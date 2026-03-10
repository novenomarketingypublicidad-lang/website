import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { revalidateAppCache } from "@/app/actions";

export type SectorType = "inicio" | "hotelero" | "gastronomia" | "deportes" | "nauticos" | "eventos";

export type TeamMember = {
    id: string;
    name: string;
    role: string;
    imageUrl: string;
};

export type ClientLogo = {
    id: string;
    brandName: string;
    logoUrl: string;
};

export type PortfolioItem = {
    id: string;
    mediaUrl: string;
    mediaType: "image" | "video";
    title?: string;
    projectName?: string;
};

export type Sector = {
    id: SectorType;
    title: string;
    description?: string;
    mediaUrl: string;
    mediaType: "image" | "video";
    icon?: string; // Nombre del icono de Lucide React
    sortOrder?: number; // Orden en el slider horizontal
    // Data específicas de la vista profunda de un sector
    teamMembers?: TeamMember[]; // Lado Izquierdo ("Inicio")
    collaborators?: TeamMember[]; // Lado Derecho ("Inicio")
    clients?: ClientLogo[]; // Logos que giran en el carrusel superior
    portfolio?: PortfolioItem[]; // Galeria de trabajos
    aboutText?: string;
};

export type FooterConfig = {
    email: string;
    phone: string;
    address: string;
    social: {
        instagram: string;
        linkedin: string;
    }
};

export type QuoteService = {
    id: string;
    name: string;
};

export type LeadStatus = "nuevo" | "revisado" | "contactado" | "cerrado" | "cancelado";

export type Lead = {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    message: string;
    services: string[]; // array of QuoteService IDs
    status: LeadStatus;
    createdAt: string;
};

export function useAgencyData() {
    const [sectors, setSectors] = useState<Sector[]>([]);
    const [footerConfig, setFooterConfig] = useState<FooterConfig | null>(null);
    const [quoteServices, setQuoteServices] = useState<QuoteService[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRealData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [
                { data: sectorsData, error: sectorsError },
                { data: footerData, error: footerError },
                { data: servicesData, error: servicesError },
                { data: leadsData, error: leadsError }
            ] = await Promise.all([
                supabase.from("sectors").select("*").order("sort_order", { ascending: true }),
                supabase.from("footer_config").select("*").eq("id", 1).maybeSingle(),
                supabase.from("quote_services").select("*").order("created_at", { ascending: true }),
                supabase.from("leads").select("*").order("created_at", { ascending: false })
            ]);

            if (sectorsError) throw sectorsError;
            if (footerError) throw footerError;
            if (servicesError) throw servicesError;
            if (leadsError) throw leadsError;

            // 1. Map Sectores
            if (sectorsData) {
                const mappedSectors: Sector[] = sectorsData.map((s: any) => ({
                    id: s.id as SectorType,
                    title: s.title,
                    description: s.description,
                    mediaUrl: s.media_url,
                    mediaType: s.media_type,
                    icon: s.icon || "Circle",
                    sortOrder: s.sort_order ?? 0,
                    teamMembers: s.team_members || [],
                    collaborators: s.collaborators || [],
                    clients: s.clients || [],
                    portfolio: s.portfolio || [],
                    aboutText: s.about_text || s.description || ""
                }));
                setSectors(mappedSectors);
            }

            // 2. Map Footer
            if (footerData) {
                setFooterConfig({
                    email: footerData.email || "",
                    phone: footerData.phone || "",
                    address: footerData.address || "",
                    social: {
                        instagram: footerData.instagram || "",
                        linkedin: footerData.linkedin || ""
                    }
                });
            }

            // 3. Map Servicios
            if (servicesData) {
                setQuoteServices(servicesData.map(s => ({ id: s.id, name: s.name })));
            }

            // 4. Map Leads
            if (leadsData) {
                setLeads(leadsData.map(l => ({
                    id: l.id,
                    fullName: l.full_name,
                    email: l.email,
                    phone: l.phone,
                    message: l.message,
                    services: l.services || [],
                    status: l.status as LeadStatus,
                    createdAt: l.created_at
                })));
            }

        } catch (e: any) {
            console.error("Supabase error:", e);
            setError(e.message || "Error al conectar con la base de datos");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRealData();

        // REALTIME SUBSCRIPTIONS
        const mainChannel = supabase
            .channel('db-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'sectors' },
                () => fetchRealData()
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'leads' },
                () => fetchRealData()
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'footer_config' },
                () => fetchRealData()
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'quote_services' },
                () => fetchRealData()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(mainChannel);
        };
    }, []);

    const updateSectorContent = async (id: string, mediaUrl: string, mediaType: "image" | "video") => {
        try {
            const { error } = await supabase.from("sectors").update({ media_url: mediaUrl, media_type: mediaType }).eq("id", id);
            if (error) throw error;
            await revalidateAppCache();
        } catch (e: any) {
            console.error(e);
            throw e;
        }
    };

    const updateSectorIcon = async (sectorId: string, icon: string) => {
        try {
            const { error } = await supabase.from("sectors").update({ icon }).eq("id", sectorId);
            if (error) throw error;
            await revalidateAppCache();
        } catch (e: any) {
            console.error(e);
            throw e;
        }
    };

    // Recibe el array de sectores en el NUEVO orden deseado y actualiza sort_order en batch
    const updateSectorsOrder = async (orderedSectors: Sector[]) => {
        try {
            await Promise.all(
                orderedSectors.map((sector, index) =>
                    supabase.from("sectors").update({ sort_order: index }).eq("id", sector.id)
                )
            );
            await revalidateAppCache();
        } catch (e: any) {
            console.error(e);
            throw e;
        }
    };

    const updateTeamMembers = async (sectorId: string, members: TeamMember[]) => {
        try {
            const { error } = await supabase.from("sectors").update({ team_members: members }).eq("id", sectorId);
            if (error) throw error;
            await revalidateAppCache();
        } catch (e: any) {
            console.error(e);
            throw e;
        }
    };

    const updateCollaborators = async (sectorId: string, collabs: TeamMember[]) => {
        try {
            const { error } = await supabase.from("sectors").update({ collaborators: collabs }).eq("id", sectorId);
            if (error) throw error;
            await revalidateAppCache();
        } catch (e: any) {
            console.error(e);
            throw e;
        }
    };

    const updateClients = async (sectorId: string, clients: ClientLogo[]) => {
        try {
            const { error } = await supabase.from("sectors").update({ clients }).eq("id", sectorId);
            if (error) throw error;
            await revalidateAppCache();
        } catch (e: any) {
            console.error(e);
            throw e;
        }
    };

    const updatePortfolio = async (sectorId: string, portfolio: PortfolioItem[]) => {
        try {
            const { error } = await supabase.from("sectors").update({ portfolio }).eq("id", sectorId);
            if (error) throw error;
            await revalidateAppCache();
        } catch (e: any) {
            console.error(e);
            throw e;
        }
    };

    const updateFooter = async (newFooter: FooterConfig) => {
        try {
            const { error } = await supabase.from("footer_config").upsert({
                id: 1,
                email: newFooter.email,
                phone: newFooter.phone,
                address: newFooter.address,
                instagram: newFooter.social.instagram,
                linkedin: newFooter.social.linkedin
            });
            if (error) throw error;
            await revalidateAppCache();
        } catch (e: any) {
            console.error(e);
            throw e;
        }
    };

    const updateQuoteServices = async (services: QuoteService[]) => {
        try {
            await supabase.from("quote_services").delete().neq("id", "0");
            const toInsert = services.map(s => {
                if (s.id.length < 20) return { name: s.name };
                return { id: s.id, name: s.name };
            });

            if (toInsert.length > 0) {
                const { error } = await supabase.from("quote_services").insert(toInsert);
                if (error) throw error;
            }
            await revalidateAppCache();
        } catch (e: any) {
            console.error(e);
            throw e;
        }
    };

    const addLead = async (leadData: Omit<Lead, "id" | "createdAt" | "status">) => {
        try {
            const { error } = await supabase.from("leads").insert({
                full_name: leadData.fullName,
                email: leadData.email,
                phone: leadData.phone,
                message: leadData.message,
                services: leadData.services,
                status: "nuevo"
            });
            if (error) throw error;
            await revalidateAppCache();
        } catch (e: any) {
            console.error("Error al enviar el formulario", e);
            throw e;
        }
    };

    const updateLeadStatus = async (leadId: string, newStatus: LeadStatus) => {
        try {
            const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", leadId);
            if (error) throw error;
            await revalidateAppCache();
        } catch (e: any) {
            console.error(e);
            throw e;
        }
    };

    return {
        sectors,
        footerConfig,
        quoteServices,
        leads,
        isLoading,
        error,
        updateSectorContent,
        updateSectorIcon,
        updateSectorsOrder,
        updateTeamMembers,
        updateCollaborators,
        updateClients,
        updatePortfolio,
        updateFooter,
        updateQuoteServices,
        addLead,
        updateLeadStatus
    };
}

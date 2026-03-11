"use client";

import { useState, useEffect, useRef } from "react";
import { useAgencyData, Sector, TeamMember, FooterConfig, ClientLogo, PortfolioItem, QuoteService, Lead, LeadStatus } from "@/hooks/useAgencyData";
import { Lock, LogOut, Plus, Trash2, Image as ImageIcon, Video as VideoIcon, LayoutDashboard, Users, HeartHandshake, Settings, Mail, Phone, Calendar, ClipboardList, Check, GripVertical, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import AdminCursor from "@/components/AdminCursor";
import SaveIndicator, { SaveStatus } from "@/components/SaveIndicator";
import { ICON_MAP } from "@/components/TopNavigation";

type Tab = "sectors" | "team" | "collaborators" | "leads" | "footer";

export default function AdminPage() {
    const { sectors, footerConfig, quoteServices, leads, isLoading, error, updateSectorContent, updateSectorIcon, updateSectorsOrder, updateTeamMembers, updateCollaborators, updateClients, updatePortfolio, updateFooter, updateQuoteServices, updateLeadStatus } = useAgencyData();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [activeTab, setActiveTab] = useState<Tab>("sectors");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email === "admin@test.com" && password === "12345678") {
            setIsAuthenticated(true);
        } else {
            alert("Credenciales incorrectas.");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setEmail("");
        setPassword("");
    }

    if (isLoading) {
        return <div className="w-full h-screen bg-[#FAFAF9] flex items-center justify-center font-lovelo text-terracotta text-3xl tracking-widest animate-pulse">CARGANDO...</div>;
    }

    if (error) {
        return (
            <div className="w-full h-screen bg-[#FAFAF9] flex flex-col items-center justify-center gap-4 p-8">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-lg w-full text-center shadow-sm">
                    <h2 className="font-lovelo text-2xl text-red-600 mb-3 tracking-widest">Error de Conexión</h2>
                    <p className="font-Montserrat text-sm text-red-500 mb-6">{error}</p>
                    <p className="font-Montserrat text-xs text-slate-400">Verifica que las variables de entorno de Supabase estén configuradas correctamente en <code className="bg-slate-100 px-1 rounded">.env.local</code></p>
                </div>
            </div>
        );
    }


    if (!isAuthenticated) {
        return (
            <main className="w-full h-screen bg-[#FAFAF9] flex items-center justify-center p-4 cursor-auto overflow-y-auto">
                <AdminCursor />
                <div className="bg-white p-10 rounded-2xl max-w-sm w-full shadow-xl relative z-10 border border-black/5">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-lovelo uppercase tracking-widest text-dark mb-2">Noveno</h2>
                        <h3 className="text-sm font-Montserrat tracking-widest text-terracotta uppercase font-semibold">Admin Panel</h3>
                    </div>
                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-Montserrat text-slate-500 uppercase tracking-wider font-semibold">Correo</label>
                            <input
                                type="email"
                                className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal bg-slate-50 font-Montserrat text-dark"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-Montserrat text-slate-500 uppercase tracking-wider font-semibold">Contraseña</label>
                            <input
                                type="password"
                                className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal bg-slate-50 font-Montserrat text-dark"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="border-2 border-dark text-dark bg-transparent py-3 mt-4 rounded-xl font-Montserrat font-semibold hover:bg-white transition-colors flex justify-center items-center gap-2 tracking-wider"
                        >
                            <Lock className="w-4 h-4" /> ACCEDER
                        </button>
                    </form>
                    <div className="mt-8 text-center pt-6 border-t border-slate-100">
                        <Link href="/" className="text-xs font-Montserrat text-slate-400 hover:text-teal transition-colors flex items-center justify-center gap-1">
                            &larr; Volver al sitio web
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="h-screen w-full bg-[#f4f2f0] text-dark flex cursor-auto overflow-y-auto">
            <AdminCursor />
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col shadow-sm hidden md:flex">
                <div className="p-8 pb-4">
                    <h1 className="text-2xl font-lovelo uppercase tracking-widest text-dark">NOVENO</h1>
                    <p className="text-[10px] font-Montserrat tracking-widest text-terracotta font-bold mt-1 uppercase">Control Panel</p>
                </div>

                <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
                    <TabButton icon={<LayoutDashboard />} label="Sectores" active={activeTab === "sectors"} onClick={() => setActiveTab("sectors")} />
                    <TabButton icon={<ClipboardList />} label="Cotizaciones" active={activeTab === "leads"} onClick={() => setActiveTab("leads")} />
                    <TabButton icon={<Users />} label="Equipo Noveno" active={activeTab === "team"} onClick={() => setActiveTab("team")} />
                    <TabButton icon={<HeartHandshake />} label="Colaboradores" active={activeTab === "collaborators"} onClick={() => setActiveTab("collaborators")} />
                    <TabButton icon={<Settings />} label="Configuración" active={activeTab === "footer"} onClick={() => setActiveTab("footer")} />
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-Montserrat text-slate-500 hover:text-terracotta hover:bg-terracotta/5 rounded-xl transition-all"
                    >
                        <LogOut className="w-4 h-4" /> Cerrar Sesión
                    </button>
                    <div className="mt-2 text-center">
                        <Link href="/" className="text-xs font-Montserrat text-teal hover:underline flex items-center justify-center">Ver Sitio Web</Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 w-full bg-white shadow-sm z-50 flex flex-col">
                <div className="px-4 py-3 flex justify-between items-center">
                    <h1 className="text-xl font-lovelo uppercase tracking-widest text-dark">NOVENO</h1>
                    <button onClick={handleLogout} className="text-slate-500"><LogOut className="w-5 h-5" /></button>
                </div>
                {/* Horizontal scrollable tab bar for mobile */}
                <nav className="overflow-x-auto scrollbar-hide border-t border-slate-100">
                    <div className="flex min-w-max">
                        {([
                            { id: "sectors", label: "Sectores", icon: <LayoutDashboard className="w-4 h-4" /> },
                            { id: "leads", label: "Cotizaciones", icon: <ClipboardList className="w-4 h-4" /> },
                            { id: "team", label: "Equipo", icon: <Users className="w-4 h-4" /> },
                            { id: "collaborators", label: "Colabs", icon: <HeartHandshake className="w-4 h-4" /> },
                            { id: "footer", label: "Config", icon: <Settings className="w-4 h-4" /> },
                        ] as { id: Tab; label: string; icon: React.ReactNode }[]).map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 px-4 py-2.5 font-Montserrat text-xs font-semibold uppercase tracking-wider flex-shrink-0 border-b-2 transition-all ${
                                    activeTab === tab.id
                                        ? "border-terracotta text-terracotta"
                                        : "border-transparent text-slate-400 hover:text-slate-600"
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-4 sm:p-6 md:p-12 overflow-y-auto w-full pt-28 md:pt-12">
                <div className="max-w-5xl mx-auto">

                    {/* Header based on Tab */}
                    <header className="mb-10">
                        <h2 className="text-3xl font-lovelo text-dark capitalize mb-2 tracking-wider">
                            {activeTab === "sectors" && "Gestión de Sectores"}
                            {activeTab === "leads" && "CRM: Cotizaciones"}
                            {activeTab === "team" && "Equipo de Trabajo"}
                            {activeTab === "collaborators" && "Colaboradores Externos"}
                            {activeTab === "footer" && "Configuración General"}
                        </h2>
                        <p className="font-Montserrat text-sm text-slate-500">
                            Modifica la información visual y estática de la página web. Se reflejará automáticamente.
                        </p>
                    </header>

                    {/* Tab Contents */}
                    <div className="animate-in fade-in duration-500">
                        {activeTab === "sectors" && (
                            <div className="flex flex-col gap-6">
                                {/* Drag-and-drop order panel */}
                                <SectorOrderPanel sectors={sectors} onSave={updateSectorsOrder} />

                                {sectors.map((sector) => (
                                    <AdminSectorCard
                                        key={sector.id}
                                        sector={sector}
                                        onSave={updateSectorContent}
                                        onSaveIcon={(icon) => updateSectorIcon(sector.id, icon)}
                                        onSaveClients={(clients) => updateClients(sector.id, clients)}
                                        onSavePortfolio={(portfolio) => updatePortfolio(sector.id, portfolio)}
                                    />
                                ))}
                            </div>
                        )}

                        {activeTab === "leads" && (
                            <LeadsKanbanBoard
                                leads={leads}
                                services={quoteServices}
                                onStatusChange={updateLeadStatus}
                            />
                        )}

                        {activeTab === "team" && (
                            <TeamEditor
                                members={sectors.find(s => s.id === "inicio")?.teamMembers || []}
                                onSave={(m) => updateTeamMembers("inicio", m)}
                                title="Miembros del Equipo"
                            />
                        )}

                        {activeTab === "collaborators" && (
                            <TeamEditor
                                members={sectors.find(s => s.id === "inicio")?.collaborators || []}
                                onSave={(m) => updateCollaborators("inicio", m)}
                                title="Marcas y Colaboradores"
                            />
                        )}

                        {activeTab === "footer" && (
                            <div className="flex flex-col gap-6">
                                <FooterEditor config={footerConfig} onSave={updateFooter} />
                                <ServicesEditor services={quoteServices} onSave={updateQuoteServices} />
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </main>
    );
}

// -------------------------------------------------------------
// Sub-components
// -------------------------------------------------------------

function TabButton({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-Montserrat text-sm tracking-wide ${active ? 'bg-teal/10 text-teal font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-dark'}`}
        >
            {icon} {label}
        </button>
    )
}

function MediaPreview({ url, type, fallbackText = "No Media" }: { url: string, type: "image" | "video", fallbackText?: string }) {
    if (!url) return (
        <div className="w-full h-full bg-slate-100 rounded-lg flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-300">
            <ImageIcon className="w-6 h-6 opacity-50 mb-1" />
            <span className="text-xs font-Montserrat">{fallbackText}</span>
        </div>
    );

    if (type === "video") {
        return (
            <div className="relative w-full h-full bg-black rounded-lg overflow-hidden group border border-slate-200 shadow-sm">
                <video src={url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-black/50 p-1 rounded text-white backdrop-blur-sm"><VideoIcon className="w-3 h-3" /></div>
            </div>
        );
    }
    return (
        <div className="relative w-full h-full rounded-lg overflow-hidden border border-slate-200 shadow-sm">
            <img src={url} alt="Preview" className="w-full h-full object-cover" />
        </div>
    );
}

function AdminSectorCard({ sector, onSave, onSaveIcon, onSaveClients, onSavePortfolio }: {
    sector: Sector;
    onSave: (id: string, url: string, type: "image" | "video") => Promise<void>;
    onSaveIcon: (icon: string) => Promise<void>;
    onSaveClients: (c: ClientLogo[]) => Promise<void>;
    onSavePortfolio: (p: PortfolioItem[]) => Promise<void>;
}) {
    const [url, setUrl] = useState(sector.mediaUrl);
    const [type, setType] = useState<"image" | "video">(sector.mediaType);
    const [selectedIcon, setSelectedIcon] = useState(sector.icon ?? "Circle");
    const [isSaving, setIsSaving] = useState(false);
    const [isSavingIcon, setIsSavingIcon] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(sector.id, url, type);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveIcon = async () => {
        setIsSavingIcon(true);
        try {
            await onSaveIcon(selectedIcon);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSavingIcon(false);
        }
    };

    return (
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col gap-6 hover:shadow-md transition-shadow">
            <header className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                    <h3 className="text-xl font-lovelo text-dark tracking-wider uppercase">{sector.title}</h3>
                    <span className="text-xs font-Montserrat text-terracotta bg-terracotta/10 px-2 py-1 rounded-full uppercase font-bold tracking-widest inline-block mt-2">SECTOR</span>
                </div>
            </header>

            {/* Icon Picker Section */}
            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 flex flex-col gap-3">
                <label className="text-xs font-Montserrat font-semibold text-slate-500 uppercase tracking-widest">Icono de Navegación</label>
                <div className="flex items-center gap-4">
                    {/* Current icon preview */}
                    <div className="w-10 h-10 rounded-xl bg-white border-2 border-teal/30 flex items-center justify-center shadow-sm flex-shrink-0">
                        {(() => {
                            const Preview = ICON_MAP[selectedIcon] ?? ICON_MAP["Circle"];
                            return <Preview strokeWidth={1.5} className="w-5 h-5 text-teal" />;
                        })()}
                    </div>
                    {/* Icon grid picker */}
                    <div className="flex flex-wrap gap-2 flex-1">
                        {Object.entries(ICON_MAP).map(([name, Icon]) => (
                            <button
                                key={name}
                                title={name}
                                onClick={() => setSelectedIcon(name)}
                                className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all ${
                                    selectedIcon === name
                                        ? "border-teal bg-teal/10 text-teal shadow-sm"
                                        : "border-slate-200 bg-white text-slate-400 hover:border-teal/50 hover:text-teal/70"
                                }`}
                            >
                                <Icon strokeWidth={1.5} className="w-4 h-4" />
                                {selectedIcon === name && <span className="sr-only"><Check /></span>}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-[10px] font-Montserrat text-slate-400">Seleccionado: <strong className="text-slate-600">{selectedIcon}</strong></p>
                    <button
                        onClick={handleSaveIcon}
                        disabled={isSavingIcon || selectedIcon === (sector.icon ?? "Circle")}
                        className="border border-teal text-teal bg-transparent px-4 py-2 rounded-xl font-Montserrat font-semibold text-xs hover:bg-white hover:text-teal transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {isSavingIcon ? "Guardando..." : "Guardar Icono"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6">
                <div className="w-full h-32 md:h-full">
                    <MediaPreview url={url} type={type} fallbackText="Fondo" />
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-Montserrat font-semibold text-slate-500 uppercase tracking-widest">URL del Fondo (Imagen o Video)</label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full bg-slate-50 font-Montserrat border border-slate-200 rounded-xl px-4 py-2.5 text-dark focus:outline-none focus:ring-2 focus:ring-teal/50 transition-colors"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-Montserrat font-semibold text-slate-500 uppercase tracking-widest">Tipo de Archivo</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as "image" | "video")}
                            className="bg-slate-50 font-Montserrat border border-slate-200 rounded-xl px-4 py-2.5 text-dark focus:outline-none focus:ring-2 focus:ring-teal/50 transition-colors md:w-64"
                        >
                            <option value="image">Fotografía Específica (Image)</option>
                            <option value="video">Clip en Boop Loop (Video MP4)</option>
                        </select>
                    </div>

                    <div className="mt-6 flex justify-start">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="border border-dark text-dark bg-transparent px-6 py-2.5 rounded-xl font-Montserrat font-semibold text-sm hover:bg-white transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Nested Sub-modules for Clients & Portfolio (if the sector supports it, e.g. not global hero) */}
            <div className="border-t border-slate-100 pt-6 mt-4 flex flex-col gap-8 flex-1">
                {sector.clients !== undefined && (
                    <ClientsEditor clients={sector.clients} onSave={onSaveClients} />
                )}
                {sector.portfolio !== undefined && (
                    <PortfolioEditor portfolio={sector.portfolio} onSave={onSavePortfolio} />
                )}
            </div>
        </div>
    );
}

function ClientsEditor({ clients, onSave }: { clients: ClientLogo[], onSave: (c: ClientLogo[]) => Promise<void> }) {
    const [localClients, setLocalClients] = useState<ClientLogo[]>(clients);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(localClients);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (index: number, field: keyof ClientLogo, value: string) => {
        const updated = [...localClients];
        updated[index] = { ...updated[index], [field]: value };
        setLocalClients(updated);
    };

    const handleAdd = () => {
        setLocalClients([...localClients, { id: Date.now().toString(), brandName: "", logoUrl: "" }]);
    };

    const handleRemove = (index: number) => {
        setLocalClients(localClients.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h4 className="font-lovelo text-dark text-lg tracking-wider">Logos de Clientes</h4>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {localClients.map((client, i) => (
                    <div key={client.id} className="border border-slate-200 rounded-xl p-3 flex flex-col gap-3 relative bg-slate-50 group">
                        <button onClick={() => handleRemove(i)} className="absolute -top-2 -right-2 bg-white border border-slate-200 text-terracotta p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 z-10">
                            <Trash2 className="w-3 h-3" />
                        </button>
                        <div className="w-full h-16 bg-white rounded flex items-center justify-center overflow-hidden p-2">
                            <MediaPreview url={client.logoUrl} type="image" fallbackText="Logo" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <input type="text" value={client.brandName} onChange={(e) => handleChange(i, 'brandName', e.target.value)} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-[10px] font-Montserrat" placeholder="Nombre Marca" />
                            <input type="text" value={client.logoUrl} onChange={(e) => handleChange(i, 'logoUrl', e.target.value)} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-[10px] font-Montserrat" placeholder="Logo URL" />
                        </div>
                    </div>
                ))}
                <button onClick={handleAdd} className="border border-dashed border-slate-300 rounded-xl p-3 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-teal hover:border-teal hover:bg-teal/5 transition-colors min-h-[140px]">
                    <Plus className="w-5 h-5 mb-1" />
                    <span className="font-Montserrat font-semibold text-[10px] uppercase">Añadir</span>
                </button>
            </div>

            <div className="mt-6 flex justify-start">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-dark text-white px-6 py-2.5 rounded-xl font-Montserrat font-semibold text-sm hover:bg-teal transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? "Guardando..." : "Guardar Logos"}
                </button>
            </div>
        </div>
    );
}

function PortfolioEditor({ portfolio, onSave }: { portfolio: PortfolioItem[], onSave: (p: PortfolioItem[]) => Promise<void> }) {
    const [localPortfolio, setLocalPortfolio] = useState<PortfolioItem[]>(portfolio);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(localPortfolio);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (index: number, field: keyof PortfolioItem, value: string) => {
        const updated = [...localPortfolio];
        updated[index] = { ...updated[index], [field]: value };
        setLocalPortfolio(updated);
    };

    const handleAdd = () => {
        setLocalPortfolio([...localPortfolio, { id: Date.now().toString(), mediaUrl: "", mediaType: "image", title: "", projectName: "" }]);
    };

    const handleRemove = (index: number) => {
        setLocalPortfolio(localPortfolio.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h4 className="font-lovelo text-dark text-lg tracking-wider">Portafolio (Trabajos)</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {localPortfolio.map((item, i) => (
                    <div key={item.id} className="border border-slate-200 rounded-xl p-3 flex flex-col gap-3 relative bg-slate-50 group">
                        <button onClick={() => handleRemove(i)} className="absolute -top-2 -right-2 bg-white border border-slate-200 text-terracotta p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 z-10">
                            <Trash2 className="w-3 h-3" />
                        </button>
                        <div className="w-full h-32 rounded overflow-hidden">
                            <MediaPreview url={item.mediaUrl} type={item.mediaType} fallbackText="Media" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <input type="text" value={item.title || ""} onChange={(e) => handleChange(i, 'title', e.target.value)} className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs font-Montserrat" placeholder="Título (Opcional)" />
                            <input type="text" value={item.projectName || ""} onChange={(e) => handleChange(i, 'projectName', e.target.value)} className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs font-Montserrat" placeholder="Cliente / Proyecto (Opcional)" />
                            <input type="text" value={item.mediaUrl} onChange={(e) => handleChange(i, 'mediaUrl', e.target.value)} className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs font-Montserrat" placeholder="Media URL" />
                            <select value={item.mediaType} onChange={(e) => handleChange(i, 'mediaType', e.target.value)} className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs font-Montserrat">
                                <option value="image">Imagen</option>
                                <option value="video">Video MP4</option>
                            </select>
                        </div>
                    </div>
                ))}
                <button onClick={handleAdd} className="border border-dashed border-slate-300 rounded-xl p-3 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-teal hover:border-teal hover:bg-teal/5 transition-colors min-h-[220px]">
                    <Plus className="w-6 h-6 mb-1" />
                    <span className="font-Montserrat font-semibold text-xs uppercase">Añadir Proyecto</span>
                </button>
            </div>

            <div className="mt-6 flex justify-start">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-dark text-white px-6 py-2.5 rounded-xl font-Montserrat font-semibold text-sm hover:bg-teal transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? "Guardando..." : "Guardar Portafolio"}
                </button>
            </div>
        </div>
    );
}

function TeamEditor({ members, onSave, title }: { members: TeamMember[], onSave: (m: TeamMember[]) => Promise<void>, title: string }) {
    const [localMembers, setLocalMembers] = useState<TeamMember[]>(members);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(localMembers);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (index: number, field: keyof TeamMember, value: string) => {
        const updated = [...localMembers];
        updated[index] = { ...updated[index], [field]: value };
        setLocalMembers(updated);
    };

    const handleAdd = () => {
        setLocalMembers([...localMembers, { id: Date.now().toString(), name: "", role: "", imageUrl: "" }]);
    };

    const handleRemove = (index: number) => {
        setLocalMembers(localMembers.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-2xl shadow-sm flex flex-col gap-6 relative">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-xl font-Montserrat font-bold text-dark">{title}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {localMembers.map((member, i) => (
                    <div key={member.id} className="border border-slate-200 rounded-xl p-4 flex flex-col gap-4 relative bg-slate-50/50 group">
                        <button onClick={() => handleRemove(i)} className="absolute -top-3 -right-3 bg-white border border-slate-200 text-terracotta p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="w-full h-32">
                            <MediaPreview url={member.imageUrl} type="image" fallbackText="Foto" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <div>
                                <label className="text-[10px] font-Montserrat font-bold text-slate-400 uppercase tracking-widest">Nombre</label>
                                <input type="text" value={member.name} onChange={(e) => handleChange(i, 'name', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-Montserrat" placeholder="Ej. Grecia Robles" />
                            </div>
                            <div>
                                <label className="text-[10px] font-Montserrat font-bold text-slate-400 uppercase tracking-widest">Cargo / Subtítulo</label>
                                <input type="text" value={member.role} onChange={(e) => handleChange(i, 'role', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-Montserrat" placeholder="Ej. Co-Founder" />
                            </div>
                            <div>
                                <label className="text-[10px] font-Montserrat font-bold text-slate-400 uppercase tracking-widest">URL de Foto</label>
                                <input type="text" value={member.imageUrl} onChange={(e) => handleChange(i, 'imageUrl', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-Montserrat" placeholder="https://..." />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty State Add Button */}
                <button onClick={handleAdd} className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-teal hover:border-teal hover:bg-teal/5 transition-colors min-h-[300px]">
                    <div className="bg-slate-100 p-3 rounded-full"><Plus className="w-6 h-6" /></div>
                    <span className="font-Montserrat font-semibold">Añadir Nuevo</span>
                </button>
            </div>

            <div className="mt-6 flex justify-start border-t border-slate-100 pt-6">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-dark text-white px-6 py-2.5 rounded-xl font-Montserrat font-semibold text-sm hover:bg-teal transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? "Guardando..." : "Guardar Cambios"}
                </button>
            </div>
        </div>
    )
}

function FooterEditor({ config, onSave }: { config: FooterConfig | null, onSave: (c: FooterConfig) => Promise<void> }) {
    const [local, setLocal] = useState<FooterConfig>(config ?? { email: "", phone: "", address: "", social: { instagram: "", linkedin: "" } });
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(local);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (field: keyof FooterConfig, value: any) => {
        setLocal({ ...local, [field]: value });
    };

    const handleSocial = (network: keyof FooterConfig["social"], value: string) => {
        setLocal({ ...local, social: { ...local.social, [network]: value } });
    }

    return (
        <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-2xl shadow-sm flex flex-col gap-8">
            <header className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-xl font-Montserrat font-bold text-dark">Información de Contacto (Footer)</h3>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-4">
                    <h4 className="font-lovelo text-terracotta text-lg tracking-wider mb-2">Datos Principales</h4>
                    <div>
                        <label className="text-xs font-Montserrat font-bold text-slate-500 uppercase tracking-widest">Correo Electrónico</label>
                        <input type="email" value={local.email} onChange={(e) => handleChange('email', e.target.value)} className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-dark font-Montserrat" />
                    </div>
                    <div>
                        <label className="text-xs font-Montserrat font-bold text-slate-500 uppercase tracking-widest">Teléfono / WhatsApp</label>
                        <input type="text" value={local.phone} onChange={(e) => handleChange('phone', e.target.value)} className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-dark font-Montserrat" />
                    </div>
                    <div>
                        <label className="text-xs font-Montserrat font-bold text-slate-500 uppercase tracking-widest">Dirección Física</label>
                        <input type="text" value={local.address} onChange={(e) => handleChange('address', e.target.value)} className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-dark font-Montserrat" />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <h4 className="font-lovelo text-terracotta text-lg tracking-wider mb-2">Redes Sociales</h4>
                    <div>
                        <label className="text-xs font-Montserrat font-bold text-slate-500 uppercase tracking-widest">Instagram URL</label>
                        <input type="text" value={local.social.instagram} onChange={(e) => handleSocial('instagram', e.target.value)} className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-dark font-Montserrat placeholder-slate-300" placeholder="https://instagram.com/..." />
                    </div>
                    <div>
                        <label className="text-xs font-Montserrat font-bold text-slate-500 uppercase tracking-widest">LinkedIn URL</label>
                        <input type="text" value={local.social.linkedin} onChange={(e) => handleSocial('linkedin', e.target.value)} className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-dark font-Montserrat placeholder-slate-300" placeholder="https://linkedin.com/in/..." />
                    </div>
                </div>
            </div>

            <div className="flex justify-start pt-6 border-t border-slate-100">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-dark text-white px-6 py-2.5 rounded-xl font-Montserrat font-semibold text-sm hover:bg-teal transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? "Guardando..." : "Guardar Cambios"}
                </button>
            </div>
        </div>
    )
}

function ServicesEditor({ services, onSave }: { services: QuoteService[], onSave: (s: QuoteService[]) => Promise<void> }) {
    const [localServices, setLocalServices] = useState<QuoteService[]>(services);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(localServices);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAdd = () => {
        setLocalServices([...localServices, { id: Date.now().toString(), name: "" }]);
    };

    const handleRemove = (id: string) => {
        setLocalServices(localServices.filter(s => s.id !== id));
    };

    const handleChange = (id: string, name: string) => {
        setLocalServices(localServices.map(s => s.id === id ? { ...s, name } : s));
    };

    return (
        <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-2xl shadow-sm flex flex-col gap-6">
            <header className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-xl font-Montserrat font-bold text-dark">Servicios y Cotizaciones</h3>
            </header>

            <div className="mb-2">
                <p className="font-Montserrat text-sm text-slate-500">
                    Agrega los servicios que ofreces. Estos aparecerán automáticamente como opciones dinámicas (checkboxes) en el formulario de contacto para que el usuario pueda seleccionar los de su interés al cotizar.
                </p>
            </div>

            <div className="flex flex-col gap-3">
                {localServices.map((service) => (
                    <div key={service.id} className="flex gap-3 items-center group">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={service.name}
                                onChange={(e) => handleChange(service.id, e.target.value)}
                                placeholder="Ej. Fotografía de Producto"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-dark font-Montserrat text-sm focus:outline-none focus:border-teal"
                            />
                        </div>
                        <button
                            onClick={() => handleRemove(service.id)}
                            className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-terracotta hover:border-terracotta hover:bg-terracotta/5 transition-all opacity-0 group-hover:opacity-100"
                            title="Eliminar este servicio"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                <button
                    onClick={handleAdd}
                    className="mt-2 w-full border-2 border-dashed border-slate-200 rounded-xl p-3 flex items-center justify-center gap-2 text-slate-400 hover:text-teal hover:border-teal hover:bg-teal/5 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span className="font-Montserrat font-semibold text-sm uppercase">Añadir Nuevo Servicio</span>
                </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-start">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-dark text-white px-6 py-2.5 rounded-xl font-Montserrat font-semibold text-sm hover:bg-teal transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? "Guardando..." : "Guardar Cambios"}
                </button>
            </div>
        </div>
    );
}

// -------------------------------------------------------------
// Kanban CRM
// -------------------------------------------------------------

function LeadsKanbanBoard({ leads, services, onStatusChange }: { leads: Lead[], services: QuoteService[], onStatusChange: (id: string, s: LeadStatus) => Promise<void> }) {
    const columns: { id: LeadStatus, title: string, color: string }[] = [
        { id: "nuevo", title: "🟡 Nuevos", color: "bg-amber-50 border-amber-200 text-amber-900" },
        { id: "revisado", title: "🔵 Revisados", color: "bg-blue-50 border-blue-200 text-blue-900" },
        { id: "contactado", title: "🟢 Contactados", color: "bg-emerald-50 border-emerald-200 text-emerald-900" },
        { id: "cerrado", title: "✅ Cerrado", color: "bg-teal/10 border-teal/30 text-teal font-extrabold" },
        { id: "cancelado", title: "❌ Cancelado", color: "bg-red-50 border-red-200 text-red-900" }
    ];

    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const leadId = result.draggableId;
        const newStatus = result.destination.droppableId as LeadStatus;
        const oldStatus = result.source.droppableId as LeadStatus;

        if (newStatus !== oldStatus) {
            onStatusChange(leadId, newStatus);
        }
    };

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-200px)]">
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto h-full pb-4 scrollbar-hide snap-x">
                    {columns.map(col => {
                        const colLeads = leads.filter(l => l.status === col.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                        return (
                            <div key={col.id} className="flex flex-col h-full min-w-[280px] snap-center">
                                <header className={`px-4 py-3 rounded-t-2xl border-t border-x ${col.color} font-Montserrat font-bold text-sm tracking-widest uppercase flex justify-between items-center whitespace-nowrap`}>
                                    {col.title}
                                    <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs">{colLeads.length}</span>
                                </header>

                                <Droppable droppableId={col.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`flex-1 p-3 rounded-b-2xl border-b border-x bg-white overflow-y-auto transition-colors ${snapshot.isDraggingOver ? 'bg-slate-50' : ''} ${col.color.split(' ')[1]}`}
                                        >
                                            <div className="flex flex-col gap-3 min-h-[100px]">
                                                {colLeads.map((lead, index) => (
                                                    <Draggable key={lead.id} draggableId={lead.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                onClick={() => setSelectedLead(lead)}
                                                                className={`bg-white border rounded-xl p-4 shadow-sm cursor-grab active:cursor-grabbing hover:border-teal transition-all flex flex-col gap-3 ${snapshot.isDragging ? 'shadow-lg border-teal scale-105' : 'border-slate-200'}`}
                                                            >
                                                                <div className="flex justify-between items-start gap-2">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-lovelo text-terracotta flex-shrink-0">
                                                                            {lead.fullName.charAt(0).toUpperCase()}
                                                                        </div>
                                                                        <div className="flex flex-col">
                                                                            <span className="font-Montserrat font-bold text-dark text-sm leading-tight">{lead.fullName}</span>
                                                                            <span className="font-Montserrat text-[10px] text-slate-400">{new Date(lead.createdAt).toLocaleDateString()}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <p className="font-Montserrat text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                                                    {lead.message}
                                                                </p>

                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    {lead.services.map(sid => {
                                                                        const sName = services.find(s => s.id === sid)?.name;
                                                                        return sName ? (
                                                                            <span key={sid} className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[9px] font-Montserrat font-semibold uppercase tracking-wider line-clamp-1 max-w-[120px]">
                                                                                {sName}
                                                                            </span>
                                                                        ) : null;
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        )
                    })}
                </div>
            </DragDropContext>

            {/* Lead Details Modal */}
            {selectedLead && (
                <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 md:p-8 flex flex-col gap-6">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center font-lovelo text-teal text-3xl">
                                        {selectedLead.fullName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <h2 className="font-lovelo text-2xl text-dark tracking-wider">{selectedLead.fullName}</h2>
                                        <span className="font-Montserrat text-sm text-slate-500 capitalize">{selectedLead.status} • {new Date(selectedLead.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-terracotta bg-slate-50 hover:bg-terracotta/10 rounded-full p-2 transition-colors">
                                    X
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-teal hover:bg-teal/5 transition-colors group">
                                    <div className="bg-slate-50 p-2 rounded-lg group-hover:bg-white"><Mail className="w-5 h-5 text-slate-400 group-hover:text-teal" /></div>
                                    <div className="flex flex-col">
                                        <span className="font-Montserrat text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</span>
                                        <span className="font-Montserrat text-sm text-dark font-medium">{selectedLead.email}</span>
                                    </div>
                                </a>
                                {selectedLead.phone && (
                                    <div className="flex flex-col gap-2">
                                        <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-teal hover:bg-teal/5 transition-colors group">
                                            <div className="bg-slate-50 p-2 rounded-lg group-hover:bg-white"><Phone className="w-5 h-5 text-slate-400 group-hover:text-teal" /></div>
                                            <div className="flex flex-col">
                                                <span className="font-Montserrat text-[10px] font-bold text-slate-400 uppercase tracking-widest">Teléfono</span>
                                                <span className="font-Montserrat text-sm text-dark font-medium">{selectedLead.phone}</span>
                                            </div>
                                        </a>
                                        <a
                                            href={`https://wa.me/${selectedLead.phone.replace(/[\s-]/g, '')}?text=Hola%20${selectedLead.fullName.split(' ')[0]},%20recibimos%20tu%20solicitud%20en%20Noveno...`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => {
                                                // Magic UI update: Set to 'contactado' and close modal visually immediately.
                                                if (selectedLead.status !== "contactado" && selectedLead.status !== "cerrado") {
                                                    onStatusChange(selectedLead.id, "contactado");
                                                    setSelectedLead({ ...selectedLead, status: "contactado" }); // Reflect inside modal just in case
                                                }
                                                // The link will open native whatsapp window.
                                            }}
                                            className="flex justify-center items-center gap-2 p-3 rounded-xl bg-emerald-500 text-white font-Montserrat text-sm font-bold tracking-widest uppercase hover:bg-emerald-600 transition-colors shadow-sm"
                                        >
                                            Contactar por WhatsApp
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="font-Montserrat text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <LayoutDashboard className="w-4 h-4" /> Servicios Interesados
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {selectedLead.services.map(sid => {
                                        const sName = services.find(s => s.id === sid)?.name;
                                        return sName ? (
                                            <span key={sid} className="bg-slate-50 border border-slate-200 text-dark px-3 py-1.5 rounded-lg text-xs font-Montserrat font-semibold">
                                                {sName}
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="font-Montserrat text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Detalles del Proyecto / Mensaje
                                </span>
                                <div className="bg-slate-50 p-4 rounded-xl text-sm font-Montserrat text-slate-700 leading-relaxed whitespace-pre-wrap">
                                    {selectedLead.message}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// -------------------------------------------------------------
// Sector Order Panel (Drag & Drop)
// -------------------------------------------------------------

function SectorOrderPanel({ sectors, onSave }: { sectors: Sector[]; onSave: (ordered: Sector[]) => Promise<void> }) {
    const [localOrder, setLocalOrder] = useState<Sector[]>(sectors);
    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        setLocalOrder(sectors);
        setIsDirty(false);
    }, [sectors]);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination || result.destination.index === result.source.index) return;
        const newOrder = Array.from(localOrder);
        const [moved] = newOrder.splice(result.source.index, 1);
        newOrder.splice(result.destination.index, 0, moved);
        setLocalOrder(newOrder);
        setIsDirty(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(localOrder);
            setIsDirty(false);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                    <h3 className="text-xl font-lovelo text-dark tracking-wider">
                        Orden de Navegación
                    </h3>
                    <p className="font-Montserrat text-xs text-slate-400 mt-1">
                        Arrastra los sectores para cambiar el orden en el slider. Guarda para aplicar.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving || !isDirty}
                    className="border border-teal text-teal bg-transparent px-5 py-2.5 rounded-xl font-Montserrat font-semibold text-sm hover:bg-white hover:text-teal transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                >
                    {isSaving ? "Guardando..." : "Guardar Orden"}
                </button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sector-order-list" direction="vertical">
                    {(provided) => (
                        <ul ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-2">
                            {localOrder.map((sector, index) => {
                                const IconComponent = ICON_MAP[sector.icon ?? ""] ?? ICON_MAP["Circle"];
                                return (
                                    <Draggable key={sector.id} draggableId={`order-${sector.id}`} index={index}>
                                        {(provided, snapshot) => (
                                            <li
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-all select-none ${
                                                    snapshot.isDragging
                                                        ? "border-teal bg-teal/5 shadow-lg scale-[1.02]"
                                                        : "border-slate-200 bg-slate-50/50 hover:border-slate-300"
                                                }`}
                                            >
                                                <span
                                                    {...provided.dragHandleProps}
                                                    className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing transition-colors"
                                                >
                                                    <GripVertical className="w-5 h-5" />
                                                </span>
                                                <span className="w-6 text-center font-Montserrat text-xs font-bold text-slate-400">
                                                    {index + 1}
                                                </span>
                                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm flex-shrink-0">
                                                    <IconComponent strokeWidth={1.5} className="w-4 h-4 text-teal" />
                                                </div>
                                                <span className="font-Montserrat font-semibold text-sm text-dark tracking-wide flex-1">
                                                    {sector.title}
                                                </span>
                                                <span className="text-[10px] font-Montserrat font-bold text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                                    {sector.id}
                                                </span>
                                            </li>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>

            {isDirty && (
                <p className="text-xs font-Montserrat text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    ⚠️ Cambios sin guardar — presiona "Guardar Orden" para aplicarlos al sitio.
                </p>
            )}
        </div>
    );
}

"use client";

import { useState, useRef } from "react";
import { useAgencyData } from "@/hooks/useAgencyData";
import { Instagram, Linkedin, Send, CheckCircle2, Loader2, X } from "lucide-react";

export default function UniversalFooter() {
    const { footerConfig } = useAgencyData();
    const formRef = useRef<HTMLButtonElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!footerConfig) return null;

    return (
        <footer className="w-full bg-black border-t border-white/10 relative snap-start z-10 flex flex-col mt-auto">
            <div className="p-6 sm:p-12 lg:p-24 py-16 sm:py-24 lg:py-32 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 lg:gap-16">
                <div className="flex flex-col gap-4 max-w-md">
                    <h2 className="text-white font-lovelo text-3xl md:text-4xl tracking-widest leading-none">NOVENO</h2>
                    <p className="text-sand/60 font-Montserrat text-sm max-w-[280px]">
                        {footerConfig.address}
                    </p>
                    <div className="flex flex-col gap-1 mt-4">
                        <a href={`mailto:${footerConfig.email}`} className="text-teal font-Montserrat hover:underline underline-offset-4 text-sm break-all">{footerConfig.email}</a>
                        <a href={`tel:${footerConfig.phone}`} className="text-sand font-Montserrat hover:text-white transition-colors text-sm">{footerConfig.phone}</a>
                    </div>
                </div>

                <div className="flex flex-col gap-8 items-start lg:items-end">
                    <div className="flex gap-4 mb-4">
                        {footerConfig.social.instagram && (
                            <a href={footerConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="text-sand/50 hover:text-white transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                        )}
                        {footerConfig.social.linkedin && (
                            <a href={footerConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-sand/50 hover:text-white transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            ref={formRef}
                            className="px-8 py-4 bg-white/10 text-white border border-white/20 font-Montserrat font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all shadow-xl"
                        >
                            Iniciar Cotización
                        </button>
                    </div>
                </div>
            </div>

            {/* Iframe Modal — responsive for mobile */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
                    <div className="bg-white w-[95%] max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-3 right-3 bg-slate-100 hover:bg-terracotta hover:text-white text-slate-500 rounded-full w-10 h-10 flex items-center justify-center transition-colors z-[100] flex-shrink-0"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="flex-1 overflow-y-auto">
                            <iframe
                                src="https://tally.so/r/nGrr82?transparentBackground=1"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                marginHeight={0}
                                marginWidth={0}
                                title="Cotización"
                                className="bg-transparent w-full min-h-[80vh]"
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
}

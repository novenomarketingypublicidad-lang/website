import { Check, Loader2 } from "lucide-react";

export type SaveStatus = "idle" | "saving" | "saved";

export default function SaveIndicator({ status }: { status: SaveStatus }) {
    if (status === "idle") return <div className="h-5"></div>; // Keep vertical space

    return (
        <div className="flex items-center gap-2 text-[10px] uppercase font-Montserrat animate-in fade-in h-5">
            {status === "saving" && (
                <>
                    <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin" />
                    <span className="text-slate-400 font-bold tracking-widest">Guardando...</span>
                </>
            )}
            {status === "saved" && (
                <>
                    <Check className="w-3.5 h-3.5 text-teal" />
                    <span className="text-teal font-bold tracking-widest">Guardado ✓</span>
                </>
            )}
        </div>
    );
}

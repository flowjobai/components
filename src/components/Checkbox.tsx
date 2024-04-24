import { Check } from "lucide-react";
import clsx from "clsx";

interface Props {
    label?: string;
    checked?: boolean;
    className?: string;
}

export default function ({ checked, label, className }: Props) {
    if (label) {
        return (
            <div className={`flex items-center justify-center gap-2 ${className || ""}`}>
                <div className={clsx("size-4 border rounded-[3px]", {"bg-theme-500 border-theme-500": checked, "border-slate-400": !checked})}>
                    {checked && <Check strokeWidth={4} stroke="white" className="w-full h-full"/>}
                </div>
                <div>{label}</div>
            </div>
        );
    }
    return (
        <div className={clsx("size-4 border rounded-[3px]", className, { "bg-theme-500 border-theme-500": checked, "border-slate-400": !checked })}>
            {checked && <Check strokeWidth={4} stroke="white" className="w-full h-full" />}
        </div>
    );
}

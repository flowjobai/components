"use client";

import Tippy from "@tippyjs/react";

interface Props {
    tooltip?: string;
    disabled?: boolean;
    icon?: boolean;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;
}

export default ({ tooltip, disabled, className, onClick, icon, children }: Props) => {
    const rounded = icon ? "rounded-full" : "rounded-md";
    if (tooltip) {
        return (
            <Tippy content={tooltip} className="" delay={[500, 0]} duration={[250, 0]}>
                <button onClick={onClick} disabled={disabled} className={`${rounded} ${className || ""} p-2 flex gap-1.5 items-center caption disabled:opacity-50 disabled:bg-transparent`}>
                    {children}
                </button>
            </Tippy>
        );
    }
    return (
        <button onClick={onClick} disabled={disabled} className={`${rounded} ${className || ""} p-2 flex gap-1.5 items-center caption disabled:opacity-50 disabled:bg-transparent`}>
            {children}
        </button>
    );
};

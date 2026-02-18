import { ReactNode } from 'react';

interface DetailFieldProps {
    icon: ReactNode;
    label: string;
    value: string | number;
    href?: string;
}

export default function DetailField({ icon, label, value, href }: DetailFieldProps) {
    const content = (
        <span className="text-gray-800 font-bold block break-words">
            {value || "-"}
        </span>
    );

    return (
        <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50/30 hover:bg-white hover:shadow-sm transition-all">
            <div className="flex items-center gap-2 mb-2 text-gray-400">
                {icon}
                <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
            </div>
            {href && value ? (
                <a href={href} className="text-[var(--primary)] font-bold hover:underline block truncate">
                    {value}
                </a>
            ) : content}
        </div>
    );
}
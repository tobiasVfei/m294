import { ReactNode } from 'react';

// Reusable section header for create/edit forms
export default function FormSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="space-y-6">
            <h3 className="text-[11px] font-black text-[var(--primary)] uppercase tracking-[0.2em] flex items-center gap-3">
                <span className="h-px w-8 bg-blue-200"></span>{title}
            </h3>
            {children}
        </div>
    );
}

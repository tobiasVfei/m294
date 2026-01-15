import { ReactNode } from 'react';

interface DetailSectionProps {
    title: string;
    children: ReactNode;
}

export default function DetailSection({ title, children }: DetailSectionProps) {
    return (
        <section className="w-full">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-3">
                <span className="h-px w-8 bg-gray-200"></span>
                {title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {children}
            </div>
        </section>
    );
}
import Link from 'next/link';
import { ReactNode } from 'react';
import { Icons } from '@/lib/icons';

interface DetailHeaderProps {
    title: string;
    subtitle: string;
    icon: ReactNode;
    editHref: string;
    badge?: string;
}

export default function DetailHeader({ title, subtitle, icon, editHref, badge }: DetailHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-8 mb-10">
            <div className="flex items-center gap-6">
                <div className="icon-box-large">
                    {icon}
                </div>
                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="!text-left !mb-0 text-4xl font-black text-gray-900">{title}</h1>
                        {badge && <span className="badge">{badge}</span>}
                    </div>
                    <p className="text-gray-400 text-base font-medium mt-2">{subtitle}</p>
                </div>
            </div>
            <Link href={editHref} className="btn-primary !w-full md:!w-auto px-8 py-3 flex items-center justify-center gap-3">
                <Icons.Edit />
                Bearbeiten
            </Link>
        </div>
    );
}
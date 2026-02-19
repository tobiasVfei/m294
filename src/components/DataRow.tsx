'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icons } from '@/lib/icons';

interface DataRowProps {
    id: number;
    title: string;
    subtitle?: string;
    details: string;
    info: string;
    viewHref: string;
    editHref: string;
}

export default function DataRow({ id, title, subtitle, details, info, viewHref, editHref }: DataRowProps) {
    const router = useRouter();

    return (
        <tr
            onClick={() => router.push(viewHref)}
            className="hover:bg-gray-50 transition-colors group cursor-pointer"
        >
            <td className="px-6 py-4 text-xs font-mono text-gray-400">
                #{id}
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{title}</span>
                    {subtitle && <span className="text-[10px] text-gray-400 uppercase font-medium">{subtitle}</span>}
                </div>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-[var(--primary)] font-medium">{details}</span>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-gray-500">{info}</span>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex justify-end items-center gap-4">
                    <Link
                        href={viewHref}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-black uppercase tracking-wider text-gray-300 hover:text-[var(--primary)] transition-colors"
                    >
                        Anzeigen
                    </Link>
                    <Link
                        href={editHref}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-900"
                    >
                        <Icons.Edit size={16} />
                    </Link>
                </div>
            </td>
        </tr>
    );
}
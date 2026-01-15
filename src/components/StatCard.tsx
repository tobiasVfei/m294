import Link from 'next/link';

interface StatCardProps {
    label: string;
    count: number;
    href: string;
    colorClassName?: string;
}

export default function StatCard({ label, count, href, colorClassName = "text-gray-800" }: StatCardProps) {
    return (
        <Link
            href={href}
            className="bg-white border border-gray-100 p-8 rounded-2xl text-center block transition-all hover:shadow-xl hover:border-[var(--primary)] group"
        >
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-[var(--primary)] transition-colors">
                {label}
            </span>
            <span className={`text-5xl font-black mt-3 block group-hover:text-[var(--primary)] transition-colors ${colorClassName}`}>
                {count}
            </span>
            <span className="text-[10px] text-gray-300 mt-4 opacity-0 group-hover:opacity-100 transition-all italic">
                Liste filtern
            </span>
        </Link>
    );
}
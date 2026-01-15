import Link from 'next/link';
import { ReactNode } from 'react';

interface DataGridProps<T> {
    items: T[];
    emptyMessage?: string;
    resetHref: string;
    renderItem: (item: T) => ReactNode;
}

export default function DataGrid({ items, emptyMessage = 'Keine Daten gefunden.', resetHref, renderItem }: DataGridProps<any>) {
    if (items.length === 0) {
        return (
            <div className="w-full max-w-6xl py-20 text-center bg-gray-50 dark:bg-gray-900/20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                <p className="text-gray-400 font-medium">{emptyMessage}</p>
                <Link href={resetHref} className="text-[var(--primary)] text-sm mt-2 inline-block font-semibold hover:underline">
                    Filter zurücksetzen
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {items.map(renderItem)}
        </div>
    );
}
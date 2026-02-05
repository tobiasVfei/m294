import { ReactNode } from 'react';

interface DataTableProps {
    headers: string[];
    children: ReactNode;
    isEmpty: boolean;
    emptyMessage?: string;
}

export default function DataTable({ headers, children, isEmpty, emptyMessage = "Keine Daten gefunden." }: DataTableProps) {
    if (isEmpty) {
        return (
            <div className="w-full max-w-6xl py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {headers.map((header, index) => (
                        <th key={index} className={`px-6 py-4 ${index === headers.length - 1 ? 'text-right' : ''}`}>
                            {header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {children}
                </tbody>
            </table>
        </div>
    );
}
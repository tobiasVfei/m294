import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';

export default async function LandDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const land = await fetchWithAuth(`/laender/${id}`);

    return (
        <main className="page-container flex-col !justify-start">
            <div className="w-full max-w-4xl card">
                <div className="flex justify-between items-start border-b pb-4 mb-6">
                    <div>
                        <h1 className="!text-left !mb-1 text-3xl">{land.country}</h1>
                        <p className="text-gray-500 text-sm">Land-ID: {land.id_land}</p>
                    </div>

                    <Link
                        href={`/laender/manage/${id}`}
                        className="text-sm border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50 flex items-center gap-2"
                    >
                        ✏️ Land bearbeiten
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link
                        href={`/lernende?landId=${id}`}
                        className="bg-[var(--background)] border p-6 rounded-xl text-center block transition-shadow hover:shadow-md cursor-pointer group"
                    >
                        <span className="block text-sm font-medium text-gray-500 uppercase group-hover:text-[var(--primary)] transition-colors">Lernende</span>
                        <span className="text-4xl font-bold text-[var(--primary)] mt-2 block">0</span>
                    </Link>
                    <Link
                        href={`/lehrbetriebe?landId=${id}`}
                        className="bg-[var(--background)] border p-6 rounded-xl text-center block transition-shadow hover:shadow-md cursor-pointer group"
                    >
                        <span className="block text-sm font-medium text-gray-500 uppercase group-hover:text-[var(--primary)] transition-colors">Lehrbetriebe</span>
                        <span className="text-4xl font-bold text-gray-800 mt-2 block group-hover:text-[var(--primary)]">0</span>
                    </Link>
                </div>

                <div className="mt-12 pt-6 border-t">
                    <Link href="/laender" className="text-gray-600 hover:text-[var(--primary)] flex items-center gap-1">
                        ← Zurück zur Länderliste
                    </Link>
                </div>
            </div>
        </main>
    );
}


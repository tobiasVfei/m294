import { fetchWithAuth } from '@/lib/api';
import FilterBar from '@/components/FilterBar';
import PageHeader from '@/components/PageHeader';
import DataGrid from '@/components/DataGrid';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({ searchParams }: { searchParams: Promise<any> }) {
    const filters = await searchParams;

    const laenderData = await fetchWithAuth('/laender', {
        cache: 'no-store',
        next: { revalidate: 0 }
    });

    const safeLaender = Array.isArray(laenderData) ? laenderData : [];

    const filteredLaender = safeLaender.filter((land: any) => {
        const searchTerm = filters.q?.toLowerCase();
        return !searchTerm || land.country?.toLowerCase().includes(searchTerm);
    });

    const queryString = new URLSearchParams(filters).toString();

    return (
        <main className="page-container mx-auto w-full max-w-[1200px] !justify-start">
            <PageHeader
                title="Länder"
                count={filteredLaender.length}
                createLabel="+ Neues Land"
                createHref="/laender/manage"
            />

            <FilterBar
                searchPlaceholder="Land suchen..."
                filterOptions={[]}
            />

            <DataGrid
                key={queryString}
                items={filteredLaender}
                resetHref="/laender"
                emptyMessage="Keine Länder gefunden."
                renderItem={(land) => (
                    <div key={land.id_country} className="card p-6 border-l-4 border-l-[var(--primary)] flex flex-col justify-between hover:shadow-xl transition-all h-full">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">ID: #{land.id_country}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{land.country}</h3>
                            <div className="mt-3 h-10">
                                <p className="text-sm text-gray-500 italic">Globaler Standort</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                            <Link
                                href={`/laender/${land.id_country}`}
                                className="text-[var(--primary)] text-sm font-bold hover:underline"
                            >
                                Details anzeigen
                            </Link>
                            <Link
                                href={`/laender/manage/${land.id_country}`}
                                className="text-gray-400 hover:text-gray-700 transition-colors"
                            >
                                ✏️
                            </Link>
                        </div>
                    </div>
                )}
            />
        </main>
    );
}
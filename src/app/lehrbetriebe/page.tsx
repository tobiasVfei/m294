import { fetchWithAuth } from '@/lib/api';
import FilterBar from '@/components/FilterBar';
import PageHeader from '@/components/PageHeader';
import DataGrid from '@/components/DataGrid';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }: { searchParams: Promise<any> }) {
    const filters = await searchParams;

    const [allBetriebe, laender] = await Promise.all([
        fetchWithAuth('/lehrbetriebe', { cache: 'no-store' }),
        fetchWithAuth('/laender', { next: { revalidate: 3600 } })
    ]);

    const safeItems = Array.isArray(allBetriebe) ? allBetriebe : [];

    const filteredBetriebe = safeItems.filter((betrieb: any) => {
        const searchTerm = filters.q?.toLowerCase();
        const landFilter = filters.nr_land;

        const matchesSearch = !searchTerm ||
            betrieb.firma?.toLowerCase().includes(searchTerm) ||
            betrieb.ort?.toLowerCase().includes(searchTerm) ||
            betrieb.strasse?.toLowerCase().includes(searchTerm);

        const matchesLand = !landFilter || String(betrieb.nr_land) === String(landFilter);

        return matchesSearch && matchesLand;
    });

    const landOptions = (laender || []).map((l: any) => ({
        label: l.country,
        value: l.id_country.toString()
    }));

    const queryString = new URLSearchParams(filters).toString();

    return (
        <main className="page-container flex-col !justify-start">
            <PageHeader
                title="Lehrbetriebe"
                count={filteredBetriebe.length}
                createLabel="+ Neuer Betrieb"
                createHref="/lehrbetriebe/manage"
                showBackButton={!!filters.origin}
                backHref={`/${filters.origin}`}
            />

            <FilterBar
                searchPlaceholder="Firma oder Ort suchen..."
                filterOptions={[
                    { key: 'nr_land', label: 'Land', options: landOptions }
                ]}
            />

            <DataGrid
                key={queryString}
                items={filteredBetriebe}
                resetHref="/lehrbetriebe"
                emptyMessage="Keine Lehrbetriebe gefunden."
                renderItem={(betrieb) => (
                    <div key={betrieb.id_lehrbetrieb} className="card p-6 border-l-4 border-l-[var(--primary)] flex flex-col justify-between hover:shadow-xl transition-all h-full">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">ID: #{betrieb.id_lehrbetrieb}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{betrieb.firma}</h3>
                            <div className="mt-3 h-10">
                                <p className="text-sm text-gray-500 truncate">{betrieb.ort || 'Kein Ort angegeben'}</p>
                                <p className="text-xs text-gray-400 truncate">{betrieb.strasse}</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                            <Link
                                href={`/lehrbetriebe/${betrieb.id_lehrbetrieb}`}
                                className="text-[var(--primary)] text-sm font-bold hover:underline"
                            >
                                Details anzeigen
                            </Link>
                            <Link
                                href={`/lehrbetriebe/manage/${betrieb.id_lehrbetrieb}`}
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
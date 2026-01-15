import { fetchWithAuth } from '@/lib/api';
import FilterBar from '@/components/FilterBar';
import PageHeader from '@/components/PageHeader';
import DataGrid from '@/components/DataGrid';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({ searchParams }: { searchParams: Promise<any> }) {
    const filters = await searchParams;

    const [allItems, dozenten] = await Promise.all([
        fetchWithAuth('/kurse', { cache: 'no-store' }),
        fetchWithAuth('/dozenten', { next: { revalidate: 3600 } })
    ]);

    const safeItems = Array.isArray(allItems) ? allItems : [];
    const searchTerm = filters.q?.toLowerCase() || '';
    const dozentFilter = filters.nr_dozent;

    const filteredKurse = safeItems.filter((kurs: any) => {
        const matchesSearch = !searchTerm ||
            kurs.kursthema?.toLowerCase().includes(searchTerm) ||
            kurs.kursnummer?.toLowerCase().includes(searchTerm) ||
            kurs.inhalt?.toLowerCase().includes(searchTerm);

        const matchesDozent = !dozentFilter || String(kurs.nr_dozent) === String(dozentFilter);

        return matchesSearch && matchesDozent;
    });

    const dozentOptions = (dozenten || []).map((d: any) => ({
        label: `${d.vorname} ${d.nachname}`,
        value: d.id_dozent.toString()
    }));

    const currentKey = JSON.stringify(filters);

    return (
        <main key={currentKey} className="page-container flex-col !justify-start">
            <PageHeader
                title="Kurse"
                count={filteredKurse.length}
                createLabel="+ Neuer Kurs"
                createHref="/kurse/manage"
                showBackButton={!!filters.origin}
                backHref={`/${filters.origin}`}
            />

            <FilterBar
                searchPlaceholder="Thema, Nummer oder Inhalt suchen..."
                filterOptions={[{ key: 'nr_dozent', label: 'Dozent', options: dozentOptions }]}
            />

            <DataGrid
                items={filteredKurse}
                resetHref="/kurse"
                emptyMessage="Keine Kurse gefunden."
                renderItem={(kurs) => (
                    <div key={kurs.id_kurs} className="card p-6 border-l-4 border-l-[var(--primary)] flex flex-col justify-between hover:shadow-xl transition-all h-full">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{kurs.kursnummer}</span>
                                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">
                                    {kurs.dauer}h
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{kurs.kursthema}</h3>
                            <p className="text-sm text-gray-500 mt-3 line-clamp-2 italic h-10">
                                {kurs.inhalt || "Kein Inhalt hinterlegt."}
                            </p>
                            <div className="mt-4 flex gap-2 text-[10px] text-gray-400">
                                <span>Start: {kurs.startdatum}</span>
                                <span>•</span>
                                <span>Ende: {kurs.enddatum}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                            <Link href={`/kurse/${kurs.id_kurs}`} className="text-[var(--primary)] text-sm font-bold hover:underline">
                                Details anzeigen
                            </Link>
                            <Link href={`/kurse/manage/${kurs.id_kurs}`} className="text-gray-400 hover:text-gray-700 transition-colors">
                                ✏️
                            </Link>
                        </div>
                    </div>
                )}
            />
        </main>
    );
}
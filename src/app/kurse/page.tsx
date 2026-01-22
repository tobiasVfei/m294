import { fetchWithAuth } from '@/lib/api';
import FilterBar from '@/components/FilterBar';
import PageHeader from '@/components/PageHeader';
import DataGrid from '@/components/DataGrid';
import Link from 'next/link';

interface Kurs {
    id_kurs: number;
    kursnummer: string;
    kursthema: string;
    inhalt?: string;
    nr_dozent: number;
    startdatum: string;
    enddatum: string;
    dauer: string;
}

interface Lernender {
    id_lernende: number;
    vorname: string;
    nachname: string;
}

interface KursLernender {
    nr_kurs: number;
    nr_lernende: number;
}

interface Dozent {
    id_dozent: number;
    vorname: string;
    nachname: string;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({
                                       searchParams
                                   }: {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
    const filters = await searchParams;

    // Laden der notwendigen Daten für Filter und Anzeige
    const [allItems, dozenten, allLernende, allKursLinks] = await Promise.all([
        fetchWithAuth('/kurse', { cache: 'no-store' }),
        fetchWithAuth('/dozenten', { next: { revalidate: 3600 } }),
        fetchWithAuth('/lernende', { cache: 'no-store' }),
        fetchWithAuth('/kurse_lernende', { cache: 'no-store' })
    ]);

    const safeItems: Kurs[] = Array.isArray(allItems) ? allItems : [];
    const safeLinks: KursLernender[] = Array.isArray(allKursLinks) ? allKursLinks : [];

    const searchTerm = typeof filters.q === 'string' ? filters.q.toLowerCase() : '';
    const dozentFilter = filters.nr_dozent;
    const lernendeFilter = filters.nr_lernende;

    const filteredKurse = safeItems.filter((kurs: Kurs) => {
        const matchesSearch = !searchTerm ||
            kurs.kursthema?.toLowerCase().includes(searchTerm) ||
            kurs.kursnummer?.toLowerCase().includes(searchTerm) ||
            kurs.inhalt?.toLowerCase().includes(searchTerm);

        const matchesDozent = !dozentFilter || String(kurs.nr_dozent) === String(dozentFilter);

        const matchesLernende = !lernendeFilter || safeLinks.some(link =>
            String(link.nr_kurs) === String(kurs.id_kurs) &&
            String(link.nr_lernende) === String(lernendeFilter)
        );

        return matchesSearch && matchesDozent && matchesLernende;
    });

    const dozentOptions = (dozenten as Dozent[] || []).map((d: Dozent) => ({
        label: `${d.vorname} ${d.nachname}`,
        value: d.id_dozent.toString()
    }));

    const lernendeOptions = (allLernende as Lernender[] || []).map((l: Lernender) => ({
        label: `${l.vorname} ${l.nachname}`,
        value: l.id_lernende.toString()
    }));

    return (
        <main className="page-container mx-auto w-full max-w-[1200px] flex-col !justify-start px-6 md:px-10">
            <PageHeader
                title="Kurse"
                count={filteredKurse.length}
                createLabel="+ Neuer Kurs"
                createHref="/kurse/manage"
                showBackButton={!!filters.origin}
                backHref={typeof filters.origin === 'string' ? `/${filters.origin}` : '/'}
            />

            <FilterBar
                searchPlaceholder="Thema, Nummer oder Inhalt suchen..."
                filterOptions={[
                    { key: 'nr_dozent', label: 'Dozent', options: dozentOptions },
                    { key: 'nr_lernende', label: 'Lernende/r', options: lernendeOptions }
                ]}
            />

            <DataGrid
                items={filteredKurse}
                resetHref="/kurse"
                emptyMessage="Keine Kurse für diese Filterkriterien gefunden."
                renderItem={(kurs: Kurs) => (
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
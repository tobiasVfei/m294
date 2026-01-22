import { fetchWithAuth } from '@/lib/api';
import FilterBar from '@/components/FilterBar';
import PageHeader from '@/components/PageHeader';
import DataGrid from '@/components/DataGrid';
import Link from 'next/link';

interface Lernender {
    id_lernende: number;
    vorname: string;
    nachname: string;
    email: string;
    nr_land: number;
    ort?: string;
    geschlecht?: string;
}

interface Country {
    id_country: number;
    country: string;
}

interface Lehrbetrieb {
    id_lehrbetrieb: number;
    firma: string;
}

interface LehrLink {
    nr_lernende: number;
    nr_lehrbetrieb: number;
    beruf: string;
}

export const dynamic = 'force-dynamic';

export default async function Page({
                                       searchParams
                                   }: {
    searchParams: Promise<{ [_key: string]: string | string[] | undefined }>
}) {
    const filters = await searchParams;

    const [allItems, laender, allLehrLinks, allLehrbetriebe] = await Promise.all([
        fetchWithAuth('/lernende', { cache: 'no-store' }),
        fetchWithAuth('/laender', { next: { revalidate: 3600 } }),
        fetchWithAuth('/lehrbetrieb_lernende', { cache: 'no-store' }),
        fetchWithAuth('/lehrbetriebe', { next: { revalidate: 3600 } })
    ]);

    const safeItems: Lernender[] = Array.isArray(allItems) ? allItems : [];
    const safeLehrLinks: LehrLink[] = Array.isArray(allLehrLinks) ? allLehrLinks : [];

    const filteredItems = safeItems.filter((item: Lernender) => {
        const searchTerm = typeof filters.q === 'string' ? filters.q.toLowerCase() : undefined;
        const landFilter = filters.nr_land;
        const lehrbetriebFilter = filters.nr_lehrbetrieb;
        const berufFilter = filters.beruf;

        const rel = safeLehrLinks.find(l => String(l.nr_lernende) === String(item.id_lernende));

        const matchesSearch = !searchTerm ||
            item.vorname?.toLowerCase().includes(searchTerm) ||
            item.nachname?.toLowerCase().includes(searchTerm) ||
            item.email?.toLowerCase().includes(searchTerm);

        const matchesLand = !landFilter || String(item.nr_land) === String(landFilter);
        const matchesLehrbetrieb = !lehrbetriebFilter || String(rel?.nr_lehrbetrieb) === String(lehrbetriebFilter);
        const matchesBeruf = !berufFilter || rel?.beruf === berufFilter;

        return matchesSearch && matchesLand && matchesLehrbetrieb && matchesBeruf;
    });

    const landOptions = (laender as Country[] || []).map((l: Country) => ({
        label: l.country,
        value: l.id_country.toString()
    }));

    const lehrbetriebOptions = (allLehrbetriebe as Lehrbetrieb[] || []).map((lb: Lehrbetrieb) => ({
        label: lb.firma,
        value: lb.id_lehrbetrieb.toString()
    }));

    const berufOptions = Array.from(new Set(safeLehrLinks.map((l: LehrLink) => l.beruf)))
        .filter(Boolean)
        .map(b => ({ label: b, value: b }));

    return (
        <main className="page-container mx-auto w-full max-w-[1200px] !justify-start">
            <PageHeader
                title="Lernende"
                count={filteredItems.length}
                createLabel="+ Neue Person"
                createHref="/lernende/manage"
                showBackButton={!!filters.origin}
                backHref={typeof filters.origin === 'string' ? `/${filters.origin}` : '/'}
            />

            <FilterBar
                searchPlaceholder="Name oder E-Mail suchen..."
                filterOptions={[
                    { key: 'nr_land', label: 'Land', options: landOptions },
                    { key: 'nr_lehrbetrieb', label: 'Lehrbetrieb', options: lehrbetriebOptions },
                    { key: 'beruf', label: 'Beruf', options: berufOptions }
                ]}
            />

            <DataGrid
                items={filteredItems}
                resetHref="/lernende"
                renderItem={(person: Lernender) => (
                    <div key={person.id_lernende} className="card p-6 border-l-4 border-l-[var(--primary)] flex flex-col justify-between hover:shadow-xl transition-all h-full">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">ID: #{person.id_lernende}</span>
                                <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500 font-mono uppercase">
                                    {person.geschlecht}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                                {person.vorname} {person.nachname}
                            </h3>
                            <div className="mt-3 h-10">
                                <p className="text-sm text-gray-500 truncate">{person.ort || 'Kein Wohnort'}</p>
                                <p className="text-xs text-[var(--primary)] font-medium truncate">{person.email}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                            <Link href={`/lernende/${person.id_lernende}`} className="text-[var(--primary)] text-sm font-bold hover:underline">
                                Profil anzeigen
                            </Link>
                            <Link href={`/lernende/manage/${person.id_lernende}`} className="text-gray-400 hover:text-gray-700 transition-colors">
                                ✏️
                            </Link>
                        </div>
                    </div>
                )}
            />
        </main>
    );
}
import { fetchWithAuth } from '@/lib/api';
import FilterBar from '@/components/FilterBar';
import PageHeader from '@/components/PageHeader';
import DataGrid from '@/components/DataGrid';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }: { searchParams: Promise<any> }) {
    const filters = await searchParams;

    const [allItems, laender] = await Promise.all([
        fetchWithAuth('/lernende', { cache: 'no-store' }),
        fetchWithAuth('/laender', { next: { revalidate: 3600 } })
    ]);

    const safeItems = Array.isArray(allItems) ? allItems : [];

    const filteredItems = safeItems.filter((item: any) => {
        const searchTerm = filters.q?.toLowerCase();
        const landFilter = filters.nr_land;

        const matchesSearch = !searchTerm ||
            item.vorname?.toLowerCase().includes(searchTerm) ||
            item.nachname?.toLowerCase().includes(searchTerm) ||
            item.email?.toLowerCase().includes(searchTerm);

        const matchesLand = !landFilter || String(item.nr_land) === String(landFilter);

        return matchesSearch && matchesLand;
    });

    const landOptions = (laender || []).map((l: any) => ({
        label: l.country,
        value: l.id_country.toString()
    }));

    return (
        <main className="page-container flex-col !justify-start">
            <PageHeader
                title="Lernende"
                count={filteredItems.length}
                createLabel="+ Neue Person"
                createHref="/lernende/manage"
                showBackButton={!!filters.origin}
                backHref={`/${filters.origin}`}
            />

            <FilterBar
                searchPlaceholder="Name oder E-Mail suchen..."
                filterOptions={[{ key: 'nr_land', label: 'Land', options: landOptions }]}
            />

            <DataGrid
                items={filteredItems}
                resetHref="/lernende"
                renderItem={(person) => (
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
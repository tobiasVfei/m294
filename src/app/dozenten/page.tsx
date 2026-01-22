import { fetchWithAuth } from '@/lib/api';
import FilterBar from '@/components/FilterBar';
import PageHeader from '@/components/PageHeader';
import DataGrid from '@/components/DataGrid';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({ searchParams }: { searchParams: Promise<any> }) {
    const filters = await searchParams;

    const [allDozenten, laender] = await Promise.all([
        fetchWithAuth('/dozenten', { cache: 'no-store' }),
        fetchWithAuth('/laender', { next: { revalidate: 3600 } })
    ]);

    const safeItems = Array.isArray(allDozenten) ? allDozenten : [];
    const searchTerm = filters.q?.toLowerCase() || '';
    const landFilter = filters.nr_land;
    const geschlechtFilter = filters.geschlecht;

    const filteredDozenten = safeItems.filter((dozent: any) => {
        const matchesSearch = !searchTerm ||
            dozent.vorname?.toLowerCase().includes(searchTerm) ||
            dozent.nachname?.toLowerCase().includes(searchTerm) ||
            dozent.email?.toLowerCase().includes(searchTerm) ||
            dozent.ort?.toLowerCase().includes(searchTerm);

        const matchesLand = !landFilter || String(dozent.nr_land) === String(landFilter);
        const matchesGeschlecht = !geschlechtFilter || dozent.geschlecht === geschlechtFilter;

        return matchesSearch && matchesLand && matchesGeschlecht;
    });

    const landOptions = (laender || []).map((l: any) => ({
        label: l.country,
        value: l.id_country.toString()
    }));

    const currentKey = JSON.stringify(filters);

    return (
        <main key={currentKey} className="page-container mx-auto w-full max-w-[1200px] !justify-start">
            <PageHeader
                title="Dozenten"
                count={filteredDozenten.length}
                createLabel="+ Neuer Dozent"
                createHref="/dozenten/manage"
                showBackButton={filters.origin === 'kurse' || filters.origin === 'laender'}
                backHref={filters.origin === 'kurse' ? '/kurse' : '/laender'}
            />

            <FilterBar
                searchPlaceholder="Name, E-Mail oder Ort suchen..."
                filterOptions={[
                    { key: 'nr_land', label: 'Land', options: landOptions },
                    {
                        key: 'geschlecht',
                        label: 'Geschlecht',
                        options: [
                            { label: 'Weiblich', value: 'W' },
                            { label: 'Männlich', value: 'M' }
                        ]
                    }
                ]}
            />

            <DataGrid
                items={filteredDozenten}
                resetHref="/dozenten"
                emptyMessage="Keine Dozenten gefunden."
                renderItem={(dozent) => (
                    <div key={dozent.id_dozent} className="card p-6 border-l-4 border-l-[var(--primary)] flex flex-col justify-between hover:shadow-xl transition-all h-full">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">ID: #{dozent.id_dozent}</span>
                                <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500 font-mono uppercase">
                                    {dozent.geschlecht}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{dozent.vorname} {dozent.nachname}</h3>
                            <div className="mt-3 h-10">
                                <p className="text-sm text-gray-500 truncate">{dozent.ort || 'Kein Ort angegeben'}</p>
                                <p className="text-xs text-[var(--primary)] font-medium truncate">{dozent.email}</p>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
                            <Link href={`/dozenten/${dozent.id_dozent}`} className="text-[var(--primary)] text-sm font-bold hover:underline">
                                Profil öffnen
                            </Link>
                            <Link href={`/dozenten/manage/${dozent.id_dozent}`} className="text-gray-400 text-sm hover:text-gray-700 ml-auto transition-colors">
                                ✏️
                            </Link>
                        </div>
                    </div>
                )}
            />
        </main>
    );
}
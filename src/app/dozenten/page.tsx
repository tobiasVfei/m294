import { fetchWithAuth } from '@/lib/api';
import FilterBar from '@/components/FilterBar';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import DataRow from '@/components/DataRow';

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

            <DataTable
                headers={['ID', 'Name', 'E-Mail', 'Ort', 'Aktionen']}
                isEmpty={filteredDozenten.length === 0}
                emptyMessage="Keine Dozenten gefunden."
            >
                {filteredDozenten.map((dozent: any) => (
                    <DataRow
                        key={dozent.id_dozent}
                        id={dozent.id_dozent}
                        title={`${dozent.vorname} ${dozent.nachname}`}
                        subtitle={dozent.geschlecht === 'W' ? 'Weiblich' : 'Männlich'}
                        details={dozent.email}
                        info={dozent.ort || 'Kein Ort angegeben'}
                        viewHref={`/dozenten/${dozent.id_dozent}`}
                        editHref={`/dozenten/manage/${dozent.id_dozent}`}
                    />
                ))}
            </DataTable>
        </main>
    );
}
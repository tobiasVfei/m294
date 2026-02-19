import { fetchWithAuth } from '@/lib/api';
import FilterBar from '@/components/FilterBar';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import DataRow from '@/components/DataRow';

export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }: { searchParams: Promise<any> }) {
    const filters = await searchParams;

    const allBetriebe = await fetchWithAuth('/lehrbetriebe', { cache: 'no-store' });
    const safeItems = Array.isArray(allBetriebe) ? allBetriebe : [];

    const filteredBetriebe = safeItems.filter((betrieb: any) => {
        const searchTerm = filters.q?.toLowerCase();
        return !searchTerm ||
            betrieb.firma?.toLowerCase().includes(searchTerm) ||
            betrieb.ort?.toLowerCase().includes(searchTerm) ||
            betrieb.strasse?.toLowerCase().includes(searchTerm);
    });

    return (
        <main className="page-container mx-auto w-full max-w-[1200px] !justify-start">
            <PageHeader
                title="Lehrbetriebe"
                count={filteredBetriebe.length}
                createLabel="+ Neuer Betrieb"
                createHref="/lehrbetriebe/manage"
                showBackButton={!!filters.origin}
                backHref={`/${filters.origin}`}
            />

            <FilterBar
                searchPlaceholder="Firma, Ort oder Strasse suchen..."
                filterOptions={[]}
            />

            <DataTable
                headers={['ID', 'Firma', 'Adresse', 'Ort', 'Aktionen']}
                isEmpty={filteredBetriebe.length === 0}
                emptyMessage="Keine Lehrbetriebe gefunden."
            >
                {filteredBetriebe.map((betrieb: any) => (
                    <DataRow
                        key={betrieb.id_lehrbetrieb}
                        id={betrieb.id_lehrbetrieb}
                        title={betrieb.firma}
                        details={betrieb.strasse || '—'}
                        info={betrieb.ort || '—'}
                        viewHref={`/lehrbetriebe/${betrieb.id_lehrbetrieb}`}
                        editHref={`/lehrbetriebe/manage/${betrieb.id_lehrbetrieb}`}
                    />
                ))}
            </DataTable>
        </main>
    );
}

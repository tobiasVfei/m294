import { fetchWithAuth } from '@/lib/api';
import FilterBar from '@/components/FilterBar';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import DataRow from '@/components/DataRow';

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

interface Kurs {
    id_kurs: number;
    kursthema: string;
}

interface KursLernende {
    nr_lernende: number;
    nr_kurs: number;
}

export const dynamic = 'force-dynamic';

export default async function Page({
                                       searchParams
                                   }: {
    searchParams: Promise<{ [_key: string]: string | string[] | undefined }>
}) {
    const filters = await searchParams;

    const [allItems, laender, allLehrLinks, allLehrbetriebe, allKurse, allKursLinks] = await Promise.all([
        fetchWithAuth('/lernende'),
        fetchWithAuth('/laender'),
        fetchWithAuth('/lehrbetrieb_lernende'),
        fetchWithAuth('/lehrbetriebe'),
        fetchWithAuth('/kurse'),
        fetchWithAuth('/kurse_lernende')
    ]);

    const safeItems: Lernender[] = Array.isArray(allItems) ? allItems : [];
    const safeLehrLinks: LehrLink[] = Array.isArray(allLehrLinks) ? allLehrLinks : [];
    const safeKursLinks: KursLernende[] = Array.isArray(allKursLinks) ? allKursLinks : [];

    const filteredItems = safeItems.filter((item: Lernender) => {
        const searchTerm = typeof filters.q === 'string' ? filters.q.toLowerCase() : undefined;
        const landFilter = filters.nr_land;
        const lehrbetriebFilter = filters.nr_lehrbetrieb;
        const berufFilter = filters.beruf;
        const kursFilter = filters.nr_kurs;

        const lehrRel = safeLehrLinks.find(l => String(l.nr_lernende) === String(item.id_lernende));

        const matchesSearch = !searchTerm ||
            item.vorname?.toLowerCase().includes(searchTerm) ||
            item.nachname?.toLowerCase().includes(searchTerm) ||
            item.email?.toLowerCase().includes(searchTerm);

        const matchesLand = !landFilter || String(item.nr_land) === String(landFilter);
        const matchesLehrbetrieb = !lehrbetriebFilter || String(lehrRel?.nr_lehrbetrieb) === String(lehrbetriebFilter);
        const matchesBeruf = !berufFilter || lehrRel?.beruf === berufFilter;

        const matchesKurs = !kursFilter || safeKursLinks.some(kl =>
            String(kl.nr_lernende) === String(item.id_lernende) && String(kl.nr_kurs) === String(kursFilter)
        );

        return matchesSearch && matchesLand && matchesLehrbetrieb && matchesBeruf && matchesKurs;
    });

    const landOptions = (laender as Country[] || []).map((l: Country) => ({
        label: l.country,
        value: l.id_country.toString()
    }));

    const lehrbetriebOptions = (allLehrbetriebe as Lehrbetrieb[] || []).map((lb: Lehrbetrieb) => ({
        label: lb.firma,
        value: lb.id_lehrbetrieb.toString()
    }));

    const kursOptions = (allKurse as Kurs[] || []).map((k: Kurs) => ({
        label: k.kursthema,
        value: k.id_kurs.toString()
    }));

    const berufOptions = Array.from(new Set(safeLehrLinks.map((l: LehrLink) => l.beruf)))
        .filter(Boolean)
        .map(b => ({ label: b, value: b }));

    return (
        <main className="page-container mx-auto w-full !justify-start">
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
                    { key: 'nr_kurs', label: 'Kurs', options: kursOptions },
                    { key: 'beruf', label: 'Beruf', options: berufOptions }
                ]}
            />

            <DataTable
                headers={['ID', 'Name', 'Kontakt', 'Wohnort', 'Aktionen']}
                isEmpty={filteredItems.length === 0}
            >
                {filteredItems.map((person) => (
                    <DataRow
                        key={person.id_lernende}
                        id={person.id_lernende}
                        title={`${person.vorname} ${person.nachname}`}
                        subtitle={person.geschlecht === 'w' ? 'Weiblich' : 'Männlich'}
                        details={person.email}
                        info={person.ort || '-'}
                        viewHref={`/lernende/${person.id_lernende}`}
                        editHref={`/lernende/manage/${person.id_lernende}`}
                    />
                ))}
            </DataTable>
        </main>
    );
}
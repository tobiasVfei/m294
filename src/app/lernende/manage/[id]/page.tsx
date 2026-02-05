import { fetchWithAuth } from '@/lib/api';
import EditLernendeForm from './edit-form';

export default async function EditLernendePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [person, allKurse, allKursLinks, laender, lehrbetriebe, allLehrLinks] = await Promise.all([
        fetchWithAuth(`/lernende/${id}`),
        fetchWithAuth('/kurse'),
        fetchWithAuth('/kurse_lernende'),
        fetchWithAuth('/laender'),
        fetchWithAuth('/lehrbetriebe'),
        fetchWithAuth('/lehrbetrieb_lernende')
    ]);

    const relevantLinks = (allKursLinks || []).filter((link: any) => String(link.nr_lernende) === id);
    const lehrRel = (allLehrLinks || []).find((l: any) => String(l.nr_lernende) === id);

    return (
        <main className="page-container flex flex-col items-center py-12">
            <EditLernendeForm
                person={person}
                allKurse={allKurse}
                kursLinks={relevantLinks}
                laender={laender}
                lehrbetriebe={lehrbetriebe}
                lehrverhaeltnis={lehrRel}
            />
        </main>
    );
}
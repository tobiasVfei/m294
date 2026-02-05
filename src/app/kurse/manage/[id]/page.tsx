import { fetchWithAuth } from '@/lib/api';
import EditKursForm from './edit-form';

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [kurs, allLernende, kursBelegungen, allDozenten] = await Promise.all([
        fetchWithAuth(`/kurse/${id}`),
        fetchWithAuth('/lernende'),
        fetchWithAuth('/kurse_lernende'),
        fetchWithAuth('/dozenten')
    ]);

    const belegteLernende = (kursBelegungen || []).filter((b: any) => String(b.nr_kurs) === id);

    return (
        <main className="page-container flex flex-col items-center py-12">
            <EditKursForm
                kurs={kurs}
                allLernende={allLernende}
                belegungen={belegteLernende}
                allDozenten={allDozenten || []}
            />
        </main>
    );
}
import { fetchWithAuth } from '@/lib/api';
import EditLehrbetriebForm from './edit-form';

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [lehrbetrieb, allLernende, allLehrLinks] = await Promise.all([
        fetchWithAuth(`/lehrbetriebe/${id}`),
        fetchWithAuth('/lernende'),
        fetchWithAuth('/lehrbetrieb_lernende'),
    ]);

    // Only the links that belong to this Lehrbetrieb
    const lehrLinks = Array.isArray(allLehrLinks)
        ? allLehrLinks.filter((l: any) => String(l.nr_lehrbetrieb) === id)
        : [];

    return (
        <main className="page-container">
            <EditLehrbetriebForm
                lehrbetrieb={lehrbetrieb}
                allLernende={Array.isArray(allLernende) ? allLernende : []}
                lehrLinks={lehrLinks}
            />
        </main>
    );
}

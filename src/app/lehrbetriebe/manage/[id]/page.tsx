import { fetchWithAuth } from '@/lib/api';
import EditKursForm from './edit-form';

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const lehrbetrieb = await fetchWithAuth(`/lehrbetriebe/${id}`);

    return (
        <main className="page-container">
            <EditKursForm lehrbetrieb={lehrbetrieb} />
        </main>
    );
}

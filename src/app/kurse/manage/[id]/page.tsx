import { fetchWithAuth } from '@/lib/api';
import EditKursForm from './edit-form';

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const kurs = await fetchWithAuth(`/kurse/${id}`);

    return (
        <main className="page-container">
            <EditKursForm kurs={kurs} />
        </main>
    );
}

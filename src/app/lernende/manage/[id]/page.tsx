import { fetchWithAuth } from '@/lib/api';
import EditLernendeForm from './edit-form';

export default async function EditLernendePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const person = await fetchWithAuth(`/lernende/${id}`);

    return (
        <main className="page-container">
            <EditLernendeForm person={person} />
        </main>
    );
}
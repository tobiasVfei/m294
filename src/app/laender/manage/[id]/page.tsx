import { fetchWithAuth } from '@/lib/api';
import EditLandForm from './edit-form';

export default async function EditLandPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const land = await fetchWithAuth(`/laender/${id}`);

    return (
        <main className="page-container">
            <EditLandForm land={land} />
        </main>
    );
}
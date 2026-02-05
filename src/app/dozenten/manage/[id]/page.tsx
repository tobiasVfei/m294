import { fetchWithAuth } from '@/lib/api';
import EditDozentForm from './edit-form';

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [dozent, laender] = await Promise.all([
        fetchWithAuth(`/dozenten/${id}`),
        fetchWithAuth('/laender')
    ]);

    return (
        <main className="page-container flex flex-col items-center py-12">
            <EditDozentForm
                dozent={dozent}
                laender={Array.isArray(laender) ? laender : []}
            />
        </main>
    );
}
import { fetchWithAuth } from '@/lib/api';
import CreateKursForm from './create-form';

// Server component: lädt Dozenten-Liste für das Dropdown
export default async function CreateKursPage() {
    const dozenten = await fetchWithAuth('/dozenten');

    return (
        <main className="page-container flex flex-col items-center py-12">
            <CreateKursForm dozenten={dozenten || []} />
        </main>
    );
}

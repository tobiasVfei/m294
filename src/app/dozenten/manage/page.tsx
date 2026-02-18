import { fetchWithAuth } from '@/lib/api';
import CreateDozentForm from './create-form';

// Server component: lädt Länder für das Dropdown
export default async function CreateDozentPage() {
    const laender = await fetchWithAuth('/laender');

    return (
        <main className="page-container flex flex-col items-center py-12">
            <CreateDozentForm laender={laender || []} />
        </main>
    );
}

import { fetchWithAuth } from '@/lib/api';
import CreateLernendeForm from './create-form';

// Server component: lädt Dropdown-Daten und reicht sie ans Client-Formular weiter
export default async function CreateLernendePage() {
    const [laender, lehrbetriebe] = await Promise.all([
        fetchWithAuth('/laender'),
        fetchWithAuth('/lehrbetriebe'),
    ]);

    return (
        <main className="page-container flex flex-col items-center py-12">
            <CreateLernendeForm laender={laender || []} lehrbetriebe={lehrbetriebe || []} />
        </main>
    );
}

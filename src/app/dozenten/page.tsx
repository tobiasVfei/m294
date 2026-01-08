import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';

export default async function Page() {
    const dozenten = await fetchWithAuth('/dozenten');

    return (
        <main className="page-container flex-col !justify-start">
            <div className="w-full max-w-6xl flex justify-between items-center mb-8">
                <h1 className="!mb-0">Alle Dozenten</h1>
                <Link href="/kurse/manage" className="btn-primary !w-auto">
                    + Neuer Dozent
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                {dozenten.map((dozent: any) => (
                    <div key={dozent.id_dozent} className="card relative group">
                        <h3 className="text-xl font-bold">{dozent.vorname}</h3>
                        <p className="text-sm text-gray-500 mb-4">{dozent.nachname}</p>
                        
                        <div className="flex gap-2 mt-4">
                            <Link href={`/dozenten/${dozent.id_dozent}`} className="text-blue-600 text-sm hover:underline">
                                Details ansehen
                            </Link>
                             <Link href={`/dozenten/manage/${dozent.id_dozent}`} className="text-gray-400 text-sm hover:text-gray-700 ml-auto">
                                ✏️ Bearbeiten
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}

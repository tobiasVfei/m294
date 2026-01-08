import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const lernende = await fetchWithAuth('/lernende');
    const { landId } = await searchParams;

    // Filterlogik
    let filteredLernende = lernende;
    let isFiltered = false;

    if (landId && typeof landId === 'string') {
        filteredLernende = lernende.filter((p: any) => String(p.id_land) === landId);
        isFiltered = true;
    }

    return (
        <main className="page-container flex-col !justify-start">
            <div className="w-full max-w-6xl flex flex-col mb-8">
                <div className="flex justify-between items-center w-full mb-4">
                    <h1 className="!mb-0">Lernende</h1>
                    <Link href="/lernende/manage" className="btn-primary !w-auto">
                        + Neue Person
                    </Link>
                </div>

                {isFiltered && (
                    <div className="w-full bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md flex justify-between items-center">
                        <span className="text-sm">
                            Gefiltert nach Land #{landId} &bull; {filteredLernende.length} Ergebnisse
                        </span>
                        <Link href="/lernende" className="text-sm font-medium hover:underline text-blue-900">
                            ✕ Filter zurücksetzen
                        </Link>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                {filteredLernende.map((person: any) => (
                    <div key={person.id_lernende} className="card relative group">
                        <h3 className="text-xl font-bold">{person.vorname} {person.nachname}</h3>
                        <div className="flex gap-2 mt-4 border-t pt-4">
                            <Link href={`/lernende/${person.id_lernende}`} className="text-[var(--primary)] text-sm hover:underline">
                                Profil anzeigen
                            </Link>
                            <Link href={`/lernende/manage/${person.id_lernende}`} className="text-gray-400 text-sm hover:text-gray-700 ml-auto">
                                ✏️ Bearbeiten
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const betriebe = await fetchWithAuth('/lehrbetriebe');
    const { landId } = await searchParams;

    // Filterlogik
    let filteredBetriebe = betriebe;
    let isFiltered = false;

    if (landId && typeof landId === 'string') {
        filteredBetriebe = betriebe.filter((b: any) => String(b.id_land) === landId);
        isFiltered = true;
    }

    return (
        <main className="page-container flex-col !justify-start">
            <div className="w-full max-w-6xl flex flex-col mb-8">
                <div className="flex justify-between items-center w-full mb-4">
                    <h1 className="!mb-0">Lehrbetriebe</h1>
                    <Link href="/lehrbetriebe/manage" className="btn-primary !w-auto">
                        + Neuer Betrieb
                    </Link>
                </div>

                {isFiltered && (
                    <div className="w-full bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md flex justify-between items-center">
                        <span className="text-sm">
                            Gefiltert nach Land #{landId} &bull; {filteredBetriebe.length} Ergebnisse
                        </span>
                        <Link href="/lehrbetriebe" className="text-sm font-medium hover:underline text-blue-900">
                            ✕ Filter zurücksetzen
                        </Link>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                {filteredBetriebe.map((betrieb: any) => (
                    <div key={betrieb.id_lehrbetrieb} className="card relative group">
                        <h3 className="text-xl font-bold">{betrieb.firma}</h3>

                        <p className="text-sm text-gray-500 mb-4">{betrieb.ort}</p>

                        <div className="flex gap-2 mt-4">
                            <Link href={`/lehrbetriebe/manage/${betrieb.id_lehrbetrieb}`} className="text-gray-400 text-sm hover:text-gray-700 ml-auto">
                                ✏️ Bearbeiten
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
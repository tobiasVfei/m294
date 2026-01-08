import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';

export default async function LehrbetriebDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const betrieb = await fetchWithAuth(`/lehrbetriebe/${id}`);

    return (
        <main className="page-container flex-col !justify-start">
            <div className="w-full max-w-4xl card">

                <div className="flex justify-between items-start border-b pb-4 mb-6">
                    <div>
                        <h1 className="!text-left !mb-1 text-3xl">{betrieb.firma}</h1>
                        <p className="text-gray-500 text-sm">Betriebs-ID: {betrieb.id_lehrbetrieb}</p>
                    </div>

                    <Link
                        href={`/lehrbetriebe/manage/${betrieb.id_lehrbetrieb}`}
                        className="btn-primary !w-auto bg-gray-100 !text-gray-700 hover:bg-gray-200 border-none"
                    >
                        ✏️ Bearbeiten
                    </Link>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2">Adresse</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-lg">{betrieb.strasse || "Keine Strasse hinterlegt"}</p>
                            <p className="text-lg">{betrieb.plz} {betrieb.ort}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border p-4 rounded-lg">
                            <span className="block text-sm font-medium text-gray-500">Standort</span>
                            <span className="text-lg font-medium">{betrieb.ort}</span>
                        </div>
                        <div className="border p-4 rounded-lg">
                            <span className="block text-sm font-medium text-gray-500">Postleitzahl</span>
                            <span className="text-lg font-medium">{betrieb.plz || "–"}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t">
                    <Link href="/lehrbetriebe" className="text-[var(--primary)] hover:underline flex items-center gap-1">
                        ← Zurück zur Liste
                    </Link>
                </div>

            </div>
        </main>
    );
}
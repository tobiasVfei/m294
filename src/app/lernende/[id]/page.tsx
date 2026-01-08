import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';

export default async function LernendeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const person = await fetchWithAuth(`/lernende/${id}`);

    return (
        <main className="page-container flex-col !justify-start">
            <div className="w-full max-w-4xl card">

                <div className="flex justify-between items-start border-b pb-4 mb-6">
                    <div>
                        <h1 className="!text-left !mb-1 text-3xl">{person.vorname} {person.nachname}</h1>
                        <p className="text-gray-500 text-sm">Lernende-ID: {person.id_lernende}</p>
                    </div>

                    <Link
                        href={`/lernende/manage/${id}`}
                        className="text-sm border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50 flex items-center gap-2"
                    >
                        ✏️ Bearbeiten
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Persönliche Informationen</h3>
                        <div className="space-y-4">
                            <div>
                                <span className="block text-sm text-gray-500">Wohnort</span>
                                <p className="text-lg font-medium">{person.plz} {person.ort}</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Ausbildungsbetrieb</h3>
                        <div className="bg-[var(--background)] border p-4 rounded-lg">
                            <span className="block text-sm text-gray-500 mb-1">Betriebsnummer</span>
                            <Link href={`/lehrbetriebe/${person.id_lehrbetrieb}`} className="text-lg font-medium text-[var(--primary)] hover:underline">
                                #{person.id_lehrbetrieb}
                            </Link>
                        </div>
                    </section>
                </div>

                <div className="mt-8 pt-6 border-t">
                    <Link href="/lernende" className="text-gray-600 hover:text-[var(--primary)] flex items-center gap-1">
                        ← Zurück zur Liste
                    </Link>
                </div>

            </div>
        </main>
    );
}
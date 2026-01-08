import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';

export default async function DozentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Daten für diesen Dozenten holen
    const dozent = await fetchWithAuth(`/dozenten/${id}`);

    return (
        <main className="page-container flex-col !justify-start">
            <div className="w-full max-w-4xl card">

                {/* Header Bereich */}
                <div className="flex justify-between items-start border-b pb-4 mb-6">
                    <div>
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Dozent
                        </span>
                        <h1 className="!text-left !mb-1 mt-2 text-3xl">
                            {dozent.vorname} {dozent.nachname}
                        </h1>
                        <p className="text-gray-500 text-sm">ID: {dozent.id_dozent}</p>
                    </div>

                    {/* Action Button: Zur Bearbeitung springen */}
                    <Link
                        href={`/dozenten/manage/${id}`}
                        className="text-sm border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50 flex items-center gap-2"
                    >
                        ✏️ Bearbeiten
                    </Link>
                </div>

                {/* Inhalt Bereich */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Adresse</h3>
                            <p className="text-lg">
                                {dozent.strasse || "-"}<br />
                                {dozent.plz} {dozent.ort}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Kontaktdaten</h3>
                            <p className="text-lg">
                                {/* Hier E-Mail oder Telefon anzeigen, falls vorhanden */}
                                {dozent.email ? (
                                    <a href={`mailto:${dozent.email}`} className="text-blue-600 hover:underline">{dozent.email}</a>
                                ) : (
                                    <span className="text-gray-400">Keine E-Mail hinterlegt</span>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Optional: Liste der Länder-ID oder andere Infos */}
                    {dozent.id_land && (
                        <div>
                            <span className="text-sm text-gray-500">Land ID: {dozent.id_land}</span>
                        </div>
                    )}
                </div>

                {/* Footer / Zurück Button */}
                <div className="mt-8 pt-6 border-t">
                    <Link href="/dozenten" className="text-blue-600 hover:underline flex items-center gap-1">
                        ← Zurück zur Übersicht
                    </Link>
                </div>

            </div>
        </main>
    );
}

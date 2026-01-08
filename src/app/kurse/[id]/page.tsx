import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';

// Wir holen die ID aus den URL-Parametern
export default async function KursDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    // 1. Parameter auflösen (Notwendig in Next.js 15)
    const { id } = await params;

    // 2. Daten für diesen spezifischen Kurs holen
    // API Endpoint muss z.B. /kurse/123 unterstützen
    const kurs = await fetchWithAuth(`/kurse/${id}`);

    // Optional: Wenn du auch den Namen des Dozenten anzeigen willst,
    // müsstest du hier evtl. noch einen zweiten Fetch machen:
    // const dozent = await fetchWithAuth(`/dozenten/${kurs.nr_dozent}`);

    return (
        <main className="page-container flex-col !justify-start">
            <div className="w-full max-w-4xl card">
                
                {/* Header Bereich */}
                <div className="flex justify-between items-start border-b pb-4 mb-6">
                    <div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {kurs.kursnummer}
                        </span>
                        <h1 className="!text-left !mb-1 mt-2 text-3xl">{kurs.kursthema}</h1>
                        <p className="text-gray-500 text-sm">Kurs-ID: {kurs.id_kurs}</p>
                    </div>
                    
                    {/* Action Button: Zur Bearbeitung springen */}
                    <Link 
                        href={`/kurse/manage/${id}`} 
                        className="text-sm border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50 flex items-center gap-2"
                    >
                        ✏️ Bearbeiten
                    </Link>
                </div>

                {/* Inhalt Bereich */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Kursinhalt</h3>
                        <p className="text-gray-700 leading-relaxed mt-2 whitespace-pre-wrap">
                            {kurs.inhalt || "Keine Inhaltsangabe verfügbar."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                        <div>
                            <span className="block text-sm font-medium text-gray-500">Dozent ID</span>
                            <span className="text-lg font-medium">{kurs.nr_dozent}</span>
                             {/* Falls du den Dozentennamen geholt hättest:
                                <span className="text-lg font-medium">{dozent.vorname} {dozent.nachname}</span> 
                             */}
                        </div>
                        <div>
                             <span className="block text-sm font-medium text-gray-500">Dauer / Termine</span>
                             <span className="text-lg font-medium">{kurs.dauer || "Nicht angegeben"}</span>
                        </div>
                    </div>
                </div>

                {/* Footer / Zurück Button */}
                <div className="mt-8 pt-6 border-t">
                    <Link href="/kurse" className="text-blue-600 hover:underline flex items-center gap-1">
                        ← Zurück zur Übersicht
                    </Link>
                </div>

            </div>
        </main>
    );
}

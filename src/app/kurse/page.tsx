import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';

export default async function Page() {
    const kurse = await fetchWithAuth('/kurse');

    return (
        <main className="page-container flex-col !justify-start">
            <div className="w-full max-w-6xl flex justify-between items-center mb-8">
                <h1 className="!mb-0">Alle Kurse</h1>
                <Link href="/kurse/manage" className="btn-primary !w-auto">
                    + Neuer Kurs
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                {kurse.map((kurs: any) => (
                    <div key={kurs.id_kurs} className="card relative group">
                        <h3 className="text-xl font-bold">{kurs.kursthema}</h3>
                        <p className="text-sm text-gray-500 mb-4">{kurs.kursnummer}</p>
                        
                        <div className="flex gap-2 mt-4">
                            <Link href={`/kurse/${kurs.id_kurs}`} className="text-blue-600 text-sm hover:underline">
                                Details ansehen
                            </Link>
                             <Link href={`/kurse/manage/${kurs.id_kurs}`} className="text-gray-400 text-sm hover:text-gray-700 ml-auto">
                                ✏️ Bearbeiten
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}

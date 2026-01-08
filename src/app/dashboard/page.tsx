import Link from 'next/link';

export default function DashboardPage() {
    return (
        <main className="page-container flex-col !justify-start">
            <h1 className="text-4xl font-bold mb-10">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                {/* Karte für Kurse */}
                <Link href="/kurse" className="card hover:shadow-xl transition-shadow cursor-pointer block !p-6">
                    <h2 className="text-2xl font-bold text-blue-600 mb-2"> Kurse</h2>
                    <p className="text-gray-600">Verwalten Sie das Kursangebot, Details und Termine.</p>
                </Link>

                {/* Karte für Lernende */}
                <Link href="/lernende" className="card hover:shadow-xl transition-shadow cursor-pointer block !p-6">
                    <h2 className="text-2xl font-bold text-green-600 mb-2"> Lernende</h2>
                    <p className="text-gray-600">Übersicht aller Studenten und deren Leistungen.</p>
                </Link>

                {/* Karte für Dozenten */}
                <Link href="/dozenten" className="card hover:shadow-xl transition-shadow cursor-pointer block !p-6">
                    <h2 className="text-2xl font-bold text-purple-600 mb-2"> Dozenten</h2>
                    <p className="text-gray-600">Profile und Zuweisungen der Lehrkräfte.</p>
                </Link>
                
                 {/* Weitere Karten für Betriebe und Länder... */}
            </div>
        </main>
    );
}

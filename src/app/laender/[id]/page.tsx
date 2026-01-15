import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';
import StatCard from '@/components/StatCard';

export default async function LandDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [land, allLernende, allLehrbetriebe, allDozenten] = await Promise.all([
        fetchWithAuth(`/laender/${id}`),
        fetchWithAuth('/lernende'),
        fetchWithAuth('/lehrbetriebe'),
        fetchWithAuth('/dozenten')
    ]);

    const stats = [
        {
            label: 'Lernende',
            count: (allLernende || []).filter((l: any) => String(l.nr_land) === id).length,
            href: `/lernende?nr_land=${id}&origin=laender`
        },
        {
            label: 'Lehrbetriebe',
            count: (allLehrbetriebe || []).filter((b: any) => String(b.nr_land) === id).length,
            href: `/lehrbetriebe?nr_land=${id}&origin=laender`
        },
        {
            label: 'Dozenten',
            count: (allDozenten || []).filter((d: any) => String(d.nr_land) === id).length,
            href: `/dozenten?nr_land=${id}&origin=laender`
        }
    ];

    return (
        <main className="page-container flex-col !justify-start">
            <div className="w-full max-w-4xl card p-8">
                <div className="flex justify-between items-start border-b border-gray-100 pb-6 mb-8">
                    <div>
                        <h1 className="!text-left !mb-1 text-4xl font-extrabold">{land.country}</h1>
                        <p className="text-gray-400 text-sm font-medium">Datenbank-ID: {land.id_country}</p>
                    </div>

                    <Link
                        href={`/laender/manage/${id}`}
                        className="text-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-all font-medium"
                    >
                        ✏️ Land bearbeiten
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat) => (
                        <StatCard
                            key={stat.label}
                            label={stat.label}
                            count={stat.count}
                            href={stat.href}
                        />
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t border-gray-50">
                    <Link href="/laender" className="text-gray-400 hover:text-[var(--primary)] flex items-center gap-2 text-sm font-semibold transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6"/>
                        </svg>
                        Zurück zur Übersicht
                    </Link>
                </div>
            </div>
        </main>
    );
}
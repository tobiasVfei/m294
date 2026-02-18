import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';
import StatCard from '@/components/StatCard';
import DetailHeader from '@/components/DetailHeader';
import { Icons } from '@/lib/icons';

export const dynamic = 'force-dynamic';

export default async function LandDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [land, allLernende, allDozenten] = await Promise.all([
        fetchWithAuth(`/laender/${id}`),
        fetchWithAuth('/lernende'),
        fetchWithAuth('/dozenten')
    ]);

    const stats = [
        {
            label: 'Lernende',
            count: (allLernende || []).filter((l: any) => String(l.nr_land) === id).length,
            href: `/lernende?nr_land=${id}&origin=laender`
        },
        {
            label: 'Dozenten',
            count: (allDozenten || []).filter((d: any) => String(d.nr_land) === id).length,
            href: `/dozenten?nr_land=${id}&origin=laender`
        }
    ];

    return (
        <main className="page-container flex-col !justify-start py-10">
            <div className="card !max-w-4xl p-10 mx-auto">

                <DetailHeader
                    title={land.country}
                    subtitle={`Datenbank-ID: ${land.id_country}`}
                    icon={<Icons.Globe size={40} />}
                    editHref={`/laender/manage/${id}`}
                />

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

                <div className="mt-16 pt-8 border-t border-gray-100">
                    <Link href="/laender" className="back-link group">
                        <div className="p-2 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors">
                            <Icons.ChevronLeft />
                        </div>
                        ZURÜCK ZUR ÜBERSICHT
                    </Link>
                </div>
            </div>
        </main>
    );
}
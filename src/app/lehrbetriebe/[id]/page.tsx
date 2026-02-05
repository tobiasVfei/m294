import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';
import StatCard from '@/components/StatCard';
import DetailField from '@/components/DetailField';
import DetailSection from '@/components/DetailSection';
import DetailHeader from '@/components/DetailHeader';
import { Icons } from '@/lib/icons';

interface Lehrbetrieb {
    id_lehrbetrieb: number;
    firma: string;
    strasse: string;
    plz: string;
    ort: string;
}

interface LehrLink {
    nr_lehrbetrieb: number;
    nr_lernende: number;
}

export default async function LehrbetriebDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [betriebData, allLehrLinks] = await Promise.all([
        fetchWithAuth(`/lehrbetriebe/${id}`),
        fetchWithAuth('/lehrbetrieb_lernende')
    ]);

    const betrieb = betriebData as Lehrbetrieb;
    const lehrLinks = (allLehrLinks as LehrLink[]) || [];
    const lernendeCount = lehrLinks.filter((link: LehrLink) => String(link.nr_lehrbetrieb) === id).length;

    return (
        <main className="page-container flex-col !justify-start py-10">
            <div className="card !max-w-7xl p-10">

                <DetailHeader
                    title={betrieb.firma}
                    subtitle={`Betriebs-ID: #${betrieb.id_lehrbetrieb}`}
                    icon={<Icons.Building size={40} />}
                    editHref={`/lehrbetriebe/manage/${id}`}
                    badge="Lehrbetrieb"
                />

                <div className="detail-grid-layout">
                    <div className="detail-main-content">
                        <DetailSection title="Standort & Adresse">
                            <DetailField
                                label="Strasse"
                                value={betrieb.strasse}
                                icon={<Icons.MapPin />}
                            />
                            <DetailField
                                label="Postleitzahl"
                                value={betrieb.plz}
                                icon={<Icons.Hash />}
                            />
                            <DetailField
                                label="Ort"
                                value={betrieb.ort}
                                icon={<Icons.MapPin />}
                            />
                        </DetailSection>
                    </div>

                    <div className="detail-sidebar">
                        <StatCard
                            label="Lernende im Betrieb"
                            count={lernendeCount}
                            href={`/lernende?nr_lehrbetrieb=${id}&origin=lehrbetriebe`}
                        />
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100">
                    <Link href="/lehrbetriebe" className="back-link group">
                        <div className="p-2 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors">
                            <Icons.ChevronLeft />
                        </div>
                        ZURÜCK ZUR LISTE
                    </Link>
                </div>
            </div>
        </main>
    );
}
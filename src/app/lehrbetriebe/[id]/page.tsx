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
    id_lehrbetrieb_lernende: number;
    nr_lehrbetrieb: number;
    nr_lernende: number;
    beruf?: string;
    start?: string;
    ende?: string;
}

export default async function LehrbetriebDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [betriebData, allLehrLinks, allLernende] = await Promise.all([
        fetchWithAuth(`/lehrbetriebe/${id}`),
        fetchWithAuth('/lehrbetrieb_lernende'),
        fetchWithAuth('/lernende'),
    ]);

    const betrieb = betriebData as Lehrbetrieb;
    const lehrLinks = ((allLehrLinks as LehrLink[]) || []).filter((link: LehrLink) => String(link.nr_lehrbetrieb) === id);
    const lernendeCount = lehrLinks.length;

    const formatDate = (d: string | undefined) => d ? new Date(d).toLocaleDateString('de-CH') : '-';

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
                                label="Adresse"
                                value={`${betrieb.strasse}, ${betrieb.plz} ${betrieb.ort}`}
                                icon={<Icons.MapPin />}
                            />
                        </DetailSection>

                        <section className="w-full">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-3">
                                <span className="h-px w-8 bg-gray-200"></span>
                                Lernende im Betrieb
                            </h3>
                            <div className="flex flex-col gap-3">
                                {lehrLinks.length > 0 ? (
                                    lehrLinks.map((link: LehrLink) => {
                                        const person = (allLernende || []).find((l: any) => l.id_lernende === link.nr_lernende);
                                        return (
                                            <Link
                                                key={link.nr_lernende}
                                                href={`/lernende/${link.nr_lernende}`}
                                                className="group flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[var(--primary)] hover:bg-white transition-all duration-200 hover:shadow-sm"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors">
                                                        {person ? `${person.vorname} ${person.nachname}` : `Lernende/r #${link.nr_lernende}`}
                                                    </p>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                        {link.beruf || 'Beruf nicht angegeben'}
                                                        {link.start && ` · ${formatDate(link.start)} – ${formatDate(link.ende)}`}
                                                    </span>
                                                </div>
                                                <Icons.ChevronLeft className="rotate-180 text-gray-300 group-hover:text-[var(--primary)] transition-colors shrink-0 ml-4" size={18} />
                                            </Link>
                                        );
                                    })
                                ) : (
                                    <div className="p-10 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 italic">
                                        Noch keine Lernenden in diesem Betrieb.
                                    </div>
                                )}
                            </div>
                        </section>
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

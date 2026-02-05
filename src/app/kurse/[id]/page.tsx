import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';
import StatCard from '@/components/StatCard';
import DetailField from '@/components/DetailField';
import DetailSection from '@/components/DetailSection';
import DetailHeader from '@/components/DetailHeader';
import { Icons } from '@/lib/icons';

export default async function KursDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [kurs, allKursLernende] = await Promise.all([
        fetchWithAuth(`/kurse/${id}`),
        fetchWithAuth('/kurse_lernende')
    ]);

    let dozent = null;
    if (kurs.nr_dozent) {
        dozent = await fetchWithAuth(`/dozenten/${kurs.nr_dozent}`);
    }

    const teilnehmerCount = (allKursLernende || []).filter((kl: any) => String(kl.nr_kurs) === id).length;

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('de-CH');
    };

    return (
        <main className="page-container flex-col !justify-start py-10">
            <div className="card p-10">

                <DetailHeader
                    title={kurs.kursthema}
                    subtitle={`Kurs-ID: #${kurs.id_kurs}`}
                    icon={<Icons.Book size={40} />}
                    editHref={`/kurse/manage/${id}`}
                    badge={kurs.kursnummer}
                />

                <div className="detail-grid-layout">
                    <div className="detail-main-content">

                        <section className="w-full">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-3">
                                <span className="h-px w-8 bg-gray-200"></span>
                                Beschreibung
                            </h3>
                            <div className="p-8 rounded-3xl border border-gray-100 bg-gray-50/30">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {kurs.inhalt || "Keine Inhaltsangabe verfügbar."}
                                </p>
                            </div>
                        </section>

                        <DetailSection title="Organisation & Zeitplan">
                            <DetailField
                                label="Verantwortlicher Dozent"
                                value={dozent ? `${dozent.vorname} ${dozent.nachname}` : `ID: ${kurs.nr_dozent}`}
                                href={dozent ? `/dozenten/${dozent.id_dozent}` : undefined}
                                icon={<Icons.User />}
                            />
                            <DetailField
                                label="Dauer"
                                value={kurs.dauer || "Nicht angegeben"}
                                icon={<Icons.Clock />}
                            />
                            <DetailField
                                label="Zeitraum"
                                value={`${formatDate(kurs.startdatum)} - ${formatDate(kurs.enddatum)}`}
                                icon={<Icons.Calendar />}
                            />
                        </DetailSection>
                    </div>

                    <div className="detail-sidebar">
                        <StatCard
                            label="Eingeschriebene Personen"
                            count={teilnehmerCount}
                            href={`/lernende?nr_kurs=${id}&origin=kurse`}
                        />
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100">
                    <Link href="/kurse" className="back-link group">
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
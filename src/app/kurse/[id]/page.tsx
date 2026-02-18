import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';
import StatCard from '@/components/StatCard';
import DetailField from '@/components/DetailField';
import DetailSection from '@/components/DetailSection';
import DetailHeader from '@/components/DetailHeader';
import { Icons } from '@/lib/icons';

export default async function KursDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [kurs, allKursLernende, allLernende] = await Promise.all([
        fetchWithAuth(`/kurse/${id}`),
        fetchWithAuth('/kurse_lernende'),
        fetchWithAuth('/lernende'),
    ]);

    let dozent = null;
    if (kurs.nr_dozent) {
        dozent = await fetchWithAuth(`/dozenten/${kurs.nr_dozent}`);
    }

    const belegungen = (allKursLernende || []).filter((kl: any) => String(kl.nr_kurs) === id);
    const teilnehmerCount = belegungen.length;

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
                                value={kurs.dauer ? `${kurs.dauer} Stunden` : "Nicht angegeben"}
                                icon={<Icons.Clock />}
                            />
                            <DetailField
                                label="Zeitraum"
                                value={`${formatDate(kurs.startdatum)} – ${formatDate(kurs.enddatum)}`}
                                icon={<Icons.Calendar />}
                            />
                        </DetailSection>

                        <section className="w-full">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-3">
                                <span className="h-px w-8 bg-gray-200"></span>
                                Eingeschriebene Lernende
                            </h3>
                            <div className="flex flex-col gap-3">
                                {belegungen.length > 0 ? (
                                    belegungen.map((bel: any) => {
                                        const person = (allLernende || []).find((l: any) => l.id_lernende === bel.nr_lernende);
                                        const noteNum = parseFloat(bel.note ?? '');
                                        const noteColor = !bel.note || isNaN(noteNum)
                                            ? 'text-gray-300'
                                            : noteNum >= 4 ? 'text-green-600' : 'text-red-500';
                                        return (
                                            <Link
                                                key={bel.nr_lernende}
                                                href={`/lernende/${bel.nr_lernende}`}
                                                className="group flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[var(--primary)] hover:bg-white transition-all duration-200 hover:shadow-sm"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors">
                                                        {person ? `${person.vorname} ${person.nachname}` : `Lernende/r #${bel.nr_lernende}`}
                                                    </p>
                                                    {person?.email && (
                                                        <span className="text-[10px] text-gray-400">{person.email}</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-5 shrink-0 ml-6">
                                                    <div className="text-right">
                                                        <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Note</p>
                                                        <p className={`text-2xl font-black ${noteColor}`}>{bel.note || '–'}</p>
                                                    </div>
                                                    <Icons.ChevronLeft className="rotate-180 text-gray-300 group-hover:text-[var(--primary)] transition-colors" size={18} />
                                                </div>
                                            </Link>
                                        );
                                    })
                                ) : (
                                    <div className="p-10 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 italic">
                                        Noch keine Lernenden eingeschrieben.
                                    </div>
                                )}
                            </div>
                        </section>
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

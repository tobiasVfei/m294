import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';
import StatCard from '@/components/StatCard';
import DetailField from '@/components/DetailField';
import DetailSection from '@/components/DetailSection';

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
        <main className="page-container flex-col !justify-start">
            <div className="w-full max-w-7xl card p-10">

                <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-8 mb-10">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 bg-gray-900 text-white rounded-3xl flex items-center justify-center shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/center" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/>
                            </svg>
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="!text-left !mb-0 text-4xl font-black text-gray-900">
                                    {kurs.kursthema}
                                </h1>
                                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-[10px] font-black rounded uppercase tracking-widest">
                                    {kurs.kursnummer}
                                </span>
                            </div>
                            <p className="text-gray-400 text-base font-medium mt-2">Kurs-ID: #{kurs.id_kurs}</p>
                        </div>
                    </div>

                    <Link
                        href={`/kurse/manage/${id}`}
                        className="btn-primary !w-full md:!w-auto px-8 py-3 flex items-center justify-center gap-3"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
                        </svg>
                        Kurs bearbeiten
                    </Link>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
                    <div className="xl:col-span-3 space-y-12">

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
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                            />
                            <DetailField
                                label="Dauer"
                                value={kurs.dauer || "Nicht angegeben"}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                            />
                            <DetailField
                                label="Zeitraum"
                                value={`${formatDate(kurs.startdatum)} - ${formatDate(kurs.enddatum)}`}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>}
                            />
                        </DetailSection>
                    </div>

                    <div className="flex flex-col gap-8">
                        <StatCard
                            label="Eingeschriebene Personen"
                            count={teilnehmerCount}
                            href={`/lernende?nr_kurs=${id}&origin=kurse`}
                        />
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100">
                    <Link href="/kurse" className="text-gray-400 hover:text-gray-900 flex items-center gap-3 text-sm font-black transition-colors group">
                        <div className="p-2 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        </div>
                        ZURÜCK ZUR ÜBERSICHT
                    </Link>
                </div>
            </div>
        </main>
    );
}
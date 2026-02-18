import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';
import StatCard from '@/components/StatCard';
import DetailField from '@/components/DetailField';
import DetailSection from '@/components/DetailSection';
import DetailHeader from '@/components/DetailHeader';
import { Icons } from '@/lib/icons';

export default async function DozentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [dozent, allKurse, allLaender] = await Promise.all([
        fetchWithAuth(`/dozenten/${id}`),
        fetchWithAuth('/kurse'),
        fetchWithAuth('/laender')
    ]);

    const meinKurse = (allKurse || []).filter((k: any) => String(k.nr_dozent) === id);
    const land = (allLaender || []).find((l: any) => String(l.id_country) === String(dozent.nr_land));

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('de-CH');
    };

    return (
        <main className="page-container flex-col !justify-start py-10">
            <div className="card !max-w-7xl p-10">

                <DetailHeader
                    title={`${dozent.vorname} ${dozent.nachname}`}
                    subtitle={`Dozent-ID: #${dozent.id_dozent}`}
                    icon={<Icons.User size={40} />}
                    editHref={`/dozenten/manage/${id}`}
                    badge={dozent.geschlecht === 'W' ? 'Weiblich' : 'Männlich'}
                />

                <div className="detail-grid-layout">
                    <div className="detail-main-content">
                        <DetailSection title="Erreichbarkeit">
                            <DetailField label="E-Mail" value={dozent.email || '-'} href={dozent.email ? `mailto:${dozent.email}` : undefined} icon={<Icons.Email />} />
                            <DetailField label="Handy" value={dozent.handy || '-'} icon={<Icons.Phone />} />
                            <DetailField label="Telefon" value={dozent.telefon || '-'} icon={<Icons.Landline />} />
                        </DetailSection>

                        <DetailSection title="Wohnort & Person">
                            <DetailField label="Adresse" value={`${dozent.strasse}, ${dozent.plz} ${dozent.ort}`} icon={<Icons.MapPin />} />
                            <DetailField label="Land" value={land ? land.country : '-'} icon={<Icons.Globe />} />
                            <DetailField label="Geburtsdatum" value={formatDate(dozent.birthdate)} icon={<Icons.Calendar />} />
                        </DetailSection>

                        <section className="w-full">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-3">
                                <span className="h-px w-8 bg-gray-200"></span>
                                Geleitete Kurse
                            </h3>
                            <div className="flex flex-col gap-3">
                                {meinKurse.length > 0 ? (
                                    meinKurse.map((kurs: any) => (
                                        <Link
                                            key={kurs.id_kurs}
                                            href={`/kurse/${kurs.id_kurs}`}
                                            className="group flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[var(--primary)] hover:bg-white transition-all duration-200 hover:shadow-sm"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <p className="font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors truncate">
                                                    {kurs.kursthema}
                                                </p>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                    {kurs.kursnummer} · {formatDate(kurs.startdatum)} – {formatDate(kurs.enddatum)}
                                                </span>
                                            </div>
                                            <Icons.ChevronLeft className="rotate-180 text-gray-300 group-hover:text-[var(--primary)] transition-colors shrink-0 ml-4" size={18} />
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-10 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 italic">
                                        Noch keine Kurse zugewiesen.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="detail-sidebar">
                        <StatCard
                            label="Geleitete Kurse"
                            count={meinKurse.length}
                            href={`/kurse?nr_dozent=${id}&origin=dozenten`}
                        />
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100">
                    <Link href="/dozenten" className="back-link group">
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

import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';
import StatCard from '@/components/StatCard';
import DetailField from '@/components/DetailField';
import DetailSection from '@/components/DetailSection';

export default async function LernendeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [person, allKursLernende, allLaender] = await Promise.all([
        fetchWithAuth(`/lernende/${id}`),
        fetchWithAuth('/kurse_lernende'),
        fetchWithAuth('/laender')
    ]);

    let lehrbetrieb = null;
    if (person.id_lehrbetrieb) {
        lehrbetrieb = await fetchWithAuth(`/lehrbetriebe/${person.id_lehrbetrieb}`);
    }

    const kurseCount = (allKursLernende || []).filter((kl: any) => String(kl.nr_lernende) === id).length;
    const land = (allLaender || []).find((l: any) => String(l.id_country) === String(person.nr_land));

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
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="!text-left !mb-0 text-4xl font-black text-gray-900">
                                    {person.vorname} {person.nachname}
                                </h1>
                                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-[10px] font-black rounded uppercase tracking-widest">
                                    Lernende/r
                                </span>
                            </div>
                            <p className="text-gray-400 text-base font-medium mt-2">Lernenden-ID: #{person.id_lernende}</p>
                        </div>
                    </div>

                    <Link
                        href={`/lernende/manage/${id}`}
                        className="btn-primary !w-full md:!w-auto px-8 py-3 flex items-center justify-center gap-3"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
                        </svg>
                        Profil bearbeiten
                    </Link>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
                    <div className="xl:col-span-3 space-y-12">

                        <DetailSection title="Erreichbarkeit & Betrieb">
                            <DetailField
                                label="E-Mail"
                                value={person.email}
                                href={`mailto:${person.email}`}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>}
                            />
                            <DetailField
                                label="Lehrbetrieb"
                                value={lehrbetrieb ? lehrbetrieb.firma : `ID: ${person.id_lehrbetrieb}`}
                                href={person.id_lehrbetrieb ? `/lehrbetriebe/${person.id_lehrbetrieb}` : undefined}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4"/></svg>}
                            />
                        </DetailSection>

                        <DetailSection title="Wohnort & Person">
                            <DetailField
                                label="Adresse"
                                value={`${person.strasse}, ${person.plz} ${person.ort}`}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>}
                            />
                            <DetailField
                                label="Land"
                                value={land ? land.country : `ID: ${person.nr_land}`}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>}
                            />
                            <DetailField
                                label="Geburtsdatum"
                                value={formatDate(person.birthdate)}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>}
                            />
                        </DetailSection>
                    </div>

                    <div className="flex flex-col gap-8">
                        <StatCard
                            label="Belegte Kurse"
                            count={kurseCount}
                            href={`/kurse?nr_lernende=${id}&origin=lernende`}
                        />
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100">
                    <Link href="/lernende" className="text-gray-400 hover:text-gray-900 flex items-center gap-3 text-sm font-black transition-colors group">
                        <div className="p-2 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        </div>
                        ZURÜCK ZUR LISTE
                    </Link>
                </div>
            </div>
        </main>
    );
}
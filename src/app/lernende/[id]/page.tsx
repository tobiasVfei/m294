import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';
import StatCard from '@/components/StatCard';
import DetailField from '@/components/DetailField';
import DetailSection from '@/components/DetailSection';

interface Lernender {
    id_lernende: number;
    vorname: string;
    nachname: string;
    email: string;
    email_privat?: string;
    strasse: string;
    plz: string;
    ort: string;
    nr_land: number;
    birthdate: string;
    geschlecht: string;
    telefon?: string;
    handy?: string;
}

interface LehrLink {
    nr_lernende: number;
    nr_lehrbetrieb: number;
    beruf: string;
    start: string;
    ende: string;
}

interface Kurs {
    id_kurs: number;
    kursnummer: string;
    kursthema: string;
}

interface KursLernender {
    nr_lernende: number;
    nr_kurs: number;
    note: string;
}

interface Country {
    id_country: number;
    country: string;
}

interface Lehrbetrieb {
    id_lehrbetrieb: number;
    firma: string;
}

export default async function LernendeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [personData, allKursLinks, allLaender, allLehrLinks, allKurse] = await Promise.all([
        fetchWithAuth(`/lernende/${id}`),
        fetchWithAuth('/kurse_lernende'),
        fetchWithAuth('/laender'),
        fetchWithAuth('/lehrbetrieb_lernende'),
        fetchWithAuth('/kurse')
    ]);

    const person = personData as Lernender;
    const lehrverhaeltnis = (allLehrLinks as LehrLink[] || []).find((lb: LehrLink) => String(lb.nr_lernende) === id);

    let lehrbetrieb: Lehrbetrieb | null = null;
    if (lehrverhaeltnis && lehrverhaeltnis.nr_lehrbetrieb) {
        lehrbetrieb = await fetchWithAuth(`/lehrbetriebe/${lehrverhaeltnis.nr_lehrbetrieb}`) as Lehrbetrieb;
    }

    const studentCourses = (allKursLinks as KursLernender[] || [])
        .filter((kl: KursLernender) => String(kl.nr_lernende) === id)
        .map(link => {
            const courseDetails = (allKurse as Kurs[] || []).find(k => k.id_kurs === link.nr_kurs);
            return {
                ...link,
                title: courseDetails?.kursthema || 'Unbekannter Kurs'
            };
        });

    const land = (allLaender as Country[] || []).find((l: Country) => String(l.id_country) === String(person.nr_land));

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('de-CH');
    };

    return (
        <main className="page-container flex-col !justify-start">
            <div className="w-full max-w-none card p-10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-8 mb-10">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 bg-gray-900 text-white rounded-3xl flex items-center justify-center shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
                    <Link href={`/lernende/manage/${id}`} className="btn-primary !w-full md:!w-auto px-8 py-3 flex items-center justify-center gap-3">
                        Profil bearbeiten
                    </Link>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
                    <div className="xl:col-span-3 space-y-12">
                        <DetailSection title="Besuchte Kurse">
                            <div className="grid grid-cols-1 gap-6 w-full">
                                {studentCourses.length > 0 ? (
                                    studentCourses.map((course, index) => (
                                        <Link
                                            key={index}
                                            href={`/kurse?id_kurs=${course.nr_kurs}`}
                                            className="group w-full p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[var(--primary)] hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md flex justify-between items-center"
                                        >
                                            <div className="flex-1 min-w-0 pr-10">
                                                <h4 className="font-bold text-2xl text-gray-900 group-hover:text-[var(--primary)] transition-colors truncate">
                                                    {course.title}
                                                </h4>
                                                <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest font-bold opacity-60">
                                                    Kurs-Referenz: #{course.nr_kurs}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-12 shrink-0">
                                                <div className="text-right px-8 border-l border-gray-200">
                                                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter mb-1">Erreichte Note</p>
                                                    <p className={`text-4xl font-black ${Number(course.note) >= 4 ? 'text-green-600' : 'text-red-500'}`}>
                                                        {course.note || '-'}
                                                    </p>
                                                </div>
                                                <div className="p-3 rounded-full bg-white text-gray-300 group-hover:text-[var(--primary)] group-hover:bg-blue-50 transition-all border border-gray-50 shadow-inner">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="m9 18 6-6-6-6"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-10 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 italic">
                                        Noch keine Kursbelegungen vorhanden.
                                    </div>
                                )}
                            </div>
                        </DetailSection>

                        <DetailSection title="Betrieb">
                            <DetailField
                                label="Beruf"
                                value={lehrverhaeltnis?.beruf || "Nicht definiert"}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 7h20v10H2z"/><path d="M16 21V3a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v18"/></svg>}
                            />
                            <DetailField
                                label="Lehrbetrieb"
                                value={lehrbetrieb?.firma || "Kein Betrieb zugewiesen"}
                                href={lehrverhaeltnis?.nr_lehrbetrieb ? `/lehrbetriebe/${lehrverhaeltnis.nr_lehrbetrieb}` : undefined}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18"/><path d="M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4"/></svg>}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DetailField
                                    label="Lehrbeginn"
                                    value={formatDate(lehrverhaeltnis?.start)}
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>}
                                />
                                <DetailField
                                    label="Lehrende"
                                    value={formatDate(lehrverhaeltnis?.ende)}
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/></svg>}
                                />
                            </div>
                        </DetailSection>

                        <DetailSection title="Kontaktinformationen">
                            <DetailField
                                label="E-Mail (Geschäftlich)"
                                value={person.email}
                                href={`mailto:${person.email}`}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>}
                            />
                            <DetailField
                                label="E-Mail (Privat)"
                                value={person.email_privat || "-"}
                                href={person.email_privat ? `mailto:${person.email_privat}` : undefined}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10Z"/><path d="M7 12h10"/></svg>}
                            />
                            <DetailField
                                label="Telefon"
                                value={person.telefon || "-"}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>}
                            />
                            <DetailField
                                label="Handy"
                                value={person.handy || "-"}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>}
                            />
                        </DetailSection>

                        <DetailSection title="Persönliche Daten">
                            <DetailField
                                label="Adresse"
                                value={`${person.strasse}, ${person.plz} ${person.ort}`}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>}
                            />
                            <DetailField
                                label="Land"
                                value={land?.country || "-"}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>}
                            />
                            <DetailField
                                label="Geburtsdatum"
                                value={formatDate(person.birthdate)}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>}
                            />
                            <DetailField
                                label="Geschlecht"
                                value={person.geschlecht || "-"}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2"/><path d="m9 22 2-6 1-4 1 4 2 6"/><path d="m6 12 10-3 1 1-10 3Z"/></svg>}
                            />
                        </DetailSection>
                    </div>

                    <div className="flex flex-col gap-8">
                        <StatCard label="Kurse (Übersicht)" count={studentCourses.length} href={`/kurse?nr_lernende=${id}&origin=lernende`} />
                    </div>
                </div>
            </div>
        </main>
    );
}
import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';
import StatCard from '@/components/StatCard';
import DetailField from '@/components/DetailField';
import DetailSection from '@/components/DetailSection';
import DetailHeader from '@/components/DetailHeader';
import { Icons } from '@/lib/icons';


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
        <main className="page-container flex-col !justify-start py-10">
            <div className="card !max-w-7xl p-10">
                <DetailHeader
                    title={`${person.vorname} ${person.nachname}`}
                    subtitle={`Lernenden-ID: #${person.id_lernende}`}
                    icon={<Icons.User size={40} />}
                    editHref={`/lernende/manage/${id}`}
                    badge="Lernende/r"
                />

                <div className="detail-grid-layout">
                    <div className="detail-main-content">
                        <DetailSection title="Kontaktinformationen">
                            <DetailField
                                label="E-Mail (Geschaeftlich)"
                                value={person.email}
                                href={`mailto:${person.email}`}
                                icon={<Icons.Email />}
                            />
                            <DetailField
                                label="E-Mail (Privat)"
                                value={person.email_privat || "-"}
                                href={person.email_privat ? `mailto:${person.email_privat}` : undefined}
                                icon={<Icons.Email />}
                            />
                            <DetailField
                                label="Telefon"
                                value={person.telefon || "-"}
                                icon={<Icons.Landline />}
                            />
                            <DetailField
                                label="Handy"
                                value={person.handy || "-"}
                                icon={<Icons.Phone />}
                            />
                        </DetailSection>

                        <DetailSection title="Ausbildung im Betrieb">
                            <DetailField
                                label="Beruf"
                                value={lehrverhaeltnis?.beruf || "Nicht definiert"}
                                icon={<Icons.Hash />}
                            />
                            <DetailField
                                label="Lehrbetrieb"
                                value={lehrbetrieb?.firma || "Kein Betrieb zugewiesen"}
                                href={lehrverhaeltnis?.nr_lehrbetrieb ? `/lehrbetriebe/${lehrverhaeltnis.nr_lehrbetrieb}` : undefined}
                                icon={<Icons.Building size={14} />}
                            />
                            <DetailField
                                label="Lehrbeginn"
                                value={formatDate(lehrverhaeltnis?.start)}
                                icon={<Icons.Calendar />}
                            />
                            <DetailField
                                label="Lehrende"
                                value={formatDate(lehrverhaeltnis?.ende)}
                                icon={<Icons.Clock />}
                            />
                        </DetailSection>

                        <DetailSection title="Besuchte Kurse">
                            <div className="grid grid-cols-1 gap-6 w-full">
                                {studentCourses.length > 0 ? (
                                    studentCourses.map((course, index) => (
                                        <Link
                                            key={index}
                                            href={`/kurse/${course.nr_kurs}`}
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
                                                    <Icons.ChevronLeft className="rotate-180" size={24} />
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

                        <DetailSection title="Persoenliche Daten">
                            <DetailField
                                label="Adresse"
                                value={`${person.strasse}, ${person.plz} ${person.ort}`}
                                icon={<Icons.MapPin />}
                            />
                            <DetailField
                                label="Land"
                                value={land?.country || "-"}
                                icon={<Icons.Globe size={14} />}
                            />
                            <DetailField
                                label="Geburtsdatum"
                                value={formatDate(person.birthdate)}
                                icon={<Icons.Calendar />}
                            />
                            <DetailField
                                label="Geschlecht"
                                value={person.geschlecht === 'w' ? 'Weiblich' : 'Männlich'}
                                icon={<Icons.User size={14} />}
                            />
                        </DetailSection>
                    </div>

                    <div className="detail-sidebar">
                        <StatCard label="Kurse (Übersicht)" count={studentCourses.length} href={`/kurse?nr_lernende=${id}&origin=lernende`} />
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100">
                    <Link href="/lernende" className="back-link group">
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
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
    note: string | null;
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
                title: courseDetails?.kursthema || 'Unbekannter Kurs',
                kursnummer: courseDetails?.kursnummer,
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
                                label="E-Mail (Geschäftlich)"
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

                        <section className="w-full">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-3">
                                <span className="h-px w-8 bg-gray-200"></span>
                                Besuchte Kurse
                            </h3>
                            <div className="flex flex-col gap-3">
                                {studentCourses.length > 0 ? (
                                    studentCourses.map((course, index) => {
                                        const noteNum = parseFloat(course.note ?? '');
                                        const noteColor = !course.note || isNaN(noteNum)
                                            ? 'text-gray-300'
                                            : noteNum >= 4 ? 'text-green-600' : 'text-red-500';

                                        return (
                                            <Link
                                                key={index}
                                                href={`/kurse/${course.nr_kurs}`}
                                                className="group flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[var(--primary)] hover:bg-white transition-all duration-200 hover:shadow-sm"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors truncate">
                                                        {course.title}
                                                    </p>
                                                    {course.kursnummer && (
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                            {course.kursnummer}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-5 shrink-0 ml-6">
                                                    <div className="text-right">
                                                        <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Note</p>
                                                        <p className={`text-2xl font-black ${noteColor}`}>
                                                            {course.note || '–'}
                                                        </p>
                                                    </div>
                                                    <Icons.ChevronLeft
                                                        className="rotate-180 text-gray-300 group-hover:text-[var(--primary)] transition-colors"
                                                        size={18}
                                                    />
                                                </div>
                                            </Link>
                                        );
                                    })
                                ) : (
                                    <div className="p-10 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 italic">
                                        Noch keine Kursbelegungen vorhanden.
                                    </div>
                                )}
                            </div>
                        </section>

                        <DetailSection title="Persönliche Daten">
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
                                value={person.geschlecht === 'W' ? 'Weiblich' : 'Männlich'}
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

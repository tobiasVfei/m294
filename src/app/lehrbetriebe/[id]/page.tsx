import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';
import StatCard from '@/components/StatCard';
import DetailField from '@/components/DetailField';
import DetailSection from '@/components/DetailSection';

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
        <main className="page-container flex-col !justify-start">
            <div className="w-full max-w-7xl card p-10">

                <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-8 mb-10">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 bg-gray-900 text-white rounded-3xl flex items-center justify-center shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 21h18"/><path d="M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4"/>
                            </svg>
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="!text-left !mb-0 text-4xl font-black text-gray-900">
                                    {betrieb.firma}
                                </h1>
                                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-[10px] font-black rounded uppercase tracking-widest">
                                    Lehrbetrieb
                                </span>
                            </div>
                            <p className="text-gray-400 text-base font-medium mt-2">Betriebs-ID: #{betrieb.id_lehrbetrieb}</p>
                        </div>
                    </div>

                    <Link href={`/lehrbetriebe/manage/${id}`} className="btn-primary !w-full md:!w-auto px-8 py-3 flex items-center justify-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
                        </svg>
                        Betrieb bearbeiten
                    </Link>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
                    <div className="xl:col-span-3 space-y-12">
                        <DetailSection title="Standort & Adresse">
                            <DetailField
                                label="Strasse"
                                value={betrieb.strasse}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>}
                            />
                            <DetailField
                                label="Postleitzahl"
                                value={betrieb.plz}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2 5-5"/><path d="M18 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/><path d="M10 9H6"/><path d="M10 13H6"/><path d="M10 17H6"/></svg>}
                            />
                            <DetailField
                                label="Ort"
                                value={betrieb.ort}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>}
                            />
                        </DetailSection>
                    </div>
                    <div className="flex flex-col gap-8">
                        <StatCard
                            label="Lernende im Betrieb"
                            count={lernendeCount}
                            href={`/lernende?nr_lehrbetrieb=${id}&origin=lehrbetriebe`}
                        />
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100">
                    <Link href="/lehrbetriebe" className="text-gray-400 hover:text-gray-900 flex items-center gap-3 text-sm font-black transition-colors group">
                        <div className="p-2 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m15 18-6-6 6-6"/>
                            </svg>
                        </div>
                        ZURÜCK ZUR LISTE
                    </Link>
                </div>
            </div>
        </main>
    );
}
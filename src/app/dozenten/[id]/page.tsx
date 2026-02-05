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

    const kurseCount = (allKurse || []).filter((k: any) => String(k.nr_dozent) === id).length;
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
                    badge={dozent.geschlecht === 'w' ? 'Weiblich' : 'Männlich'}
                />

                <div className="detail-grid-layout">
                    <div className="detail-main-content">
                        <DetailSection title="Erreichbarkeit">
                            <DetailField label="E-Mail" value={dozent.email} href={`mailto:${dozent.email}`} icon={<Icons.Email />} />
                            <DetailField label="Handy" value={dozent.handy} icon={<Icons.Phone />} />
                            <DetailField label="Telefon" value={dozent.telefon} icon={<Icons.Landline />} />
                        </DetailSection>

                        <DetailSection title="Wohnort & Person">
                            <DetailField label="Adresse" value={`${dozent.strasse}, ${dozent.plz} ${dozent.ort}`} icon={<Icons.MapPin />} />
                            <DetailField label="Land" value={land ? land.country : `ID: ${dozent.nr_land}`} icon={<Icons.Globe />} />
                            <DetailField label="Geburtsdatum" value={formatDate(dozent.birthdate)} icon={<Icons.Calendar />} />
                        </DetailSection>
                    </div>

                    <div className="detail-sidebar">
                        <StatCard
                            label="Geleitete Kurse"
                            count={kurseCount}
                            href={`/kurse?nr_dozent=${id}&origin=dozenten`}
                        />
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100">
                    <Link href="/dozenten" className="back-link">
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
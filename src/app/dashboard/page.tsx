import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { fetchWithAuth } from "@/lib/api";
import StatCard from "@/components/StatCard";

export default async function DashboardPage() {
    const isLoggedIn = await isAuthenticated();

    let stats = {
        lernende: 0,
        kurse: 0,
        dozenten: 0,
        betriebe: 0
    };

    if (isLoggedIn) {
        const [lernende, kurse, dozenten, betriebe] = await Promise.all([
            fetchWithAuth('/lernende'),
            fetchWithAuth('/kurse'),
            fetchWithAuth('/dozenten'),
            fetchWithAuth('/lehrbetriebe')
        ]);

        stats = {
            lernende: (lernende || []).length,
            kurse: (kurse || []).length,
            dozenten: (dozenten || []).length,
            betriebe: (betriebe || []).length
        };
    }

    if (!isLoggedIn) {
        return (
            <main className="page-container flex flex-col items-center justify-center min-h-[calc(100vh-140px)] py-12">
                <div className="w-full max-w-4xl card p-16 text-center shadow-2xl bg-gray-900 dark:bg-black border-none">
                    <div className="relative z-10 max-w-4xl mx-auto">
                        <h1 className="text-6xl font-black text-white leading-tight mb-8 uppercase tracking-tighter">
                            VFei <span className="text-[var(--primary)]">Admin</span>
                        </h1>
                        <p className="text-gray-400 text-xl font-medium mb-12">
                            Bitte melden Sie sich an, um die Verwaltung zu starten.
                        </p>
                        <Link href="/login" className="btn-primary !w-auto inline-block px-12 bg-white text-black hover:bg-gray-200">
                            Jetzt Einloggen
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="page-container flex flex-col items-center py-12 gap-10">
            <div className="w-full flex flex-col md:flex-row justify-between items-center dashboard-card !p-10 lg:!p-14 !rounded-[2.5rem]">
                <div className="text-center md:text-left">
                    <h1 className="!mb-2 text-4xl lg:text-5xl font-black tracking-tight uppercase">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-lg italic">Aktueller Status der VFei Kursverwaltung</p>
                </div>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard label="Lernende" count={stats.lernende} href="/lernende" colorClassName="text-[var(--foreground)]" />
                <StatCard label="Kurse" count={stats.kurse} href="/kurse" colorClassName="text-[var(--foreground)]" />
                <StatCard label="Dozenten" count={stats.dozenten} href="/dozenten" colorClassName="text-[var(--foreground)]" />
                <StatCard label="Betriebe" count={stats.betriebe} href="/lehrbetriebe" colorClassName="text-[var(--foreground)]" />
            </div>
        </main>
    );
}
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
            <main className="w-full flex justify-center py-20 px-6">
                <div className="w-full max-w-[1600px] bg-gray-900 rounded-[3rem] p-20 text-center shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 max-w-4xl mx-auto">
                        <h1 className="text-7xl font-black text-white leading-tight mb-8 uppercase tracking-tighter">
                            VFei <span className="text-blue-500">Admin</span>
                        </h1>
                        <p className="text-gray-400 text-2xl font-medium mb-12">
                            Bitte melden Sie sich an.
                        </p>
                        <Link href="/login" className="inline-block px-16 py-5 bg-white text-gray-900 rounded-2xl font-black text-lg uppercase tracking-widest hover:scale-105 transition-all">
                            Login
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="w-full flex flex-col items-center py-12 px-6 lg:px-12 gap-10">
            <div className="w-full max-w-[1600px] flex flex-col md:flex-row justify-between items-center bg-gray-900 p-10 lg:p-14 rounded-[3rem] shadow-xl text-white">
                <div className="text-center md:text-left">
                    <h1 className="text-5xl font-black tracking-tight mb-2 uppercase">Dashboard</h1>
                    <p className="text-gray-400 font-medium text-lg italic">Übersicht der VFei Kursverwaltung.</p>
                </div>
            </div>

            <div className="w-full max-w-[1600px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard label="Lernende" count={stats.lernende} href="/lernende" />
                <StatCard label="Kurse" count={stats.kurse} href="/kurse" />
                <StatCard label="Dozenten" count={stats.dozenten} href="/dozenten" />
                <StatCard label="Betriebe" count={stats.betriebe} href="/lehrbetriebe" />
            </div>
        </main>
    );
}
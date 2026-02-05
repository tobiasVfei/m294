import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";

export default async function Home() {
    const isLoggedIn = await isAuthenticated();

    const subtitle = isLoggedIn
        ? "Du bist eingeloggt. Verwalte jetzt deine Kurse und Dozenten im Dashboard."
        : "Verwalten Sie Ihre Kurse, Dozenten und Lernenden zentral und effizient.";

    return (
        <main className="page-container flex flex-col items-center justify-center min-h-[calc(100vh-120px)] text-center px-4">
            <div className="max-w-3xl">
                <h1 className="hero-title">
                    {isLoggedIn ? (
                        "Willkommen zurück!"
                    ) : (
                        <>
                            Willkommen bei der <span className="text-[var(--primary)]">VFei</span> Kursverwaltung
                        </>
                    )}
                </h1>

                <p className="hero-subtitle">
                    {subtitle}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-6">
                    {isLoggedIn ? (
                        <Link href="/dashboard" className="btn-primary w-auto px-8">
                            Zum Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="btn-primary w-auto px-8">
                                Jetzt anmelden
                            </Link>
                            <Link href="/register" className="font-semibold hover:text-[var(--primary)] transition-colors">
                                Account erstellen →
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
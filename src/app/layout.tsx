import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { logout } from "./(auth)/logout/actions";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "VFei Kursverwaltung",
    description: "Verwaltung von Kursen, Dozenten und Lernenden",
};

const guestMenu = [
    { label: "Anmelden", href: "/login" },
    { label: "Registrieren", href: "/register" },
]
const userMenu = [
    { label: "Kurse", href: "/kurse" },
    { label: "Dozenten", href: "/dozenten" },
    { label: "Lernende", href: "/lernende" },
    { label: "Lehrbetriebe", href: "/lehrbetriebe" },
    { label: "Länder", href: "/laender" },
]

export default async function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const isLoggedIn = await isAuthenticated();

    const menuItems = isLoggedIn ? userMenu : guestMenu;
    return (
        <html lang="de">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]`}
        >

        <nav className="sticky top-0 z-50 p-4 flex justify-between items-center shadow-sm border-b transition-colors bg-[var(--background)] border-[var(--card-border)]">

            <Link href="/" className="font-bold text-xl text-[var(--primary)]">
                VFei Kursverwaltung
            </Link>
            
            <div className="flex items-center gap-6 text-sm font-medium">

                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="transition-colors hover:text-[var(--primary)] text-[var(--foreground)] opacity-80 hover:opacity-100"
                    >
                        {item.label}
                    </Link>
                ))}

                {isLoggedIn && (
                    <form action={logout}>
                        <button 
                            type="submit" 
                            className="text-red-600 hover:text-red-800 transition-colors opacity-80 hover:opacity-100 cursor-pointer"
                        >
                            Abmelden
                        </button>
                    </form>
                )}
            </div>
        </nav>

        <main className="flex-grow">
            {children}
        </main>

        <footer className="p-4 text-center text-xs border-t mt-auto transition-colors bg-[var(--background)] border-[var(--card-border)] text-[var(--foreground)] opacity-60">
            © 2025 VFei Bildungszentrum
        </footer>
        </body>
        </html>
    );
}
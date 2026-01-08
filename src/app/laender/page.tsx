import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';

export default async function Page() {
    const laender = await fetchWithAuth('/laender');

    return (
        <main className="page-container flex-col !justify-start">
            <div className="w-full max-w-6xl flex justify-between items-center mb-8">
                <h1 className="!mb-0">Länder</h1>
                <Link href="/laender/manage" className="btn-primary !w-auto">
                    + Neues Land
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
                {laender.map((land: any) => (
                    <div key={land.id_country} className="card relative group flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold">{land.country}</h3>
                            <p className="text-sm text-gray-400 mt-1">ID: #{land.id_country}</p>
                        </div>

                        <div className="flex gap-2 mt-6 pt-4 border-t border-gray-50">
                            <Link
                                href={`/laender/${land.id_country}`}
                                className="text-[var(--primary)] text-sm font-medium hover:underline"
                            >
                                Details
                            </Link>
                            <Link
                                href={`/laender/manage/${land.id_country}`}
                                className="text-gray-400 text-sm hover:text-gray-700 ml-auto transition-colors"
                            >
                                ✏️ Bearbeiten
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
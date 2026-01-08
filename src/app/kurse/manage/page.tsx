'use client';

import { useActionState } from 'react';
import { createKurs } from '../actions';
import Link from 'next/link';

export default function CreateKursPage() {
    const [state, formAction, isPending] = useActionState(createKurs, null);

    return (
        <main className="page-container">
            <div className="card max-w-2xl">
                <h1 className="text-2xl font-bold mb-6">Neuen Kurs erstellen</h1>

                {state?.error && (
                    <div className="error-box mb-4">
                        {state.error}
                    </div>
                )}

                <form action={formAction} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="input-label">Kursnummer</label>
                            <input type="text" name="kursnummer" required className="input-field" placeholder="z.B. IT-101" />
                        </div>
                        <div>
                            <label className="input-label">Thema</label>
                            <input type="text" name="kursthema" required className="input-field" placeholder="z.B. Webentwicklung" />
                        </div>
                    </div>

                    <div>
                        <label className="input-label">Inhalt</label>
                        <textarea name="inhalt" rows={4} className="input-field" placeholder="Beschreibung des Kurses..."></textarea>
                    </div>

                    <div>
                        <label className="input-label">Dozent ID</label>
                        <input type="number" name="nr_dozent" required className="input-field" placeholder="ID des Dozenten" />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Link href="/kurse" className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50 flex items-center">
                            Abbrechen
                        </Link>
                        <button type="submit" disabled={isPending} className="btn-primary !w-auto">
                            {isPending ? 'Erstelle...' : 'Erstellen'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

'use client';

import { useActionState } from 'react';
import { updateKurs, deleteKurs } from '../../actions';
import Link from 'next/link';

export default function EditKursForm({ kurs }: { kurs: any }) {
    const [state, formAction, isPending] = useActionState(updateKurs, null);

    const deleteKursWithId = deleteKurs.bind(null, kurs.id_kurs);

    return (
        <div className="card max-w-2xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Kurs bearbeiten</h1>

                <form action={deleteKursWithId}>
                    <button
                        type="submit"
                        className="text-red-600 hover:text-red-800 text-sm border border-red-200 bg-red-50 px-3 py-1 rounded cursor-pointer"
                        onClick={(e) => {
                            if (!confirm('Wirklich löschen?')) {
                                e.preventDefault();
                            }
                        }}
                    >
                        🗑️ Löschen
                    </button>
                </form>
            </div>

            {state?.error && <div className="error-box mb-4">{state.error}</div>}

            <form action={formAction} className="space-y-4">
                <input type="hidden" name="id_kurs" value={kurs.id_kurs} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="input-label">Kursnummer</label>
                        <input
                            type="text"
                            name="kursnummer"
                            defaultValue={kurs.kursnummer}
                            required
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="input-label">Thema</label>
                        <input
                            type="text"
                            name="kursthema"
                            defaultValue={kurs.kursthema}
                            required
                            className="input-field"
                        />
                    </div>
                </div>

                <div>
                    <label className="input-label">Inhalt</label>
                    <textarea
                        name="inhalt"
                        rows={4}
                        defaultValue={kurs.inhalt}
                        className="input-field"
                    ></textarea>
                </div>

                <div>
                    <label className="input-label">Dozent ID</label>
                    <input
                        type="number"
                        name="nr_dozent"
                        defaultValue={kurs.nr_dozent}
                        required
                        className="input-field"
                    />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Link href={`/kurse/${kurs.id_kurs}`} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50 flex items-center">
                        Abbrechen
                    </Link>
                    <button type="submit" disabled={isPending} className="btn-primary !w-auto">
                        {isPending ? 'Speichert...' : 'Speichern'}
                    </button>
                </div>
            </form>
        </div>
    );
}

'use client';

import { useActionState } from 'react';
import { createKurs, ActionState } from '../actions';
import Link from 'next/link';

export default function CreateKursForm({ dozenten }: { dozenten: any[] }) {
    const initialState: ActionState = { error: null, success: null };
    const [state, formAction, isPending] = useActionState(createKurs, initialState);

    return (
        <div className="card max-w-4xl">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Neuen Kurs erstellen</h1>
                <Link href="/kurse" className="text-sm font-bold text-gray-400 hover:text-gray-600">Abbrechen</Link>
            </div>

            {state?.error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8 font-bold border border-red-100">
                    {state.error}
                </div>
            )}

            <form action={formAction} className="space-y-12">

                {/* Stammdaten & Zeitplan */}
                <div className="space-y-6">
                    <h3 className="text-[11px] font-black text-[var(--primary)] uppercase tracking-[0.2em] flex items-center gap-3">
                        <span className="h-px w-8 bg-blue-200"></span>Stammdaten & Zeitplan
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="input-label">Kursnummer</label>
                            <input type="text" name="kursnummer" required className="input-field" placeholder="z.B. IT-101" />
                        </div>
                        <div className="lg:col-span-2">
                            <label className="input-label">Thema</label>
                            <input type="text" name="kursthema" required className="input-field" placeholder="z.B. Webentwicklung" />
                        </div>
                        <div>
                            {/* Dozent-Dropdown statt ID-Eingabe */}
                            <label className="input-label">Dozent</label>
                            <select name="nr_dozent" required className="input-field">
                                <option value="">Bitte wählen...</option>
                                {dozenten.map((d: any) => (
                                    <option key={d.id_dozent} value={d.id_dozent}>{d.nachname} {d.vorname}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Startdatum</label>
                            <input type="date" name="startdatum" required className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Enddatum</label>
                            <input type="date" name="enddatum" required className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Dauer (h)</label>
                            <input type="number" name="dauer" required className="input-field" placeholder="z.B. 40" />
                        </div>
                    </div>
                    <div>
                        <label className="input-label">Kursinhalt</label>
                        <textarea name="inhalt" rows={3} className="input-field" placeholder="Beschreibung des Kurses..."></textarea>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-10 border-t border-gray-100">
                    <Link href="/kurse" className="px-8 py-3 font-bold text-gray-400">Abbrechen</Link>
                    <button type="submit" disabled={isPending} className="btn-primary !w-auto px-12">
                        {isPending ? 'Erstellt...' : 'Kurs anlegen'}
                    </button>
                </div>
            </form>
        </div>
    );
}

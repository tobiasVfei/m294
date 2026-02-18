'use client';

import { useActionState } from 'react';
import { ActionState, createDozent } from '../actions';
import Link from 'next/link';

export default function CreateDozentForm({ laender }: { laender: any[] }) {
    const [state, formAction, isPending] = useActionState(createDozent, { error: null, success: null });

    return (
        <div className="card max-w-4xl">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Neuen Dozenten erfassen</h1>
                <Link href="/dozenten" className="text-sm font-bold text-gray-400 hover:text-gray-600">Abbrechen</Link>
            </div>

            {state?.error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8 font-bold border border-red-100">
                    {state.error}
                </div>
            )}

            <form action={formAction} className="space-y-12">

                {/* Persönliche Daten */}
                <div className="space-y-6">
                    <h3 className="text-[11px] font-black text-[var(--primary)] uppercase tracking-[0.2em] flex items-center gap-3">
                        <span className="h-px w-8 bg-blue-200"></span>Persönliche Daten
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="input-label">Vorname</label>
                            <input name="vorname" required className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Nachname</label>
                            <input name="nachname" required className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Geschlecht</label>
                            <select name="geschlecht" className="input-field">
                                <option value="M">Männlich</option>
                                <option value="W">Weiblich</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="input-label">E-Mail</label>
                            <input type="email" name="email" required className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Geburtsdatum</label>
                            <input type="date" name="birthdate" className="input-field" />
                        </div>
                    </div>
                </div>

                {/* Kontakt & Adresse */}
                <div className="space-y-6">
                    <h3 className="text-[11px] font-black text-[var(--primary)] uppercase tracking-[0.2em] flex items-center gap-3">
                        <span className="h-px w-8 bg-blue-200"></span>Kontakt & Adresse
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="input-label">Strasse</label>
                            <input name="strasse" required className="input-field" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="input-label">PLZ</label>
                                <input name="plz" required className="input-field" />
                            </div>
                            <div className="col-span-2">
                                <label className="input-label">Ort</label>
                                <input name="ort" required className="input-field" />
                            </div>
                        </div>
                        <div>
                            <label className="input-label">Land</label>
                            <select name="nr_land" required className="input-field">
                                <option value="">Bitte wählen...</option>
                                {laender.map(l => (
                                    <option key={l.id_country} value={l.id_country}>{l.country}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Telefon</label>
                            <input name="telefon" className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Handy</label>
                            <input name="handy" className="input-field" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-10 border-t border-gray-100">
                    <Link href="/dozenten" className="px-8 py-3 font-bold text-gray-400">Abbrechen</Link>
                    <button type="submit" disabled={isPending} className="btn-primary !w-auto px-12">
                        {isPending ? 'Erstellt...' : 'Dozent anlegen'}
                    </button>
                </div>
            </form>
        </div>
    );
}

'use client';

import { useActionState } from 'react';
import { createLernende, ActionState } from '../actions';
import Link from 'next/link';

export default function CreateLernendeForm({ laender, lehrbetriebe }: { laender: any[]; lehrbetriebe: any[] }) {
    const initialState: ActionState = { error: null, success: null };
    const [state, formAction, isPending] = useActionState(createLernende, initialState);

    return (
        <div className="card max-w-4xl">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Lernende Person erfassen</h1>
                <Link href="/lernende" className="text-sm font-bold text-gray-400 hover:text-gray-600">Abbrechen</Link>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="input-label">Vorname</label>
                            <input type="text" name="vorname" required className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Nachname</label>
                            <input type="text" name="nachname" required className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Geschlecht</label>
                            <select name="geschlecht" className="input-field">
                                <option value="M">Männlich</option>
                                <option value="W">Weiblich</option>
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Geburtsdatum</label>
                            <input type="date" name="birthdate" required className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Land</label>
                            <select name="nr_land" required className="input-field">
                                <option value="">Bitte wählen...</option>
                                {laender.map((l: any) => (
                                    <option key={l.id_country} value={l.id_country}>{l.country}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Kontakt & Adresse */}
                <div className="space-y-6">
                    <h3 className="text-[11px] font-black text-[var(--primary)] uppercase tracking-[0.2em] flex items-center gap-3">
                        <span className="h-px w-8 bg-blue-200"></span>Kontakt & Adresse
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="input-label">E-Mail (Geschäftlich)</label>
                            <input type="email" name="email" required className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">E-Mail (Privat)</label>
                            <input type="email" name="email_privat" className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Strasse</label>
                            <input type="text" name="strasse" required className="input-field" />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-1">
                                <label className="input-label">PLZ</label>
                                <input type="text" name="plz" required className="input-field" />
                            </div>
                            <div className="col-span-2">
                                <label className="input-label">Ort</label>
                                <input type="text" name="ort" required className="input-field" />
                            </div>
                        </div>
                        <div>
                            <label className="input-label">Telefon</label>
                            <input type="text" name="telefon" className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Handy</label>
                            <input type="text" name="handy" className="input-field" />
                        </div>
                    </div>
                </div>

                {/* Ausbildung (optional) */}
                <div className="space-y-6">
                    <h3 className="text-[11px] font-black text-[var(--primary)] uppercase tracking-[0.2em] flex items-center gap-3">
                        <span className="h-px w-8 bg-blue-200"></span>Ausbildung <span className="text-gray-300 font-normal normal-case tracking-normal text-xs">(optional)</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="md:col-span-2">
                            <label className="input-label">Lehrbetrieb</label>
                            <select name="nr_lehrbetrieb" className="input-field">
                                <option value="">Kein Betrieb</option>
                                {lehrbetriebe.map((b: any) => (
                                    <option key={b.id_lehrbetrieb} value={b.id_lehrbetrieb}>{b.firma}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Beruf</label>
                            <input type="text" name="beruf" className="input-field" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="input-label">Lehrbeginn</label>
                                <input type="date" name="lehr_start" className="input-field" />
                            </div>
                            <div>
                                <label className="input-label">Lehrende</label>
                                <input type="date" name="lehr_ende" className="input-field" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-10 border-t border-gray-100">
                    <Link href="/lernende" className="px-8 py-3 font-bold text-gray-400">Abbrechen</Link>
                    <button type="submit" disabled={isPending} className="btn-primary !w-auto px-12">
                        {isPending ? 'Erstellt...' : 'Person anlegen'}
                    </button>
                </div>
            </form>
        </div>
    );
}

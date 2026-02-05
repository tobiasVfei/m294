'use client';

import { useActionState } from 'react';
import { ActionState, createDozent } from '../actions';
import Link from 'next/link';

export default function CreateDozentPage({ laender }: { laender: any[] }) {
    const [state, formAction, isPending] = useActionState(createDozent, { error: null, success: null });

    return (
        <main className="page-container flex flex-col items-center py-12">
            <div className="card max-w-4xl">
                <h1 className="text-2xl font-black uppercase tracking-tight mb-8 pb-4 border-b">Neuen Dozenten erfassen</h1>
                {state?.error && <div className="error-box mb-6">{state.error}</div>}

                <form action={formAction} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div><label className="input-label">Vorname</label><input name="vorname" required className="input-field" /></div>
                        <div><label className="input-label">Nachname</label><input name="nachname" required className="input-field" /></div>
                        <div>
                            <label className="input-label">Geschlecht</label>
                            <select name="geschlecht" className="input-field">
                                <option value="M">Männlich</option>
                                <option value="W">Weiblich</option>
                            </select>
                        </div>
                        <div className="md:col-span-2"><label className="input-label">E-Mail</label><input type="email" name="email" required className="input-field" /></div>
                        <div><label className="input-label">Geburtsdatum</label><input type="date" name="birthdate" className="input-field" /></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                        <div className="md:col-span-2"><label className="input-label">Strasse</label><input name="strasse" className="input-field" /></div>
                        <div className="grid grid-cols-3 gap-4">
                            <div><label className="input-label">PLZ</label><input name="plz" className="input-field" /></div>
                            <div className="col-span-2"><label className="input-label">Ort</label><input name="ort" className="input-field" /></div>
                        </div>
                        <div>
                            <label className="input-label">Land</label>
                            <select name="nr_land" className="input-field">
                                {laender?.map(l => <option key={l.id_country} value={l.id_country}>{l.country}</option>)}
                            </select>
                        </div>
                        <div><label className="input-label">Handy</label><input name="handy" className="input-field" /></div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t">
                        <Link href="/dozenten" className="px-6 py-3 font-bold text-gray-400">Abbrechen</Link>
                        <button type="submit" disabled={isPending} className="btn-primary px-10">
                            {isPending ? 'Erstellt...' : 'Dozent anlegen'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
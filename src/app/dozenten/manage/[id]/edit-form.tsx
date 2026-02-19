'use client';

import { useActionState } from 'react';
import { updateDozent, deleteDozent, ActionState } from '../../actions';
import Link from 'next/link';
import { Icons } from '@/lib/icons';
import FormSection from '@/components/FormSection';

interface EditDozentFormProps {
    dozent: any;
    laender: any[];
}

export default function EditDozentForm({ dozent, laender }: EditDozentFormProps) {
    const initialState: ActionState = { error: null, success: null };
    const [state, formAction, isPending] = useActionState(updateDozent, initialState);
    const [deleteState, deleteFormAction] = useActionState(deleteDozent.bind(null, dozent.id_dozent), initialState);

    return (
        <div className="card max-w-4xl">
            <div className="flex justify-between items-center mb-8 pb-4 border-b">
                <h1 className="text-2xl font-black uppercase tracking-tight">Dozentenprofil bearbeiten</h1>
                <form action={deleteFormAction}>
                    <button
                        type="submit"
                        className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl border border-red-100 font-bold text-xs uppercase"
                        onClick={(e) => { if (!confirm('Wirklich löschen?')) e.preventDefault(); }}
                    >
                        <Icons.Trash size={14} className="inline mr-1" /> Löschen
                    </button>
                </form>
            </div>

            {deleteState?.error && <div className="error-box mb-6">{deleteState.error}</div>}
            {state?.error && <div className="error-box mb-6">{state.error}</div>}

            <form action={formAction} className="space-y-8">
                <input type="hidden" name="id_dozent" value={dozent.id_dozent} />

                <FormSection title="Person & Kontakt">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="input-label">Vorname</label>
                            <input type="text" name="vorname" defaultValue={dozent.vorname} required className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Nachname</label>
                            <input type="text" name="nachname" defaultValue={dozent.nachname} required className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Geschlecht</label>
                            <select name="geschlecht" defaultValue={dozent.geschlecht} className="input-field">
                                <option value="M">Männlich</option>
                                <option value="W">Weiblich</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="input-label">E-Mail</label>
                            <input type="email" name="email" defaultValue={dozent.email} required className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Geburtsdatum</label>
                            <input type="date" name="birthdate" defaultValue={dozent.birthdate?.split('T')[0]} className="input-field" />
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Adresse & Telefon">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="input-label">Strasse</label>
                            <input type="text" name="strasse" defaultValue={dozent.strasse} className="input-field" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="input-label">PLZ</label>
                                <input type="text" name="plz" defaultValue={dozent.plz} className="input-field" />
                            </div>
                            <div className="col-span-2">
                                <label className="input-label">Ort</label>
                                <input type="text" name="ort" defaultValue={dozent.ort} className="input-field" />
                            </div>
                        </div>
                        <div>
                            <label className="input-label">Land</label>
                            <select name="nr_land" defaultValue={dozent.nr_land} className="input-field">
                                {laender.map((l: any) => (
                                    <option key={l.id_country} value={l.id_country}>{l.country}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Handy</label>
                            <input type="text" name="handy" defaultValue={dozent.handy} className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Telefon</label>
                            <input type="text" name="telefon" defaultValue={dozent.telefon} className="input-field" />
                        </div>
                    </div>
                </FormSection>

                <div className="flex justify-end gap-4 pt-6 border-t">
                    <Link href={`/dozenten/${dozent.id_dozent}`} className="px-6 py-3 font-bold text-gray-400 hover:text-gray-600 transition-colors">Abbrechen</Link>
                    <button type="submit" disabled={isPending} className="btn-primary !w-auto px-10">
                        {isPending ? 'Speichert...' : 'Profil aktualisieren'}
                    </button>
                </div>
            </form>
        </div>
    );
}
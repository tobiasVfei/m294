'use client';

import { useActionState } from 'react';
import { updateLernende, deleteLernende, removeKursEnrollment, addKursToLernende, ActionState } from '../../actions';
import Link from 'next/link';
import { Icons } from '@/lib/icons';
import FormSection from '@/components/FormSection';

export default function EditLernendeForm({ person, allKurse, kursLinks, laender, lehrbetriebe, lehrverhaeltnis }: any) {
    const initialState: ActionState = { error: null, success: null };
    const [state, formAction, isPending] = useActionState(updateLernende, initialState);
    const [removeState, removeAction] = useActionState(removeKursEnrollment, initialState);
    const [addState, addAction] = useActionState(addKursToLernende, initialState);

    const assignedKursIds = new Set(kursLinks.map((l: any) => l.nr_kurs));
    const availableKurse = allKurse.filter((k: any) => !assignedKursIds.has(k.id_kurs));

    return (
        <div className="card !max-w-5xl">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Profil bearbeiten</h1>
                <Link href={`/lernende/${person.id_lernende}`} className="text-sm font-bold text-gray-400 hover:text-gray-600">Abbrechen</Link>
            </div>

            {state?.error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8 font-bold border border-red-100">
                    {state.error}
                </div>
            )}
            {removeState?.error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8 font-bold border border-red-100">
                    {removeState.error}
                </div>
            )}
            {addState?.error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8 font-bold border border-red-100">
                    {addState.error}
                </div>
            )}

            <form action={formAction} className="space-y-12">
                <input type="hidden" name="id_lernende" value={person.id_lernende} />

                <FormSection title="Persönliche Daten">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div><label className="input-label">Vorname</label><input type="text" name="vorname" defaultValue={person.vorname} className="input-field" /></div>
                        <div><label className="input-label">Nachname</label><input type="text" name="nachname" defaultValue={person.nachname} className="input-field" /></div>
                        <div>
                            <label className="input-label">Geschlecht</label>
                            <select name="geschlecht" defaultValue={person.geschlecht} className="input-field">
                                <option value="M">Männlich</option>
                                <option value="W">Weiblich</option>
                            </select>
                        </div>
                        <div><label className="input-label">Geburtsdatum</label><input type="date" name="birthdate" defaultValue={person.birthdate?.split('T')[0]} className="input-field" /></div>
                        <div>
                            <label className="input-label">Land</label>
                            <select name="nr_land" defaultValue={person.nr_land} className="input-field">
                                {laender.map((l: any) => <option key={l.id_country} value={l.id_country}>{l.country}</option>)}
                            </select>
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Kontakt & Adresse">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="input-label">E-Mail (Geschäftlich)</label><input type="email" name="email" defaultValue={person.email} className="input-field" /></div>
                        <div><label className="input-label">E-Mail (Privat)</label><input type="email" name="email_privat" defaultValue={person.email_privat} className="input-field" /></div>
                        <div><label className="input-label">Strasse</label><input type="text" name="strasse" defaultValue={person.strasse} className="input-field" /></div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-1"><label className="input-label">PLZ</label><input type="text" name="plz" defaultValue={person.plz} className="input-field" /></div>
                            <div className="col-span-2"><label className="input-label">Ort</label><input type="text" name="ort" defaultValue={person.ort} className="input-field" /></div>
                        </div>
                        <div><label className="input-label">Telefon</label><input type="text" name="telefon" defaultValue={person.telefon} className="input-field" /></div>
                        <div><label className="input-label">Handy</label><input type="text" name="handy" defaultValue={person.handy} className="input-field" /></div>
                    </div>
                </FormSection>

                <FormSection title="Ausbildung">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <input type="hidden" name="id_lehrbetrieb_lernende" value={lehrverhaeltnis?.id_lehrbetrieb_lernende ?? ''} />
                        <div className="md:col-span-2">
                            <label className="input-label">Lehrbetrieb</label>
                            <select name="nr_lehrbetrieb" defaultValue={lehrverhaeltnis?.nr_lehrbetrieb ?? ''} className="input-field">
                                <option value="">Kein Betrieb</option>
                                {lehrbetriebe.map((b: any) => <option key={b.id_lehrbetrieb} value={b.id_lehrbetrieb}>{b.firma}</option>)}
                            </select>
                        </div>
                        <div><label className="input-label">Beruf</label><input type="text" name="beruf" defaultValue={lehrverhaeltnis?.beruf} className="input-field" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="input-label">Lehrbeginn</label><input type="date" name="lehr_start" defaultValue={lehrverhaeltnis?.start?.split('T')[0]} className="input-field" /></div>
                            <div><label className="input-label">Lehrende</label><input type="date" name="lehr_ende" defaultValue={lehrverhaeltnis?.ende?.split('T')[0]} className="input-field" /></div>
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Besuchte Kurse & Noten">
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Kurs</th>
                                <th className="px-6 py-3 w-32 text-center">Note</th>
                                <th className="px-6 py-3 w-16"></th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {kursLinks.map((link: any) => {
                                const k = allKurse.find((c: any) => c.id_kurs === link.nr_kurs);
                                const linkId = link.id_kurse_lernende;
                                return (
                                    <tr key={linkId}>
                                        <td className="px-6 py-4 font-bold text-sm">{k?.kursthema}</td>
                                        <td className="px-6 py-4">
                                            <input type="hidden" name={`nr_kurs_for_${linkId}`} value={link.nr_kurs} />
                                            <input type="text" name={`grade_link_${linkId}`} defaultValue={link.note} className="input-field !p-2 text-center font-black" />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {/* Button references external form by ID to avoid nested <form> */}
                                            <button
                                                type="submit"
                                                form={`remove-kurs-${linkId}`}
                                                onClick={(e) => { if (!confirm('Kurs aus Profil entfernen?')) e.preventDefault(); }}
                                                className="text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <Icons.Trash size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>

                    {availableKurse.length > 0 && (
                        <div className="p-8 bg-blue-50/30 rounded-2xl border border-blue-100/50 flex gap-6 items-end">
                            <div className="flex-grow">
                                <label className="input-label !text-blue-700">Kurs einschreiben</label>
                                <select name="add_kurs_id" form="add-kurs-form" className="input-field bg-white">
                                    <option value="">Wählen...</option>
                                    {availableKurse
                                        .sort((a: any, b: any) => a.kursthema.localeCompare(b.kursthema))
                                        .map((k: any) => (
                                            <option key={k.id_kurs} value={k.id_kurs}>{k.kursthema}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="w-32">
                                <label className="input-label !text-blue-700">Note</label>
                                <input type="text" name="add_kurs_note" form="add-kurs-form" placeholder="5.0" className="input-field bg-white text-center" />
                            </div>
                            <button type="submit" form="add-kurs-form" className="btn-primary !w-auto px-8">Einschreiben</button>
                        </div>
                    )}
                </FormSection>

                <div className="flex justify-between items-center pt-10 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => { if(confirm('Person löschen?')) deleteLernende(person.id_lernende); }}
                        className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl border border-red-100 font-bold text-xs uppercase flex items-center gap-2"
                    >
                        <Icons.Trash size={14} /> Löschen
                    </button>
                    <div className="flex gap-4">
                        <button type="submit" disabled={isPending} className="btn-primary !w-auto px-12">
                            {isPending ? 'Speichert...' : 'Profil aktualisieren'}
                        </button>
                    </div>
                </div>
            </form>

            {/* Delete forms outside main form — buttons above reference these by ID */}
            {kursLinks.map((link: any) => {
                const linkId = link.id_kurse_lernende;
                return (
                    <form key={linkId} id={`remove-kurs-${linkId}`} action={removeAction}>
                        <input type="hidden" name="link_id" value={linkId} />
                        <input type="hidden" name="lernende_id" value={person.id_lernende} />
                    </form>
                );
            })}

            {/* Add-Kurs form outside main form */}
            <form id="add-kurs-form" action={addAction}>
                <input type="hidden" name="id_lernende" value={person.id_lernende} />
            </form>
        </div>
    );
}

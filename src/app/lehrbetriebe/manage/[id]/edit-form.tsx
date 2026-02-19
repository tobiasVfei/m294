'use client';

import { useActionState } from 'react';
import { updateLehrbetrieb, deleteLehrbetrieb, removeLernendeFromBetrieb, addLernendeToLehrbetrieb, ActionState } from '../../actions';
import Link from 'next/link';
import { Icons } from '@/lib/icons';
import FormSection from '@/components/FormSection';

export default function EditLehrbetriebForm({ lehrbetrieb, allLernende, lehrLinks }: {
    lehrbetrieb: any;
    allLernende: any[];
    lehrLinks: any[];
}) {
    const initialState: ActionState = { error: null, success: null };
    const [state, formAction, isPending] = useActionState(updateLehrbetrieb, initialState);
    const [removeState, removeAction] = useActionState(removeLernendeFromBetrieb, initialState);
    const [addState, addAction] = useActionState(addLernendeToLehrbetrieb, initialState);

    // Only show lernende who are not already assigned to this Betrieb
    const assignedIds = new Set(lehrLinks.map((l: any) => l.nr_lernende));
    const availableLernende = allLernende.filter((p: any) => !assignedIds.has(p.id_lernende));

    const formatDate = (d: string | undefined) => d ? new Date(d).toLocaleDateString('de-CH') : '—';

    return (
        <div className="card max-w-4xl">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Lehrbetrieb bearbeiten</h1>

                <form action={deleteLehrbetrieb.bind(null, lehrbetrieb.id_lehrbetrieb)}>
                    <button
                        type="submit"
                        className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl border border-red-100 font-bold text-xs uppercase flex items-center gap-2"
                        onClick={(e) => { if (!confirm('Wirklich löschen?')) e.preventDefault(); }}
                    >
                        <Icons.Trash size={14} /> Löschen
                    </button>
                </form>
            </div>

            {state?.error && <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8 font-bold border border-red-100">{state.error}</div>}
            {removeState?.error && <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8 font-bold border border-red-100">{removeState.error}</div>}
            {addState?.error && <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8 font-bold border border-red-100">{addState.error}</div>}

            <form action={formAction} className="space-y-12">
                <input type="hidden" name="id_lehrbetrieb" value={lehrbetrieb.id_lehrbetrieb} />

                <FormSection title="Firmendaten">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="input-label">Firma</label>
                            <input type="text" name="firma" defaultValue={lehrbetrieb.firma} required className="input-field" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="input-label">Strasse</label>
                            <input type="text" name="strasse" defaultValue={lehrbetrieb.strasse} className="input-field" />
                        </div>
                        <div className="grid grid-cols-3 gap-4 md:col-span-2">
                            <div>
                                <label className="input-label">PLZ</label>
                                <input type="text" name="plz" defaultValue={lehrbetrieb.plz} className="input-field" />
                            </div>
                            <div className="col-span-2">
                                <label className="input-label">Ort</label>
                                <input type="text" name="ort" defaultValue={lehrbetrieb.ort} className="input-field" />
                            </div>
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Lernende im Betrieb">
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400">
                                <tr>
                                    <th className="px-6 py-3">Person</th>
                                    <th className="px-6 py-3">Beruf</th>
                                    <th className="px-6 py-3">Zeitraum</th>
                                    <th className="px-6 py-3 w-16"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {lehrLinks.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-400 italic text-sm">
                                            Noch keine Lernenden zugewiesen.
                                        </td>
                                    </tr>
                                )}
                                {lehrLinks.map((link: any) => {
                                    const person = allLernende.find((p: any) => p.id_lernende === link.nr_lernende);
                                    const linkId = link.id_lehrbetrieb_lernende;
                                    return (
                                        <tr key={linkId}>
                                            <td className="px-6 py-4 font-bold text-sm">
                                                {person ? `${person.vorname} ${person.nachname}` : `#${link.nr_lernende}`}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{link.beruf || '—'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {link.start ? `${formatDate(link.start)} – ${formatDate(link.ende)}` : '—'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {/* Button references external form by ID to avoid nested <form> */}
                                                <button
                                                    type="submit"
                                                    form={`remove-lernende-${linkId}`}
                                                    onClick={(e) => { if (!confirm('Person aus Betrieb entfernen?')) e.preventDefault(); }}
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

                    {availableLernende.length > 0 && (
                        <div className="p-8 bg-blue-50/30 rounded-2xl border border-blue-100/50 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                            <div className="md:col-span-1">
                                <label className="input-label !text-blue-700">Person hinzufügen</label>
                                <select name="add_lernende_id" form="add-lernende-form" className="input-field bg-white">
                                    <option value="">Wählen...</option>
                                    {availableLernende
                                        .sort((a: any, b: any) => `${a.nachname}${a.vorname}`.localeCompare(`${b.nachname}${b.vorname}`))
                                        .map((p: any) => (
                                            <option key={p.id_lernende} value={p.id_lernende}>
                                                {p.nachname} {p.vorname}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div>
                                <label className="input-label !text-blue-700">Beruf</label>
                                <input type="text" name="add_beruf" form="add-lernende-form" placeholder="z.B. Informatiker" className="input-field bg-white" />
                            </div>
                            <div>
                                <label className="input-label !text-blue-700">Lehrbeginn</label>
                                <input type="date" name="add_start" form="add-lernende-form" className="input-field bg-white" />
                            </div>
                            <div>
                                <label className="input-label !text-blue-700">Lehrende</label>
                                <input type="date" name="add_ende" form="add-lernende-form" className="input-field bg-white" />
                            </div>
                            <div className="md:col-span-4 flex justify-end">
                                <button type="submit" form="add-lernende-form" className="btn-primary !w-auto px-8">
                                    Lernende/n zuweisen
                                </button>
                            </div>
                        </div>
                    )}
                </FormSection>

                <div className="flex justify-end gap-4 pt-10 border-t border-gray-100">
                    <Link href={`/lehrbetriebe/${lehrbetrieb.id_lehrbetrieb}`} className="px-8 py-3 font-bold text-gray-400">Abbrechen</Link>
                    <button type="submit" disabled={isPending} className="btn-primary !w-auto px-12">
                        {isPending ? 'Speichert...' : 'Änderungen speichern'}
                    </button>
                </div>
            </form>

            {/* Remove forms outside main form — buttons above reference these by ID */}
            {lehrLinks.map((link: any) => {
                const linkId = link.id_lehrbetrieb_lernende;
                return (
                    <form key={linkId} id={`remove-lernende-${linkId}`} action={removeAction}>
                        <input type="hidden" name="link_id" value={linkId} />
                        <input type="hidden" name="betrieb_id" value={lehrbetrieb.id_lehrbetrieb} />
                    </form>
                );
            })}

            {/* Add-Lernende form outside main form */}
            <form id="add-lernende-form" action={addAction}>
                <input type="hidden" name="id_lehrbetrieb" value={lehrbetrieb.id_lehrbetrieb} />
            </form>
        </div>
    );
}

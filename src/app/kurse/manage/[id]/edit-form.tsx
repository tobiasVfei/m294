'use client';

import { useActionState } from 'react';
import { updateKurs, deleteKurs, ActionState } from '../../actions';
import Link from 'next/link';
import { Icons } from '@/lib/icons';

export default function EditKursForm({ kurs, allLernende, belegungen, allDozenten }: any) {
    const initialState: ActionState = { error: null, success: null };
    const [state, formAction, isPending] = useActionState(updateKurs, initialState);

    return (
        <div className="card !max-w-5xl">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Kursverwaltung</h1>
                <form action={deleteKurs.bind(null, kurs.id_kurs)}>
                    <button type="submit" className="text-red-600 font-bold text-xs uppercase hover:bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                        <Icons.Trash size={14} /> Kurs löschen
                    </button>
                </form>
            </div>

            {state?.error && <div className="error-box mb-8">{state.error}</div>}
            {state?.success && <div className="bg-green-50 text-green-700 p-5 rounded-2xl mb-8 border border-green-100">Speichern erfolgreich!</div>}

            <form action={formAction} className="space-y-12">
                <input type="hidden" name="id_kurs" value={kurs.id_kurs} />

                <div className="space-y-8">
                    <h3 className="text-[11px] font-black text-[var(--primary)] uppercase tracking-widest flex items-center gap-3">
                        <span className="h-px w-8 bg-blue-200"></span>Stammdaten & Zeitplan
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="input-label">Kursnummer</label>
                            <input type="text" name="kursnummer" defaultValue={kurs.kursnummer} required className="input-field" />
                        </div>
                        <div className="lg:col-span-2">
                            <label className="input-label">Thema</label>
                            <input type="text" name="kursthema" defaultValue={kurs.kursthema} required className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Dozent</label>
                            <select name="nr_dozent" defaultValue={kurs.nr_dozent} className="input-field">
                                {allDozenten.map((d: any) => (
                                    <option key={d.id_dozent} value={d.id_dozent}>{d.nachname} {d.vorname}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Startdatum</label>
                            <input type="date" name="startdatum" defaultValue={kurs.startdatum?.split('T')[0]} required className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Enddatum</label>
                            <input type="date" name="enddatum" defaultValue={kurs.enddatum?.split('T')[0]} required className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Dauer (h)</label>
                            <input type="number" name="dauer" defaultValue={kurs.dauer} required className="input-field" />
                        </div>
                    </div>

                    <div>
                        <label className="input-label">Kursinhalt</label>
                        <textarea name="inhalt" rows={3} defaultValue={kurs.inhalt} className="input-field" />
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-[11px] font-black text-[var(--primary)] uppercase tracking-widest flex items-center gap-3">
                        <span className="h-px w-8 bg-blue-200"></span>Notenblatt
                    </h3>

                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400">
                            <tr>
                                <th className="px-6 py-4">Lernende/r</th>
                                <th className="px-6 py-4 w-32 text-center">Note</th>
                                <th className="px-6 py-4 w-16"></th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {belegungen.map((bel: any) => {
                                const student = allLernende.find((l: any) => l.id_lernende === bel.nr_lernende);
                                const linkId = bel.id_kurse_lernende || bel.id;

                                return (
                                    <tr key={bel.nr_lernende}>
                                        <td className="px-6 py-4 font-bold text-gray-900">{student?.vorname} {student?.nachname}</td>
                                        <td className="px-6 py-4">
                                            <input type="hidden" name={`lernende_id_for_${linkId}`} value={bel.nr_lernende} />
                                            <input
                                                type="text"
                                                name={`grade_link_id_${linkId}`}
                                                defaultValue={bel.note}
                                                className="input-field !p-2 text-center font-black !w-20 mx-auto"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button type="button" className="text-gray-300 hover:text-red-500 transition-colors">
                                                <Icons.Trash size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-8 bg-blue-50/30 rounded-2xl border border-blue-100/50 flex gap-6 items-end">
                        <div className="flex-grow">
                            <label className="input-label !text-blue-700">Neu einschreiben</label>
                            <select name="add_lernende_id" className="input-field bg-white">
                                <option value="">Wählen...</option>
                                {allLernende
                                    .filter((l: any) => !belegungen.some((b: any) => b.nr_lernende === l.id_lernende))
                                    .sort((a: any, b: any) => a.nachname.localeCompare(b.nachname))
                                    .map((l: any) => (
                                        <option key={l.id_lernende} value={l.id_lernende}>{l.nachname} {l.vorname}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="w-32">
                            <label className="input-label !text-blue-700">Note</label>
                            <input type="text" name="add_lernende_note" placeholder="5.0" className="input-field bg-white text-center" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-10 border-t border-gray-100">
                    <Link href={`/kurse/${kurs.id_kurs}`} className="px-8 py-3 font-bold text-gray-400">Abbrechen</Link>
                    <button type="submit" disabled={isPending} className="btn-primary !w-auto px-12">
                        {isPending ? 'Verarbeitung...' : 'Alles Speichern'}
                    </button>
                </div>
            </form>
        </div>
    );
}
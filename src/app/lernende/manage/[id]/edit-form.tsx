'use client';

import { useActionState } from 'react';
import { updateLernende, deleteLernende, ActionState } from '../../actions';
import Link from 'next/link';

export default function EditLernendeForm({ person }: { person: any }) {
    const initialState: ActionState = { error: null, success: null };
    const [state, formAction, isPending] = useActionState(updateLernende, initialState);

    const deleteWithId = deleteLernende.bind(null, person.id_lernende);

    return (
        <div className="card max-w-2xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Lernende Person bearbeiten</h1>

                <form action={deleteWithId}>
                    <button
                        type="submit"
                        className="text-red-600 hover:text-red-800 text-sm border border-red-200 bg-red-50 px-3 py-1 rounded cursor-pointer"
                        onClick={(e) => {
                            if (!confirm('Diese Person wirklich löschen?')) {
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
                <input type="hidden" name="id_lernende" value={person.id_lernende} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="input-label">Vorname</label>
                        <input
                            type="text"
                            name="vorname"
                            defaultValue={person.vorname}
                            required
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="input-label">Nachname</label>
                        <input
                            type="text"
                            name="nachname"
                            defaultValue={person.nachname}
                            required
                            className="input-field"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                        <label className="input-label">PLZ</label>
                        <input
                            type="text"
                            name="plz"
                            defaultValue={person.plz}
                            className="input-field"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="input-label">Ort</label>
                        <input
                            type="text"
                            name="ort"
                            defaultValue={person.ort}
                            required
                            className="input-field"
                        />
                    </div>
                </div>

                <div>
                    <label className="input-label">Lehrbetrieb ID</label>
                    <input
                        type="number"
                        name="id_lehrbetrieb"
                        defaultValue={person.id_lehrbetrieb}
                        required
                        className="input-field"
                    />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Link href={`/lernende/${person.id_lernende}`} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50 flex items-center">
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
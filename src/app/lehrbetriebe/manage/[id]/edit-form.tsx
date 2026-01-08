'use client';

import { useActionState } from 'react';
import { updateLehrbetrieb, deleteLehrbetrieb, ActionState } from '../../actions';
import Link from 'next/link';

export default function EditLehrbetriebForm({ lehrbetrieb }: { lehrbetrieb: any }) {
    const initialState: ActionState = { error: null, success: null };
    const [state, formAction, isPending] = useActionState(updateLehrbetrieb, initialState);

    const deleteWithId = deleteLehrbetrieb.bind(null, lehrbetrieb.id_lehrbetrieb);

    return (
        <div className="card max-w-2xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Lehrbetrieb bearbeiten</h1>

                <form action={deleteWithId}>
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
                <input type="hidden" name="id_lehrbetrieb" value={lehrbetrieb.id_lehrbetrieb} />

                <div>
                    <label className="input-label">Firma</label>
                    <input type="text" name="firma" defaultValue={lehrbetrieb.firma} required className="input-field" />
                </div>

                <div>
                    <label className="input-label">Strasse</label>
                    <input type="text" name="strasse" defaultValue={lehrbetrieb.strasse} className="input-field" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="input-label">PLZ</label>
                        <input type="text" name="plz" defaultValue={lehrbetrieb.plz} className="input-field" />
                    </div>
                    <div>
                        <label className="input-label">Ort</label>
                        <input type="text" name="ort" defaultValue={lehrbetrieb.ort} required className="input-field" />
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Link href="/lehrbetriebe" className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50 flex items-center">
                        Abbrechen
                    </Link>
                    <button type="submit" disabled={isPending} className="btn-primary !w-auto">
                        {isPending ? 'Speichert...' : 'Änderungen speichern'}
                    </button>
                </div>
            </form>
        </div>
    );
}
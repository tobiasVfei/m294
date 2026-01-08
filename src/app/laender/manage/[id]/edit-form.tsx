'use client';

import { useActionState } from 'react';
import { updateLand, deleteLand, ActionState } from '../../actions';
import Link from 'next/link';

export default function EditLandForm({ land }: { land: any }) {
    const initialState: ActionState = { error: null, success: null };
    const [state, formAction, isPending] = useActionState(updateLand, initialState);

    const deleteWithId = deleteLand.bind(null, land.id_land);

    return (
        <div className="card max-w-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Land bearbeiten</h1>

                <form action={deleteWithId}>
                    <button
                        type="submit"
                        className="text-red-600 hover:text-red-800 text-sm border border-red-200 bg-red-50 px-3 py-1 rounded cursor-pointer"
                        onClick={(e) => {
                            if (!confirm(`Möchtest du ${land.landname} wirklich löschen?`)) {
                                e.preventDefault();
                            }
                        }}
                    >
                        🗑️
                    </button>
                </form>
            </div>

            {state?.error && <div className="error-box mb-4">{state.error}</div>}

            <form action={formAction} className="space-y-4">
                <input type="hidden" name="id_land" value={land.id_land} />

                <div>
                    <label className="input-label">Offizieller Name</label>
                    <input
                        type="text"
                        name="landname"
                        defaultValue={land.landname}
                        required
                        className="input-field"
                        placeholder="z.B. Schweiz"
                    />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Link href="/laender" className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">
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
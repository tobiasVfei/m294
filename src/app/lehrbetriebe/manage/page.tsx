'use client';

import { useActionState } from 'react';
import { createLehrbetrieb, ActionState } from '../actions';
import Link from 'next/link';

export default function CreateLehrbetriebPage() {
    const initialState: ActionState = { error: null, success: null };
    const [state, formAction, isPending] = useActionState(createLehrbetrieb, initialState);

    return (
        <main className="page-container">
            <div className="card max-w-2xl">
                <h1 className="text-2xl font-bold mb-6">Neuen Lehrbetrieb hinzufügen</h1>

                {state?.error && <div className="error-box mb-4">{state.error}</div>}

                <form action={formAction} className="space-y-4">
                    <div>
                        <label className="input-label">Firma</label>
                        <input type="text" name="firma" required className="input-field" />
                    </div>

                    <div>
                        <label className="input-label">Strasse</label>
                        <input type="text" name="strasse" className="input-field" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="input-label">PLZ</label>
                            <input type="text" name="plz" className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Ort</label>
                            <input type="text" name="ort" required className="input-field" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Link href="/lehrbetriebe" className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50 flex items-center">
                            Abbrechen
                        </Link>
                        <button type="submit" disabled={isPending} className="btn-primary !w-auto">
                            {isPending ? 'Speichert...' : 'Erstellen'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
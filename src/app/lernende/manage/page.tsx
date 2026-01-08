'use client';

import { useActionState } from 'react';
import { createLernende, ActionState } from '../actions';
import Link from 'next/link';

export default function CreateLernendePage() {
    const initialState: ActionState = { error: null, success: null };
    const [state, formAction, isPending] = useActionState(createLernende, initialState);

    return (
        <main className="page-container">
            <div className="card max-w-2xl">
                <h1 className="text-2xl font-bold mb-6">Lernende Person erfassen</h1>

                {state?.error && <div className="error-box mb-4">{state.error}</div>}

                <form action={formAction} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="input-label">Vorname</label>
                            <input type="text" name="vorname" required className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Nachname</label>
                            <input type="text" name="nachname" required className="input-field" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                            <label className="input-label">PLZ</label>
                            <input type="text" name="plz" className="input-field" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="input-label">Ort</label>
                            <input type="text" name="ort" required className="input-field" />
                        </div>
                    </div>

                    <div>
                        <label className="input-label">Lehrbetrieb ID</label>
                        <input type="number" name="id_lehrbetrieb" required className="input-field" />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Link href="/lernende" className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50 flex items-center">
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
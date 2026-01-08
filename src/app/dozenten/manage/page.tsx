'use client';

import { useActionState } from 'react';
import {ActionState, createDozent} from '../actions';
import Link from 'next/link';

export default function CreateDozentPage() {
    const initialState: ActionState = {
        error: null,
        success: null
    };
    const [state, formAction, isPending] = useActionState(createDozent, initialState);

    return (
        <main className="page-container">
            <div className="card max-w-2xl">
                <h1 className="text-2xl font-bold mb-6">Neuen Dozenten erstellen</h1>

                {state?.error && (
                    <div className="error-box mb-4">
                        {state.error}
                    </div>
                )}

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

                    {/* Weitere Felder wie Straße, PLZ, Ort ... */}
                    <div>
                        <label className="input-label">Ort</label>
                        <input type="text" name="ort" className="input-field" />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Link href="/dozenten" className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50 flex items-center">
                            Abbrechen
                        </Link>
                        <button type="submit" disabled={isPending} className="btn-primary !w-auto">
                            {isPending ? 'Erstelle...' : 'Erstellen'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

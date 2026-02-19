'use client';

import { useActionState } from 'react';
import { createLehrbetrieb, ActionState } from '../actions';
import Link from 'next/link';

export default function CreateLehrbetriebForm() {
    const [state, formAction, isPending] = useActionState(createLehrbetrieb, { error: null, success: null } as ActionState);

    return (
        <div className="card max-w-2xl">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Neuen Lehrbetrieb erfassen</h1>
                <Link href="/lehrbetriebe" className="text-sm font-bold text-gray-400 hover:text-gray-600">Abbrechen</Link>
            </div>

            {state?.error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8 font-bold border border-red-100">
                    {state.error}
                </div>
            )}

            <form action={formAction} className="space-y-6">
                <div>
                    <label className="input-label">Firma</label>
                    <input type="text" name="firma" required className="input-field" />
                </div>
                <div>
                    <label className="input-label">Strasse</label>
                    <input type="text" name="strasse" className="input-field" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="input-label">PLZ</label>
                        <input type="text" name="plz" className="input-field" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="input-label">Ort</label>
                        <input type="text" name="ort" className="input-field" />
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-10 border-t border-gray-100">
                    <Link href="/lehrbetriebe" className="px-8 py-3 font-bold text-gray-400">Abbrechen</Link>
                    <button type="submit" disabled={isPending} className="btn-primary !w-auto px-12">
                        {isPending ? 'Erstellt...' : 'Betrieb anlegen'}
                    </button>
                </div>
            </form>
        </div>
    );
}

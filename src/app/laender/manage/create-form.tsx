'use client';

import { useActionState } from 'react';
import { createLand, ActionState } from '../actions';
import Link from 'next/link';

export default function CreateLandForm() {
    const [state, formAction, isPending] = useActionState(createLand, { error: null, success: null } as ActionState);

    return (
        <div className="card max-w-md">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Neues Land erfassen</h1>
                <Link href="/laender" className="text-sm font-bold text-gray-400 hover:text-gray-600">Abbrechen</Link>
            </div>

            {state?.error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8 font-bold border border-red-100">
                    {state.error}
                </div>
            )}

            <form action={formAction} className="space-y-6">
                <div>
                    <label className="input-label">Offizieller Landname</label>
                    {/* Field name must match what actions.ts reads: formData.get('country') */}
                    <input type="text" name="country" required className="input-field" placeholder="z.B. Schweiz" />
                </div>

                <div className="flex justify-end gap-4 pt-10 border-t border-gray-100">
                    <Link href="/laender" className="px-8 py-3 font-bold text-gray-400">Abbrechen</Link>
                    <button type="submit" disabled={isPending} className="btn-primary !w-auto px-12">
                        {isPending ? 'Erstellt...' : 'Land anlegen'}
                    </button>
                </div>
            </form>
        </div>
    );
}

'use client';

import { useActionState } from 'react';
import { createLand, ActionState } from '../actions';
import Link from 'next/link';

export default function CreateLandPage() {
    const initialState: ActionState = {
        error: null,
        success: null
    };

    const [state, formAction, isPending] = useActionState(createLand, initialState);

    return (
        <main className="page-container">
            <div className="card max-w-md">
                <h1 className="text-2xl font-bold mb-6">Neues Land erfassen</h1>

                {state?.error && (
                    <div className="error-box mb-4">
                        {state.error}
                    </div>
                )}

                <form action={formAction} className="space-y-6">
                    <div>
                        <label className="input-label">Landname</label>
                        <input
                            type="text"
                            name="landname"
                            required
                            className="input-field"
                            placeholder="z.B. Deutschland"
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-8">
                        <Link
                            href="/laender"
                            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50 flex items-center"
                        >
                            Abbrechen
                        </Link>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="btn-primary !w-auto px-6"
                        >
                            {isPending ? 'Wird erstellt...' : 'Land speichern'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { register } from './actions';

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(register, null);

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <h1 className="text-2xl font-bold text-center">Neuen Account erstellen</h1>

                {state?.error && (
                    <div className="p-3 text-sm text-red-500 bg-red-100 rounded border border-red-200">
                        {state.error}
                    </div>
                )}

                <form action={formAction} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">E-Mail</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full mt-1 p-2 border rounded border-gray-300"
                            placeholder="neu@vfei.ch"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Passwort</label>
                        <input
                            type="password"
                            name="password"
                            required
                            minLength={8}
                            className="w-full mt-1 p-2 border rounded border-gray-300"
                            placeholder="Mindestens 8 Zeichen"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-2 text-white bg-green-600 rounded hover:bg-green-700 disabled:bg-green-300"
                    >
                        {isPending ? 'Erstelle Account...' : 'Registrieren'}
                    </button>
                </form>

                <div className="text-center text-sm">
                    Bereits einen Account?{' '}
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Hier einloggen
                    </Link>
                </div>
            </div>
        </main>
    );
}
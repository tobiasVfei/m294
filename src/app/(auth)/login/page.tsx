'use client';

import { useActionState } from 'react';
import { login } from './actions';

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, null);

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <h1 className="text-2xl font-bold text-center text-black">
                    Login Kursverwaltung
                </h1>
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
                            className="w-full mt-1 p-2 border rounded border-gray-300 text-black bg-white"
                            placeholder="admin@vfei.ch"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Passwort</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full mt-1 p-2 border rounded border-gray-300 text-black bg-white"
                            placeholder="••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="btn-primary">
                        {isPending ? 'Logge ein...' : 'Anmelden'}
                    </button>
                </form>
            </div>
        </main>
    );
}
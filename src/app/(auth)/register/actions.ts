'use server';

import { redirect } from 'next/navigation';
import { postPublic } from '@/lib/api';

export async function register(prevState: any, formData: FormData) {
    const email = formData.get('email');
    const password = formData.get('password');

    const res = await postPublic('/benutzer', { email, password });


    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return {
            error: errorData.message || `Fehler beim Erstellen: ${res.statusText}`
        };
    }

    redirect('/login');
}
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { postPublic } from '@/lib/api';

export async function login(prevState: any, formData: FormData) {
    const email = formData.get('email');
    const password = formData.get('password');

    const res = await postPublic('/login', {email, password});

    if (!res.ok) {
        return {error: 'Login fehlgeschlagen. E-Mail oder Passwort falsch.'};
    }

    const data = await res.json();
    const token = data.token;

    if (!token) {
        return { error: 'Kein Token erhalten.' };
    }

    const cookieStore = await cookies();
    cookieStore.set('session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60000,
        path: '/',
    });

    redirect('/dashboard');
}
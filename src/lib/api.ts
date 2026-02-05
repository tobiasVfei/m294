import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const BASE_URL = 'http://localhost/api/src';

export async function postPublic(endpoint: string, data: any) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    return res;
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
        redirect('/login');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(options.headers || {}),
    };

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
        cache: 'no-store',
    });

    if (res.status === 401) {
        redirect('/login');
    }

    if (!res.ok) {
        throw new Error(`API Fehler: ${res.status} bei ${endpoint}`);
    }

    if (res.status === 204) {
        return {};
    }

    return res.json().catch(() => ({}));
}
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Base URL of the PHP backend API
const BASE_URL = 'http://localhost/api/src';

// Public POST request without authentication
// Only used for login since there is no token yet at that point
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

// All authenticated API requests go through this function
// It reads the JWT token from the httpOnly cookie and attaches it as a Bearer token
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    // No token means the user is not logged in → redirect to login
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
        cache: 'no-store', // Always fetch fresh data, no caching
    });

    // Token expired or invalid → redirect to login
    if (res.status === 401) {
        redirect('/login');
    }

    // Throw an error so the calling action can catch it and show a message
    if (!res.ok) {
        throw new Error(`API Fehler: ${res.status} bei ${endpoint}`);
    }

    // DELETE requests often return no body (204 No Content)
    if (res.status === 204) {
        return {};
    }

    return res.json().catch(() => ({}));
}

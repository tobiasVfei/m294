import { cookies } from "next/headers";

export async function isAuthenticated() {
    const cookieStore = await cookies();
    return cookieStore.has('session_token');
}
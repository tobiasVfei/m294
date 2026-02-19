'use server';

import { redirect } from 'next/navigation';
import { postPublic } from '@/lib/api';
import {cookies} from "next/headers";

// Clears the session cookie and redirects to the home page
export async function logout( formData: FormData) {

    const cookieStore = await cookies();
    cookieStore.delete('session_token');
    redirect('/');

}
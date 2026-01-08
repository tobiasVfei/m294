'use server';

import { redirect } from 'next/navigation';
import { postPublic } from '@/lib/api';
import {cookies} from "next/headers";

export async function logout( formData: FormData) {

    const cookieStore = await cookies();
    cookieStore.delete('session_token');
    redirect('/');

}
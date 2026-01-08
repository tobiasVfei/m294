'use server';

import { fetchWithAuth } from '@/lib/api';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { handleCreate, handleUpdate, handleDelete } from '@/lib/actions-utils';

export interface ActionState {
    error: string | null;
    success: boolean | null;
}

export async function createDozent(prevState: ActionState, formData: FormData) {
    const dozent = {
        vorname: formData.get('vorname'),
        nachname: formData.get('nachname'),
        ort: formData.get('ort'),
    };

    return await handleCreate('/dozenten', dozent, '/dozenten');
}

export async function updateDozent(prevState: ActionState, formData: FormData) {
    const id = formData.get('id_dozent') as string;

    const dozent = {
        vorname: formData.get('vorname'),
        nachname: formData.get('nachname'),
        ort: formData.get('ort'),
    };

    return await handleUpdate('/dozenten', id, dozent, '/dozenten');
}

export async function deleteDozent(id: number) {
    return await handleDelete('/dozenten', id, '/dozenten');
}

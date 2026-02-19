'use server';

import { handleCreate, handleUpdate, ActionStatus } from '@/lib/actions-utils';
import { fetchWithAuth } from '@/lib/api';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type ActionState = ActionStatus;

// Creates a new country and redirects to the overview
export async function createLand(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const land = {
        country: formData.get('country'),
    };

    return await handleCreate('/laender', land, '/laender');
}

// Updates an existing country name
export async function updateLand(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const id = formData.get('id_land') as string;

    const land = {
        country: formData.get('country'),
    };

    return await handleUpdate('/laender', id, land, '/laender');
}

// Deletes a country by ID — returns an error state if the country is still in use (409)
export async function deleteLand(id: number, prevState: ActionState, _formData: FormData): Promise<ActionState> {
    try {
        await fetchWithAuth(`/laender/${id}`, { method: 'DELETE' });
    } catch {
        return { error: 'Dieses Land kann nicht gelöscht werden – es wird noch von Lernenden oder Dozenten verwendet.', success: false };
    }
    revalidatePath('/laender');
    redirect('/laender');
}
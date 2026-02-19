'use server';

import { handleCreate, handleUpdate, handleDelete, ActionStatus } from '@/lib/actions-utils';

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

// Deletes a country by ID and redirects to the overview
export async function deleteLand(id: number) {
    return await handleDelete('/laender', id, '/laender');
}
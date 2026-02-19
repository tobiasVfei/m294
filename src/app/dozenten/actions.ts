'use server';

import { fetchWithAuth } from '@/lib/api';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface ActionState {
    error: string | null;
    success: boolean | null;
}

// Creates a new Dozent and redirects to the overview
export async function createDozent(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const dozent = {
        vorname: formData.get('vorname'),
        nachname: formData.get('nachname'),
        geschlecht: formData.get('geschlecht'),
        email: formData.get('email'),
        birthdate: formData.get('birthdate') || null,
        strasse: formData.get('strasse'),
        plz: formData.get('plz'),
        ort: formData.get('ort'),
        nr_land: Number(formData.get('nr_land')) || null,
        handy: formData.get('handy') || null,
        telefon: formData.get('telefon') || null,
    };

    try {
        await fetchWithAuth('/dozenten', {
            method: 'POST',
            body: JSON.stringify(dozent),
        });
        revalidatePath('/dozenten');
    } catch (e: any) {
        return { error: e.message, success: null };
    }

    redirect('/dozenten');
}

// Updates all fields of an existing Dozent
export async function updateDozent(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const id = formData.get('id_dozent') as string;

    const dozent = {
        vorname: formData.get('vorname'),
        nachname: formData.get('nachname'),
        geschlecht: formData.get('geschlecht'),
        email: formData.get('email'),
        birthdate: formData.get('birthdate') || null,
        strasse: formData.get('strasse'),
        plz: formData.get('plz'),
        ort: formData.get('ort'),
        nr_land: Number(formData.get('nr_land')) || null,
        handy: formData.get('handy') || null,
        telefon: formData.get('telefon') || null,
    };

    try {
        await fetchWithAuth(`/dozenten/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dozent),
        });
        revalidatePath(`/dozenten/${id}`);
        revalidatePath('/dozenten');
    } catch (e: any) {
        return { error: e.message, success: null };
    }

    redirect(`/dozenten/${id}`);
}

// Deletes a Dozent by ID — returns an error state if the Dozent still has active courses (409)
export async function deleteDozent(id: number, prevState: ActionState, _formData: FormData): Promise<ActionState> {
    try {
        await fetchWithAuth(`/dozenten/${id}`, { method: 'DELETE' });
    } catch {
        return { error: 'Dieser Dozent kann nicht gelöscht werden – er leitet noch aktive Kurse.', success: false };
    }
    revalidatePath('/dozenten');
    redirect('/dozenten');
}

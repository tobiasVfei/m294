'use server';

import { handleCreate, handleUpdate, handleDelete, ActionStatus } from '@/lib/actions-utils';
import { fetchWithAuth } from '@/lib/api';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type ActionState = ActionStatus;

export async function createLehrbetrieb(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const lehrbetrieb = {
        firma: formData.get('firma'),
        strasse: formData.get('strasse'),
        plz: formData.get('plz'),
        ort: formData.get('ort'),
    };

    return await handleCreate('/lehrbetriebe', lehrbetrieb, '/lehrbetriebe');
}

export async function updateLehrbetrieb(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const id = formData.get('id_lehrbetrieb') as string;

    const lehrbetrieb = {
        firma: formData.get('firma'),
        strasse: formData.get('strasse'),
        plz: formData.get('plz'),
        ort: formData.get('ort'),
    };

    return await handleUpdate('/lehrbetriebe', id, lehrbetrieb, '/lehrbetriebe');
}

export async function deleteLehrbetrieb(id: number) {
    return await handleDelete('/lehrbetriebe', id, '/lehrbetriebe');
}

// Removes a single student from this Lehrbetrieb by deleting the link record
export async function removeLernendeFromBetrieb(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const linkId = formData.get('link_id') as string;
    const betriebId = formData.get('betrieb_id') as string;

    try {
        await fetchWithAuth(`/lehrbetrieb_lernende/${linkId}`, { method: 'DELETE' });
        revalidatePath(`/lehrbetriebe/${betriebId}`);
        revalidatePath('/lehrbetriebe');
    } catch (e: any) {
        return { error: e.message, success: null };
    }

    redirect(`/lehrbetriebe/manage/${betriebId}`);
}

// Adds a student to this Lehrbetrieb by creating a new link record
export async function addLernendeToLehrbetrieb(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const betriebId = formData.get('id_lehrbetrieb') as string;
    const lernendeId = formData.get('add_lernende_id') as string;

    if (!lernendeId) {
        return { error: 'Bitte eine Person auswählen.', success: null };
    }

    try {
        await fetchWithAuth('/lehrbetrieb_lernende', {
            method: 'POST',
            body: JSON.stringify({
                nr_lehrbetrieb: Number(betriebId),
                nr_lernende: Number(lernendeId),
                beruf: formData.get('add_beruf') || null,
                start: formData.get('add_start') || null,
                ende: formData.get('add_ende') || null,
            }),
        });
        revalidatePath(`/lehrbetriebe/${betriebId}`);
        revalidatePath('/lehrbetriebe');
    } catch (e: any) {
        return { error: e.message, success: null };
    }

    redirect(`/lehrbetriebe/manage/${betriebId}`);
}

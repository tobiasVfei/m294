'use server';

import { handleCreate, handleUpdate, handleDelete, ActionStatus } from '@/lib/actions-utils';

export type ActionState = ActionStatus;

export async function createLernende(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const lernende = {
        vorname: formData.get('vorname'),
        nachname: formData.get('nachname'),
        ort: formData.get('ort'),
        plz: formData.get('plz'),
        id_lehrbetrieb: Number(formData.get('id_lehrbetrieb')),
    };

    return await handleCreate('/lernende', lernende, '/lernende');
}

export async function updateLernende(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const id = formData.get('id_lernende') as string;

    const lernende = {
        vorname: formData.get('vorname'),
        nachname: formData.get('nachname'),
        ort: formData.get('ort'),
        plz: formData.get('plz'),
        id_lehrbetrieb: Number(formData.get('id_lehrbetrieb')),
    };

    return await handleUpdate('/lernende', id, lernende, '/lernende');
}

export async function deleteLernende(id: number) {
    return await handleDelete('/lernende', id, '/lernende');
}
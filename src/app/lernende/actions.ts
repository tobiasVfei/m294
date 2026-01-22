'use server';

import { handleCreate, handleUpdate, handleDelete } from '@/lib/actions-utils';

export interface ActionState {
    status: 'success' | 'error' | 'idle';
    message: string;
    data?: { id_lernende?: number } & Record<string, unknown>;
}

export async function createLernende(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const lernende = {
        vorname: formData.get('vorname'),
        nachname: formData.get('nachname'),
        strasse: formData.get('strasse'),
        plz: formData.get('plz'),
        ort: formData.get('ort'),
        nr_land: Number(formData.get('nr_land')),
        geschlecht: formData.get('geschlecht'),
        telefon: formData.get('telefon'),
        handy: formData.get('handy'),
        email: formData.get('email'),
        email_privat: formData.get('email_privat'),
        birthdate: formData.get('birthdate'),
    };

    const response = (await handleCreate('/lernende', lernende, '/lernende')) as unknown as ActionState;

    if (response.status === 'success' && formData.get('id_lehrbetrieb')) {
        const newLernendeId = response.data?.id_lernende;

        const lehrverhaeltnis = {
            nr_lehrbetrieb: Number(formData.get('id_lehrbetrieb')),
            nr_lernende: newLernendeId,
            start: formData.get('start'),
            ende: formData.get('ende'),
            beruf: formData.get('beruf')
        };

        await handleCreate('/lehrbetrieb_lernende', lehrverhaeltnis, '/lernende');
    }

    return response;
}

export async function updateLernende(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const id = formData.get('id_lernende') as string;

    const lernende = {
        vorname: formData.get('vorname'),
        nachname: formData.get('nachname'),
        strasse: formData.get('strasse'),
        plz: formData.get('plz'),
        ort: formData.get('ort'),
        nr_land: Number(formData.get('nr_land')),
        geschlecht: formData.get('geschlecht'),
        telefon: formData.get('telefon'),
        handy: formData.get('handy'),
        email: formData.get('email'),
        email_privat: formData.get('email_privat'),
        birthdate: formData.get('birthdate'),
    };

    return (await handleUpdate('/lernende', id, lernende, '/lernende')) as unknown as ActionState;
}

export async function deleteLernende(id: number) {
    return await handleDelete('/lernende', id, '/lernende');
}
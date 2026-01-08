'use server';

import { handleCreate, handleUpdate, handleDelete, ActionStatus } from '@/lib/actions-utils';

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
'use server';

import { fetchWithAuth } from '@/lib/api';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { handleCreate, handleUpdate, handleDelete } from '@/lib/actions-utils';

interface ActionState {
    error?: string;
    success?: boolean;
}

export async function createKurs(prevState: ActionState, formData: FormData) {
    const kurs = {
        kursnummer: formData.get('kursnummer'),
        kursthema: formData.get('kursthema'),
        inhalt: formData.get('inhalt'),
        nr_dozent: Number(formData.get('nr_dozent')),
    };

    return await handleCreate('/kurse', kurs, '/kurse');
}


export async function updateKurs(prevState: ActionState, formData: FormData) {
    const id = formData.get('id_kurs') as string;
    
    const kurs = {
        kursnummer: formData.get('kursnummer'),
        kursthema: formData.get('kursthema'),
        inhalt: formData.get('inhalt'),
        nr_dozent: Number(formData.get('nr_dozent')),
    };

    return await handleUpdate('/kurse', id, kurs, '/kurse');
}

export async function deleteKurs(id: number) {
    return await handleDelete('/kurse', id, '/kurse');
}

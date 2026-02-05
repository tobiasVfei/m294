'use server';

import { handleCreate, handleUpdate, handleDelete } from '@/lib/actions-utils';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface ActionState {
    error: string | null;
    success: boolean | null;
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

    try {
        const response = await handleCreate('/lernende', lernende, '/lernende');

        if (formData.get('nr_lehrbetrieb')) {
            const newId = (response as any).id_lernende;
            const lehrverhaeltnis = {
                nr_lehrbetrieb: Number(formData.get('nr_lehrbetrieb')),
                nr_lernende: newId,
                start: formData.get('lehr_start'),
                ende: formData.get('lehr_ende'),
                beruf: formData.get('beruf')
            };
            await handleCreate('/lehrbetrieb_lernende', lehrverhaeltnis, '/lernende');
        }

        revalidatePath('/lernende');
    } catch (e: any) {
        return { error: e.message, success: null };
    }

    redirect('/lernende');
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

    try {
        await handleUpdate('/lernende', id, lernende, '/lernende');

        const entries = Array.from(formData.entries());
        for (const [key, value] of entries) {
            if (key.startsWith('grade_kurs_')) {
                const kursId = key.replace('grade_kurs_', '');
                await handleUpdate('/kurse_lernende', `${id}/${kursId}`, { note: value }, '/lernende');
            }
        }

        revalidatePath(`/lernende/${id}`);
        revalidatePath('/lernende');
    } catch (e: any) {
        return { error: e.message, success: null };
    }

    redirect(`/lernende/${id}`);
}

export async function deleteLernende(id: number) {
    await handleDelete('/lernende', id, '/lernende');
    redirect('/lernende');
}
'use server';

import { handleDelete } from '@/lib/actions-utils';
import { fetchWithAuth } from '@/lib/api';
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
        // Create the student and capture the returned record to extract the new ID
        const created = await fetchWithAuth('/lernende', {
            method: 'POST',
            body: JSON.stringify(lernende),
        });

        // If a Lehrbetrieb was selected, create the relationship using the new student's ID
        if (formData.get('nr_lehrbetrieb') && created?.id_lernende) {
            await fetchWithAuth('/lehrbetrieb_lernende', {
                method: 'POST',
                body: JSON.stringify({
                    nr_lehrbetrieb: Number(formData.get('nr_lehrbetrieb')),
                    nr_lernende: created.id_lernende,
                    start: formData.get('lehr_start') || null,
                    ende: formData.get('lehr_ende') || null,
                    beruf: formData.get('beruf') || null,
                }),
            });
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
        await fetchWithAuth(`/lernende/${id}`, {
            method: 'PUT',
            body: JSON.stringify(lernende),
        });

        // Loop through all form fields and update grades for each enrolled course
        // The field names follow the pattern "grade_link_{id_kurse_lernende}"
        const entries = Array.from(formData.entries());
        for (const [key, value] of entries) {
            if (key.startsWith('grade_link_')) {
                const linkId = key.replace('grade_link_', '');
                const nrKurs = formData.get(`nr_kurs_for_${linkId}`);
                const noteValue = value && String(value).trim() !== '' ? String(value) : null;
                await fetchWithAuth(`/kurse_lernende/${linkId}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        nr_kurs: Number(nrKurs),
                        nr_lernende: Number(id),
                        note: noteValue,
                    }),
                });
            }
        }

        // Handle Lehrbetrieb changes — three possible cases:
        const nrLehrbetrieb = formData.get('nr_lehrbetrieb') as string;
        const idLehrbetriebLernende = formData.get('id_lehrbetrieb_lernende') as string;

        if (!nrLehrbetrieb && idLehrbetriebLernende) {
            // Case 1: Lehrbetrieb was removed → delete the relationship
            await fetchWithAuth(`/lehrbetrieb_lernende/${idLehrbetriebLernende}`, {
                method: 'DELETE',
            });
        } else if (nrLehrbetrieb && idLehrbetriebLernende) {
            // Case 2: Lehrbetrieb was changed → update the existing relationship
            await fetchWithAuth(`/lehrbetrieb_lernende/${idLehrbetriebLernende}`, {
                method: 'PUT',
                body: JSON.stringify({
                    nr_lehrbetrieb: Number(nrLehrbetrieb),
                    nr_lernende: Number(id),
                    start: formData.get('lehr_start') || null,
                    ende: formData.get('lehr_ende') || null,
                    beruf: formData.get('beruf') || null,
                }),
            });
        } else if (nrLehrbetrieb && !idLehrbetriebLernende) {
            // Case 3: No Lehrbetrieb existed before → create a new relationship
            await fetchWithAuth('/lehrbetrieb_lernende', {
                method: 'POST',
                body: JSON.stringify({
                    nr_lehrbetrieb: Number(nrLehrbetrieb),
                    nr_lernende: Number(id),
                    start: formData.get('lehr_start') || null,
                    ende: formData.get('lehr_ende') || null,
                    beruf: formData.get('beruf') || null,
                }),
            });
        }

        revalidatePath(`/lernende/${id}`);
        revalidatePath('/lernende');
    } catch (e: any) {
        return { error: e.message, success: null };
    }

    redirect(`/lernende/${id}`);
}

// Removes a single course enrollment by its link ID
export async function removeKursEnrollment(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const linkId = formData.get('link_id') as string;
    const lernendeId = formData.get('lernende_id') as string;

    try {
        await fetchWithAuth(`/kurse_lernende/${linkId}`, {
            method: 'DELETE',
        });
        revalidatePath(`/lernende/${lernendeId}`);
        revalidatePath('/lernende');
    } catch (e: any) {
        return { error: e.message, success: null };
    }

    redirect(`/lernende/manage/${lernendeId}`);
}

// Enrolls a student in a new course, optionally with a grade
export async function addKursToLernende(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const lernendeId = formData.get('id_lernende') as string;
    const kursId = formData.get('add_kurs_id') as string;
    const noteInput = formData.get('add_kurs_note');

    if (!kursId || kursId === '') {
        return { error: 'Bitte einen Kurs auswählen.', success: null };
    }

    // Empty string should be stored as null, not as an empty string
    const noteValue = noteInput && String(noteInput).trim() !== '' ? String(noteInput) : null;

    try {
        await fetchWithAuth('/kurse_lernende', {
            method: 'POST',
            body: JSON.stringify({
                nr_kurs: Number(kursId),
                nr_lernende: Number(lernendeId),
                note: noteValue,
            }),
        });
        revalidatePath(`/lernende/${lernendeId}`);
        revalidatePath('/lernende');
    } catch (e: any) {
        return { error: e.message, success: null };
    }

    redirect(`/lernende/manage/${lernendeId}`);
}

export async function deleteLernende(id: number) {
    await handleDelete('/lernende', id, '/lernende');
    redirect('/lernende');
}

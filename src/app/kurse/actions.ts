'use server';

import { fetchWithAuth } from '@/lib/api';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface ActionState {
    error: string | null;
    success: boolean | null;
}

export async function createKurs(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const kursData = {
        kursnummer: formData.get('kursnummer'),
        kursthema: formData.get('kursthema'),
        inhalt: formData.get('inhalt'),
        nr_dozent: Number(formData.get('nr_dozent')),
        startdatum: formData.get('startdatum'),
        enddatum: formData.get('enddatum'),
        dauer: formData.get('dauer')
    };

    try {
        await fetchWithAuth('/kurse', {
            method: 'POST',
            body: JSON.stringify(kursData),
        });
        revalidatePath('/kurse');
    } catch (e: any) {
        return { error: e.message, success: null };
    }

    redirect('/kurse');
}

export async function updateKurs(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const id = formData.get('id_kurs') as string;

    const kursData = {
        kursnummer: formData.get('kursnummer'),
        kursthema: formData.get('kursthema'),
        inhalt: formData.get('inhalt'),
        nr_dozent: Number(formData.get('nr_dozent')),
        startdatum: formData.get('startdatum'),
        enddatum: formData.get('enddatum'),
        dauer: formData.get('dauer')
    };

    try {
        await fetchWithAuth(`/kurse/${id}`, {
            method: 'PUT',
            body: JSON.stringify(kursData),
        });

        // Update grades for all enrolled students — field names follow "grade_link_id_{id_kurse_lernende}"
        const entries = Array.from(formData.entries());

        for (const [key, value] of entries) {
            if (key.startsWith('grade_link_id_')) {
                const linkId = key.replace('grade_link_id_', '');
                const lernendeId = formData.get(`lernende_id_for_${linkId}`);

                const noteValue = value && String(value).trim() !== "" ? String(value) : null;

                await fetchWithAuth(`/kurse_lernende/${linkId}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        nr_kurs: Number(id),
                        nr_lernende: Number(lernendeId),
                        note: noteValue
                    }),
                });
            }
        }

        const newStudentId = formData.get('add_lernende_id');
        const newStudentNoteInput = formData.get('add_lernende_note');

        if (newStudentId && newStudentId !== "") {
            const newNoteValue = newStudentNoteInput && String(newStudentNoteInput).trim() !== ""
                ? String(newStudentNoteInput)
                : null;

            await fetchWithAuth('/kurse_lernende', {
                method: 'POST',
                body: JSON.stringify({
                    nr_kurs: Number(id),
                    nr_lernende: Number(newStudentId),
                    note: newNoteValue
                }),
            });
        }

        revalidatePath(`/kurse/${id}`);
        revalidatePath(`/kurse`);

    } catch (e: any) {
        return { error: e.message, success: null };
    }

    redirect(`/kurse/${id}`);
}

export async function removeStudentFromKurs(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const linkId = formData.get('link_id') as string;
    const kursId = formData.get('kurs_id') as string;

    try {
        await fetchWithAuth(`/kurse_lernende/${linkId}`, {
            method: 'DELETE',
        });
        revalidatePath(`/kurse/${kursId}`);
        revalidatePath('/kurse');
    } catch (e: any) {
        return { error: e.message, success: null };
    }

    redirect(`/kurse/${kursId}/manage`);
}

export async function deleteKurs(id: string | number) {
    try {
        await fetchWithAuth(`/kurse/${id}`, {
            method: 'DELETE',
        });
        revalidatePath('/kurse');
    } catch (e) {
        console.error("Löschen fehlgeschlagen");
    }
    redirect('/kurse');
}
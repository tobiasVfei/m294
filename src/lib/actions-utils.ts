import { fetchWithAuth } from '@/lib/api';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface ActionStatus {
    error: string | null;
    success: boolean | null;
}

// Helper for simple create operations
// After the API call, the Next.js cache is invalidated and the user is redirected
export async function handleCreate(endpoint: string, data: any, redirectUrl: string): Promise<ActionStatus> {
    try {
        await fetchWithAuth(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    } catch (error) {
        return { error: 'Fehler beim Erstellen.', success: false };
    }
    revalidatePath(redirectUrl);
    redirect(redirectUrl);
    return { error: null, success: true };
}

// Helper for simple update operations
// The ID is appended directly to the endpoint (e.g. /dozenten/5)
export async function handleUpdate(endpoint: string, id: string | number, data: any, redirectUrl: string): Promise<ActionStatus> {
    try {
        await fetchWithAuth(`${endpoint}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    } catch (error) {
        return { error: 'Fehler beim Speichern.', success: false };
    }
    revalidatePath(redirectUrl);
    redirect(redirectUrl);
    return { error: null, success: true };
}

// Helper for delete operations
export async function handleDelete(endpoint: string, id: number, redirectUrl: string) {
    try {
        await fetchWithAuth(`${endpoint}/${id}`, {
            method: 'DELETE',
        });
    } catch (error) {
        throw error;
    }
    revalidatePath(redirectUrl);
    redirect(redirectUrl);
}

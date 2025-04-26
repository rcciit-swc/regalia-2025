import { supabase } from './supabase-client';

/**
 * Generates a UUID string.
 * Uses crypto.randomUUID() if available; otherwise, falls back to a simple generator.
 *
 * @returns A UUID string.
 */
function getUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback: Note that this is not cryptographically secure.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Uploads the payment screenshot file to the Supabase Storage bucket.
 *
 * @param file - The File object representing the payment screenshot.
 * @param eventName - The name of the event (used to create a folder).
 * @returns The public URL of the uploaded file.
 * @throws An error if the upload fails.
 */
export async function uploadPaymentScreenshot(file: File, eventName: string) {
  const bucket = 'fests';

  // Generate a safe unique identifier for the file name.
  const uuid = getUUID();
  const fileName = `${uuid}-${file.name}`;
  const filePath = `got-2025/${eventName}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading file:', error);
    throw error;
  }

  // Get the public URL of the uploaded file.
  const publicUrl = supabase.storage.from(bucket).getPublicUrl(filePath)
    .data?.publicUrl;

  if (!publicUrl) {
    throw new Error('Failed to get public URL for the uploaded file.');
  }

  // Return the public URL.
  return publicUrl;
}

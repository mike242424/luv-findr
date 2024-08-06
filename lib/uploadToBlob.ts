import { put } from '@vercel/blob';

export async function uploadBufferToBlob(file: Buffer, filename: string) {
  try {
    const blob = await put(filename, file, {
      access: 'public',
    });
    return blob.url;
  } catch (error) {
    console.error('Failed to upload file to Vercel Blob:', error);
    throw new Error('Failed to upload file.');
  }
}

export async function uploadFileToBlob(file: File): Promise<any> {
  const filename = file.name;
  try {
    const blob = await put(filename, file.stream(), {
      access: 'public',
    });
    return blob;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file.');
  }
}

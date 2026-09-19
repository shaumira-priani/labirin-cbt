// src/utils/cloudinaryUpload.ts
//
// Uploads an image file directly from the browser to Cloudinary using an
// "unsigned" upload preset (no backend, no secret key exposed). Requires
// VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET env vars —
// see the Cloudinary account setup instructions from earlier in this project.

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

export async function uploadImageToCloudinary(file: File): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary belum dikonfigurasi. Cek VITE_CLOUDINARY_CLOUD_NAME dan VITE_CLOUDINARY_UPLOAD_PRESET di secrets.');
  }

  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw new Error(errBody?.error?.message || `Upload gagal (HTTP ${res.status})`);
  }

  const data = await res.json();
  return data.secure_url as string;
}

/** Basic client-side guardrails before we even try uploading. */
export function validateImageFile(file: File): string | undefined {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowed.includes(file.type)) return 'Format gambar harus JPG, PNG, WEBP, atau GIF.';
  if (file.size > 5 * 1024 * 1024) return 'Ukuran gambar maksimal 5MB.';
  return undefined;
}

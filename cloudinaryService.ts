/**
 * Cloudinary Unsigned Upload Service
 * Allows direct browser image uploads without backend or secret API keys.
 */

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
}

const STORAGE_KEY_CLOUD_NAME = 'cbt_cloudinary_cloud_name';
const STORAGE_KEY_UPLOAD_PRESET = 'cbt_cloudinary_upload_preset';

/**
 * Retrieves the current Cloudinary configuration from environment variables or localStorage.
 */
export function getCloudinaryConfig(): CloudinaryConfig {
  const envCloudName =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ||
    (import.meta.env as any).CLOUDINARY_CLOUD_NAME ||
    '';
  const envUploadPreset =
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ||
    (import.meta.env as any).CLOUDINARY_UPLOAD_PRESET ||
    '';

  const localCloudName =
    typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_CLOUD_NAME) || '' : '';
  const localUploadPreset =
    typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_UPLOAD_PRESET) || '' : '';

  return {
    cloudName: (envCloudName || localCloudName).trim(),
    uploadPreset: (envUploadPreset || localUploadPreset).trim()
  };
}

/**
 * Saves custom Cloudinary configuration in localStorage (useful if env var wasn't set in deployment).
 */
export function saveCloudinaryConfig(cloudName: string, uploadPreset: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_CLOUD_NAME, cloudName.trim());
    localStorage.setItem(STORAGE_KEY_UPLOAD_PRESET, uploadPreset.trim());
  }
}

/**
 * Checks if Cloudinary credentials are fully present.
 */
export function isCloudinaryConfigured(): boolean {
  const config = getCloudinaryConfig();
  return Boolean(config.cloudName && config.uploadPreset);
}

/**
 * Performs unsigned upload to Cloudinary.
 * Accepts File, Blob, or base64 data URI string.
 */
export async function uploadImageToCloudinary(
  fileOrBlobOrDataUrl: File | Blob | string
): Promise<CloudinaryUploadResponse> {
  const { cloudName, uploadPreset } = getCloudinaryConfig();

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Cloudinary belum dikonfigurasi. Harap tentukan CLOUDINARY_CLOUD_NAME dan CLOUDINARY_UPLOAD_PRESET di file konfigurasi atau form pengaturan.'
    );
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`;
  const formData = new FormData();

  formData.append('file', fileOrBlobOrDataUrl);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    let errorDetail = `Status ${response.status}: ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson.error && errJson.error.message) {
        errorDetail = errJson.error.message;
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(`Upload Cloudinary gagal: ${errorDetail}`);
  }

  const data = await response.json();
  return {
    secure_url: data.secure_url,
    public_id: data.public_id,
    format: data.format,
    width: data.width,
    height: data.height,
    bytes: data.bytes
  };
}

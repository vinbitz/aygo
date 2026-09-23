// Reads an image file and shrinks it so photos stay light in memory and uploads
const MAX_BYTES = 15 * 1024 * 1024;

// Event photos: one cover plus a small gallery
export const MAX_EVENT_PHOTOS = 8;
export const EMPTY_EVENT_PHOTOS = { cover: null, gallery: [] };

export async function loadImageFile(file, { maxSize = 1600, quality = 0.85 } = {}) {
  if (!file?.type?.startsWith('image/')) throw new Error('Please choose an image file (JPG, PNG, HEIC, WEBP).');
  if (file.size > MAX_BYTES) throw new Error('That photo is over 15 MB. Please choose a smaller one.');

  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read that photo.'));
    reader.readAsDataURL(file);
  });

  const img = new Image();
  img.src = dataUrl;
  try {
    await img.decode();
  } catch {
    // The browser can't decode it (some HEIC files): keep the original
    return { src: dataUrl, name: file.name };
  }
  const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
  return { src: canvas.toDataURL('image/jpeg', quality), name: file.name };
}

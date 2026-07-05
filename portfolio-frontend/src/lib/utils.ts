export const t = (localized: any, lang: string = 'en') => {
  if (!localized) return '';
  if (typeof localized === 'string') return localized;
  return localized[lang] || localized['en'] || '';
};

/**
 * Construct full image URL from relative or absolute paths
 * Handles both relative uploads paths and absolute URLs
 */
export function getImageUrl(imagePath?: string): string {
  if (!imagePath) return '';

  // Already absolute URL (http/https)
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Relative path from uploads directory
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  const baseUrl = apiUrl.replace('/api', ''); // Remove /api suffix
  return `${baseUrl}${imagePath}`;
}

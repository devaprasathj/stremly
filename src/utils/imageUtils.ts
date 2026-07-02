import { TMDB_IMAGE_BASE, IMAGE_SIZES } from './constants';

export const FALLBACK_IMAGES = {
  poster: '',
  backdrop: '',
  thumbnail: '',
  avatar: `https://ui-avatars.com/api/?name=U&background=7B61FF&color=fff&size=128`,
};

export function getImageUrl(
  path: string | null | undefined,
  size: keyof typeof IMAGE_SIZES = 'thumbnail',
  fallback?: string
): string {
  if (!path) return fallback || '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  if (path.startsWith('/')) return path;
  return `${TMDB_IMAGE_BASE}/${IMAGE_SIZES[size]}${path}`;
}

export function logImageError(src: string, target: string) {
  console.warn(`[STREAMLY] Image failed to load:`, {
    src: src.substring(0, 120),
    target,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  });
}

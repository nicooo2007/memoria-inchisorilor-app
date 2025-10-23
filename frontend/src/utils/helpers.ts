// Utility functions for Memorial Gherla App

/**
 * Calculate distance between two coordinates in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Format date to Romanian format
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date with time
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Generate shareable text for a prison
 */
export function generateShareText(prisonName: string, description: string): string {
  return `${prisonName}\n\n${truncateText(description, 200)}\n\nDescoperă mai multe în aplicația Memorial Gherla.`;
}

/**
 * Validate QR code format
 */
export function isValidQRFormat(data: string): boolean {
  try {
    const parsed = JSON.parse(data);
    return parsed.type && parsed.prison_id;
  } catch {
    return false;
  }
}

/**
 * Calculate years between two dates
 */
export function calculateYears(startYear: number, endYear?: number): number {
  if (!endYear) return new Date().getFullYear() - startYear;
  return endYear - startYear;
}

/**
 * Format number with thousands separator
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ro-RO');
}

/**
 * Get period label (e.g., "1945-1964")
 */
export function getPeriodLabel(years: number[]): string {
  if (years.length === 0) return 'Unknown';
  if (years.length === 1) return years[0].toString();
  return `${years[0]}-${years[years.length - 1]}`;
}
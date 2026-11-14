/**
 * @organic-store/shared-utils
 * Reusable formatting, validation, and domain calculation helpers
 */

/**
 * Format numeric amount into standard Indian Rupee notation (e.g. ₹1,250)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format ISO date string into clean readable date
 */
export function formatDate(isoString: string | Date | undefined): string {
  if (!isoString) return 'N/A';
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return String(isoString);
  }
}

/**
 * Validate 12-digit Indian Bank UTR format
 */
export function isValidUTR(utr: string): boolean {
  if (!utr) return false;
  const clean = utr.trim().toUpperCase();
  return clean.length >= 10 && clean.length <= 22 && /^[A-Z0-9]+$/.test(clean);
}

/**
 * Mask Indian phone numbers for privacy display (e.g. +91 93916*****44)
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 10) return phone || '';
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 10) {
    return `${clean.slice(0, 4)}****${clean.slice(8)}`;
  }
  return phone;
}

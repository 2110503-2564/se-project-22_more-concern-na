import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const reportReasonExternal = [
  'Child Exploitation',
  'Bullying/Harassment',
  'Self-Harm/Suicide Content',
  'Violence/Graphic Content',
  'NSFW/Adult Content',
  'Spam/Unwanted Content',
  'Scam/Fraudulent Activity',
];

export const reportReasonInternal = [
  'pedo',
  'bully',
  'suicide',
  'violence',
  'nsfw',
  'spam',
  'scam',
  'other',
];

/**
 * Maps an external report reason to its internal code
 * @param externalReason The external reason to map
 * @returns The corresponding internal code, or "other" if not found
 */
export function reportReasonE2I(externalReason: string): string {
  const index = reportReasonExternal.indexOf(externalReason);
  return index !== -1 ? reportReasonInternal[index] : 'other';
}

/**
 * Maps an internal report reason code to its external description
 * @param internalReason The internal code to map
 * @returns The corresponding external description, or "Other" if it's the "other" code
 */
export function reportReasonI2E(internalReason: string): string {
  if (internalReason === 'other') return 'Other';
  const index = reportReasonInternal.indexOf(internalReason);
  return index !== -1 ? reportReasonExternal[index] : 'Other';
}

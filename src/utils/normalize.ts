/**
 * BBIE Data Normalization Layer
 * Implements Rule-based cleaning as per PRD Section 16.
 */

const LEGAL_SUFFIXES = [
  'pvt ltd', 'private limited', 'ltd', 'limited', 
  'llp', 'inc', 'corp', 'corporation', 'mfg', 
  'manufacturing', 'co', 'company', 'ind', 'industries'
];

const ADDRESS_MAP: Record<string, string> = {
  'road': 'rd',
  'street': 'st',
  'floor': 'fl',
  'apartment': 'apt',
  'building': 'bldg',
  'extension': 'ext',
  'industrial estate': 'ie',
  'industrial area': 'ia',
  'complex': 'cplx',
  'near': 'nr',
  'opposite': 'opp'
};

/**
 * Normalizes entity names by removing common legal suffixes and noise
 */
export function normalizeName(name: string): string {
  if (!name) return '';
  let clean = name.toLowerCase().trim();
  
  // Remove special characters but keep spaces
  clean = clean.replace(/[^a-z0-9\s]/g, ' ');
  
  // Remove legal suffixes
  LEGAL_SUFFIXES.forEach(suffix => {
    const regex = new RegExp(`\\b${suffix}\\b`, 'g');
    clean = clean.replace(regex, '');
  });
  
  // Clean up extra whitespace
  return clean.replace(/\s+/g, ' ').trim();
}

/**
 * Normalizes addresses using common abbreviation mapping
 */
export function normalizeAddress(address: string): string {
  if (!address) return '';
  let clean = address.toLowerCase().trim();
  
  // Map abbreviations
  Object.entries(ADDRESS_MAP).forEach(([full, short]) => {
    const regex = new RegExp(`\\b${full}\\b`, 'g');
    clean = clean.replace(regex, short);
  });
  
  // Remove punctuation
  clean = clean.replace(/[,.-]/g, ' ');
  
  return clean.replace(/\s+/g, ' ').trim();
}

/**
 * Extracts digits only (useful for PIN codes and identifiers)
 */
export function extractDigits(input: string): string {
  if (!input) return '';
  return input.replace(/\D/g, '');
}

/**
 * Normalizes alphanumeric identifiers (PAN/GSTIN)
 */
export function normalizeIdentifier(id: string): string {
  if (!id) return '';
  return id.toUpperCase().replace(/[^A-Z0-9]/g, '').trim();
}

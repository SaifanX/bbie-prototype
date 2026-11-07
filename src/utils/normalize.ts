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

// Kannada to English Offline Dictionary for generated seed terms and fallbacks
const KANNADA_TO_ENGLISH_DICT: Record<string, string> = {
  // Surnames
  'ಗೌಡ': 'Gowda',
  'ಶೆಟ್ಟಿ': 'Shetty',
  'ಮೂರ್ತಿ': 'Murthy',
  'ರಾವ್': 'Rao',
  'ಸಿಂಗ್': 'Singh',
  'ಗುಪ್ತಾ': 'Gupta',
  'ಅಗರ್ವಾಲ್': 'Agarwal',
  'ಅಯ್ಯರ್': 'Iyer',
  'ಮೆನನ್': 'Menon',
  'ಪಾಟೀಲ್': 'Patil',
  'ದೇಶ್‌ಮುಖ್': 'Deshmukh',
  'ರೆಡ್ಡಿ': 'Reddy',
  'ನಾಯ್ಡು': 'Naidu',
  'ಚೌಹಾಣ್': 'Chauhan',
  'ಮೆಹ್ತಾ': 'Mehta',
  'ಶಾ': 'Shah',
  'ಕುಲಕರ್ಣಿ': 'Kulkarni',
  'ಜೋಶಿ': 'Joshi',
  'ಬೋಸ್': 'Bose',
  'ಚಟರ್ಜಿ': 'Chatterjee',

  // Suffixes
  'ಎಂಟರ್‌ಪ್ರೈಸಸ್': 'Enterprises',
  'ಎಂಟರ್ಪ್ರೈಸಸ್': 'Enterprises',
  'ಟ್ರೇಡರ್ಸ್': 'Traders',
  'ಸೊಲ್ಯೂಷನ್ಸ್': 'Solutions',
  'ಸೊಲ್ಯೂಷನ್': 'Solutions',
  'ಇಂಡಸ್ಟ್ರೀಸ್': 'Industries',
  'ಲಾಜಿಸ್ಟಿಕ್ಸ್': 'Logistics',
  'ವೆಂಚರ್ಸ್': 'Ventures',
  'ಆಗ್ರೋ': 'Agro',
  'ಇನ್ಫ್ರಾಟೆಕ್': 'Infratech',
  'ಡಿಜಿಟಲ್': 'Digital',
  'ಸಿಸ್ಟಮ್ಸ್': 'Systems',
  'ಸಿಸ್ಟಮ್': 'Systems',
  'ಮ್ಯಾನುಫ್ಯಾಕ್ಚರಿಂಗ್': 'Manufacturing',
  'ಟೆಕ್ಸ್‌ಟೈಲ್ಸ್': 'Textiles',
  'ಅಸೋಸಿಯೇಟ್ಸ್': 'Associates',
  'ಗ್ರೂಪ್': 'Group',
  'ಏಜೆನ್ಸಿ': 'Agency',
  'ವರ್ಕ್ಸ್': 'Works',
  'ಕಾರ್ಪೊರೇಷನ್': 'Corporation',
  'ಇಂಜಿನಿಯರಿಂಗ್': 'Engineering',
  'ಕನ್ಸಲ್ಟೆನ್ಸಿ': 'Consultancy',
  'ಗ್ಲೋಬಲ್': 'Global',

  // Areas
  'ಪೀಣ್ಯ': 'Peenya',
  'ಬಿಟಿಎಂ ಲೇಔಟ್': 'BTM Layout',
  'ಯಶವಂತಪುರ': 'Yeshwanthpur',
  'ವೈಟ್‌ಫೀಲ್ಡ್': 'Whitefield',
  'ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ': 'Electronic City',
  'ರಾಜಾಜಿನಗರ': 'Rajajinagar',
  'ಜಯನಗರ': 'Jayanagar',
  'ಕೋರಮಂಗಲ': 'Koramangala',
  'ಇಂದಿರಾನಗರ': 'Indiranagar',
  'ಮಲ್ಲೇಶ್ವರಂ': 'Malleshwaram',
  'ಬೊಮ್ಮಸಂದ್ರ': 'Bommasandra',
  'ಎಚ್‌ಎಸ್‌ಆರ್ ಲೇಔಟ್': 'HSR Layout',
  'ಬೆಂಗಳೂರು': 'Bangalore',

  // Conjunctions & common noise
  'ಮತ್ತು': '&',
  'ಆಂಡ್': '&',
  'ಅಂಡ್': '&',
  'ಸನ್ಸ್': 'Sons',
  'ಪುತ್ರರು': 'Sons',
  'ಲಿಮಿಟೆಡ್': 'Limited',
  'ಪ್ರೈವೇಟ್': 'Private',
  'ಪೈ': 'Pvt',
  'ಲಿ': 'Ltd',
};

/**
 * Checks if a string contains Kannada characters
 */
export function hasKannada(text: string): boolean {
  if (!text) return false;
  return /[\u0C80-\u0CFF]/.test(text);
}

/**
 * Performs a fast, offline dictionary-based translation and basic transliteration for Kannada text.
 */
export function translateKannadaToEnglishOffline(text: string): string {
  if (!text) return '';
  
  // Split input into words, preserve spaces and common symbols
  const words = text.split(/(\s+|[,.\-&()+/])/);
  const translatedWords = words.map(word => {
    const trimmed = word.trim();
    if (!trimmed) return word;
    
    // Look up in dictionary
    if (KANNADA_TO_ENGLISH_DICT[trimmed]) {
      return KANNADA_TO_ENGLISH_DICT[trimmed];
    }
    
    // Return original if no translation mapping
    return word;
  });
  
  return translatedWords.join('').replace(/\s+/g, ' ').trim();
}

/**
 * Normalizes entity names by removing common legal suffixes and noise
 */
export function normalizeName(name: string): string {
  if (!name) return '';
  
  let clean = name;
  if (hasKannada(clean)) {
    clean = translateKannadaToEnglishOffline(clean);
  }
  
  clean = clean.toLowerCase().trim();
  
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
  
  let clean = address;
  if (hasKannada(clean)) {
    clean = translateKannadaToEnglishOffline(clean);
  }
  
  clean = clean.toLowerCase().trim();
  
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
export function normalizeIdentifier(id: string | null | undefined): string | null {
  if (!id) return null;
  const stripped = id.toUpperCase().replace(/[^A-Z0-9]/g, '').trim();
  
  // PAN must be 10, GSTIN must be 15.
  // Anything else is likely a placeholder (e.g., "NA", "PENDING", "0")
  if (stripped.length === 10 || stripped.length === 15) {
    return stripped;
  }
  
  return null;
}

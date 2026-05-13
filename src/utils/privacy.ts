/**
 * BBIE Privacy Shield
 * Ensures PII (Personally Identifiable Information) is masked before 
 * being sent to external LLM providers (Gemini), as per PRD Section 7.
 */

export function maskPII(text: string): string {
  if (!text) return text;

  let masked = text;

  // 1. Mask GSTINs (Format: 2 digits, 10 chars, 3 chars)
  const gstinRegex = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/g;
  masked = masked.replace(gstinRegex, "[MASKED-GSTIN]");

  // 2. Mask PANs (Format: 5 chars, 4 digits, 1 char)
  const panRegex = /[A-Z]{5}\d{4}[A-Z]{1}/g;
  masked = masked.replace(panRegex, "[MASKED-PAN]");

  // 3. Mask Pincodes (6 digits)
  const pincodeRegex = /\b\d{6}\b/g;
  masked = masked.replace(pincodeRegex, "[PIN-REDACTED]");

  // 4. Mask specific House/Plot numbers in addresses
  // Look for patterns like "No. 123", "Plot 42", "#12"
  const houseRegex = /(?:No\.|Plot|#|Flat|Suite)\s*\d+[A-Z]?/gi;
  masked = masked.replace(houseRegex, "[LOCATION-ID-MASKED]");

  return masked;
}

export function anonymizeRecord(record: any) {
  const sanitized = { ...record };
  
  if (sanitized.gstin) sanitized.gstin = "[MASKED]";
  if (sanitized.pan) sanitized.pan = "[MASKED]";
  
  if (typeof sanitized.raw_data === 'object') {
    sanitized.raw_data = JSON.parse(maskPII(JSON.stringify(sanitized.raw_data)));
  }

  return sanitized;
}

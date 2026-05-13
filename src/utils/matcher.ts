import { calculateConfidence, ConfidenceInput } from './confidence';

interface BusinessRecord {
  primary_name?: string;
  pan?: string;
  gstin?: string;
  registered_address?: string;
  pincode?: string;
}

export interface MatchResult {
  score: number;
  reasoning: string[];
  matchedFields: string[];
  breakdown?: any;
}

/**
 * The Core Matcher (Wrapper for Confidence Engine)
 */
export function calculateMatch(source: BusinessRecord, target: BusinessRecord): MatchResult {
  const input: ConfidenceInput = {
    source: {
      name: source.primary_name || '',
      address: source.registered_address || '',
      pan: source.pan,
      gstin: source.gstin,
      pincode: source.pincode
    },
    target: {
      name: target.primary_name || '',
      address: target.registered_address || '',
      pan: target.pan,
      gstin: target.gstin,
      pincode: target.pincode
    }
  };

  const result = calculateConfidence(input);

  const matchedFields: string[] = [];
  if (result.nameScore > 0.3) matchedFields.push("Name");
  if (result.addressScore > 0.1) matchedFields.push("Address");
  if (result.idScore > 0) matchedFields.push("Identifier");
  if (result.pincodeScore > 0) matchedFields.push("Pincode");

  return {
    score: result.overall,
    reasoning: result.reasoning,
    matchedFields,
    breakdown: {
      name: result.nameScore,
      address: result.addressScore,
      id: result.idScore,
      pin: result.pincodeScore
    }
  };
}

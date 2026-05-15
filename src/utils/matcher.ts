import { calculateConfidence, ConfidenceInput } from './confidence';

interface BusinessRecord {
  name?: string;
  pan?: string;
  gstin?: string;
  address?: string;
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
      name: source.name || '',
      address: source.address || '',
      pan: source.pan,
      gstin: source.gstin,
      pincode: source.pincode
    },
    target: {
      name: target.name || '',
      address: target.address || '',
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

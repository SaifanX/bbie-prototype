/**
 * BBIE Confidence Engine
 * Implements the resolution formula from PRD Section 18.
 */

import { normalizeName, normalizeAddress, extractDigits, normalizeIdentifier } from './normalize';
import { getSimilarityScore } from './similarity';

export interface ConfidenceInput {
  source: {
    name: string;
    address: string;
    pan?: string;
    gstin?: string;
    pincode?: string;
  };
  target: {
    name: string;
    address: string;
    pan?: string;
    gstin?: string;
    pincode?: string;
  };
}

export interface ConfidenceBreakdown {
  overall: number;
  nameScore: number;
  addressScore: number;
  idScore: number;
  pincodeScore: number;
  reasoning: string[];
}

/**
 * Calculates confidence score between two entities
 */
export function calculateConfidence(input: ConfidenceInput): ConfidenceBreakdown {
  const { source, target } = input;
  const reasoning: string[] = [];

  // 1. Normalize
  const nSourceName = normalizeName(source.name);
  const nTargetName = normalizeName(target.name);
  const nSourceAddr = normalizeAddress(source.address);
  const nTargetAddr = normalizeAddress(target.address);
  
  // 2. Name Similarity (Weight: 0.5)
  const nameSim = getSimilarityScore(nSourceName, nTargetName, 'name');
  if (nameSim > 0.8) reasoning.push('Strong Name Alignment');
  else if (nameSim > 0.5) reasoning.push('Partial Name Match');

  // 3. Address Similarity (Weight: 0.2)
  const addrSim = getSimilarityScore(nSourceAddr, nTargetAddr, 'address');
  if (addrSim > 0.7) reasoning.push('Geographic Co-location');

  // 4. Identifier Match (Weight: 0.2)
  let idScore = 0;
  if ((source.pan && target.pan && normalizeIdentifier(source.pan) === normalizeIdentifier(target.pan)) ||
      (source.gstin && target.gstin && normalizeIdentifier(source.gstin) === normalizeIdentifier(target.gstin))) {
    idScore = 1.0;
    reasoning.push('Exact Identifier Anchor (PAN/GSTIN)');
  }

  // 5. Pincode Match (Weight: 0.1)
  const sourcePin = extractDigits(source.pincode || '');
  const targetPin = extractDigits(target.pincode || '');
  const pincodeScore = (sourcePin && targetPin && sourcePin === targetPin) ? 1.0 : 0;
  if (pincodeScore > 0) reasoning.push('Pincode Verified');

  // 6. Overall Calculation
  const overall = (0.5 * nameSim) + (0.2 * addrSim) + (0.2 * idScore) + (0.1 * pincodeScore);

  return {
    overall: parseFloat(overall.toFixed(2)),
    nameScore: parseFloat((nameSim * 0.5).toFixed(2)),
    addressScore: parseFloat((addrSim * 0.2).toFixed(2)),
    idScore: parseFloat((idScore * 0.2).toFixed(2)),
    pincodeScore: parseFloat((pincodeScore * 0.1).toFixed(2)),
    reasoning
  };
}

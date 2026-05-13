/**
 * BBIE Similarity Engine
 * Implements distance algorithms as per PRD Section 17.
 */

/**
 * Calculates Levenshtein Distance between two strings
 */
export function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  const maxLen = Math.max(m, n);
  if (maxLen === 0) return 1.0;
  return 1 - dp[m][n] / maxLen;
}

/**
 * Calculates word-based overlap similarity (0-1)
 * Good for addresses and long names
 */
export function wordOverlapSimilarity(s1: string, s2: string): number {
  const words1 = new Set(s1.split(/\s+/).filter(w => w.length > 1));
  const words2 = new Set(s2.split(/\s+/).filter(w => w.length > 1));
  
  if (words1.size === 0 || words2.size === 0) return 0;
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  return (2 * intersection.size) / (words1.size + words2.size);
}

/**
 * Combined similarity score optimized for different data types
 */
export function getSimilarityScore(s1: string, s2: string, type: 'name' | 'address' | 'identifier' = 'name'): number {
  if (!s1 || !s2) return 0;
  
  if (type === 'identifier') {
    return s1.trim().toUpperCase() === s2.trim().toUpperCase() ? 1.0 : 0;
  }
  
  if (type === 'address') {
    // Addresses use word overlap primarily
    return wordOverlapSimilarity(s1, s2);
  }
  
  // Names use a mix of character distance and word overlap
  const charSim = levenshteinDistance(s1, s2);
  const wordSim = wordOverlapSimilarity(s1, s2);
  
  return (charSim * 0.4) + (wordSim * 0.6);
}

import { calculateMatch } from '../src/utils/matcher';

/**
 * Test: Deterministic Override
 * Scenario: Different names/addresses, but EXACT same PAN.
 * Expectation: Score 1.0 (100%)
 */

const source = {
  primary_name: "Ganesh Traders (Messy)",
  pan: "ABCDE1234F",
  registered_address: "123 Old Road, Bangalore"
};

const target = {
  primary_name: "Shree Ganesh Enterprises",
  pan: "ABCDE1234F", // EXACT MATCH
  registered_address: "Sector 4, HSR Layout, Bengaluru"
};

console.log("--- STARTING DETERMINISTIC TEST ---");
const result = calculateMatch(source, target);

console.log("Match Score:", result.score);
console.log("Reasoning:", result.reasoning);
console.log("Matched Fields:", result.matchedFields);

if (result.score === 1.0) {
  console.log("\n✅ SUCCESS: Deterministic override forced a 100% match.");
} else {
  console.log("\n❌ FAILURE: Score is not 1.0. The weighted logic is still interfering.");
}

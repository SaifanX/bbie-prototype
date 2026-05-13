import { GoogleGenerativeAI } from "@google/generative-ai";
import { maskPII } from "./privacy";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Generates a 3072-dimensional embedding for a given text.
 * Uses gemini-embedding-2 model (2026 Edition).
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
    // Scrub PII before embedding
    const safeText = maskPII(text);
    const result = await model.embedContent(safeText);
    return result.embedding.values;
  } catch (error) {
    console.error("Embedding Error:", error);
    return new Array(3072).fill(0);
  }
}

/**
 * Generates a forensic reasoning verdict for a potential identity match.
 */
export async function generateMatchVerdict(source: string, target: string, confidence: number): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    // Scrub PII before sending to external LLM
    const safeSource = maskPII(source);
    const safeTarget = maskPII(target);

    const prompt = `
      As a Forensic Data Auditor for the Bharat Business Intelligence Engine (BBIE), 
      analyze the following identity match and provide a professional, one-sentence verdict.
      
      Source Name: "${safeSource}"
      Matched Registry Entity: "${safeTarget}"
      Calculated Confidence: ${confidence}%
      
      Explain the logic (e.g., phonetic similarity, acronym resolution, common typos) 
      that suggests these are the same business entity.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Verdict Error:", error);
    return "Automated match based on high-dimensional semantic similarity.";
  }
}

/**
 * Generates a forensic activity verdict for a business.
 */
export async function generateActivityVerdict(status: string, eventSummary: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    // Scrub PII before sending to external LLM
    const safeSummary = maskPII(eventSummary);

    const prompt = `
      As a Regulatory Intelligence Agent, provide a brief forensic summary for why this business 
      is classified as "${status.toUpperCase()}".
      
      Event Summary: ${safeSummary}
      
      Be concise and use high-trust professional language.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Activity Verdict Error:", error);
    return `System classified as ${status} based on recent regulatory signals.`;
  }
}

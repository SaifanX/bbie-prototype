require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function healthCheck() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello! Are you active?");
    console.log("✅ API is ACTIVE. Response:", result.response.text());
  } catch (error) {
    console.error("❌ API Health Check FAILED:", error.message);
  }
}

healthCheck();

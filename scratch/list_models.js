require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const modelList = await genAI.listModels();
    console.log("Available Models:");
    modelList.models.forEach(m => {
      console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods.join(', ')})`);
    });
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();

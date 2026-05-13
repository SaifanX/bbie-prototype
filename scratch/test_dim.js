require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testDim() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
    const result = await model.embedContent("test");
    console.log("Vector Length:", result.embedding.values.length);
  } catch (error) {
    console.error("Test Error:", error.message);
  }
}

testDim();

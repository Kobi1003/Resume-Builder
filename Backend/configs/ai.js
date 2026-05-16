import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Default model name (can be overridden via GEMINI_MODEL env variable)
const defaultModelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

// Export a function to get a generative model instance
export const getModel = (modelName = defaultModelName) => {
  return genAI.getGenerativeModel({ model: modelName });
};

// Export the default model instance for convenience
export const ai = getModel();

export { genAI };
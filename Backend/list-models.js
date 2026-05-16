import fetch from 'node-fetch';
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const endpoint = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;

async function listModels() {
  try {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const data = await res.json();
    console.log('Available models:');
    data.models?.forEach(m => console.log(m.name));
  } catch (e) {
    console.error('Error listing models:', e);
  }
}

listModels();

import { getModel } from "../configs/ai.js";
import ResumeModel from "../models/resumemodel.js";

// Helper function to call AI using the configured model
const callAI = async (prompt) => {
  try {
    const model = getModel(); // uses default or env-specified model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error:", error.message);
    throw error;
  }
};

// Controller for enhancing professional summary
export const enhanceResume = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });
    const prompt = `Enhance this professional summary for a resume. Make it impactful and grammatically perfect. Original: "${text}" Return ONLY the enhanced text.`;
    const enhancedText = await callAI(prompt);
    res.status(200).json({ enhancedText });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller for enhancing job description
export const enhanceJobDescription = async (req, res) => {
  try {
    const { text, role, company } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });
    const prompt = `Enhance this job description for a ${role || "professional"} role at ${company || "a company"}. Use action verbs and focus on achievements. Original: "${text}" Return ONLY the enhanced text.`;
    const enhancedText = await callAI(prompt);
    res.status(200).json({ enhancedText });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller for uploading resume and parsing it
export const uploadResume = async (req, res) => {
    try {
        const { title, resumeText } = req.body;
        const userId = req.user.userid;

        // Basic implementation: Create a resume document with the extracted text
        // In a real app, you might use AI to parse the text into fields
        const newResume = await ResumeModel.create({
            userId,
            title,
            professional_summary: resumeText // Placeholder
        });

        res.status(201).json({
            message: "Resume uploaded and created successfully",
            resume: newResume
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

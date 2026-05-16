// controller for enhancing a resume's professional summary
// POST: /api/ai/enhance
import ai from "../configs/ai.js";
import resume from "../models/resumemodel";

export const enhanceResume = async (req, res) => {
    try {
        const { userContent } = req.body;
        if (!userContent) {
            return res.status(404).json({ message: "Resume not found" });
        }
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-001",
            messages: [
                {
                    role: "System",
                    contents: "You are an AI assistant that helps users create and enhance their resumes. Your goal is to provide users with high-quality, professional, and tailored content that will help them secure their desired jobs. You are an expert in resume writing and career coaching, and you understand what recruiters and hiring managers look for in a strong resume. You are also proficient in various resume templates and formatting styles, and you can adapt your responses to suit different industries and career levels."
                },
                {
                    role: "User",
                    contents: userContent,
                }
            ],
        });
        const enhancedContent = response.text;
        res.status(200).json({ enhancedContent });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

//controller for enhancing a resume's job description
// POST: /api/ai/enhanceJobDescription

export const enhanceJobDescription = async (req, res) => {
    try {
        const { userContent } = req.body;
        if (!userContent) {
            return res.status(404).json({ message: "Resume not found" });
        }
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-001",
            messages: [
                {
                    role: "System",
                    contents: "You are an expert resume writer who specializes in enhancing job descriptions. Your task is to analyze the user's current resume content (provided in the 'userContent' field) and improve the language, structure, and impact of the job descriptions to make them more compelling and professional. Focus on highlighting achievements, using strong action verbs, and tailoring the content to the user's experience."
                },
                {
                    role: "User",
                    contents: userContent,
                }
            ],
        });
        const enhancedContent = response.text;
        res.status(200).json({ enhancedContent });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

//controller for uploading a resume to the database
// POST: /api/ai/uploadResume

export const uploadResume = async (req, res) => {
    try {
        const { resumeText, title } = req.body;
        const userId = req.user.userid;
        if (!resumeText) {
            return res.status(404).json({ message: "Resume not found" });
        }
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-001",
            messages: [
                {
                    role: "System",
                    contents: "You are an expert resume writer who specializes in uploading resumes to the database. Your task is to analyze the user's current resume content (provided in the 'userContent' field) and upload it to the database."
                },
                {
                    role: "User",
                    contents: `Extract data from this resume: ${resumeText}
                    
                    Provide Data in the following JSON format with no additional text before or after:
                    {
                        professional_summary: {
                        type: String,
                        default: ""
                    },
                    skills: [{
                        type: String 
                    }],
                    personal_info: {
                        image: {type: String, default: ""},
                        full_name: {type: String, default: ""},
                        profession: {type: String, default: ""},
                        phone: {type: String, default: ""},
                        email: {type: String, default: ""},
                        location: {type: String, default: ""},
                        linkedin: {type: String, default: ""},
                        website: {type: String, default: ""}
                    },
                    experience: [
                        {
                            company: {type: String, default: ""},
                            position: {type: String, default: ""},
                            start_date: {type: String, default: ""},
                            end_date: {type: String, default: ""},
                            description: {type: String, default: ""},
                            is_current: {type: Boolean},
                        }
                    ],
                    projects: [{
                        name: {type: String, default: ""},
                        type: {type: String, default: ""},
                        description: {type: String, default: ""}
                    }],
                    education: [{
                        institution: {type: String, default: ""},
                        degree: {type: String, default: ""},
                        field: {type: String, default: ""},
                        graduation_date: {type: String, default: ""},
                        is_current: {type: Boolean} 
                    }], 
                }, {timestamps: true, minimize: false})

            }`
                }
            ],
            response_format: { type: "json_object" }
        });
        const extractedData = response.text;

        const parsedData = JSON.parse(extractedData);

        const Resume = await resume.create({
            user: userId,
            title: title,
            data: parsedData
        });

        res.json({ resumeId: newResume._id });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
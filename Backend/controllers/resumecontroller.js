import ResumeModel from "../models/resumemodel.js";
import imagekit from "../configs/imagekit.js";
import ImageKit from "@imagekit/nodejs";

// controller for creating a new resume
// POST: /api/resumes
export const createResume = async (req, res) => {
    try {
        const userId = req.user.userid;
        const { title } = req.body;

        console.log("Creating resume for user:", userId, "with title:", title);

        const newResume = await ResumeModel.create({ userId, title });
        console.log("Resume created successfully in DB:", newResume._id);

        return res.status(201).json({ message: "Resume created Successfully", resume: newResume });
    } catch (error) {
        console.error("Error in createResume:", error);
        res.status(400).json({ message: error.message });
    }
}

//controller for deleting a resume
// DELETE: /api/resumes/:id
export const deleteResume = async (req, res) => {
    try {
        const { id } = req.params; // The Resume ID
        const userId = req.user.userid; // The User ID (from protect middleware)

        // Find the resume ONLY if it belongs to the logged-in user
        const deletedResume = await ResumeModel.findOneAndDelete({ _id: id, userId: userId });

        if (!deletedResume) {
            return res.status(404).json({ message: "Resume not found or unauthorized" });
        }

        return res.status(200).json({ message: "Resume deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// get user resume by id
// GET: /api/resumes/get
export const getResumeById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userid;
        const resume = await ResumeModel.findOne({ _id: id, userId: userId });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        resume.__v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;
        return res.status(200).json({ resume });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


// controller for updating a resume
// PUT: /api/resumes/:id
export const updateResume = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userid;
        const { resumeId, resumeData, removeBackground } = req.body;

        console.log("Updating resume:", resumeId || id, "for user:", userId);

        let resumeDataCopy = typeof resumeData === 'string' ? JSON.parse(resumeData) : resumeData;

        // Prevent updating IDs
        delete resumeDataCopy._id;
        // Handle naming mismatches and normalize data
        if (resumeDataCopy.project && !resumeDataCopy.projects) resumeDataCopy.projects = resumeDataCopy.project;
        if (resumeDataCopy.experiences && !resumeDataCopy.experience) resumeDataCopy.experience = resumeDataCopy.experiences;

        console.log("RAW DATA FROM WEBSITE:", JSON.stringify(resumeDataCopy, null, 2));

        // Normalize Experience items (Handling potential empty position/role)
        if (Array.isArray(resumeDataCopy.experience)) {
            resumeDataCopy.experience = resumeDataCopy.experience.map(exp => ({
                company: exp.company || exp.companyName || "Unknown Company",
                role: exp.role || exp.position || exp.jobTitle || exp.role_name || "Staff",
                duration: exp.duration || (exp.start_date && exp.end_date ? `${exp.start_date} - ${exp.end_date}` : exp.start_date || exp.end_date || "Present"),
                description: exp.description || ""
            }));
        }

        // Clean up project/projects clash
        const rawProjects = resumeDataCopy.projects || resumeDataCopy.project || [];
        if (Array.isArray(rawProjects) && rawProjects.length > 0) {
            resumeDataCopy.projects = rawProjects.map(proj => ({
                title: proj.title || proj.name || "Untitled Project",
                link: proj.link || proj.url || "",
                description: proj.description || proj.type || ""
            }));
            delete resumeDataCopy.project; // Remove singular version to avoid clash
        }

        console.log("FINAL NORMALIZED DATA (Exp):", JSON.stringify(resumeDataCopy.experience, null, 2));

        // Deep merge logic
        const updateData = {};
        for (const key in resumeDataCopy) {
            if (typeof resumeDataCopy[key] === 'object' && !Array.isArray(resumeDataCopy[key]) && resumeDataCopy[key] !== null) {
                for (const subKey in resumeDataCopy[key]) {
                    updateData[`${key}.${subKey}`] = resumeDataCopy[key][subKey];
                }
            } else {
                updateData[key] = resumeDataCopy[key];
            }
        }

        const resume = await ResumeModel.findOneAndUpdate(
            { userId, _id: resumeId || id },
            { $set: updateData },
            { returnDocument: 'after', runValidators: true }
        )

        if (!resume) {
            console.warn("Resume not found for update:", resumeId || id);
            return res.status(404).json({ message: "Resume not found" });
        }

        console.log("Resume updated successfully:", resume._id);
        console.log("VERIFICATION - Title:", resume.title);
        console.log("VERIFICATION - Image in DB:", resume.personal_info.image);
        return res.status(200).json({ resume });
    } catch (error) {
        console.error("Error in updateResume:", error);
        res.status(400).json({ message: error.message });
    }
}

//get resume by id public
// GET: /api/resumes/public/:id 
export const getResumeByIdPublic = async (req, res) => {
    try {
        const { id } = req.params;
        const resume = await ResumeModel.findOne({ public: true, _id: id });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        resume.__v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;
        return res.status(200).json({ resume });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// controller for uploading an image to ImageKit
export const uploadImage = async (req, res) => {
    console.log("DEBUG START: function entered");
    console.log("Image upload request received for file:", req.file?.originalname);

    // Safety timeout: if ImageKit doesn't respond in 30 seconds, abort
    const timeout = setTimeout(() => {
        if (!res.headersSent) {
            console.error("ERROR: ImageKit upload timed out");
            res.status(504).json({ message: "Upload timed out" });
        }
    }, 30000);

    try {
        console.log("DEBUG: Inside try block");
        if (!req.file) {
            clearTimeout(timeout);
            return res.status(400).json({ message: "No file uploaded" });
        }

        console.log("Preparing file buffer...");
        const fileToUpload = await ImageKit.toFile(req.file.buffer, req.file.originalname || "image.png");
        console.log("DEBUG: toFile success");

        console.log("Uploading to ImageKit...");
        const response = await imagekit.files.upload({
            file: fileToUpload,
            fileName: req.file.originalname || "resume-image.png",
            folder: "/resumes/images"
        });

        clearTimeout(timeout);
        console.log("Upload successful! URL:", response.url);

        return res.status(200).json({
            message: "Image uploaded successfully",
            url: response.url
        });
    } catch (error) {
        console.log("DEBUG: Caught error:", error.message);
        clearTimeout(timeout);
        console.error("CRITICAL: ImageKit upload failed!");
        console.error("Error details:", error);

        if (!res.headersSent) {
            res.status(400).json({
                message: error.message || "Upload failed",
                details: error.toString()
            });
        }
    }
}
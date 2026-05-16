import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
    company: { type: String, default: "" },
    position: { type: String, default: "" },
    start_date: { type: String, default: "" },
    end_date: { type: String, default: "" },
    description: { type: String, default: "" },
    is_current: { type: Boolean, default: false }
});

const educationSchema = new mongoose.Schema({
    institution: { type: String, default: "" },
    degree: { type: String, default: "" },
    field: { type: String, default: "" },
    graduation_date: { type: String, default: "" },
    gpa: { type: String, default: "" }
});

const projectSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    type: { type: String, default: "" },
    description: { type: String, default: "" }
});

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        default: "Untitled Resume"
    },
    public: {
        type: Boolean,
        default: false
    },
    template: {
        type: String,
        default: "classic"
    },
    accent_color: {
        type: String,
        default: "#9333ea"
    },
    professional_summary: {
        type: String,
        default: ""
    },
    skills: {
        type: [String],
        default: []
    },
    personal_info: {
        image: { type: String, default: "" },
        full_name: { type: String, default: "" },
        profession: { type: String, default: "" },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        location: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        website: { type: String, default: "" },
    },
    experience: { type: [experienceSchema], default: [] },
    project: { type: [projectSchema], default: [] },
    education: { type: [educationSchema], default: [] },
}, { timestamps: true });

const ResumeModel = mongoose.model("Resume", resumeSchema);

export default ResumeModel;

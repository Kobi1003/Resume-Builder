import React, { useState } from "react";
import { Plus, Trash2, Sparkles, Loader2 } from "lucide-react";
import api from "../configs/api";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const ExperienceForm = ({ data, onChange }) => {
    // data is an array of experience objects
    const experiences = Array.isArray(data) ? data : [];
    const [enhancingIndex, setEnhancingIndex] = useState(null);
    const { token } = useSelector((state) => state.auth);

    const handleEnhance = async (index) => {
        const exp = experiences[index];
        if (!exp.description || exp.description.trim().length < 10) {
            toast.error("Please enter a job description first");
            return;
        }

        try {
            setEnhancingIndex(index);
            const response = await api.post("/api/ai/enhance-job-desc", 
                {
                    text: exp.description,
                    role: exp.position,
                    company: exp.company
                },
                { headers: { Authorization: token } }
            );
            
            if (response.data.enhancedText) {
                handleChange(index, "description", response.data.enhancedText);
                toast.success("Description enhanced!");
            }
        } catch (error) {
            console.error("Enhance error:", error);
            toast.error(error.response?.data?.message || "Failed to enhance description");
        } finally {
            setEnhancingIndex(null);
        }
    };

    const handleAdd = () => {
        onChange([
            ...experiences,
            {
                company: "",
                position: "",
                start_date: "",
                end_date: "",
                is_current: false,
                description: "",
            }
        ]);
    };

    const handleRemove = (index) => {
        const newExperiences = [...experiences];
        newExperiences.splice(index, 1);
        onChange(newExperiences);
    };

    const handleChange = (index, field, value) => {
        const newExperiences = [...experiences];
        newExperiences[index][field] = value;
        // If "Currently working here" is checked, we might want to clear end_date
        if (field === "is_current" && value === true) {
            newExperiences[index].end_date = "";
        }
        onChange(newExperiences);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className='text-lg font-semibold text-gray-800'>Professional Experience</h3>
                    <p className="text-sm text-gray-500">Add your job experience</p>
                </div>
                <button 
                    onClick={handleAdd}
                    className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors border border-emerald-200"
                >
                    <Plus size={16} />
                    Add Experience
                </button>
            </div>

            <div className="space-y-6">
                {experiences.map((exp, index) => (
                    <div key={index} className="p-5 border border-gray-200 rounded-lg bg-white relative shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-gray-800">Experience #{index + 1}</h4>
                            <button 
                                onClick={() => handleRemove(index)}
                                className="text-red-400 hover:text-red-600 transition-colors p-1"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Company Name"
                                    value={exp.company}
                                    onChange={(e) => handleChange(index, "company", e.target.value)}
                                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Job Title"
                                    value={exp.position}
                                    onChange={(e) => handleChange(index, "position", e.target.value)}
                                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                />
                            </div>
                            <div>
                                <input
                                    type="month"
                                    value={exp.start_date}
                                    onChange={(e) => handleChange(index, "start_date", e.target.value)}
                                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-gray-600"
                                />
                            </div>
                            <div>
                                <input
                                    type="month"
                                    value={exp.end_date}
                                    disabled={exp.is_current}
                                    onChange={(e) => handleChange(index, "end_date", e.target.value)}
                                    className={`w-full p-2.5 border border-gray-300 rounded-md outline-none text-sm text-gray-600 ${exp.is_current ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`}
                                />
                            </div>
                        </div>

                        <div className="mb-4 flex items-center gap-2">
                            <input
                                type="checkbox"
                                id={`current-${index}`}
                                checked={exp.is_current}
                                onChange={(e) => handleChange(index, "is_current", e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                            />
                            <label htmlFor={`current-${index}`} className="text-sm text-gray-700 cursor-pointer select-none">
                                Currently working here
                            </label>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm text-gray-700 font-medium">Job Description</label>
                                <button 
                                    onClick={() => handleEnhance(index)}
                                    disabled={enhancingIndex === index}
                                    className="flex items-center gap-1 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded transition-colors border border-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {enhancingIndex === index ? (
                                        <Loader2 size={12} className="animate-spin" />
                                    ) : (
                                        <Sparkles size={12} />
                                    )}
                                    {enhancingIndex === index ? "Enhancing..." : "Enhance with AI"}
                                </button>
                            </div>
                            <textarea
                                value={exp.description}
                                onChange={(e) => handleChange(index, "description", e.target.value)}
                                placeholder="Describe your key responsibilities and achievements..."
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y min-h-[120px] text-sm text-gray-700 leading-relaxed"
                            ></textarea>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExperienceForm;

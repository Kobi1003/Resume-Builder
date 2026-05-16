import React, { useState } from "react";
import { X, Plus } from "lucide-react";

const SkillsForm = ({ data, onChange }) => {
    const skills = Array.isArray(data) ? data : [];
    const [inputValue, setInputValue] = useState("");

    const handleAdd = (e) => {
        e.preventDefault();
        const trimmed = inputValue.trim();
        if (trimmed && !skills.includes(trimmed)) {
            onChange([...skills, trimmed]);
            setInputValue("");
        }
    };

    const handleRemove = (skillToRemove) => {
        onChange(skills.filter(s => s !== skillToRemove));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdd(e);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className='text-lg font-semibold text-gray-800'>Skills</h3>
                    <p className="text-sm text-gray-500">Add your technical and soft skills</p>
                </div>
            </div>

            <div>
                <form onSubmit={handleAdd} className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter a skill (e.g., JavaScript, Project Management)"
                        className="flex-1 p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                    <button 
                        type="submit"
                        className="flex items-center justify-center gap-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-lg transition-colors shadow-sm"
                    >
                        <Plus size={16} />
                        Add
                    </button>
                </form>

                <div className="flex flex-wrap gap-2 mb-6">
                    {skills.map((skill, index) => (
                        <div 
                            key={index} 
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
                        >
                            <span>{skill}</span>
                            <button 
                                type="button"
                                onClick={() => handleRemove(skill)}
                                className="text-blue-500 hover:text-blue-800 focus:outline-none flex items-center justify-center bg-white rounded-full p-0.5"
                            >
                                <X size={12} strokeWidth={3} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800 border border-blue-100 mb-6">
                    <span className="font-semibold text-blue-900">Tip:</span> Add 8-12 relevant skills. Include both technical skills (programming languages, tools) and soft skills (leadership, communication).
                </div>
            </div>
        </div>
    );
};

export default SkillsForm;

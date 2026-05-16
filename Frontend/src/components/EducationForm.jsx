import React from "react";
import { Plus, Trash2 } from "lucide-react";

const EducationForm = ({ data, onChange }) => {
    const educations = Array.isArray(data) ? data : [];

    const handleAdd = () => {
        onChange([
            ...educations,
            {
                institution: "",
                degree: "",
                field: "",
                graduation_date: "",
                gpa: "",
            }
        ]);
    };

    const handleRemove = (index) => {
        const newEducations = [...educations];
        newEducations.splice(index, 1);
        onChange(newEducations);
    };

    const handleChange = (index, field, value) => {
        const newEducations = [...educations];
        newEducations[index][field] = value;
        onChange(newEducations);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className='text-lg font-semibold text-gray-800'>Education</h3>
                    <p className="text-sm text-gray-500">Add your education details</p>
                </div>
                <button 
                    onClick={handleAdd}
                    className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors border border-emerald-200"
                >
                    <Plus size={16} />
                    Add Education
                </button>
            </div>

            <div className="space-y-6">
                {educations.map((edu, index) => (
                    <div key={index} className="p-5 border border-gray-200 rounded-lg bg-white relative shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-gray-800">Education #{index + 1}</h4>
                            <button 
                                onClick={() => handleRemove(index)}
                                className="text-red-400 hover:text-red-600 transition-colors p-1"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 sm:col-span-1">
                                <input
                                    type="text"
                                    placeholder="Institution or School"
                                    value={edu.institution}
                                    onChange={(e) => handleChange(index, "institution", e.target.value)}
                                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <input
                                    type="text"
                                    placeholder="Degree (e.g. B.Tech)"
                                    value={edu.degree}
                                    onChange={(e) => handleChange(index, "degree", e.target.value)}
                                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <input
                                    type="text"
                                    placeholder="Field of Study (e.g. CSE)"
                                    value={edu.field}
                                    onChange={(e) => handleChange(index, "field", e.target.value)}
                                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <input
                                    type="month"
                                    value={edu.graduation_date}
                                    onChange={(e) => handleChange(index, "graduation_date", e.target.value)}
                                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-gray-600"
                                />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <input
                                    type="text"
                                    placeholder="GPA (optional)"
                                    value={edu.gpa}
                                    onChange={(e) => handleChange(index, "gpa", e.target.value)}
                                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EducationForm;

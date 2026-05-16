import React from "react";
import { Plus, Trash2 } from "lucide-react";

const ProjectForm = ({ data, onChange }) => {
    // data is expected to be `resumeData.project` array
    const projects = Array.isArray(data) ? data : [];

    const handleAdd = () => {
        onChange([
            ...projects,
            {
                name: "",
                type: "",
                description: "",
            }
        ]);
    };

    const handleRemove = (index) => {
        const newProjects = [...projects];
        newProjects.splice(index, 1);
        onChange(newProjects);
    };

    const handleChange = (index, field, value) => {
        const newProjects = [...projects];
        newProjects[index][field] = value;
        onChange(newProjects);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className='text-lg font-semibold text-gray-800'>Projects</h3>
                    <p className="text-sm text-gray-500">Add your projects</p>
                </div>
                <button 
                    onClick={handleAdd}
                    className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors border border-emerald-200"
                >
                    <Plus size={16} />
                    Add Project
                </button>
            </div>

            <div className="space-y-6">
                {projects.map((proj, index) => (
                    <div key={index} className="p-5 border border-gray-200 rounded-lg bg-white relative shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-800">Project #{index + 1}</h4>
                            <button 
                                onClick={() => handleRemove(index)}
                                className="text-red-400 hover:text-red-600 transition-colors p-1"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Project Name"
                                value={proj.name}
                                onChange={(e) => handleChange(index, "name", e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                            />
                            <input
                                type="text"
                                placeholder="Project Type"
                                value={proj.type}
                                onChange={(e) => handleChange(index, "type", e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                            />
                            <textarea
                                value={proj.description}
                                onChange={(e) => handleChange(index, "description", e.target.value)}
                                placeholder="Describe your project..."
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y min-h-[120px] text-sm text-gray-700 leading-relaxed"
                            ></textarea>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectForm;

import React, { useState } from "react";
import { BriefcaseBusiness, Globe, Link, Mail, MapPin, Phone, User } from "lucide-react";
import api from "../configs/api";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const PersonalInfoForm = ({
    data,
    onChange,
    removeBackground,
    setRemoveBackground,
}) => {
    const { token } = useSelector((state) => state.auth);
    const [uploading, setUploading] = useState(false);

    // Helper to update any field in the data object
    const handleChange = async (field, value) => {
        console.log(`handleChange called for field: ${field}`, value);
        
        // Detect if it's a file upload (File or Blob)
        const isFile = value && (value instanceof File || (value.name && value.size));

        if (field === "image" && isFile) {
            try {
                console.log("Starting image upload...");
                setUploading(true);
                const formData = new FormData();
                formData.append("image", value);

                const response = await api.post("/api/resume/upload-image", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: token,
                    },
                });

                console.log("Upload response:", response.data);
                onChange({ ...(data || {}), image: response.data.url });
                toast.success("Image uploaded successfully!");
            } catch (error) {
                console.error("Error uploading image:", error);
                if (error.response) {
                    console.error("Server response:", error.response.data);
                }
                toast.error("Failed to upload image");
            } finally {
                setUploading(false);
            }
            return;
        }
        onChange({ ...(data || {}), [field]: value });
    }

    const fields = [
        { key: 'full_name', label: 'Full Name', type: 'text', icon: User, required: true },
        { key: 'email', label: 'Email', type: 'email', icon: Mail, required: true },
        { key: 'phone', label: 'Phone', type: 'tel', icon: Phone },
        { key: 'linkedin', label: 'LinkedIn', type: 'url', icon: Link },
        { key: 'location', label: 'Location', type: 'text', icon: MapPin },
        { key: 'profession', label: 'Profession', type: 'text', icon: BriefcaseBusiness },
        { key: 'website', label: 'Website', type: 'url', icon: Globe },
    ];

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900">
                Personal Information
            </h3>
            <p className="text-sm text-gray-600">Get started with the Personal Information</p>

            <div className='flex items-center gap-2'>
                <label>
                    {uploading ? (
                        <div className='w-16 h-16 rounded-full flex items-center justify-center mt-5 border border-dashed border-slate-300'>
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : data?.image ? (
                        <img
                            src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)}
                            alt="user-image"
                            className='w-16 h-16 rounded-full object-cover mt-5 ring ring-slate-300 hover:opacity-80'
                        />
                    ) : (
                        <div className='inline-flex items-center gap-2 mt-5 text-slate-600 hover:text-slate-700 cursor-pointer'>
                            <User className='size-10 p-2.5 border rounded-full' />
                            upload user image
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/jpeg, image/png"
                        className="hidden"
                        onChange={(e) => handleChange("image", e.target.files[0])}
                    />
                </label>
                {data?.image && (
                    <div className="flex flex-col gap-1 pl-4 text-sm">
                        <p className="font-medium text-gray-700">Image Options</p>
                        <label className="relative inline-flex items-center cursor-pointer text-gray-90 gap-3">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={removeBackground}
                                onChange={() => setRemoveBackground(prev => !prev)}
                            />
                            <div className='w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200'> </div>
                            <span className='dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4'></span>
                            <p className="text-sm text-gray-600">Remove Background</p>
                        </label>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {fields.map((field) => {
                    const Icon = field.icon;
                    return (
                        <div key={field.key} className="space-y-1">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                <Icon className='size-4' />
                                {field.label}
                                {field.required && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                type={field.type}
                                value={data?.[field.key] || ""}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                required={field.required}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PersonalInfoForm;

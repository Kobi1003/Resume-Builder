import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import api from "../configs/api";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const ProfessionalSummaryForm = ({ data, onChange }) => {
    const [enhancing, setEnhancing] = useState(false);
    const { token } = useSelector((state) => state.auth);

    const handleEnhance = async () => {
        if (!data || data.trim().length < 10) {
            toast.error("Please enter some text first");
            return;
        }

        try {
            setEnhancing(true);
            const response = await api.post("/api/ai/enhance-pro-sum", 
                { text: data },
                { headers: { Authorization: token } }
            );
            if (response.data.enhancedText) {
                onChange(response.data.enhancedText);
                toast.success("Summary enhanced!");
            }
        } catch (error) {
            console.error("Enhance error:", error);
            toast.error(error.response?.data?.message || "Failed to enhance summary");
        } finally {
            setEnhancing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className='text-lg font-semibold text-gray-800'>Professional Summary</h3>
                    <p className="text-sm text-gray-500">Add summary for your resume here</p>
                </div>
                <button 
                    onClick={handleEnhance}
                    disabled={enhancing}
                    className="flex items-center gap-1.5 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors border border-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {enhancing ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <Sparkles size={14} />
                    )}
                    {enhancing ? "Enhancing..." : "AI Enhance"}
                </button>
            </div>

            <div>
                <textarea
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y min-h-[180px] text-gray-700 leading-relaxed shadow-sm"
                    placeholder="e.g. Highly analytical Data Analyst with 6 years of experience transforming complex datasets into actionable insights using SQL, Python, and advanced visualization tools."
                    value={data || ""}
                    onChange={(e) => onChange(e.target.value)}
                ></textarea>
                <p className="text-xs text-gray-500 mt-3 text-center">
                    Tip: Keep it concise (3-4 sentences) and focus on your most relevant achievements and skills.
                </p>
            </div>
        </div>
    );
};

export default ProfessionalSummaryForm;
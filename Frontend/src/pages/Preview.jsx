import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ResumePreview from "../components/ResumePreview";
import api from "../configs/api";

const Preview = () => {
  const { resumeId } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        // Add a timestamp to bypass any browser caching
        const { data } = await api.get(`/api/resume/public/${resumeId}?t=${Date.now()}`);
        const resume = data.resume;
        if (!resume) {
          setStatus("notfound");
          return;
        }
        if (!resume.public) {
          setStatus("private");
          return;
        }
        setResumeData(resume);
        setStatus("ready");
      } catch (error) {
        console.error("Error fetching public resume:", error);
        setStatus("notfound");
      }
    };
    if (resumeId) fetchResume();
  }, [resumeId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700">
        <div className="text-center">
          <p className="text-xl font-semibold">Loading resume preview...</p>
        </div>
      </div>
    );
  }

  if (status === "notfound") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700 px-4">
        <div className="max-w-xl rounded-2xl bg-white shadow-sm border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-semibold mb-4">Resume not found</h1>
          <p className="text-sm text-slate-500 mb-6">
            The resume you are trying to view does not exist or the link is
            invalid.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  if (status === "private") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700 px-4">
        <div className="max-w-xl rounded-2xl bg-white shadow-sm border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-semibold mb-4">Resume is private</h1>
          <p className="text-sm text-slate-500 mb-6">
            This resume has been marked as private and cannot be viewed
            publicly.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Resume Preview
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Share this URL with others to let them view your resume.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            Back to Home
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <ResumePreview
            data={resumeData}
            template={resumeData.template}
            accentColor={resumeData.accent_color}
          />
        </div>
      </div>
    </div>
  );
};

export default Preview;

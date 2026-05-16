import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderIcon,
  GraduationCap,
  Sparkles,
  User,
  Share2,
  Globe,
  Lock,
  Download,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import ResumePreview from "../components/ResumePreview";
import PersonalInfoForm from "../components/PersonalInfoForm";
import TemplatesSelector from "../components/TemplatesSelector";
import ColorPicker from "../components/ColorPicker";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsForm";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [resumeData, setResumeData] = useState({
    _id: resumeId || "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#9333ea",
    public: false,
  });

  const [loading, setLoading] = useState(true);
  const [resumeNotFound, setResumeNotFound] = useState(false);

  // Fetch Resume Data from Backend
  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/resume/get/${resumeId}`, {
          headers: { Authorization: token },
        });
        setResumeData(data.resume);
        setResumeNotFound(false);
      } catch (error) {
        console.error("Error fetching resume:", error);
        setResumeNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (resumeId && token) {
      fetchResume();
    }
  }, [resumeId, token]);

  const saveResume = async (nextResume) => {
    try {
      const { data } = await api.put(`/api/resume/update/${resumeId}`, {
        resumeId: resumeId,
        resumeData: JSON.stringify(nextResume),
        removeBackground: removeBackground
      }, {
        headers: { Authorization: token },
      });
      setResumeData(data.resume);
      toast.success("Resume saved to cloud!");
    } catch (error) {
      console.error("Error saving resume:", error);
      toast.error("Failed to save resume");
    }
  };

  const updateResumeData = (updater) => {
    const nextResume =
      typeof updater === "function" ? updater(resumeData) : updater;
    setResumeData(nextResume);
  };

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: " Personal Info", icon: User },
    { id: "summary", name: " Summary", icon: FileText },
    { id: "experience", name: " Experience", icon: Briefcase },
    { id: "education", name: " Education", icon: GraduationCap },
    { id: "projects", name: " Projects", icon: FolderIcon },
    { id: "skills", name: " Skills", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (resumeNotFound) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
        <div className="max-w-xl w-full rounded-3xl bg-white p-8 shadow-sm border border-gray-200 text-center">
          <h1 className="text-2xl font-semibold text-slate-900 mb-3">
            Resume not found
          </h1>
          <p className="text-slate-600 mb-6">
            We couldn’t find that resume. Please confirm the share link or open
            a resume from the dashboard.
          </p>
          <Link
            to="/app/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to={"/app/dashboard"}
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all duration-200"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Panel - Form */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1 relative z-10">
              <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                <hr className="absolute top-0 left-0 right-0 border-2 border-indigo-600" />
                <hr
                  className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-2000"
                  style={{
                    width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
                  }}
                />
              </div>

              {/* Section Navigation */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1 relative z-20">
                <div className="flex items-center gap-2">
                  <TemplatesSelector
                    selectedTemplate={resumeData.template}
                    onChange={(template) =>
                      setResumeData((prev) => ({ ...prev, template }))
                    }
                  />
                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={(color) =>
                      setResumeData((prev) => ({
                        ...prev,
                        accent_color: color,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center">
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() =>
                        setActiveSectionIndex((prevIndex) =>
                          Math.max(prevIndex - 1, 0),
                        )
                      }
                      className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                      disabled={activeSectionIndex === 0}
                    >
                      <ChevronLeft className="size-4" /> Previous
                    </button>
                  )}
                  {activeSectionIndex !== sections.length - 1 && (
                    <button
                      onClick={() =>
                        setActiveSectionIndex((prevIndex) =>
                          Math.min(prevIndex + 1, sections.length - 1),
                        )
                      }
                      className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 ? "cursor-not-allowed opacity-50" : ""}`}
                      disabled={activeSectionIndex === sections.length - 1}
                    >
                      Next <ChevronRight className="size-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {activeSection.id === "personal" && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) =>
                      updateResumeData((prev) => ({
                        ...prev,
                        personal_info: data,
                      }))
                    }
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}

                {activeSection.id === "summary" && (
                  <ProfessionalSummaryForm
                    data={resumeData.professional_summary}
                    onChange={(data) =>
                      updateResumeData((prev) => ({
                        ...prev,
                        professional_summary: data,
                      }))
                    }
                  />
                )}

                {activeSection.id === "experience" && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={(data) =>
                      updateResumeData((prev) => ({
                        ...prev,
                        experience: data,
                      }))
                    }
                  />
                )}

                {activeSection.id === "education" && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(data) =>
                      updateResumeData((prev) => ({ ...prev, education: data }))
                    }
                  />
                )}

                {activeSection.id === "projects" && (
                  <ProjectForm
                    data={resumeData.project}
                    onChange={(data) =>
                      updateResumeData((prev) => ({ ...prev, project: data }))
                    }
                  />
                )}

                {activeSection.id === "skills" && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(data) =>
                      updateResumeData((prev) => ({ ...prev, skills: data }))
                    }
                  />
                )}

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => saveResume(resumeData)}
                    className="bg-emerald-200 hover:bg-emerald-300 text-emerald-800 font-medium px-6 py-2.5 rounded-lg transition-colors shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="flex justify-end items-center gap-3 mb-4">
              {resumeData.public && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!resumeId) {
                      alert(
                        "Unable to create share link: resume ID is missing.",
                      );
                      return;
                    }

                    const shareUrl =
                      window.location.origin + "/view/" + resumeId;
                    const shareData = {
                      title: resumeData.personal_info?.full_name
                        ? `${resumeData.personal_info.full_name}'s Resume`
                        : "My Resume",
                      text: "Check out my professional resume!",
                      url: shareUrl,
                    };

                    let copied = false;
                    try {
                      await navigator.clipboard.writeText(shareUrl);
                      copied = true;
                    } catch (err) {
                      console.warn("Clipboard unavailable:", err);
                    }

                    if (
                      navigator.share &&
                      navigator.canShare &&
                      navigator.canShare(shareData)
                    ) {
                      try {
                        await navigator.share(shareData);
                        return;
                      } catch (err) {
                        console.error("Share failed:", err);
                      }
                    }

                    if (copied) {
                      alert(`Share link copied to clipboard:\n${shareUrl}`);
                    } else {
                      window.prompt("Copy this share link:", shareUrl);
                    }
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  <Share2 size={16} />
                  Share
                </button>
              )}

              <button
                onClick={async () => {
                  const nextPublic = !resumeData.public;
                  const nextResume = { ...resumeData, public: nextPublic };
                  setResumeData(nextResume);
                  // Auto-save the public status
                  await saveResume(nextResume);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ${resumeData.public
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {resumeData.public ? <Globe size={16} /> : <Lock size={16} />}
                {resumeData.public ? "Public" : "Private"}
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <Download size={16} />
                Download
              </button>
            </div>
            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;

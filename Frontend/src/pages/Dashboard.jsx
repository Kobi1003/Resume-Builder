import {
  PlusIcon,
  TrashIcon,
  UploadCloudIcon,
  FilePenLineIcon,
  XIcon,
  UploadCloud,
  LoaderCircle,
  Edit3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";
import React from "react";
import { dummyResumeData } from "../assets/assets";
import pdfToText from 'react-pdftotext';

const getStoredResumes = () => {
  const stored = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("resume_")) {
      try {
        stored.push(JSON.parse(localStorage.getItem(key)));
      } catch (error) {
        console.warn("Failed to parse stored resume:", key, error);
      }
    }
  }
  return stored;
};

const generateResumeId = () => {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `resume-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const Dashboard = () => {

  const { user, token } = useSelector(state => state.auth)

  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];
  const [allResumes, setAllResumes] = React.useState([]);
  const [isSampleMode, setIsSampleMode] = React.useState(false);

  const [showCreateResume, setShowCreateResume] = React.useState(false);
  const [showUploadResume, setShowUploadResume] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [resume, setResume] = React.useState(null);
  const [editResumeId, setEditResumeId] = React.useState(null);
  const [isLoading, setisLoading] = React.useState(false)

  const navigate = useNavigate();

  const createResume = async (event) => {
    try {
      event.preventDefault();
      const { data } = await api.post('/api/resume/create', { title }, {
        headers: {
          Authorization: token
        }
      })
      setAllResumes([...allResumes, data.resume])
      setTitle("")
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  };

  const loadResumes = async () => {
    try {
      const { data } = await api.get('/api/users/resumes', {
        headers: {
          Authorization: token
        }
      })
      if (data.resumes.length === 0) {
        setAllResumes(dummyResumeData);
        setIsSampleMode(true);
      } else {
        setAllResumes(data.resumes);
        setIsSampleMode(false);
      }
    }
    catch (error) {
      toast.error(error.response?.data?.message || "Failed to load resumes")
    }
  }

  const deleteResume = async (resumeId) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      try {
        await api.delete(`/api/resume/${resumeId}`, {
          headers: { Authorization: token }
        });
        setAllResumes((prev) => prev.filter((resume) => resume._id !== resumeId));
        toast.success("Resume deleted successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete resume");
      }
    }
  };

  const uploadResume = async (event) => {
    event.preventDefault();
    setisLoading(true)
    try {
      const resumeText = await pdfToText(resume)
      const { data } = await api.post('/api/ai/upload-resume', { title, resumeText }, {
        headers: {
          Authorization: token
        }
      })
      setTitle('')
      setResume(null)
      setShowUploadResume(false)
      setisLoading(false)
      navigate(`/app/builder/${data.resume._id}`)
      toast.success(data.message)
    }
    catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload resume")
    }
    setisLoading(false)
  }

  const editTitle = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.put(`/api/resume/update/${editResumeId}`, {
        resumeData: { title }
      }, {
        headers: { Authorization: token }
      });
      setAllResumes(prev => prev.map(r => r._id === editResumeId ? { ...r, title: data.resume.title } : r));
      setEditResumeId(null);
      setTitle("");
      toast.success("Title updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update title");
    }
  };

  React.useEffect(() => {
    if (token) {
      loadResumes()
    }
  }, [token])

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p
          className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700
                  bg-clip-text text-transparent sm:hidden"
        >
          Welcome, {user?.name || "Guest"}
        </p>

        <div className="flex gap-4">
          {/* Create Resume Button */}
          <button
            onClick={() => setShowCreateResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer ml-35"
          >
            <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">
              Create Resume
            </p>
          </button>

          {/* Upload Existing Button */}
          <button
            onClick={() => setShowUploadResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <UploadCloudIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-purple-600 transition-all duration-300">
              Upload Existing
            </p>
          </button>
        </div>

        <hr className="border-slate-300 ml-35 my-6 sm:w-[305px]" />

        <div className="grid grid-cols-2 sm:flex gap-4 flex-wrap ml-35">
          {allResumes.map((resume, index) => {
            const baseColor = colors[index % colors.length];
            return (
              <button
                key={resume._id || index}
                onClick={() => {
                  if (isSampleMode) {
                    toast("This is a sample resume. Create your own to start editing!", { icon: "ℹ️" });
                    return;
                  }
                  navigate(`/app/builder/${resume._id}`);
                }}
                className={`relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer ${isSampleMode ? "opacity-90" : ""}`}
                style={{
                  background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                  borderColor: baseColor + "40",
                }}
              >
                {isSampleMode && (
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-bold rounded uppercase tracking-wider">
                    Sample
                  </span>
                )}
                <FilePenLineIcon
                  className="size-7 group-hover:scale-105 transition-all "
                  style={{ color: baseColor }}
                />
                <p
                  className="text-sm group-hover:scale-105 transition-all px-2 text-center font-medium"
                  style={{ color: baseColor }}
                >
                  {resume.title}
                </p>
                <p
                  className="absolute bottom-2 text-[10px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center"
                  style={{ color: baseColor + "BB" }}
                >
                  {isSampleMode ? "Example Template" : `Updated ${new Date(resume.updatedAt).toLocaleDateString()}`}
                </p>

                {!isSampleMode && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-1 right-1 group-hover:flex items-center hidden"
                  >
                    <Edit3
                      onClick={() => {
                        setEditResumeId(resume._id);
                        setTitle(resume.title);
                      }}
                      title="Rename"
                      className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                    />
                    <TrashIcon
                      onClick={() => {
                        deleteResume(resume._id);
                      }}
                      title="Delete"
                      className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {showCreateResume && (
          <form
            onSubmit={createResume}
            onClick={() => setShowCreateResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Create a Resume</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600"
                required
              />

              <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Create Resume
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowCreateResume(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}

        {showUploadResume && (
          <form
            onSubmit={uploadResume}
            onClick={() => setShowUploadResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Upload Existing Resume</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600"
                required
              />

              <div>
                <label
                  htmlFor="resume-input"
                  className="block text-sm text-slate-700"
                >
                  Select Resume File
                  <div
                    className="flex flex-col items-center justify-center gap-2 border group text-slate-400
                  border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-500 
                  hover: text-green-700 cursor-pointer transition-colors"
                  >
                    {resume ? (
                      <p className="text-green-700"> {resume.name}</p>
                    ) : (
                      <>
                        <UploadCloud className="size-10" />
                        <p>Click to upload</p>
                      </>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id="resume-input"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </div>

              <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                {isLoading ?
                  <LoaderCircle className="animate-spin size-4 mx-auto" /> :
                  <p>Upload Resume</p>
                }
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowUploadResume(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}

        {editResumeId && (
          <form
            onSubmit={editTitle}
            onClick={() => setEditResumeId("")}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600"
                required
              />

              <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Update Title
              </button>

              <button
                type="button"
                onClick={() => navigate(`/app/builder/${editResumeId}`)}
                className="w-full py-2 mt-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <FilePenLineIcon className="size-4" />
                Edit Resume Content
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setEditResumeId("");
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

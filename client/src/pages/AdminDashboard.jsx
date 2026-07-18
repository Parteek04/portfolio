import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import { usePortfolioData } from "../contexts/PortfolioDataContext";
import {
  projectsApi,
  skillsApi,
  educationApi,
  experienceApi,
  achievementsApi,
  settingsApi,
  contactApi,
  uploadApi,
  getFallbackMode
} from "../services/api";
import {
  FaBriefcase,
  FaGraduationCap,
  FaCode,
  FaTrophy,
  FaCog,
  FaEnvelope,
  FaTrash,
  FaPlus,
  FaEdit,
  FaSignOutAlt,
  FaCheck,
  FaUpload,
  FaExclamationCircle
} from "react-icons/fa";

const AdminDashboard = () => {
  const { isAdmin, logoutAdmin, loading: authLoading } = useAdminAuth();
  const { refreshData } = usePortfolioData();
  const navigate = useNavigate();
  
  // States
  const [activeTab, setActiveTab] = useState("messages");
  const [messages, setMessages] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [educationList, setEducationList] = useState([]);
  const [experienceList, setExperienceList] = useState([]);
  const [achievementsList, setAchievementsList] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  
  // Dashboard Action States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Editor Modals
  const [editItem, setEditItem] = useState(null); // stores item being edited
  const [editType, setEditType] = useState(null); // 'projects', 'skills', etc.
  const [isNew, setIsNew] = useState(false); // true if creating new item

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, authLoading, navigate]);

  // Fetch all admin items on load/refresh
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [msgRes, projRes, skillRes, eduRes, expRes, achRes, setRes] = await Promise.all([
        contactApi.getMessages(),
        projectsApi.getAll(),
        skillsApi.getAll(),
        educationApi.getAll(),
        experienceApi.getAll(),
        achievementsApi.getAll(),
        settingsApi.get()
      ]);

      if (msgRes.success) setMessages(msgRes.messages || []);
      if (projRes.success) setProjectsList(projRes.data || []);
      if (skillRes.success) {
        // If DB has nested skills structure or flat, we normalize it to a flat list for admin editing
        const skillsData = skillRes.data || [];
        if (skillsData.length > 0 && skillsData[0].skills) {
          // nested structure
          const flat = skillsData.flatMap(c => c.skills.map(s => ({ ...s, category: c.category })));
          setSkillsList(flat);
        } else {
          setSkillsList(skillsData);
        }
      }
      if (eduRes.success) setEducationList(eduRes.data || []);
      if (expRes.success) setExperienceList(expRes.data || []);
      if (achRes.success) setAchievementsList(achRes.data || []);
      if (setRes.success) setSiteSettings(setRes.data || null);
    } catch (err) {
      setError("Failed to retrieve admin records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/");
  };

  // Message Operations
  const handleMarkMessageRead = async (id) => {
    try {
      const res = await contactApi.markAsRead(id);
      if (res.success) {
        setMessages(messages.map(m => m._id === id ? { ...m, isRead: true } : m));
        setSuccess("Message flagged as read!");
      }
    } catch (err) {
      setError("Failed to update message status.");
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await contactApi.deleteMessage(id);
      if (res.success) {
        setMessages(messages.filter(m => m._id !== id));
        setSuccess("Message deleted successfully.");
      }
    } catch (err) {
      setError("Failed to delete message.");
    }
  };

  // Resource Operations
  const handleEditClick = (type, item, isCreate = false) => {
    setIsNew(isCreate);
    setEditType(type);
    
    if (isCreate) {
      // Default structure setup
      const templates = {
        projects: { title: "", subtitle: "", description: "", longDescription: "", image: "", techStack: "", features: "", github: "", demo: "", caseStudy: { problem: "", solution: "", challenges: "", results: "" }, futureImprovements: "" },
        skills: { name: "", level: 80, icon: "SiCplusplus", color: "#6366f1", category: "Programming Languages" },
        education: { institution: "", location: "", degree: "", duration: "", score: "", description: "", courses: "" },
        experience: { role: "", company: "", location: "", type: "Internship", duration: "", description: "", techStack: "" },
        achievements: { title: "", organization: "", date: "", category: "Coding", description: "", badge: "" }
      };
      setEditItem(templates[type]);
    } else {
      // Create a copy of the item to avoid modifying local state directly
      let itemCopy = { ...item };
      // Convert arrays back to comma-separated strings for input boxes
      if (type === "projects") {
        itemCopy.techStack = itemCopy.techStack?.join(", ") || "";
        itemCopy.features = itemCopy.features?.join(", ") || "";
        itemCopy.futureImprovements = itemCopy.futureImprovements?.join(", ") || "";
        itemCopy.caseStudy = {
          problem: item.caseStudy?.problem || "",
          solution: item.caseStudy?.solution || "",
          challenges: item.caseStudy?.challenges?.join(", ") || "",
          results: item.caseStudy?.results || ""
        };
      } else if (type === "education") {
        itemCopy.courses = itemCopy.courses?.join(", ") || "";
      } else if (type === "experience") {
        itemCopy.description = itemCopy.description?.join("\n") || "";
        itemCopy.techStack = itemCopy.techStack?.join(", ") || "";
      }
      setEditItem(itemCopy);
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      let submitData = { ...editItem };

      // Parse comma/newline lists back into arrays
      if (editType === "projects") {
        submitData.techStack = typeof submitData.techStack === "string" ? submitData.techStack.split(",").map(x => x.trim()).filter(Boolean) : submitData.techStack;
        submitData.features = typeof submitData.features === "string" ? submitData.features.split(",").map(x => x.trim()).filter(Boolean) : submitData.features;
        submitData.futureImprovements = typeof submitData.futureImprovements === "string" ? submitData.futureImprovements.split(",").map(x => x.trim()).filter(Boolean) : submitData.futureImprovements;
        submitData.caseStudy = {
          problem: editItem.caseStudy?.problem || "",
          solution: editItem.caseStudy?.solution || "",
          challenges: typeof editItem.caseStudy?.challenges === "string" ? editItem.caseStudy.challenges.split(",").map(x => x.trim()).filter(Boolean) : (editItem.caseStudy?.challenges || []),
          results: editItem.caseStudy?.results || ""
        };
      } else if (editType === "education") {
        submitData.courses = typeof submitData.courses === "string" ? submitData.courses.split(",").map(x => x.trim()).filter(Boolean) : submitData.courses;
      } else if (editType === "experience") {
        submitData.description = typeof submitData.description === "string" ? submitData.description.split("\n").map(x => x.trim()).filter(Boolean) : submitData.description;
        submitData.techStack = typeof submitData.techStack === "string" ? submitData.techStack.split(",").map(x => x.trim()).filter(Boolean) : submitData.techStack;
      }

      let res;
      const apiEndpoints = {
        projects: projectsApi,
        skills: skillsApi,
        education: educationApi,
        experience: experienceApi,
        achievements: achievementsApi
      };

      const apiInstance = apiEndpoints[editType];

      if (isNew) {
        res = await apiInstance.create(submitData);
      } else {
        res = await apiInstance.update(editItem._id || editItem.id, submitData);
      }

      if (res.success) {
        setSuccess(`${editType.charAt(0).toUpperCase() + editType.slice(1, -1)} saved successfully!`);
        setEditItem(null);
        setEditType(null);
        await fetchAdminData();
        await refreshData();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save record details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const apiEndpoints = {
        projects: projectsApi,
        skills: skillsApi,
        education: educationApi,
        experience: experienceApi,
        achievements: achievementsApi
      };
      
      const res = await apiEndpoints[type].delete(id);
      if (res.success) {
        setSuccess("Record removed successfully.");
        await fetchAdminData();
        await refreshData();
      }
    } catch (err) {
      setError("Failed to delete record.");
    } finally {
      setLoading(false);
    }
  };

  // Image Upload handler for projects/avatar
  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const res = await uploadApi.uploadFile(file);
      if (res.success) {
        if (field === "settings_ogImage") {
          setSiteSettings(prev => ({
            ...prev,
            seo: { ...prev.seo, ogImage: res.url }
          }));
        } else if (field === "project_image") {
          setEditItem(prev => ({ ...prev, image: res.url }));
        }
        setSuccess("File uploaded successfully!");
      }
    } catch (err) {
      setError("File upload failed.");
    } finally {
      setLoading(false);
    }
  };

  // Settings Save Handler
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      const res = await settingsApi.update(siteSettings);
      if (res.success) {
        setSuccess("Settings updated successfully!");
        await fetchAdminData();
        await refreshData();
      }
    } catch (err) {
      setError("Failed to update general settings.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Dashboard Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 pb-6 border-b border-slate-900">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-3xl text-white">Dashboard Portal</h1>
              {getFallbackMode() && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                  <FaExclamationCircle size={10} /> Local offline mode
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">Manage database records and settings config.</p>
          </div>
          <button
            onClick={handleLogout}
            className="self-start flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:text-white hover:bg-red-950/20 font-semibold text-xs sm:text-sm transition-all"
          >
            <FaSignOutAlt size={12} />
            Sign Out
          </button>
        </div>

        {/* Global Notifications */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/20 border border-red-500/35 text-red-400 text-sm font-semibold flex items-center gap-2 animate-fadeIn">
            <FaExclamationCircle /> {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-950/20 border border-green-500/35 text-green-400 text-sm font-semibold flex items-center gap-2 animate-fadeIn">
            <FaCheck /> {success}
          </div>
        )}

        {/* Outer body Grid tab navigate */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 bg-slate-950 border border-slate-900 rounded-2xl p-3 shrink-0">
            {[
              { id: "messages", label: "Messages", icon: <FaEnvelope /> },
              { id: "projects", label: "Projects", icon: <FaCode /> },
              { id: "skills", label: "Skills", icon: <FaCode /> },
              { id: "education", label: "Education", icon: <FaGraduationCap /> },
              { id: "experience", label: "Experience", icon: <FaBriefcase /> },
              { id: "achievements", label: "Achievements", icon: <FaTrophy /> },
              { id: "settings", label: "Settings", icon: <FaCog /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setEditItem(null);
                  setEditType(null);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all text-left whitespace-nowrap lg:whitespace-normal ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.id === "messages" && messages.filter(m => !m.isRead).length > 0 && (
                  <span className="ml-auto px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-bold font-mono">
                    {messages.filter(m => !m.isRead).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Editor view / Tab details container */}
          <div className="lg:col-span-9 glass-card rounded-2xl p-6 sm:p-8 border border-white/5 shadow-xl min-h-[400px]">
            {editItem ? (
              // Active editor Form
              <form onSubmit={handleSaveItem} className="flex flex-col gap-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-900">
                  <h2 className="font-display font-bold text-lg text-white">
                    {isNew ? "Create New" : "Edit Details"} {editType.slice(0, -1)}
                  </h2>
                  <button
                    type="button"
                    onClick={() => { setEditItem(null); setEditType(null); }}
                    className="text-xs text-slate-500 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                {/* Form fields based on editType */}
                {editType === "projects" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">Project Title</label>
                      <input
                        type="text"
                        value={editItem.title}
                        onChange={e => setEditItem({ ...editItem, title: e.target.value })}
                        required
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">Subtitle</label>
                      <input
                        type="text"
                        value={editItem.subtitle}
                        onChange={e => setEditItem({ ...editItem, subtitle: e.target.value })}
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-400">Brief Description</label>
                      <input
                        type="text"
                        value={editItem.description}
                        onChange={e => setEditItem({ ...editItem, description: e.target.value })}
                        required
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-400">Long Overview (Markdown / Case Study Intro)</label>
                      <textarea
                        value={editItem.longDescription}
                        onChange={e => setEditItem({ ...editItem, longDescription: e.target.value })}
                        rows={4}
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none resize-none"
                      ></textarea>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">Tech Stack (comma-separated)</label>
                      <input
                        type="text"
                        value={editItem.techStack}
                        onChange={e => setEditItem({ ...editItem, techStack: e.target.value })}
                        placeholder="React.js, Node.js, Express.js"
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">Image Cover Path / URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editItem.image}
                          onChange={e => setEditItem({ ...editItem, image: e.target.value })}
                          className="flex-1 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                        />
                        <label className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 hover:bg-slate-800 text-xs font-bold flex items-center justify-center cursor-pointer">
                          <FaUpload />
                          <input
                            type="file"
                            onChange={e => handleFileUpload(e, "project_image")}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">GitHub Link</label>
                      <input
                        type="text"
                        value={editItem.github}
                        onChange={e => setEditItem({ ...editItem, github: e.target.value })}
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">Demo Link</label>
                      <input
                        type="text"
                        value={editItem.demo}
                        onChange={e => setEditItem({ ...editItem, demo: e.target.value })}
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      />
                    </div>

                    {/* Case Study Details */}
                    <div className="sm:col-span-2 p-4 rounded-xl border border-slate-900 bg-slate-950/40 flex flex-col gap-4 mt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Case Study Details</h4>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500">The Problem</label>
                        <textarea
                          value={editItem.caseStudy?.problem}
                          onChange={e => setEditItem({ ...editItem, caseStudy: { ...editItem.caseStudy, problem: e.target.value } })}
                          rows={2}
                          className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500">The Solution</label>
                        <textarea
                          value={editItem.caseStudy?.solution}
                          onChange={e => setEditItem({ ...editItem, caseStudy: { ...editItem.caseStudy, solution: e.target.value } })}
                          rows={2}
                          className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500">Challenges (comma-separated)</label>
                        <input
                          type="text"
                          value={editItem.caseStudy?.challenges}
                          onChange={e => setEditItem({ ...editItem, caseStudy: { ...editItem.caseStudy, challenges: e.target.value } })}
                          className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500">Outcome Results</label>
                        <textarea
                          value={editItem.caseStudy?.results}
                          onChange={e => setEditItem({ ...editItem, caseStudy: { ...editItem.caseStudy, results: e.target.value } })}
                          rows={2}
                          className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {editType === "skills" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">Skill Name</label>
                      <input
                        type="text"
                        value={editItem.name}
                        onChange={e => setEditItem({ ...editItem, name: e.target.value })}
                        required
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">Category</label>
                      <select
                        value={editItem.category}
                        onChange={e => setEditItem({ ...editItem, category: e.target.value })}
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      >
                        <option>Programming Languages</option>
                        <option>Web Development</option>
                        <option>Data Science & Machine Learning</option>
                        <option>Databases</option>
                        <option>Tools & Platforms</option>
                        <option>Soft Skills</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">Proficiency Level (0-100)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editItem.level}
                        onChange={e => setEditItem({ ...editItem, level: parseInt(e.target.value) })}
                        required
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">React Icon component Name</label>
                      <input
                        type="text"
                        value={editItem.icon}
                        onChange={e => setEditItem({ ...editItem, icon: e.target.value })}
                        placeholder="SiCplusplus"
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">Glow Color Code (HEX)</label>
                      <input
                        type="text"
                        value={editItem.color}
                        onChange={e => setEditItem({ ...editItem, color: e.target.value })}
                        placeholder="#6366f1"
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {editType === "education" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">Institution School / University</label>
                      <input
                        type="text"
                        value={editItem.institution}
                        onChange={e => setEditItem({ ...editItem, institution: e.target.value })}
                        required
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">Location City</label>
                      <input
                        type="text"
                        value={editItem.location}
                        onChange={e => setEditItem({ ...editItem, location: e.target.value })}
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">Degree / Standard</label>
                      <input
                        type="text"
                        value={editItem.degree}
                        onChange={e => setEditItem({ ...editItem, degree: e.target.value })}
                        required
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">Duration Range</label>
                      <input
                        type="text"
                        value={editItem.duration}
                        onChange={e => setEditItem({ ...editItem, duration: e.target.value })}
                        required
                        placeholder="August 2023 - Present"
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">Academic Score (CGPA / %)</label>
                      <input
                        type="text"
                        value={editItem.score}
                        onChange={e => setEditItem({ ...editItem, score: e.target.value })}
                        placeholder="8.1/10.0"
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-400">Description details</label>
                      <textarea
                        value={editItem.description}
                        onChange={e => setEditItem({ ...editItem, description: e.target.value })}
                        rows={3}
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none resize-none"
                      ></textarea>
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-400">Key Courses (comma-separated)</label>
                      <input
                        type="text"
                        value={editItem.courses}
                        onChange={e => setEditItem({ ...editItem, courses: e.target.value })}
                        placeholder="Algorithms, Database Systems"
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {editType === "experience" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">Role / Position</label>
                      <input
                        type="text"
                        value={editItem.role}
                        onChange={e => setEditItem({ ...editItem, role: e.target.value })}
                        required
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">Company / Organization</label>
                      <input
                        type="text"
                        value={editItem.company}
                        onChange={e => setEditItem({ ...editItem, company: e.target.value })}
                        required
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">Experience Type</label>
                      <select
                        value={editItem.type}
                        onChange={e => setEditItem({ ...editItem, type: e.target.value })}
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      >
                        <option>Internship</option>
                        <option>Training</option>
                        <option>Volunteer Work</option>
                        <option>Hackathons</option>
                        <option>Freelancing</option>
                        <option>Job</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">Duration Period</label>
                      <input
                        type="text"
                        value={editItem.duration}
                        onChange={e => setEditItem({ ...editItem, duration: e.target.value })}
                        required
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-400">Bullet Points Details (One per line)</label>
                      <textarea
                        value={editItem.description}
                        onChange={e => setEditItem({ ...editItem, description: e.target.value })}
                        rows={4}
                        required
                        placeholder="Contributed to full stack development&#10;Analyzed dataset using pandas"
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none resize-none"
                      ></textarea>
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-400">Tech Stack Used (comma-separated)</label>
                      <input
                        type="text"
                        value={editItem.techStack}
                        onChange={e => setEditItem({ ...editItem, techStack: e.target.value })}
                        placeholder="React.js, Node.js"
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {editType === "achievements" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-400">Achievement Title</label>
                      <input
                        type="text"
                        value={editItem.title}
                        onChange={e => setEditItem({ ...editItem, title: e.target.value })}
                        required
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">Issuing Organization</label>
                      <input
                        type="text"
                        value={editItem.organization}
                        onChange={e => setEditItem({ ...editItem, organization: e.target.value })}
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">Year / Date</label>
                      <input
                        type="text"
                        value={editItem.date}
                        onChange={e => setEditItem({ ...editItem, date: e.target.value })}
                        placeholder="2022"
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">Category type</label>
                      <select
                        value={editItem.category}
                        onChange={e => setEditItem({ ...editItem, category: e.target.value })}
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      >
                        <option>Coding</option>
                        <option>Competition</option>
                        <option>Certificate</option>
                        <option>Badges</option>
                        <option>DSA Progress</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400">Badge Label (e.g. Silver Medal)</label>
                      <input
                        type="text"
                        value={editItem.badge}
                        onChange={e => setEditItem({ ...editItem, badge: e.target.value })}
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-400">Description Summary</label>
                      <textarea
                        value={editItem.description}
                        onChange={e => setEditItem({ ...editItem, description: e.target.value })}
                        rows={3}
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none resize-none"
                      ></textarea>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all"
                >
                  {loading ? "Saving Details..." : "Save Record"}
                </button>
              </form>
            ) : (
              // Standard Tab display
              <div>
                {activeTab === "messages" && (
                  <div>
                    <h2 className="font-display font-bold text-xl text-white mb-6">Contact Messages</h2>
                    {messages.length === 0 ? (
                      <p className="text-slate-500 text-sm">No messages received yet.</p>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {messages.map(msg => (
                          <div
                            key={msg._id || msg.id}
                            className={`p-5 rounded-xl border flex flex-col gap-3 relative overflow-hidden transition-all ${
                              msg.isRead
                                ? "bg-slate-950/20 border-slate-900"
                                : "bg-indigo-950/10 border-indigo-500/20 shadow-md shadow-indigo-950/10"
                            }`}
                          >
                            {!msg.isRead && (
                              <div className="absolute top-0 left-0 w-[3px] h-full bg-indigo-500"></div>
                            )}
                            
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <h3 className="font-semibold text-white text-sm sm:text-base">{msg.subject}</h3>
                                <span className="text-[11px] text-slate-500">
                                  From: <strong className="text-slate-350">{msg.name}</strong> ({msg.email}) • {new Date(msg.createdAt).toLocaleDateString()}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                {!msg.isRead && (
                                  <button
                                    onClick={() => handleMarkMessageRead(msg._id)}
                                    className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-400 hover:text-indigo-400 text-xs"
                                    title="Mark as Read"
                                  >
                                    Mark read
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteMessage(msg._id)}
                                  className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-400 text-xs"
                                  title="Delete Message"
                                >
                                  <FaTrash size={11} />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-900/60 pt-2 font-sans whitespace-pre-line">
                              {msg.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "settings" && siteSettings && (
                  <form onSubmit={handleSaveSettings} className="flex flex-col gap-6">
                    <h2 className="font-display font-bold text-xl text-white pb-4 border-b border-slate-900">
                      SEO & Site Configurations
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">SEO Configuration</h3>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400">Meta Title Tag</label>
                        <input
                          type="text"
                          value={siteSettings.seo?.title}
                          onChange={e => setSiteSettings({ ...siteSettings, seo: { ...siteSettings.seo, title: e.target.value } })}
                          className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400">Og:Image URL / Path</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={siteSettings.seo?.ogImage}
                            onChange={e => setSiteSettings({ ...siteSettings, seo: { ...siteSettings.seo, ogImage: e.target.value } })}
                            className="flex-1 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                          />
                          <label className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 hover:bg-slate-800 text-xs font-bold flex items-center justify-center cursor-pointer">
                            <FaUpload />
                            <input
                              type="file"
                              onChange={e => handleFileUpload(e, "settings_ogImage")}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-400">Meta Description</label>
                        <textarea
                          value={siteSettings.seo?.description}
                          onChange={e => setSiteSettings({ ...siteSettings, seo: { ...siteSettings.seo, description: e.target.value } })}
                          rows={2}
                          className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none resize-none"
                        ></textarea>
                      </div>

                      <div className="flex flex-col gap-1.5 sm:col-span-2 pt-4 border-t border-slate-900">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Contact configurations</h3>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400">Public Contact Email</label>
                        <input
                          type="email"
                          value={siteSettings.contact?.email}
                          onChange={e => setSiteSettings({ ...siteSettings, contact: { ...siteSettings.contact, email: e.target.value } })}
                          className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400">Public Phone Number</label>
                        <input
                          type="text"
                          value={siteSettings.contact?.phone}
                          onChange={e => setSiteSettings({ ...siteSettings, contact: { ...siteSettings.contact, phone: e.target.value } })}
                          className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-400">Public Location Address</label>
                        <input
                          type="text"
                          value={siteSettings.contact?.address}
                          onChange={e => setSiteSettings({ ...siteSettings, contact: { ...siteSettings.contact, address: e.target.value } })}
                          className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-sm focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-4 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all"
                    >
                      {loading ? "Saving config..." : "Save Settings"}
                    </button>
                  </form>
                )}

                {/* Resource list panels (Projects, Skills, etc) */}
                {["projects", "skills", "education", "experience", "achievements"].includes(activeTab) && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-display font-bold text-xl text-white capitalize">{activeTab}</h2>
                      <button
                        onClick={() => handleEditClick(activeTab, null, true)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-md"
                      >
                        <FaPlus size={10} /> Add New
                      </button>
                    </div>

                    {/* Render List items */}
                    <div className="flex flex-col gap-3">
                      {activeTab === "projects" && projectsList.map(item => (
                        <div key={item._id || item.id} className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 flex justify-between items-center gap-4">
                          <div>
                            <h3 className="font-semibold text-white text-sm sm:text-base">{item.title}</h3>
                            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">{item.subtitle}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditClick("projects", item)}
                              className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem("projects", item._id || item.id)}
                              className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {activeTab === "skills" && skillsList.map(item => (
                        <div key={item._id || item.id} className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 flex justify-between items-center gap-4">
                          <div>
                            <h3 className="font-semibold text-white text-sm sm:text-base">{item.name} ({item.level}%)</h3>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.category}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditClick("skills", item)}
                              className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem("skills", item._id || item.id)}
                              className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {activeTab === "education" && educationList.map(item => (
                        <div key={item._id || item.id} className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 flex justify-between items-center gap-4">
                          <div>
                            <h3 className="font-semibold text-white text-sm sm:text-base">{item.institution}</h3>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.degree} • {item.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditClick("education", item)}
                              className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem("education", item._id || item.id)}
                              className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {activeTab === "experience" && experienceList.map(item => (
                        <div key={item._id || item.id} className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 flex justify-between items-center gap-4">
                          <div>
                            <h3 className="font-semibold text-white text-sm sm:text-base">{item.role}</h3>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.company} • {item.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditClick("experience", item)}
                              className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem("experience", item._id || item.id)}
                              className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {activeTab === "achievements" && achievementsList.map(item => (
                        <div key={item._id || item.id} className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 flex justify-between items-center gap-4">
                          <div>
                            <h3 className="font-semibold text-white text-sm sm:text-base">{item.title}</h3>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.organization} • {item.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditClick("achievements", item)}
                              className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem("achievements", item._id || item.id)}
                              className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;

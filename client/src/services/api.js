import axios from "axios";

// Import Local Mock Data Fallbacks
import { profileData } from "../data/profile";
import { educationData } from "../data/education";
import { skillsData } from "../data/skills";
import { projectsData } from "../data/projects";
import { experienceData } from "../data/experience";
import { achievementsData } from "../data/achievements";
import { settingsData } from "../data/settings";
import { socialData } from "../data/social";

// Setup Base Axios Instance
const getApiUrl = () => {
  let envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    envUrl = envUrl.trim();
    if (envUrl !== "/api" && envUrl !== "api") {
      // Ensure it has protocol
      if (!/^https?:\/\//i.test(envUrl)) {
        envUrl = `https://${envUrl}`;
      }
      // Ensure it has /api path
      if (!envUrl.endsWith("/api") && !envUrl.includes("/api/")) {
        envUrl = envUrl.replace(/\/$/, "") + "/api";
      }
      return envUrl;
    }
  }
  
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (
      hostname === "localhost" || 
      hostname === "127.0.0.1" || 
      hostname.startsWith("192.168.") || 
      hostname.startsWith("10.") || 
      hostname.startsWith("172.")
    ) {
      return "/api";
    }
  }

  return "https://exquisite-luck-production-832d.up.railway.app/api";
};

const API_URL = getApiUrl();
const api = axios.create({
  baseURL: API_URL,
  timeout: 4000 // 4 seconds timeout
});

// Helper to recursively normalize relative /uploads/ paths to absolute URLs in production
const normalizeImageUrls = (data) => {
  if (!data) return data;
  
  const backendHost = "https://exquisite-luck-production-832d.up.railway.app";
  const isLocal = typeof window !== "undefined" && (
    window.location.hostname === "localhost" || 
    window.location.hostname === "127.0.0.1" || 
    window.location.hostname.startsWith("192.168.") || 
    window.location.hostname.startsWith("10.") || 
    window.location.hostname.startsWith("172.")
  );

  if (isLocal) return data;

  if (typeof data === "string") {
    if (data.startsWith("/uploads/")) {
      return `${backendHost}${data}`;
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => normalizeImageUrls(item));
  }

  if (typeof data === "object") {
    const newData = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        newData[key] = normalizeImageUrls(data[key]);
      }
    }
    return newData;
  }

  return data;
};

// Response Interceptor to automatically normalize all image URLs
api.interceptors.response.use((response) => {
  if (response.data) {
    response.data = normalizeImageUrls(response.data);
  }
  return response;
});

// Add JWT token to header if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Check if backend is alive
let isFallbackMode = false;
let inMemoryDb = {
  projects: [...projectsData],
  skills: [...skillsData],
  education: [...educationData],
  experience: [...experienceData],
  achievements: [...achievementsData],
  settings: { ...settingsData },
  messages: []
};

export const checkBackendStatus = async () => {
  try {
    const res = await axios.get(`${API_URL}/settings`, { timeout: 2500 });
    if (res.data && res.data.success) {
      isFallbackMode = false;
      console.log("Connected to portfolio backend server! MongoDB mode active.");
      return false;
    } else {
      isFallbackMode = true;
      console.warn("Invalid response from backend server. Activating Offline Local JSON Mode.");
      return true;
    }
  } catch (error) {
    isFallbackMode = true;
    console.warn("Could not connect to backend server. Activating Offline Local JSON Mode.");
  }
  return isFallbackMode;
};

// Perform initial status check
checkBackendStatus();

// Helper to check fallback state
export const getFallbackMode = () => isFallbackMode;

// Generic CRUD Wrapper
const createApiEndpoints = (resource) => {
  return {
    getAll: async () => {
      if (isFallbackMode) {
        return { success: true, data: inMemoryDb[resource] };
      }
      try {
        const response = await api.get(`/${resource}`);
        return response.data;
      } catch (error) {
        console.error(`Fetch ${resource} failed. Falling back to local data.`, error);
        return { success: true, data: inMemoryDb[resource] };
      }
    },
    getById: async (id) => {
      if (isFallbackMode) {
        const item = inMemoryDb[resource].find((x) => x.id === id || x._id === id);
        return { success: true, data: item };
      }
      try {
        const response = await api.get(`/${resource}/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Fetch ${resource} id ${id} failed. Falling back.`, error);
        const item = inMemoryDb[resource].find((x) => x.id === id || x._id === id);
        return { success: true, data: item };
      }
    },
    create: async (data) => {
      if (isFallbackMode) {
        const newItem = { ...data, _id: `mock-${Date.now()}`, createdAt: new Date() };
        if (resource === "skills") {
          // Add to the nested category skill list
          let cat = inMemoryDb.skills.find(c => c.category === data.category);
          if (cat) {
            cat.skills.push(newItem);
          } else {
            inMemoryDb.skills.push({ category: data.category, skills: [newItem] });
          }
        } else {
          inMemoryDb[resource].unshift(newItem);
        }
        return { success: true, data: newItem, message: "Created in-memory (Mock mode)" };
      }
      const response = await api.post(`/${resource}`, data);
      return response.data;
    },
    update: async (id, data) => {
      if (isFallbackMode) {
        if (resource === "skills") {
          // Look for skill in nested structure and update it
          inMemoryDb.skills = inMemoryDb.skills.map(c => ({
            ...c,
            skills: c.skills.map(s => (s._id === id || s.id === id ? { ...s, ...data } : s))
          }));
        } else {
          inMemoryDb[resource] = inMemoryDb[resource].map((item) =>
            item._id === id || item.id === id ? { ...item, ...data } : item
          );
        }
        return { success: true, message: "Updated in-memory (Mock mode)" };
      }
      const response = await api.put(`/${resource}/${id}`, data);
      return response.data;
    },
    delete: async (id) => {
      if (isFallbackMode) {
        if (resource === "skills") {
          // Remove from nested category
          inMemoryDb.skills = inMemoryDb.skills.map(c => ({
            ...c,
            skills: c.skills.filter(s => s._id !== id && s.id !== id)
          })).filter(c => c.skills.length > 0);
        } else {
          inMemoryDb[resource] = inMemoryDb[resource].filter(
            (item) => item._id !== id && item.id !== id
          );
        }
        return { success: true, message: "Deleted in-memory (Mock mode)" };
      }
      const response = await api.delete(`/${resource}/${id}`);
      return response.data;
    }
  };
};

export const projectsApi = createApiEndpoints("projects");
export const skillsApi = createApiEndpoints("skills");
export const educationApi = createApiEndpoints("education");
export const experienceApi = createApiEndpoints("experience");
export const achievementsApi = createApiEndpoints("achievements");

// Settings Endpoints
export const settingsApi = {
  get: async () => {
    if (isFallbackMode) {
      return { success: true, data: inMemoryDb.settings };
    }
    try {
      const response = await api.get("/settings");
      return response.data;
    } catch (error) {
      return { success: true, data: inMemoryDb.settings };
    }
  },
  update: async (data) => {
    if (isFallbackMode) {
      inMemoryDb.settings = { ...inMemoryDb.settings, ...data };
      return { success: true, data: inMemoryDb.settings };
    }
    const response = await api.put("/settings", data);
    return response.data;
  },
  incrementVisit: async () => {
    if (isFallbackMode) {
      inMemoryDb.settings.visitorCount = (inMemoryDb.settings.visitorCount || 100) + 1;
      return { success: true, visitorCount: inMemoryDb.settings.visitorCount };
    }
    try {
      const response = await api.post("/settings/visit");
      return response.data;
    } catch (error) {
      inMemoryDb.settings.visitorCount = (inMemoryDb.settings.visitorCount || 100) + 1;
      return { success: true, visitorCount: inMemoryDb.settings.visitorCount };
    }
  }
};

// Profile Endpoint (Loads Static JSON + connects settings)
export const profileApi = {
  get: async () => {
    // Merges static resume details with settings
    const settings = await settingsApi.get();
    return {
      success: true,
      data: {
        ...profileData,
        email: settings.data.contact?.email || profileData.email,
        phone: settings.data.contact?.phone || profileData.phone,
        address: settings.data.contact?.address || profileData.location
      }
    };
  }
};

// Social Data
export const socialApi = {
  getAll: async () => {
    return { success: true, data: socialData };
  }
};

// Contact Form Endpoint
export const contactApi = {
  submit: async (messageData) => {
    if (isFallbackMode) {
      const newMsg = {
        ...messageData,
        _id: `msg-${Date.now()}`,
        isRead: false,
        createdAt: new Date()
      };
      inMemoryDb.messages.unshift(newMsg);
      console.log("Mock received message:", newMsg);
      return { success: true, message: "Mock message sent successfully!" };
    }
    const response = await api.post("/contact", messageData);
    return response.data;
  },
  getMessages: async () => {
    if (isFallbackMode) {
      return { success: true, messages: inMemoryDb.messages };
    }
    const response = await api.get("/contact/messages");
    return response.data;
  },
  markAsRead: async (id) => {
    if (isFallbackMode) {
      inMemoryDb.messages = inMemoryDb.messages.map((m) =>
        m._id === id ? { ...m, isRead: true } : m
      );
      return { success: true };
    }
    const response = await api.put(`/contact/messages/${id}`);
    return response.data;
  },
  deleteMessage: async (id) => {
    if (isFallbackMode) {
      inMemoryDb.messages = inMemoryDb.messages.filter((m) => m._id !== id);
      return { success: true };
    }
    const response = await api.delete(`/contact/messages/${id}`);
    return response.data;
  }
};

// Auth API Endpoints
export const authApi = {
  login: async (credentials) => {
    if (isFallbackMode) {
      // Mock Login checks matching config password (default admin/admin123)
      if (credentials.username === "admin" && credentials.password === "admin123") {
        localStorage.setItem("admin_token", "mock_jwt_token");
        return { success: true, token: "mock_jwt_token", username: "admin" };
      } else {
        throw new Error("Invalid username or password (Mock Mode: admin/admin123)");
      }
    }
    const response = await api.post("/auth/login", credentials);
    if (response.data?.success) {
      localStorage.setItem("admin_token", response.data.token);
    }
    return response.data;
  },
  verifyToken: async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) throw new Error("No token found");

    if (isFallbackMode) {
      if (token === "mock_jwt_token") {
        return { success: true, user: { username: "admin" } };
      }
      throw new Error("Invalid mock token");
    }
    const response = await api.get("/auth/verify");
    return response.data;
  },
  logout: async () => {
    localStorage.removeItem("admin_token");
    return { success: true };
  },
  setup: async (credentials) => {
    if (isFallbackMode) {
      return { success: true, message: "Setup complete (Mock Mode)" };
    }
    const response = await api.post("/auth/setup", credentials);
    return response.data;
  }
};

// File Upload Utility
export const uploadApi = {
  uploadFile: async (file) => {
    if (isFallbackMode) {
      // Mock File upload: return local object URL
      const objectUrl = URL.createObjectURL(file);
      return {
        success: true,
        url: objectUrl,
        message: "File uploaded successfully to mock browser storage"
      };
    }
    
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  }
};

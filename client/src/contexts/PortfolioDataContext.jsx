import React, { createContext, useContext, useState, useEffect } from "react";
import {
  profileApi,
  projectsApi,
  skillsApi,
  educationApi,
  experienceApi,
  achievementsApi,
  settingsApi,
  socialApi,
  checkBackendStatus
} from "../services/api";

const PortfolioDataContext = createContext();

export const PortfolioDataProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [settings, setSettings] = useState(null);
  const [socials, setSocials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  const fetchPortfolioData = async () => {
    setLoading(true);
    try {
      // 1. Establish Backend Availability
      const isOffline = await checkBackendStatus();
      setOfflineMode(isOffline);

      // 2. Fetch resources concurrently
      const [
        profileRes,
        projectsRes,
        skillsRes,
        educationRes,
        experienceRes,
        achievementsRes,
        settingsRes,
        socialsRes
      ] = await Promise.all([
        profileApi.get(),
        projectsApi.getAll(),
        skillsApi.getAll(),
        educationApi.getAll(),
        experienceApi.getAll(),
        achievementsApi.getAll(),
        settingsApi.get(),
        socialApi.getAll()
      ]);

      // 3. Update States
      if (profileRes.success) setProfile(profileRes.data);
      if (projectsRes.success) setProjects(projectsRes.data);
      if (skillsRes.success) setSkills(skillsRes.data);
      if (educationRes.success) setEducation(educationRes.data);
      if (experienceRes.success) setExperience(experienceRes.data);
      if (achievementsRes.success) setAchievements(achievementsRes.data);
      if (settingsRes.success) setSettings(settingsRes.data);
      if (socialsRes.success) setSocials(socialsRes.data);

      // 4. Increment visitor count on load
      try {
        const visitRes = await settingsApi.incrementVisit();
        if (visitRes.success && settingsRes.success) {
          setSettings((prev) => ({
            ...prev,
            visitorCount: visitRes.visitorCount
          }));
        }
      } catch (err) {
        console.warn("Could not increment visitor count:", err.message);
      }

    } catch (error) {
      console.error("Error loading portfolio data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  return (
    <PortfolioDataContext.Provider
      value={{
        profile,
        projects,
        skills,
        education,
        experience,
        achievements,
        settings,
        socials,
        loading,
        offlineMode,
        refreshData: fetchPortfolioData
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
};

export const usePortfolioData = () => useContext(PortfolioDataContext);

import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../services/api";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setIsAdmin(false);
      setAdminUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await authApi.verifyToken();
      if (res.success) {
        setIsAdmin(true);
        setAdminUser(res.user || { username: "admin" });
      } else {
        localStorage.removeItem("admin_token");
        setIsAdmin(false);
        setAdminUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error.message);
      // Clean up token if invalid
      localStorage.removeItem("admin_token");
      setIsAdmin(false);
      setAdminUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const loginAdmin = async (credentials) => {
    setLoading(true);
    try {
      const data = await authApi.login(credentials);
      if (data.success) {
        setIsAdmin(true);
        setAdminUser({ username: data.username });
        return { success: true };
      }
      return { success: false, message: "Login failed" };
    } catch (error) {
      return { success: false, message: error.message || "Invalid credentials" };
    } finally {
      setLoading(false);
    }
  };

  const logoutAdmin = async () => {
    setLoading(true);
    await authApi.logout();
    setIsAdmin(false);
    setAdminUser(null);
    setLoading(false);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdmin,
        adminUser,
        loading,
        loginAdmin,
        logoutAdmin,
        refreshAuth: checkAuth
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);

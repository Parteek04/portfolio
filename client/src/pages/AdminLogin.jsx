import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import { FaLock, FaUser, FaShieldAlt } from "react-icons/fa";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { loginAdmin, isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await loginAdmin(formData);
      if (res.success) {
        navigate("/admin");
      } else {
        setError(res.message || "Invalid credentials.");
      }
    } catch (err) {
      setError("Network error logging in.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] px-6 relative overflow-hidden grid-bg-grid">
      {/* Background blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-indigo-500/5 blur-[90px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header icon */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/25 text-indigo-400 mb-4 shadow-lg shadow-indigo-950/20">
            <FaShieldAlt size={28} />
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">Admin Portal Access</h1>
          <p className="text-xs text-slate-500 mt-1.5 uppercase tracking-wider font-bold">
            Sign in to manage portfolio contents
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card rounded-2xl p-8 border border-white/5 shadow-2xl relative">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                  <FaUser size={13} />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="admin"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500/50 text-slate-200 text-sm focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                  <FaLock size={13} />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500/50 text-slate-200 text-sm focus:outline-none transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 text-xs font-semibold rounded-xl bg-red-950/20 border border-red-500/35 text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all duration-300"
            >
              {submitting ? "Signing in..." : "Access Dashboard"}
            </button>
          </form>

          {/* Hint note for local testing */}
          <div className="mt-6 text-center">
            <span className="text-[10px] text-slate-500 font-medium">
              Mock Default Login: <code className="text-slate-400 bg-slate-900/50 px-1 py-0.5 rounded font-mono">admin</code> / <code className="text-slate-400 bg-slate-900/50 px-1 py-0.5 rounded font-mono">admin123</code>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

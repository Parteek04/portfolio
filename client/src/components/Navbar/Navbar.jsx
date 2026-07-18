import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FiSun, FiMoon, FiShield, FiLogOut } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { isAdmin, logoutAdmin } = useAdminAuth();
  const location = useLocation();

  // Scroll detection to add stronger backdrop blur
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/#hero" },
    { name: "About", path: "/#about" },
    { name: "Skills", path: "/#skills" },
    { name: "Projects", path: "/#projects" },
    { name: "Experience", path: "/#experience" },
    { name: "Achievements", path: "/#achievements" },
    { name: "Resume", path: "/#resume" },
    { name: "Contact", path: "/#contact" }
  ];

  const handleLinkClick = (hash) => {
    setIsOpen(false);
    if (location.pathname === "/") {
      const element = document.getElementById(hash.replace("/#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/10"
          : "py-5 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-2 group"
        >
          <span className="h-2 w-2 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform"></span>
          PARTEEK<span className="text-indigo-400">.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                {location.pathname === "/" ? (
                  <a
                    href={link.path}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.path);
                    }}
                    className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative py-1 group"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                ) : (
                  <Link
                    to={link.path}
                    className="text-sm font-medium text-slate-300 hover:text-white transition-colors py-1 relative group"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="h-4 w-[1px] bg-slate-800"></div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all shadow-md"
              title="Toggle theme"
            >
              {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>

            {/* Admin Profile */}
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin"
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-950/50 hover:bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 transition-all"
                >
                  <FiShield size={12} />
                  Admin
                </Link>
                <button
                  onClick={logoutAdmin}
                  className="p-2 rounded-lg bg-red-950/20 hover:bg-red-900/20 border border-red-500/20 text-red-400 transition-all"
                  title="Logout Admin"
                >
                  <FiLogOut size={14} />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="p-2 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-500 hover:text-white transition-all"
                title="Admin Login"
              >
                <FiShield size={16} />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <div className="flex items-center gap-4 md:hidden">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-300"
          >
            {isDark ? <FiSun size={15} /> : <FiMoon size={15} />}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {isOpen ? <HiX size={20} /> : <HiMenuAlt3 size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden w-full bg-slate-950/95 border-b border-slate-900 px-6 py-4 flex flex-col gap-4 overflow-hidden backdrop-blur-lg"
          >
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  {location.pathname === "/" ? (
                    <a
                      href={link.path}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(link.path);
                      }}
                      className="block py-2 text-base font-medium text-slate-300 hover:text-white transition-all"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="block py-2 text-base font-medium text-slate-300 hover:text-white transition-all"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <div className="h-[1px] w-full bg-slate-900"></div>

            <div className="flex justify-between items-center py-2">
              {isAdmin ? (
                <div className="flex items-center gap-3 w-full">
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 text-center py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logoutAdmin();
                      setIsOpen(false);
                    }}
                    className="p-2 rounded-lg border border-red-500/30 text-red-400"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2 rounded-lg border border-slate-800 text-slate-400 text-sm hover:text-white font-medium"
                >
                  Admin Access
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

import React, { useState, useEffect } from "react";
import { usePortfolioData } from "../../contexts/PortfolioDataContext";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaChevronDown, FaDownload } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

const Hero = () => {
  const { profile, socials } = usePortfolioData();
  const [typedText, setTypedText] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [roleIndex, setRoleIndex] = useState(0);

  const roles = [
    "Full-Stack Web Developer",
    "Data Science Enthusiast",
    "Competitive Programmer",
    "Machine Learning Builder"
  ];

  // Typing effect
  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timer;

    if (typingIndex < currentRole.length) {
      timer = setTimeout(() => {
        setTypedText((prev) => prev + currentRole.charAt(typingIndex));
        setTypingIndex((prev) => prev + 1);
      }, 75);
    } else {
      // Hold for 2 seconds then move to next
      timer = setTimeout(() => {
        setTypedText("");
        setTypingIndex(0);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }, 2000);
    }

    return () => clearTimeout(timer);
  }, [typingIndex, roleIndex]);

  const handleScrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case "FaGithub":
        return <FaGithub size={18} />;
      case "FaLinkedin":
        return <FaLinkedin size={18} />;
      case "SiLeetcode":
        return <SiLeetcode size={18} />;
      default:
        return <FaGithub size={18} />;
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-24 grid-bg-grid"
    >
      {/* Premium background mesh lights */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[100px] animate-blob z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[120px] animate-blob animation-delay-2000 z-0"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
        {/* Left column: Text details */}
        <div className="lg:col-span-7 flex flex-col items-start text-left order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6 shadow-md shadow-indigo-950/20"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
            Currently seeking Internship & SDE Roles
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white mb-4"
          >
            Hi, I'm <span className="text-gradient-indigo font-extrabold">{profile?.name || "Parteek Goyal"}</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-8 mb-6 flex items-center"
          >
            <span className="text-lg sm:text-xl font-medium text-slate-300 font-display">
              I build{" "}
              <span className="text-indigo-400 font-semibold typing-cursor">
                {typedText}
              </span>
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-base sm:text-lg text-slate-400 max-w-xl mb-8 leading-relaxed"
          >
            {profile?.bio ||
              "B.Tech Computer Engineering student in my 7th semester, specializing in Data Science, Full Stack Web applications (MERN Stack) and Machine Learning models."}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4 items-center mb-8"
          >
            <button
              onClick={() => handleScrollToSection("contact")}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/20 hover:scale-[1.03] transition-all duration-300 flex items-center gap-2"
            >
              Hire Me
            </button>
            <a
              href={profile?.resumeUrl || "/resume/resume.pdf"}
              download="Parteek_Goyal_Resume.pdf"
              className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold transition-all duration-300 flex items-center gap-2"
            >
              <FaDownload size={14} />
              Download Resume
            </a>
          </motion.div>

          {/* Quick socials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-4"
          >
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Find me on:
            </span>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-indigo-400 transition-all shadow-md"
                  title={social.name}
                >
                  {getIcon(social.icon)}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right column: Avatar portrait */}
        <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            className="relative"
          >
            {/* Glowing ring borders */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-20 blur-lg scale-105"></div>
            
            <div className="relative rounded-2xl border border-white/10 p-2 bg-slate-950/80 backdrop-blur-md overflow-hidden max-w-[320px] sm:max-w-[360px] shadow-2xl shadow-black/50">
              <img
                src={profile?.avatar || "/images/profile.png"}
                alt={profile?.name || "Parteek Goyal"}
                className="w-full h-auto rounded-xl object-cover object-top transition-all duration-700 border border-white/5"
              />
              
              {/* Badge Overlay */}
              <div className="absolute bottom-4 left-4 right-4 py-3 px-4 rounded-xl glass-card text-center">
                <span className="block text-xs font-bold uppercase tracking-widest text-slate-400">
                  Data Science Specialization
                </span>
                <span className="block text-[11px] text-indigo-300 font-semibold mt-0.5">
                  J.C. Bose UST, YMCA
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer z-10" onClick={() => handleScrollToSection("about")}>
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
          Scroll Down
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-slate-400 hover:text-white"
        >
          <FaChevronDown size={14} />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

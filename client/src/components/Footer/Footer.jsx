import React from "react";
import { Link } from "react-router-dom";
import { usePortfolioData } from "../../contexts/PortfolioDataContext";
import { FaGithub, FaLinkedin, FaEnvelope, FaEye } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

const Footer = () => {
  const { profile, settings, socials } = usePortfolioData();

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case "FaGithub":
        return <FaGithub />;
      case "FaLinkedin":
        return <FaLinkedin />;
      case "SiLeetcode":
        return <SiLeetcode />;
      default:
        return <FaGithub />;
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-slate-900 bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
        {/* Left Column - Brand and bio */}
        <div>
          <h4 className="font-display font-bold text-lg text-white mb-2">
            PARTEEK GOYAL<span className="text-indigo-500">.</span>
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto md:mx-0">
            B.Tech Computer Engineering student specializing in Data Science and MERN Stack. Building high performance, responsive digital experiences.
          </p>
        </div>

        {/* Middle Column - Visitor Counter & Stats */}
        <div className="flex flex-col items-center justify-center gap-2">
          {settings && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 font-semibold shadow-inner">
              <FaEye className="text-indigo-400 animate-pulse" />
              <span>Visitor count: </span>
              <span className="text-white font-mono">{settings.visitorCount || 342}</span>
            </div>
          )}
          <span className="text-[11px] text-slate-500 font-medium">
            Designed & Engineered with React + Tailwind
          </span>
        </div>

        {/* Right Column - Social Links */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex items-center gap-4">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-md"
                title={social.name}
              >
                {getIconComponent(social.icon)}
              </a>
            ))}
            <a
              href={`mailto:${profile?.email || "kumarparteek701@gmail.com"}`}
              className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-md"
              title="Email Me"
            >
              <FaEnvelope />
            </a>
          </div>
          <p className="text-xs text-slate-500">
            &copy; {currentYear} Parteek Goyal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

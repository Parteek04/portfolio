import React from "react";
import { usePortfolioData } from "../../contexts/PortfolioDataContext";
import { FaDownload, FaFilePdf, FaExternalLinkAlt } from "react-icons/fa";

const Resume = () => {
  const { profile } = usePortfolioData();

  return (
    <section id="resume" className="py-24 relative z-10 bg-slate-950/15">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-500 bg-indigo-950/30 px-3 py-1 rounded-full border border-indigo-500/10">
            Resume
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mt-3 text-white">
            Curriculum Vitae
          </h2>
          <div className="h-[2px] w-12 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Outer Grid card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/5 shadow-2xl relative overflow-hidden flex flex-col items-center">
          <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-400">
                <FaFilePdf size={24} />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">Parteek_Goyal_Resume.pdf</h3>
                <p className="text-xs text-slate-500">Updated July 2026 • B.Tech Computer Engineering</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={profile?.resumeUrl || "/resume/resume.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm hover:border-slate-700 transition-all shadow-md"
              >
                <FaExternalLinkAlt size={10} />
                Open Full Screen
              </a>
              <a
                href={profile?.resumeUrl || "/resume/resume.pdf"}
                download="Parteek_Goyal_Resume.pdf"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/20 transition-all"
              >
                <FaDownload size={11} />
                Download PDF
              </a>
            </div>
          </div>

          {/* Embedded PDF Viewer Container */}
          <div className="w-full aspect-[1/1.4] sm:aspect-[1/1.414] bg-slate-900 border border-white/5 rounded-xl overflow-hidden shadow-inner relative">
            {/* If browser supports embeds, show iframe. If not, it falls back gracefully */}
            <iframe
              src={`${profile?.resumeUrl || "/resume/resume.pdf"}#toolbar=0&navpanes=0`}
              title="Parteek Goyal PDF Resume"
              className="w-full h-full border-0"
              style={{ background: "#111827" }}
            >
              <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-400">
                <p className="mb-4">It looks like your browser doesn't support embedded PDFs.</p>
                <a
                  href={profile?.resumeUrl || "/resume/resume.pdf"}
                  download
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2"
                >
                  <FaDownload size={14} />
                  Download Resume to View
                </a>
              </div>
            </iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;

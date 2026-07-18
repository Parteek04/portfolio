import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { projectsApi } from "../services/api";
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaExclamationTriangle, FaCheckCircle, FaRocket } from "react-icons/fa";
import { motion } from "framer-motion";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const res = await projectsApi.getById(id);
        if (res.success && res.data) {
          setProject(res.data);
        } else {
          setError("Project not found.");
        }
      } catch (err) {
        setError("Error loading project case study.");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="relative flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-slate-400 font-medium">Loading Case Study details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] px-6">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-6 flex justify-center">
            <FaExclamationTriangle size={48} />
          </div>
          <h2 className="font-display font-bold text-2xl text-white mb-2">Could Not Load Details</h2>
          <p className="text-slate-400 text-sm mb-6">{error || "Case study was deleted or does not exist."}</p>
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all"
          >
            <FaArrowLeft size={12} />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 py-24 relative overflow-hidden grid-bg-dots">
      {/* Glow shapes */}
      <div className="absolute top-10 left-10 w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Back navigation */}
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors mb-10 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" size={11} />
          Back to Portfolio
        </Link>

        {/* Header Title Section */}
        <div className="mb-10">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-400 font-mono">
            {project.subtitle || "Case Study Details"}
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-5xl text-white mt-2 leading-tight">
            {project.title}
          </h1>
          
          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-4 mt-6">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold transition-all shadow-md"
              >
                <FaGithub size={14} />
                GitHub Repository
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-indigo-600/10"
              >
                <FaExternalLinkAlt size={11} />
                Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Project Cover Image */}
        <div className="w-full aspect-[2/1] rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-slate-950 mb-12">
          <img
            src={project.image || "/images/placeholder.png"}
            alt={project.title}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Case Study Content Details */}
        <div className="flex flex-col gap-10">
          {/* Overview */}
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white mb-3">Project Overview</h2>
            <p className="text-slate-350 text-sm sm:text-base leading-relaxed">
              {project.longDescription || project.description}
            </p>
          </div>

          {/* Tech Stack Used */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="p-6 rounded-2xl glass-card border border-white/5">
              <h3 className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-4 font-mono">
                Technology Stack Built With:
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-350 font-semibold"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Case study problem & solution details */}
          {project.caseStudy && (
            <>
              {/* Problem & Solution block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {project.caseStudy.problem && (
                  <div className="p-6 rounded-2xl bg-slate-900/40 border border-red-950/20">
                    <h3 className="font-display font-semibold text-lg text-white mb-2 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-500"></span>
                      The Problem
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      {project.caseStudy.problem}
                    </p>
                  </div>
                )}

                {project.caseStudy.solution && (
                  <div className="p-6 rounded-2xl bg-slate-900/40 border border-green-950/20">
                    <h3 className="font-display font-semibold text-lg text-white mb-2 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      The Solution
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      {project.caseStudy.solution}
                    </p>
                  </div>
                )}
              </div>

              {/* Challenges */}
              {project.caseStudy.challenges && project.caseStudy.challenges.length > 0 && (
                <div>
                  <h2 className="font-display font-bold text-xl sm:text-2xl text-white mb-4">Engineering Challenges</h2>
                  <div className="flex flex-col gap-3">
                    {project.caseStudy.challenges.map((challenge, idx) => (
                      <div key={idx} className="flex gap-4 items-start p-4 rounded-xl glass-card border border-white/5">
                        <div className="h-6 w-6 rounded-full bg-slate-900 border border-slate-850 flex items-center justify-center text-xs font-mono font-bold text-indigo-400 flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                          {challenge}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Results */}
              {project.caseStudy.results && (
                <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border border-indigo-500/10">
                  <h3 className="font-display font-bold text-lg text-white mb-3 flex items-center gap-2">
                    <FaCheckCircle className="text-green-400" />
                    Project Outcome & Results
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {project.caseStudy.results}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Future Improvements */}
          {project.futureImprovements && project.futureImprovements.length > 0 && (
            <div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-white mb-4">Future roadmap</h2>
              <div className="flex flex-col gap-3">
                {project.futureImprovements.map((imp, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <FaRocket className="text-indigo-400 text-xs flex-shrink-0" />
                    <p className="text-slate-400 text-xs sm:text-sm">
                      {imp}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Back navigation footer */}
        <div className="mt-16 pt-8 border-t border-slate-900 flex justify-center">
          <Link
            to="/#projects"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-semibold text-sm transition-all shadow-md"
          >
            <FaArrowLeft size={12} />
            Back to Project Grid
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ProjectDetails;

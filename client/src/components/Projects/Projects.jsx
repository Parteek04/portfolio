import React from "react";
import { Link } from "react-router-dom";
import { usePortfolioData } from "../../contexts/PortfolioDataContext";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaBookOpen } from "react-icons/fa";

const Projects = () => {
  const { projects } = usePortfolioData();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <section id="projects" className="py-24 relative z-10 bg-slate-950/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-500 bg-indigo-950/30 px-3 py-1 rounded-full border border-indigo-500/10">
            Portfolio
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mt-3 text-white">
            Featured Projects
          </h2>
          <div className="h-[2px] w-12 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Project Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {projects.map((project) => (
            <motion.div
              variants={cardVariants}
              key={project._id || project.id}
              className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/30 transition-all duration-300 flex flex-col group"
            >
              {/* Thumbnail Container */}
              <div className="relative overflow-hidden aspect-video bg-slate-900 border-b border-white/5">
                <img
                  src={project.image || "/images/placeholder.png"}
                  alt={project.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/10 transition-colors duration-300"></div>

                {/* Tech tags floating */}
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 max-w-[90%]">
                  {project.techStack?.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-sm text-[10px] font-bold text-indigo-300 uppercase tracking-wide border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack?.length > 3 && (
                    <span className="px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-sm text-[10px] font-bold text-slate-400">
                      +{project.techStack.length - 3} More
                    </span>
                  )}
                </div>
              </div>

              {/* Text content */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1.5 font-mono">
                    {project.subtitle || "Web Application"}
                  </span>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-3 group-hover:text-indigo-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                    {project.description}
                  </p>
                </div>

                {/* Buttons Action bar */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/5">
                  <Link
                    to={`/project/${project._id || project.id}`}
                    className="flex-1 min-w-[120px] text-center py-2.5 px-4 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-500/20 text-indigo-300 hover:text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <FaBookOpen size={13} />
                    Case Study
                  </Link>

                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all shadow-md"
                      title="GitHub Repository"
                    >
                      <FaGithub size={16} />
                    </a>
                  )}

                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all shadow-md"
                      title="Live Demonstration"
                    >
                      <FaExternalLinkAlt size={14} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;

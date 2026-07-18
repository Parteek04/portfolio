import React from "react";
import { usePortfolioData } from "../../contexts/PortfolioDataContext";
import { motion } from "framer-motion";
import { FaBriefcase, FaCalendarAlt, FaMapMarkerAlt, FaCode } from "react-icons/fa";

const Experience = () => {
  const { experience } = usePortfolioData();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <section id="experience" className="py-24 relative z-10 bg-slate-950/20 grid-bg-dots-darker">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-500 bg-indigo-950/30 px-3 py-1 rounded-full border border-indigo-500/10">
            Experience
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mt-3 text-white">
            Professional & Extracurriculars
          </h2>
          <div className="h-[2px] w-12 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Experience Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative pl-8 sm:pl-12 border-l border-slate-800 flex flex-col gap-12"
        >
          {experience.map((exp) => (
            <motion.div
              variants={itemVariants}
              key={exp._id || exp.id}
              className="relative group"
            >
              {/* Timeline Node */}
              <div className="absolute -left-[45px] sm:-left-[61px] top-1.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 border border-slate-750 text-indigo-400 group-hover:border-indigo-500 group-hover:bg-indigo-950/50 group-hover:text-white transition-all shadow-md">
                <FaBriefcase size={12} />
              </div>

              {/* Card Container */}
              <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/5 group-hover:border-indigo-500/20 hover:bg-slate-900/35 transition-all relative">
                {/* Type Tag */}
                <div className="absolute top-6 right-6 px-2.5 py-0.5 rounded bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest font-mono">
                  {exp.type}
                </div>

                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-2">
                  <FaCalendarAlt size={10} />
                  {exp.duration}
                </span>

                <h3 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-indigo-300 transition-colors">
                  {exp.role}
                </h3>

                <h4 className="text-sm font-semibold text-slate-300 mt-1 flex items-center gap-1.5">
                  {exp.company}
                  {exp.location && (
                    <span className="text-slate-500 text-xs font-normal flex items-center gap-1">
                      • <FaMapMarkerAlt size={9} /> {exp.location}
                    </span>
                  )}
                </h4>

                {/* Bullet Points Description */}
                <ul className="mt-6 flex flex-col gap-2.5">
                  {exp.description?.map((point, index) => (
                    <li key={index} className="flex gap-2.5 text-xs sm:text-sm text-slate-400 leading-relaxed items-start">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech tags */}
                {exp.techStack && exp.techStack.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-2 items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 font-mono mr-1">
                      <FaCode size={10} /> Stack:
                    </span>
                    {exp.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-semibold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;

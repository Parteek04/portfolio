import React from "react";
import { usePortfolioData } from "../../contexts/PortfolioDataContext";
import { motion } from "framer-motion";
import { FaGraduationCap, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

const Education = () => {
  const { education } = usePortfolioData();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <section id="education" className="py-24 relative z-10 grid-bg-dots">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-500 bg-indigo-950/30 px-3 py-1 rounded-full border border-indigo-500/10">
            Education
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mt-3 text-white">
            Academic Timeline
          </h2>
          <div className="h-[2px] w-12 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Timeline Path */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative pl-8 sm:pl-12 border-l border-slate-800 flex flex-col gap-12"
        >
          {education.map((edu, idx) => (
            <motion.div
              variants={itemVariants}
              key={edu._id || edu.id}
              className="relative group"
            >
              {/* Node Circle */}
              <div className="absolute -left-[45px] sm:-left-[61px] top-1.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 border border-slate-750 text-indigo-400 group-hover:border-indigo-500 group-hover:bg-indigo-950/50 group-hover:text-white transition-all shadow-md">
                <FaGraduationCap size={14} />
              </div>

              {/* Card Container */}
              <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/5 group-hover:border-indigo-500/20 hover:bg-slate-900/35 transition-all relative overflow-hidden">
                {/* Score badge top right */}
                {edu.score && (
                  <div className="absolute top-6 right-6 px-3 py-1 rounded-lg bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 text-xs font-bold font-mono">
                    {edu.score}
                  </div>
                )}

                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-2">
                  <FaCalendarAlt size={10} />
                  {edu.duration}
                </span>

                <h3 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-indigo-300 transition-colors">
                  {edu.institution}
                </h3>
                
                <h4 className="text-sm font-semibold text-slate-300 mt-1 flex items-center gap-1.5">
                  {edu.degree}
                  {edu.location && (
                    <span className="text-slate-500 text-xs font-normal flex items-center gap-1">
                      • <FaMapMarkerAlt size={9} /> {edu.location}
                    </span>
                  )}
                </h4>

                <p className="text-slate-400 text-xs sm:text-sm mt-4 leading-relaxed max-w-2xl">
                  {edu.description}
                </p>

                {/* Coursework Tags */}
                {edu.courses && edu.courses.length > 0 && (
                  <div className="mt-6">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">
                      Key Subjects:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {edu.courses.map((course) => (
                        <span
                          key={course}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800/80 text-xs text-slate-400 font-medium"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
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

export default Education;

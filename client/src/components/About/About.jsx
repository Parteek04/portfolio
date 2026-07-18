import React from "react";
import { usePortfolioData } from "../../contexts/PortfolioDataContext";
import { motion } from "framer-motion";
import { FaGraduationCap, FaCode, FaTrophy, FaLightbulb } from "react-icons/fa";

const About = () => {
  const { profile } = usePortfolioData();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const getFactIcon = (label) => {
    switch (label.toLowerCase()) {
      case "current semester":
        return <FaGraduationCap className="text-indigo-400" size={24} />;
      case "university cgpa":
        return <FaLightbulb className="text-yellow-400" size={24} />;
      case "leetcode solved":
        return <FaCode className="text-orange-400" size={24} />;
      default:
        return <FaTrophy className="text-indigo-400" size={24} />;
    }
  };

  return (
    <section id="about" className="py-24 relative z-10 bg-slate-950/20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-500 bg-indigo-950/30 px-3 py-1 rounded-full border border-indigo-500/10">
            About Me
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mt-3 text-white">
            My Journey & Background
          </h2>
          <div className="h-[2px] w-12 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12"
        >
          {/* Left Side: Bio & Objective */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <motion.div variants={itemVariants} className="glass-card rounded-2xl p-8 mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[4px] h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
              <h3 className="font-display font-semibold text-xl text-white mb-4">
                Professional Journey
              </h3>
              <p className="text-slate-300 leading-relaxed mb-6 text-sm sm:text-base">
                {profile?.bio ||
                  "Passionate Computer Engineering student with a core interest in building web platforms and training machine learning workflows."}
              </p>
              
              <h3 className="font-display font-semibold text-lg text-white mb-2">
                Career Objective
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed italic">
                {profile?.objective ||
                  "To secure a software development internship or full-time position that lets me utilize my backend design, algorithms, and machine learning skills to solve real-world problems."}
              </p>
            </motion.div>

            {/* Quick Facts Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
              {profile?.quickFacts?.map((fact) => (
                <div
                  key={fact.label}
                  className="glass-card rounded-xl p-4 flex items-center gap-4 border border-white/5 hover:border-white/10 transition-all hover:bg-slate-900/40"
                >
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 shadow-md">
                    {getFactIcon(fact.label)}
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                      {fact.label}
                    </span>
                    <span className="block text-base font-bold text-white mt-0.5">
                      {fact.value}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Side: Timeline of Journey */}
          <div className="lg:col-span-5">
            <motion.div variants={itemVariants} className="glass-card rounded-2xl p-8 relative">
              <h3 className="font-display font-semibold text-xl text-white mb-6">
                Milestones
              </h3>

              {/* Vertical timeline line */}
              <div className="absolute top-24 bottom-12 left-12 w-[1px] bg-slate-800"></div>

              <div className="flex flex-col gap-8 relative">
                {profile?.journey?.map((milestone, idx) => (
                  <div key={milestone.title} className="flex gap-6 items-start group">
                    {/* Timeline Node */}
                    <div className="relative z-10 flex items-center justify-center h-8 w-8 rounded-full bg-slate-900 border border-slate-700 text-indigo-400 text-xs font-bold font-mono group-hover:border-indigo-500 group-hover:text-white transition-all shadow-md mt-0.5">
                      {idx + 1}
                    </div>

                    <div className="flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
                        {milestone.year}
                      </span>
                      <h4 className="font-display font-semibold text-sm sm:text-base text-white mt-0.5 group-hover:text-indigo-300 transition-colors">
                        {milestone.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

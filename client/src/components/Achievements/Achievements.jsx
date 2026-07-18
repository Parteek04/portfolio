import React from "react";
import { usePortfolioData } from "../../contexts/PortfolioDataContext";
import { motion } from "framer-motion";
import { FaTrophy, FaCertificate, FaMedal, FaCode } from "react-icons/fa";

const Achievements = () => {
  const { achievements } = usePortfolioData();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const getIcon = (category) => {
    switch (category) {
      case "Competition":
        return <FaTrophy className="text-yellow-400" size={24} />;
      case "Coding":
        return <FaCode className="text-orange-400" size={24} />;
      case "Certificate":
        return <FaCertificate className="text-indigo-400" size={24} />;
      case "Badges":
        return <FaMedal className="text-green-400" size={24} />;
      default:
        return <FaTrophy className="text-indigo-400" size={24} />;
    }
  };

  return (
    <section id="achievements" className="py-24 relative z-10 grid-bg-dots">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-500 bg-indigo-950/30 px-3 py-1 rounded-full border border-indigo-500/10">
            Achievements
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mt-3 text-white">
            Honors & DSA Metrics
          </h2>
          <div className="h-[2px] w-12 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* LeetCode Dynamic Stats Panel (Mocked or styled beautifully) */}
        <div className="mb-12 glass-card rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-orange-500/5 blur-3xl z-0"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 items-center">
            
            {/* LeetCode logo and text */}
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-xl bg-orange-950/20 border border-orange-500/25 text-orange-400">
                <FaCode size={26} />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">LeetCode Metrics</h3>
                <p className="text-xs text-slate-500">Self-paced algorithmic practice</p>
              </div>
            </div>

            {/* Total Problems */}
            <div className="text-center border-y md:border-y-0 md:border-x border-slate-800/80 py-4 md:py-0">
              <span className="block text-3xl font-mono font-extrabold text-orange-400">200+</span>
              <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                Problems Solved
              </span>
            </div>

            {/* Practice Badges */}
            <div className="flex flex-col gap-1.5 items-center md:items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                Key Topics Mastered:
              </span>
              <div className="flex flex-wrap gap-1.5 justify-center md:justify-end">
                {["Arrays", "Trees", "Sorting", "Greedy"].map(topic => (
                  <span key={topic} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Grid cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {achievements.map((ach) => (
            <motion.div
              variants={cardVariants}
              key={ach._id || ach.id}
              className="glass-card rounded-xl p-6 border border-white/5 hover:border-indigo-500/30 transition-all hover:bg-slate-900/30 flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                {/* Header icon + badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-850 shadow-md">
                    {getIcon(ach.category)}
                  </div>
                  {ach.badge && (
                    <span className="px-2 py-0.5 rounded-md bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold font-mono uppercase tracking-wider">
                      {ach.badge}
                    </span>
                  )}
                </div>

                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">
                  {ach.organization || "Honor"} • {ach.date}
                </span>

                <h3 className="font-display font-bold text-base sm:text-lg text-white mt-1.5 group-hover:text-indigo-300 transition-colors">
                  {ach.title}
                </h3>

                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  {ach.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Achievements;

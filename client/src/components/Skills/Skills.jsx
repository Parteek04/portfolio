import React, { useState } from "react";
import { usePortfolioData } from "../../contexts/PortfolioDataContext";
import { motion } from "framer-motion";
import * as DiIcons from "react-icons/di";
import * as SiIcons from "react-icons/si";
import * as FaIcons from "react-icons/fa";

const Skills = () => {
  const { skills } = usePortfolioData();
  const [activeCategory, setActiveCategory] = useState("All");

  // Dynamically resolve react-icons components from string names
  const getIcon = (iconName, colorClass) => {
    let IconComp = null;
    if (iconName.startsWith("Di")) {
      IconComp = DiIcons[iconName];
    } else if (iconName.startsWith("Si")) {
      IconComp = SiIcons[iconName];
    } else if (iconName.startsWith("Fa")) {
      IconComp = FaIcons[iconName];
    }
    
    // Fallback if not found
    if (!IconComp) {
      return <DiIcons.DiCode className={colorClass} size={28} />;
    }
    return <IconComp className={colorClass} size={28} />;
  };

  // Group unique categories
  const categories = ["All", ...new Set(skills.map((s) => s.category))];

  // Filter skills based on current selection
  const filteredSkills = activeCategory === "All"
    ? skills.flatMap((c) => c.skills || (c.name ? [c] : [])) // handles flat or nested seeded format
    : skills.find((c) => c.category === activeCategory)?.skills || [];

  // If DB format was flat vs nested, we make sure it resolves properly:
  // Flat DB schema entries usually look like { name, level, category, icon, color }
  // Structured file configuration schema looks like { category, skills: [...] }
  const renderSkills = () => {
    // If the database has flat Skill entries:
    let flatList = [];
    if (skills.length > 0) {
      if (skills[0].skills) {
        // Nested config structure
        if (activeCategory === "All") {
          flatList = skills.flatMap((c) => c.skills.map(s => ({ ...s, categoryName: c.category })));
        } else {
          flatList = (skills.find((c) => c.category === activeCategory)?.skills || []).map(s => ({ ...s, categoryName: activeCategory }));
        }
      } else {
        // Flat Mongoose models structure
        if (activeCategory === "All") {
          flatList = skills;
        } else {
          flatList = skills.filter((s) => s.category === activeCategory);
        }
      }
    }

    return (
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {flatList.map((skill, index) => (
          <motion.div
            layout
            key={skill._id || skill.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
            className="glass-card rounded-xl p-5 border border-white/5 hover:border-indigo-500/30 transition-all hover:bg-slate-900/30 group relative overflow-hidden"
            style={{
              boxShadow: `0 4px 30px rgba(0, 0, 0, 0.1)`
            }}
          >
            {/* Custom glowing background accent based on skill hover */}
            <div
              className="absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl"
              style={{ backgroundColor: skill.color || "#6366f1" }}
            ></div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 transition-colors shadow-md"
                  style={{ color: skill.color }}
                >
                  {getIcon(skill.icon, "")}
                </div>
                <div>
                  <h4 className="font-display font-semibold text-white text-sm sm:text-base group-hover:text-indigo-300 transition-colors">
                    {skill.name}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    {skill.category || skill.categoryName || "Tech"}
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-indigo-400">
                {skill.level}%
              </span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/40">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.1 }}
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${skill.color || "#6366f1"} 0%, #a855f7 100%)`
                }}
              ></motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <section id="skills" className="py-24 relative z-10 grid-bg-dots-darker">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-500 bg-indigo-950/30 px-3 py-1 rounded-full border border-indigo-500/10">
            Skills
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mt-3 text-white">
            Technical Competence
          </h2>
          <div className="h-[2px] w-12 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                activeCategory === cat
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/15"
                  : "bg-slate-900/50 border-slate-850 hover:border-slate-700 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Render Grid */}
        {renderSkills()}
      </div>
    </section>
  );
};

export default Skills;

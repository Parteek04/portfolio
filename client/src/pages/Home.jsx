import React from "react";
import Hero from "../components/Hero/Hero";
import About from "../components/About/About";
import Skills from "../components/Skills/Skills";
import Projects from "../components/Projects/Projects";
import Education from "../components/Education/Education";
import Experience from "../components/Experience/Experience";
import Achievements from "../components/Achievements/Achievements";
import Resume from "../components/Resume/Resume";
import Contact from "../components/Contact/Contact";

const Home = () => {
  return (
    <div className="relative overflow-x-hidden min-h-screen">
      {/* Background radial overlay */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-950/15 via-transparent to-transparent pointer-events-none z-0"></div>
      
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Education />
      <Achievements />
      <Resume />
      <Contact />
    </div>
  );
};

export default Home;

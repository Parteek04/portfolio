import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";

// Models
import User from "../models/User.js";
import Project from "../models/Project.js";
import Skill from "../models/Skill.js";
import Education from "../models/Education.js";
import Experience from "../models/Experience.js";
import Achievement from "../models/Achievement.js";
import Setting from "../models/Setting.js";

// Load Environment Variables
dotenv.config();

const initialSkills = [
  // Programming
  { name: "C++", level: 90, icon: "SiCplusplus", color: "#00599C", category: "Programming Languages" },
  { name: "Java", level: 80, icon: "DiJava", color: "#007396", category: "Programming Languages" },
  { name: "Python", level: 85, icon: "DiPython", color: "#3776AB", category: "Programming Languages" },
  // Web Dev
  { name: "HTML5/CSS3", level: 95, icon: "DiHtml5", color: "#E34F26", category: "Web Development" },
  { name: "JavaScript", level: 88, icon: "DiJavascript1", color: "#F7DF1E", category: "Web Development" },
  { name: "React.js", level: 85, icon: "DiReact", color: "#61DAFB", category: "Web Development" },
  { name: "Node.js", level: 82, icon: "DiNodejsSmall", color: "#339933", category: "Web Development" },
  { name: "Express.js", level: 80, icon: "SiExpress", color: "#000000", category: "Web Development" },
  { name: "Tailwind CSS", level: 90, icon: "SiTailwindcss", color: "#06B6D4", category: "Web Development" },
  // Data Science
  { name: "Python DS (NumPy, Pandas)", level: 85, icon: "SiPandas", color: "#150458", category: "Data Science & Machine Learning" },
  { name: "Scikit-Learn", level: 80, icon: "SiScikitlearn", color: "#F7931E", category: "Data Science & Machine Learning" },
  { name: "TensorFlow & CNNs", level: 75, icon: "SiTensorflow", color: "#FF6F00", category: "Data Science & Machine Learning" },
  { name: "OpenCV", level: 78, icon: "SiOpencv", color: "#5C3EE6", category: "Data Science & Machine Learning" },
  { name: "Streamlit", level: 82, icon: "SiStreamlit", color: "#FF4B4B", category: "Data Science & Machine Learning" },
  // Databases
  { name: "SQL", level: 82, icon: "DiDatabase", color: "#4479A1", category: "Databases" },
  { name: "MongoDB", level: 80, icon: "DiMongodb", color: "#47A248", category: "Databases" },
  // Tools
  { name: "Git", level: 85, icon: "DiGit", color: "#F05032", category: "Tools & Platforms" },
  { name: "GitHub", level: 88, icon: "DiGithubBadge", color: "#181717", category: "Tools & Platforms" },
  { name: "Postman", level: 80, icon: "SiPostman", color: "#FF6C37", category: "Tools & Platforms" },
  // Soft Skills
  { name: "Problem Solving (DSA)", level: 90, icon: "SiLeetcode", color: "#FFA116", category: "Soft Skills" },
  { name: "Analytical Thinking", level: 92, icon: "FaLightbulb", color: "#FBC02D", category: "Soft Skills" },
  { name: "Team Collaboration", level: 88, icon: "FaUsers", color: "#1E88E5", category: "Soft Skills" },
  { name: "Adaptability", level: 90, icon: "FaSync", color: "#43A047", category: "Soft Skills" }
];

const initialEducation = [
  {
    institution: "J.C. Bose University of Science and Technology, YMCA",
    location: "Faridabad, Haryana, India",
    degree: "Bachelor of Technology in Computer Engineering (Data Science)",
    duration: "August 2023 - June 2027",
    score: "CGPA: 8.1/10.0 (Up to 5th semester)",
    description: "Specialized coursework in Data Structures & Algorithms, Database Management Systems, Operating Systems, Machine Learning, and Artificial Intelligence.",
    courses: ["Data Structures and Algorithms", "Object-Oriented Programming", "Operating Systems", "Database Management Systems", "Artificial Intelligence", "Machine Learning"]
  },
  {
    institution: "Govt. Sr. Sec. School, Krishanpura",
    location: "Panipat, Haryana, India",
    degree: "Board of School Education Haryana (Class XII)",
    duration: "April 2021 - March 2022",
    score: "Percentage: 86.6%",
    description: "Focused on non-medical sciences and mathematical analytical models.",
    courses: ["Physics", "Chemistry", "Mathematics", "English"]
  },
  {
    institution: "Dr. R. K. Sr. Sec. School, Kutani Road",
    location: "Panipat, Haryana, India",
    degree: "Board of School Education Haryana (Class X)",
    duration: "April 2019 - March 2020",
    score: "Percentage: 93.6%",
    description: "Completed secondary education with high distinction.",
    courses: ["Science", "Mathematics", "Social Studies", "English", "Hindi"]
  }
];

const initialExperience = [
  {
    role: "Software Developer Intern",
    company: "Tech Solutions Inc. (Placeholder Card - Editable)",
    location: "Remote",
    type: "Internship",
    duration: "June 2026 - Present",
    description: [
      "Contributing to the development of responsive MERN Stack web portals.",
      "Optimizing MongoDB database schemas and writing RESTful API endpoints.",
      "Collaborating with senior developers to review pull requests and write modular unit tests."
    ],
    techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "Git"]
  },
  {
    role: "Machine Learning Training",
    company: "Self-Paced / Academic Projects",
    location: "Faridabad, India",
    type: "Training",
    duration: "August 2024 - Dec 2024",
    description: [
      "Completed comprehensive training in data cleaning, exploratory data analysis, and model building.",
      "Studied supervised and unsupervised machine learning algorithms, deep learning, and computer vision models.",
      "Built over 5+ minor projects including sentiment analyzers, price predictors, and image classifiers."
    ],
    techStack: ["Python", "NumPy", "Pandas", "Scikit-Learn", "TensorFlow", "OpenCV"]
  },
  {
    role: "Open Source Contributor & DSA Enthusiast",
    company: "GitHub / LeetCode",
    location: "Online",
    type: "Freelancing",
    duration: "Ongoing",
    description: [
      "Solved 200+ complex problems on LeetCode and GeeksforGeeks, focusing on graph, tree, dynamic programming, and greedy algorithms.",
      "Participated in multiple hackathons and built open-source tools to assist fellow university peers.",
      "Contributed to repository documentation and minor bug fixes in community packages."
    ],
    techStack: ["C++", "Java", "Python", "Git", "GitHub"]
  }
];

const initialProjects = [
  {
    title: "SchemeSathi",
    subtitle: "Government Scheme Recommendation System",
    description: "A rule-based and machine-learning-driven platform that recommends central and state government schemes based on user eligibility criteria (income, occupation, caste, age, state).",
    longDescription: "SchemeSathi is designed to bridge the awareness gap between the government's social welfare schemes and the eligible citizens, especially in rural areas. By processing income brackets, demographics, state residency, and employment statuses, the system filters out hundreds of complex eligibility descriptions into a personalized list of actionable recommendations.",
    image: "/images/schemesathi.png",
    techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "Python", "Scikit-Learn", "JWT", "Tailwind CSS"],
    features: [
      "Custom ML classification and rule-based filter engine matching users to hundreds of government schemes.",
      "Secure user profile management with JWT authentication enabling saving, tracking, and comparing schemes.",
      "Comprehensive dashboards displaying eligibility match scores and detailed steps to apply."
    ],
    github: "https://github.com/kumar-parteek/SchemeSathi",
    demo: "https://schemesathi.vercel.app",
    caseStudy: {
      problem: "Millions of citizens miss out on essential welfare benefits due to the complex, fragmented, and bureaucratic nature of scheme details.",
      solution: "We digitized scheme definitions into structured rules in MongoDB and combined them with a simple Python classification endpoint.",
      challenges: [
        "Structuring inconsistent and vague eligibility rules from different state government portals into a singular JSON schema.",
        "Optimizing MongoDB queries to evaluate multi-condition boolean matches across millions of permutations quickly."
      ],
      results: "Achieved 96% accuracy in predicting scheme eligibility. Loaded in under 1.2 seconds on 3G connections."
    },
    futureImprovements: [
      "Integrate an automated Web Scraper using Python to fetch and update schemes.",
      "Build a lightweight mobile app (React Native)."
    ]
  },
  {
    title: "Deepfake AI Video Detection",
    subtitle: "Facial Feature Manipulation Classification System",
    description: "An AI-powered system designed to analyze and classify videos as 'real' or 'fake' by evaluating micro-expressions, facial landmarks, and convolutional manipulation artifacts.",
    longDescription: "With the rise of generative AI, synthetic media manipulations pose massive social and security threats. This project builds a Deep Learning system combining OpenCV's facial land-marking with a Convolutional Neural Network (CNN) trained on thousands of video frames.",
    image: "/images/deepfake.png",
    techStack: ["Python", "CNN", "OpenCV", "TensorFlow", "Keras", "Streamlit", "NumPy", "Matplotlib"],
    features: [
      "Real-time video upload and frame decomposition utilizing OpenCV's video pipelines.",
      "High-precision facial landmark extraction isolating manipulation artifacts.",
      "Custom CNN model built in TensorFlow, utilizing pre-trained ResNet/VGG bases to flag spatial discrepancies."
    ],
    github: "https://github.com/kumar-parteek/deepfake-detection",
    demo: "https://deepfake-detect.streamlit.app",
    caseStudy: {
      problem: "Deepfake generation models have reached a level where human eyes cannot differentiate synthesized faces.",
      solution: "Created a hybrid framework that uses OpenCV to pre-process and isolate only the facial regions first, reducing the visual data sent to the heavy deep learning model.",
      challenges: [
        "Handling temporal frame jitter and compression noise in social-media-compressed videos.",
        "Classifying synthetic faces under extreme angles or bad lighting."
      ],
      results: "Trained model achieved 92.4% validation accuracy on the FaceForensics++ benchmark."
    },
    futureImprovements: [
      "Incorporate LSTM/RNN layers to capture temporal inconsistencies across frames.",
      "Create a browser extension."
    ]
  }
];

const initialAchievements = [
  {
    title: "2nd Position, District Science Quiz Competition",
    organization: "District Education Board",
    date: "2022",
    category: "Competition",
    description: "Secured second place in the District-Level Science Quiz Competition, demonstrating excellent analytical skills, logical reasoning, and conceptual knowledge under pressure.",
    badge: "Silver Medal"
  },
  {
    title: "200+ Coding Problems Solved",
    organization: "LeetCode & GeeksforGeeks",
    date: "Ongoing",
    category: "Coding",
    description: "Successfully solved 200+ algorithm problems spanning arrays, linked lists, binary trees, dynamic programming, graphs, and search strategies on top coding sites.",
    badge: "Problem Solver"
  },
  {
    title: "MERN Stack Developer Certification",
    organization: "Online Training Platform (Self-Study)",
    date: "2024",
    category: "Certificate",
    description: "Completed comprehensive training on building full-stack web applications using React, Node, Express, MongoDB, along with JWT authentication.",
    badge: "Certified Developer"
  }
];

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data (optional - only seed if empty to preserve updates)
    const skillsCount = await Skill.countDocuments();
    if (skillsCount === 0) {
      await Skill.insertMany(initialSkills);
      console.log("Skills seeded successfully!");
    }

    const educationCount = await Education.countDocuments();
    if (educationCount === 0) {
      await Education.insertMany(initialEducation);
      console.log("Education timeline seeded successfully!");
    }

    const experienceCount = await Experience.countDocuments();
    if (experienceCount === 0) {
      await Experience.insertMany(initialExperience);
      console.log("Experience timeline seeded successfully!");
    }

    const projectsCount = await Project.countDocuments();
    if (projectsCount === 0) {
      await Project.insertMany(initialProjects);
      console.log("Projects seeded successfully!");
    }

    const achievementsCount = await Achievement.countDocuments();
    if (achievementsCount === 0) {
      await Achievement.insertMany(initialAchievements);
      console.log("Achievements seeded successfully!");
    }

    // Create default Admin User if not exists
    const adminCount = await User.countDocuments();
    if (adminCount === 0) {
      const adminPass = process.env.ADMIN_PASSWORD || "admin123";
      await User.create({
        username: process.env.ADMIN_USERNAME || "admin",
        password: adminPass
      });
      console.log(`Default admin user created! Username: admin, Password: ${adminPass}`);
    }

    console.log("Database Seeding Completed!");
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();

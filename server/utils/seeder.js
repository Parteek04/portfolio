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
  { name: "C++", level: 85, icon: "SiCplusplus", color: "#00599C", category: "Programming Languages" },
  { name: "Java", level: 75, icon: "DiJava", color: "#007396", category: "Programming Languages" },
  { name: "Python", level: 80, icon: "DiPython", color: "#3776AB", category: "Programming Languages" },
  // Web Dev
  { name: "HTML5/CSS3", level: 88, icon: "DiHtml5", color: "#E34F26", category: "Web Development" },
  { name: "JavaScript", level: 82, icon: "DiJavascript1", color: "#F7DF1E", category: "Web Development" },
  { name: "Tailwind CSS", level: 82, icon: "SiTailwindcss", color: "#06B6D4", category: "Web Development" },
  // Data Science
  { name: "NumPy & Pandas", level: 80, icon: "SiPandas", color: "#150458", category: "Data Science & Machine Learning" },
  { name: "Matplotlib & Seaborn", level: 78, icon: "SiPython", color: "#3776AB", category: "Data Science & Machine Learning" },
  { name: "Scikit-Learn", level: 75, icon: "SiScikitlearn", color: "#F7931E", category: "Data Science & Machine Learning" },
  { name: "TensorFlow & CNNs", level: 70, icon: "SiTensorflow", color: "#FF6F00", category: "Data Science & Machine Learning" },
  { name: "OpenCV", level: 72, icon: "SiOpencv", color: "#5C3EE6", category: "Data Science & Machine Learning" },
  { name: "Streamlit", level: 76, icon: "SiStreamlit", color: "#FF4B4B", category: "Data Science & Machine Learning" },
  // Databases
  { name: "SQL", level: 78, icon: "DiDatabase", color: "#4479A1", category: "Databases" },
  { name: "MongoDB", level: 74, icon: "DiMongodb", color: "#47A248", category: "Databases" },
  // Tools
  { name: "Git", level: 80, icon: "DiGit", color: "#F05032", category: "Tools & Platforms" },
  { name: "GitHub", level: 82, icon: "DiGithubBadge", color: "#ffffff", category: "Tools & Platforms" },
  { name: "Postman", level: 75, icon: "SiPostman", color: "#FF6C37", category: "Tools & Platforms" },
  // Soft Skills
  { name: "Problem Solving (DSA)", level: 85, icon: "SiLeetcode", color: "#FFA116", category: "Soft Skills" }
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
    role: "Full Stack Web Developer",
    company: "VideoChat Platform Project",
    location: "Remote / Self-Initiated",
    type: "Project",
    duration: "January 2026 - March 2026",
    description: [
      "Architected and built a production-grade real-time video calling platform supporting multi-user rooms, live chat, and screen sharing using WebRTC peer-to-peer protocols.",
      "Implemented Socket.IO-based signaling server on Node.js/Express backend to coordinate WebRTC offer/answer/ICE candidate exchange between browser clients.",
      "Designed a React.js frontend with room creation, join-by-code, and mute/camera-toggle controls — deployed live on Vercel with backend hosted on Render.",
      "Integrated real-time group text chat alongside video streams, enabling seamless in-call communication without page reloads."
    ],
    techStack: ["React.js", "Node.js", "Express.js", "Socket.IO", "WebRTC", "Tailwind CSS", "Vercel", "Render"]
  },
  {
    role: "Machine Learning & AI Engineer",
    company: "Self-Paced / Academic Projects",
    location: "Faridabad, India",
    type: "Training",
    duration: "August 2024 - December 2024",
    description: [
      "Completed comprehensive training in data cleaning, exploratory data analysis, and ML model building using Python ecosystem.",
      "Studied supervised and unsupervised learning algorithms, deep learning with CNNs, and computer vision using OpenCV.",
      "Built the Deepfake AI Video Detection system — a CNN-powered classifier achieving 92.4% validation accuracy on the FaceForensics++ benchmark.",
      "Developed 5+ ML mini-projects including sentiment analyzers, price predictors, and image classifiers using Scikit-Learn and TensorFlow."
    ],
    techStack: ["Python", "NumPy", "Pandas", "Scikit-Learn", "TensorFlow", "OpenCV", "Streamlit"]
  },
  {
    role: "Open Source Contributor & DSA Enthusiast",
    company: "GitHub / LeetCode / GeeksforGeeks",
    location: "Online",
    type: "Volunteering",
    duration: "2023 - Ongoing",
    description: [
      "Solved 200+ algorithmic problems on LeetCode and GeeksforGeeks, focusing on graphs, trees, dynamic programming, and greedy algorithms.",
      "Developed SchemeSathi — a MERN + ML government scheme recommendation platform with JWT authentication and rule-based ML filtering.",
      "Participated in university-level hackathons, collaborating in teams to build rapid prototypes under time-constrained environments.",
      "Contributed to open-source repositories with documentation improvements, bug reports, and minor code fixes."
    ],
    techStack: ["C++", "Java", "Python", "React.js", "Node.js", "MongoDB", "Git", "GitHub"]
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
    longDescription: "With the rise of generative AI, synthetic media manipulations pose massive social and security threats. This project builds a Deep Learning system combining OpenCV's facial land-marking with a Convolutional Network (CNN) trained on thousands of video frames.",
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
  },
  {
    title: "VideoChat Platform",
    subtitle: "Real-Time Multi-User Video Conferencing App",
    description: "A production-ready real-time video conferencing platform supporting multi-user rooms, live group chat, screen sharing, and camera/mic controls — built with WebRTC and Socket.IO.",
    longDescription: "VideoChat Platform is a full-stack real-time communication application that brings video calling, messaging, and screen sharing into one seamless interface. Leveraging the power of WebRTC for peer-to-peer media streaming and Socket.IO for signaling, the platform enables low-latency video calls without any plugin or native installation.",
    image: "/images/videochat.png",
    techStack: ["React.js", "Node.js", "Express.js", "Socket.IO", "WebRTC", "Tailwind CSS", "Vercel", "Render"],
    features: [
      "WebRTC peer-to-peer video/audio streaming with ICE candidate negotiation for low-latency calls across networks.",
      "Socket.IO signaling server managing room creation, user join/leave events, and offer/answer/ICE exchange.",
      "Real-time group text chat panel integrated alongside active video streams within the same room session."
    ],
    github: "https://github.com/kumar-parteek/videochat-platform",
    demo: "https://videochat-platform.vercel.app/",
    caseStudy: {
      problem: "Most existing video chat solutions are proprietary, closed-source, or require native apps and browser extensions.",
      solution: "Built a minimal but production-grade WebRTC platform from scratch using a Node.js/Socket.IO signaling server and a React.js frontend.",
      challenges: [
        "Handling NAT traversal and ICE candidate trickle across different network environments without a dedicated TURN server.",
        "Synchronizing room state (participants, media tracks) across all peers when a user joins mid-session."
      ],
      results: "Successfully deployed to Vercel and Render with sub-500ms connection establishment on local networks."
    },
    futureImprovements: [
      "Integrate a TURN server (Coturn) for reliable NAT traversal.",
      "Add recording functionality using MediaRecorder API."
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

    // Clear existing collections to refresh with clean updated data
    await Promise.all([
      Skill.deleteMany({}),
      Education.deleteMany({}),
      Experience.deleteMany({}),
      Project.deleteMany({}),
      Achievement.deleteMany({}),
      User.deleteMany({}),
      Setting.deleteMany({})
    ]);

    await Skill.insertMany(initialSkills);
    console.log("Skills seeded successfully!");

    await Education.insertMany(initialEducation);
    console.log("Education timeline seeded successfully!");

    await Experience.insertMany(initialExperience);
    console.log("Experience timeline seeded successfully!");

    await Project.insertMany(initialProjects);
    console.log("Projects seeded successfully!");

    await Achievement.insertMany(initialAchievements);
    console.log("Achievements seeded successfully!");

    // Create default Settings
    await Setting.create({
      siteName: "Parteek Goyal Portfolio",
      visitorCount: 100,
      contact: {
        email: "kumarparteek701@gmail.com",
        phone: "+91-9350046554",
        address: "Panipat, Haryana, India"
      }
    });
    console.log("Site Settings initialized successfully!");

    // Create default Admin User
    const adminPass = process.env.ADMIN_PASSWORD || "admin123";
    await User.create({
      username: process.env.ADMIN_USERNAME || "admin",
      password: adminPass
    });
    console.log(`Default admin user created! Username: admin, Password: ${adminPass}`);

    console.log("Database Seeding Completed!");
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();

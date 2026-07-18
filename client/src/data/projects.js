export const projectsData = [
  {
    id: "proj-1",
    title: "SchemeSathi",
    subtitle: "Government Scheme Recommendation System",
    description: "A rule-based and machine-learning-driven platform that recommends central and state government schemes based on user eligibility criteria (income, occupation, caste, age, state).",
    longDescription: "SchemeSathi is designed to bridge the awareness gap between the government's social welfare schemes and the eligible citizens, especially in rural areas. By processing income brackets, demographics, state residency, and employment statuses, the system filters out hundreds of complex eligibility descriptions into a personalized list of actionable recommendations. The project features a responsive modern dashboard, multi-lingual structure preparation, and comparison tools to empower users in selecting the best support schemes.",
    image: "/images/schemesathi.png",
    techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "Python", "Scikit-Learn", "JWT", "Tailwind CSS"],
    features: [
      "Custom ML classification and rule-based filter engine matching users to hundreds of government schemes.",
      "Secure user profile management with JWT authentication enabling saving, tracking, and comparing schemes.",
      "Comprehensive dashboards displaying eligibility match scores and detailed steps to apply.",
      "Clean, responsive interface matching accessibility standards for diverse, rural, and urban demographics."
    ],
    github: "https://github.com/kumar-parteek/SchemeSathi",
    demo: "https://schemesathi.vercel.app",
    caseStudy: {
      problem: "Millions of citizens miss out on essential welfare benefits due to the complex, fragmented, and bureaucratic nature of scheme details. Normal users find it difficult to read through long legalese lists to understand if they qualify.",
      solution: "We digitized scheme definitions into structured rules in MongoDB and combined them with a simple Python classification endpoint. The user fills a 1-minute profile form, and the system instantly evaluates matching percentages.",
      challenges: [
        "Structuring inconsistent and vague eligibility rules from different state government portals into a singular JSON schema.",
        "Optimizing MongoDB queries to evaluate multi-condition boolean matches across millions of permutations quickly.",
        "Designing an interface that stays high-performing on low-bandwidth rural connections."
      ],
      results: "Achieved 96% accuracy in predicting scheme eligibility compared to manual evaluations. Under simulated testing, the dashboard loaded in under 1.2 seconds on 3G connections, making it viable for rural deployments."
    },
    futureImprovements: [
      "Integrate an automated Web Scraper using Python to fetch and update schemes as they are launched on official sites.",
      "Build a lightweight mobile app (React Native) with offline mode support.",
      "Integrate WhatsApp notification APIs to alert subscribed users when application windows open."
    ]
  },
  {
    id: "proj-2",
    title: "Deepfake AI Video Detection",
    subtitle: "Facial Feature Manipulation Classification System",
    description: "An AI-powered system designed to analyze and classify videos as 'real' or 'fake' by evaluating micro-expressions, facial landmarks, and convolutional manipulation artifacts.",
    longDescription: "With the rise of generative AI, synthetic media manipulations pose massive social and security threats. This project builds a Deep Learning system combining OpenCV's facial land-marking with a Convolutional Neural Network (CNN) trained on thousands of video frames. The model processes video inputs frame-by-frame, extracts facial regions, analyzes consistency in blinking and mouth boundaries, and outputs a confidence score for video authenticity.",
    image: "/images/deepfake.png",
    techStack: ["Python", "CNN", "OpenCV", "TensorFlow", "Keras", "Streamlit", "NumPy", "Matplotlib"],
    features: [
      "Real-time video upload and frame decomposition utilizing OpenCV's video pipelines.",
      "High-precision facial landmark extraction isolating manipulation artifacts (e.g., eye borders, teeth shapes, nose grids).",
      "Custom CNN model built in TensorFlow, utilizing pre-trained ResNet/VGG feature bases to flag spatial discrepancies.",
      "Web interface powered by Streamlit for easy, interactive testing of files by general users."
    ],
    github: "https://github.com/kumar-parteek/deepfake-detection",
    demo: "https://deepfake-detect.streamlit.app",
    caseStudy: {
      problem: "Deepfake generation models have reached a level where human eyes cannot differentiate synthesized faces. Current detection utilities are slow, bulky, and require massive workstation clusters.",
      solution: "Created a hybrid framework that uses OpenCV to pre-process and isolate only the facial regions first, reducing the visual data sent to the heavy deep learning model. This allows running inferences on standard CPU laptops.",
      challenges: [
        "Handling temporal frame jitter and compression noise in social-media-compressed videos.",
        "Classifying synthetic faces under extreme angles, bad lighting, or quick head rotations.",
        "Avoiding high false-positive rates when analyzing low-quality, legitimate camera feeds."
      ],
      results: "Trained model achieved 92.4% validation accuracy on the FaceForensics++ benchmark. Streamlit UI displays frame-by-frame analysis plots in real-time, helping forensic hobbyists inspect specific seconds of video."
    },
    futureImprovements: [
      "Incorporate LSTM/RNN layers to capture temporal inconsistencies across frames, detecting audio-to-mouth sync mismatches.",
      "Create a browser extension to scan and warn users about deepfakes directly on YouTube or social feeds.",
      "Optimize model using TensorRT to double the processing speed of live streams."
    ]
  },
  {
    id: "proj-3",
    title: "VideoChat Platform",
    subtitle: "Real-Time Multi-User Video Conferencing App",
    description: "A production-ready real-time video conferencing platform supporting multi-user rooms, live group chat, screen sharing, and camera/mic controls — built with WebRTC and Socket.IO.",
    longDescription: "VideoChat Platform is a full-stack real-time communication application that brings video calling, messaging, and screen sharing into one seamless interface. Leveraging the power of WebRTC for peer-to-peer media streaming and Socket.IO for signaling, the platform enables low-latency video calls without any plugin or native installation. Users can create or join rooms using a unique code, toggle their camera and microphone, share their screen, and exchange text messages — all within the same browser session. The project is fully deployed with the React frontend on Vercel and the Node.js signaling backend on Render.",
    image: "/images/videochat.png",
    techStack: ["React.js", "Node.js", "Express.js", "Socket.IO", "WebRTC", "Tailwind CSS", "Vercel", "Render"],
    features: [
      "WebRTC peer-to-peer video/audio streaming with ICE candidate negotiation for low-latency calls across networks.",
      "Socket.IO signaling server managing room creation, user join/leave events, and offer/answer/ICE exchange.",
      "Real-time group text chat panel integrated alongside active video streams within the same room session.",
      "In-call controls: mute microphone, disable camera, share screen, and leave room — all without page reload."
    ],
    github: "https://github.com/kumar-parteek/videochat-platform",
    demo: "https://videochat-platform.vercel.app/",
    caseStudy: {
      problem: "Most existing video chat solutions are proprietary, closed-source, or require native apps and browser extensions. Developers and students need an open, understandable reference implementation of real-time WebRTC-based communication.",
      solution: "Built a minimal but production-grade WebRTC platform from scratch using a Node.js/Socket.IO signaling server and a React.js frontend. The architecture is intentionally clean and modular so each piece — signaling, peer connection, media streams — can be studied independently.",
      challenges: [
        "Handling NAT traversal and ICE candidate trickle across different network environments without a dedicated TURN server.",
        "Synchronizing room state (participants, media tracks) across all peers when a user joins mid-session or leaves abruptly.",
        "Implementing screen sharing alongside camera streams without disrupting active peer connections."
      ],
      results: "Successfully deployed to Vercel and Render with sub-500ms connection establishment on local networks. Supports up to 4 concurrent participants in a room with stable video/audio, tested across Chrome and Firefox."
    },
    futureImprovements: [
      "Integrate a TURN server (Coturn) for reliable NAT traversal in highly restricted corporate networks.",
      "Add recording functionality using MediaRecorder API to save sessions locally or upload to cloud storage.",
      "Build a waiting room / lobby system with admin controls to admit, mute, or remove participants."
    ]
  }
];


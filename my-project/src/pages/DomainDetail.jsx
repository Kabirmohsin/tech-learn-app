import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DomainDetail = () => {
  const { domainId } = useParams();
  const navigate = useNavigate();
  const [activeVideo, setActiveVideo] = useState(0);

  const domainData = {
    "web-dev": {
      title: "Web Development",
      emoji: "🖥️",
      description:
        "Web Development is the practice of building websites and web applications that run in browsers.",
      detailedDescription:
        "Web development has evolved from simple HTML pages to complex full-stack applications with dynamic frontends, REST APIs, and scalable backends. Modern web development includes responsive design, progressive web apps, and real-time features.",
      tools: [
        { name: "React", icon: "⚛️", description: "Library for building UIs" },
        { name: "Node.js", icon: "🟢", description: "Server-side runtime" },
        { name: "JavaScript", icon: "📜", description: "Web programming language" },
        { name: "CSS", icon: "🎨", description: "Styling and layout" },
        { name: "HTML5", icon: "🌐", description: "Markup language" },
        { name: "MongoDB", icon: "🍃", description: "NoSQL database" },
        { name: "Express", icon: "🚂", description: "Backend framework" },
        { name: "Git", icon: "📚", description: "Version control" },
      ],
      videos: [
        {
          id: 1,
          title: "Web Development Full Course (HTML, CSS, JS, React)",
          link: "https://www.youtube.com/embed/Q33KBiDriJY",
          duration: "4:40:00",
          notes: [
            "HTML & CSS basics",
            "JavaScript fundamentals",
            "Responsive layouts",
            "React introduction",
          ],
        },
        {
          id: 2,
          title: "React.js Crash Course 2025",
          link: "https://www.youtube.com/embed/w7ejDZ8SWv8",
          duration: "2:05:00",
          notes: [
            "React components & hooks",
            "Router setup",
            "API calls with Axios",
            "Project setup and deployment",
          ],
        },
        {
          id: 3,
          title: "Node.js + Express + MongoDB Full Stack App",
          link: "https://www.youtube.com/embed/Oe421EPjeBE",
          duration: "3:15:00",
          notes: [
            "Express server setup",
            "MongoDB integration",
            "REST API creation",
            "Authentication with JWT",
          ],
        },
      ],
    },

    android: {
      title: "Android Development",
      emoji: "📱",
      description:
        "Android Development involves creating applications for devices running the Android OS.",
      detailedDescription:
        "Android development has evolved from Java to Kotlin as the preferred language. Modern Android focuses on Jetpack Compose, Material Design, and scalable app architecture with MVVM pattern and Room database.",
      tools: [
        { name: "Kotlin", icon: "🔷", description: "Modern language" },
        { name: "Java", icon: "☕", description: "Traditional Android language" },
        { name: "Android Studio", icon: "🤖", description: "Official IDE" },
        { name: "Material Design", icon: "🎨", description: "UI design system" },
        { name: "Firebase", icon: "🔥", description: "Backend services" },
        { name: "Room DB", icon: "🏠", description: "Local database" },
        { name: "Retrofit", icon: "🔌", description: "HTTP client" },
        { name: "Coroutines", icon: "🔄", description: "Async programming" },
      ],
      videos: [
        {
          id: 1,
          title: "Android Development for Beginners (Kotlin)",
          link: "https://www.youtube.com/embed/BBWyXo-3JGQ",
          duration: "2:30:00",
          notes: [
            "Kotlin basics",
            "Android Studio setup",
            "Layouts & Views",
            "Building your first app",
          ],
        },
        {
  id: 2,
  title: "Jetpack Compose Crash Course (Simplified Coding)",
  link: "https://www.youtube.com/embed/Q9MtlmmN4Q0", // ✅ this one works inside iframe
  duration: "1:45:00",
  notes: [
    "Modern UI toolkit (Jetpack Compose)",
    "Composable functions",
    "State management",
    "Material 3 integration",
  ],
},
      ],
    },

    "data-science": {
      title: "Data Science",
      emoji: "📊",
      description:
        "Data Science involves extracting insights from data using statistics, programming, and machine learning.",
      detailedDescription:
        "Data Science combines programming (mostly Python), data visualization, and statistical modeling to build insights and predictions from raw data. It includes data cleaning, exploratory analysis, machine learning, and data visualization.",
      tools: [
        { name: "Python", icon: "🐍", description: "Primary programming language" },
        { name: "Pandas", icon: "🐼", description: "Data manipulation" },
        { name: "NumPy", icon: "🔢", description: "Numerical computing" },
        { name: "Matplotlib", icon: "📈", description: "Data visualization" },
        { name: "Scikit-learn", icon: "⚙️", description: "Machine learning" },
        { name: "SQL", icon: "🗃️", description: "Database querying" },
        { name: "Jupyter", icon: "📓", description: "Interactive notebooks" },
        { name: "TensorFlow", icon: "🧠", description: "Deep learning framework" },
      ],
      videos: [
        {
          id: 1,
          title: "Python for Data Science Full Course",
          link: "https://www.youtube.com/embed/LHBE6Q9XlzI",
          duration: "6:15:00",
          notes: [
            "Data cleaning with Pandas",
            "Visualization with Matplotlib",
            "Machine learning basics",
            "Project walkthrough",
          ],
        },
        {
          id: 2,
          title: "Machine Learning Crash Course (Scikit-learn)",
          link: "https://www.youtube.com/embed/GwIo3gDZCVQ",
          duration: "1:30:00",
          notes: [
            "Supervised vs unsupervised learning",
            "Model evaluation",
            "Regression & classification",
            "Real-world examples",
          ],
        },
      ],
    },

    devops: {
      title: "DevOps",
      emoji: "⚙️",
      description:
        "DevOps focuses on collaboration between development and operations teams to achieve faster deployment and reliability.",
      detailedDescription:
        "DevOps practices improve collaboration, CI/CD, containerization, and infrastructure management for seamless software delivery. It emphasizes automation, monitoring, and continuous improvement throughout the software lifecycle.",
      tools: [
        { name: "Docker", icon: "🐳", description: "Containerization" },
        { name: "Kubernetes", icon: "☸️", description: "Container orchestration" },
        { name: "AWS", icon: "☁️", description: "Cloud platform" },
        { name: "Jenkins", icon: "🔧", description: "CI/CD automation" },
        { name: "Terraform", icon: "🏗️", description: "Infrastructure as code" },
        { name: "GitLab CI", icon: "🦊", description: "Continuous integration" },
        { name: "Prometheus", icon: "📊", description: "Monitoring system" },
        { name: "Ansible", icon: "⚡", description: "Configuration management" },
      ],
      videos: [
        {
          id: 1,
          title: "DevOps Full Course (Docker, Jenkins, Kubernetes, AWS)",
          link: "https://www.youtube.com/embed/0yWAtQ6wYNM",
          duration: "5:00:00",
          notes: [
            "CI/CD pipeline setup",
            "Container orchestration",
            "Infrastructure automation",
            "Monitoring and logging",
          ],
        },
        {
          id: 2,
          title: "Docker & Kubernetes Crash Course",
          link: "https://www.youtube.com/embed/9zUHg7xjIqQ",
          duration: "2:00:00",
          notes: [
            "Containerization concepts",
            "Docker Compose",
            "Kubernetes deployments",
            "Scaling and services",
          ],
        },
      ],
    },
  };

  const currentDomain = domainData[domainId] || domainData["web-dev"];

  const handleStartQuiz = () => {
    // Navigate to QuizPage.jsx
    navigate(`/quiz/${domainId}`);
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Hero Header */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <button
            onClick={handleBackClick}
            className="mb-8 px-6 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
          >
            <span>←</span>
            <span>Back to Home</span>
          </button>
          <div className="text-center">
            <div className="text-6xl md:text-8xl mb-6 transform hover:scale-110 transition-transform duration-500">
              {currentDomain.emoji}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {currentDomain.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {currentDomain.description}
            </p>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </section>

      {/* Section 1: Detailed Description */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              About {currentDomain.title}
            </h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              {currentDomain.detailedDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Tools & Technologies */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Tools & Technologies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {currentDomain.tools.map((tool, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:bg-white/10 group"
              >
                <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                  {tool.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
                <p className="text-gray-400 text-sm">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 & 4: Video Tutorials with Notes */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Video Tutorials
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Video Player */}
            <div className="space-y-6">
              {currentDomain.videos.map((video, index) => (
                <div 
                  key={video.id}
                  className={`bg-white/5 backdrop-blur-lg border rounded-2xl p-6 cursor-pointer transform transition-all duration-300 ${
                    activeVideo === index 
                      ? 'border-blue-500 scale-105 bg-white/10' 
                      : 'border-white/10 hover:scale-105 hover:bg-white/10'
                  }`}
                  onClick={() => setActiveVideo(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-3">
                      📺
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{video.title}</h3>
                      <div className="flex items-center space-x-4 text-gray-400">
                        <span>⏱️ {video.duration}</span>
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          activeVideo === index 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white/10'
                        }`}>
                          {activeVideo === index ? 'Playing' : 'Play'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Video Player and Notes */}
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden">
                <iframe
                  className="w-full aspect-video"
                  src={currentDomain.videos[activeVideo].link}
                  title={currentDomain.videos[activeVideo].title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {currentDomain.videos[activeVideo].title}
                  </h3>
                  <button
                    onClick={() => window.open(currentDomain.videos[activeVideo].link.replace('/embed/', '/watch?v='), '_blank')}
                    className="w-full py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 border border-white/20"
                  >
                    <span>🎬 Watch on YouTube</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* Video Notes */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-200">
                  📝 Key Learning Points
                </h3>
                <div className="space-y-3">
                  {currentDomain.videos[activeVideo].notes.map((note, index) => (
                    <div 
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <span className="text-blue-400 text-lg">•</span>
                      <p className="text-gray-300 leading-relaxed">{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Start Quiz Button */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-lg border border-white/10 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Ready to Test Your Knowledge?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Take our interactive quiz to assess your understanding of {currentDomain.title} concepts and track your learning progress.
            </p>
            <button
              onClick={handleStartQuiz}
              className="px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-xl shadow-2xl shadow-blue-500/25 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 border border-white/20"
            >
              🚀 Start Quiz Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="container mx-auto text-center text-gray-400">
          <p>© 2024 Skill Path. Master {currentDomain.title} with expert guidance.</p>
        </div>
      </footer>
    </div>
  );
};

export default DomainDetail;
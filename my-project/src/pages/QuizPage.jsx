import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ ADD useNavigate
import QuizQuestion from "../components/QuizQuestion";
import jsPDF from "jspdf";
import { API_URL } from "../config";

const QuizPage = () => {
  const { domainId } = useParams();
  const navigate = useNavigate(); // ✅ ADD navigate
  const certRef = useRef();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [userName, setUserName] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [isGenerating, setIsGenerating] = useState(false);

  const quizData = {
    "web-dev": {
      title: "Web Development",
      emoji: "🖥️",
      questions: [
        {
          id: 1,
          question: "What does HTML stand for?",
          options: [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Hyper Transfer Markup Language",
            "Home Tool Markup Language",
          ],
          correctAnswer: 0,
        },
        {
          id: 2,
          question: "Which of the following is NOT a JavaScript framework?",
          options: ["React", "Vue", "Angular", "Python"],
          correctAnswer: 3,
        },
        {
          id: 3,
          question: "What is the purpose of CSS?",
          options: [
            "To structure web pages",
            "To style and layout web pages",
            "To add interactivity to web pages",
            "To store data",
          ],
          correctAnswer: 1,
        },
        {
          id: 4,
          question: "Which HTTP method is used to retrieve data from a server?",
          options: ["POST", "GET", "PUT", "DELETE"],
          correctAnswer: 1,
        },
        {
          id: 5,
          question: "What is React primarily used for?",
          options: [
            "Backend development",
            "Database management",
            "Building user interfaces",
            "Server configuration",
          ],
          correctAnswer: 2,
        },
      ],
    },
    android: {
      title: "Android Development",
      emoji: "📱",
      questions: [
        {
          id: 1,
          question:
            "Which language is officially supported for Android development?",
          options: ["Java", "Kotlin", "Swift", "Both Java and Kotlin"],
          correctAnswer: 3,
        },
        {
          id: 2,
          question: "What is an Activity in Android?",
          options: [
            "A background service",
            "A single screen with user interface",
            "A database table",
            "A network request",
          ],
          correctAnswer: 1,
        },
        {
          id: 3,
          question: "Which file contains the app configuration in Android?",
          options: [
            "AndroidManifest.xml",
            "config.json",
            "app.settings",
            "build.gradle",
          ],
          correctAnswer: 0,
        },
        {
          id: 4,
          question: "What is Gradle used for in Android?",
          options: [
            "UI design",
            "Build automation",
            "Database management",
            "Network calls",
          ],
          correctAnswer: 1,
        },
        {
          id: 5,
          question: "Which component is used for background tasks in Android?",
          options: ["Activity", "Service", "Fragment", "View"],
          correctAnswer: 1,
        },
      ],
    },
    "data-science": {
      title: "Data Science",
      emoji: "📊",
      questions: [
        {
          id: 1,
          question: "What is the primary purpose of Pandas in Python?",
          options: [
            "Data visualization",
            "Data manipulation and analysis",
            "Machine learning",
            "Web development",
          ],
          correctAnswer: 1,
        },
        {
          id: 2,
          question: "Which of the following is NOT a supervised learning algorithm?",
          options: ["Linear Regression", "K-Means", "Decision Trees", "SVM"],
          correctAnswer: 1,
        },
        {
          id: 3,
          question: "What does 'EDA' stand for in Data Science?",
          options: [
            "Exploratory Data Analysis",
            "Extended Data Assessment",
            "External Data Aggregation",
            "Enterprise Data Architecture",
          ],
          correctAnswer: 0,
        },
        {
          id: 4,
          question: "Which library is commonly used for data visualization in Python?",
          options: ["Matplotlib", "NumPy", "Scikit-learn", "TensorFlow"],
          correctAnswer: 0,
        },
        {
          id: 5,
          question: "What is the purpose of feature scaling in machine learning?",
          options: [
            "To reduce dataset size",
            "To normalize feature ranges",
            "To remove outliers",
            "To add new features",
          ],
          correctAnswer: 1,
        },
      ],
    },
    devops: {
      title: "DevOps",
      emoji: "🔧",
      questions: [
        {
          id: 1,
          question: "What is the main goal of DevOps?",
          options: [
            "To separate development and operations",
            "To automate everything",
            "To improve collaboration between development and operations",
            "To reduce costs",
          ],
          correctAnswer: 2,
        },
        {
          id: 2,
          question: "Which tool is used for containerization?",
          options: ["Jenkins", "Docker", "Kubernetes", "Ansible"],
          correctAnswer: 1,
        },
        {
          id: 3,
          question: "What is CI/CD in DevOps?",
          options: [
            "Continuous Integration/Continuous Deployment",
            "Code Integration/Code Deployment",
            "Continuous Inspection/Continuous Delivery",
            "Container Integration/Container Deployment",
          ],
          correctAnswer: 0,
        },
        {
          id: 4,
          question: "Which of the following is an infrastructure as code tool?",
          options: ["Terraform", "Git", "Selenium", "Nagios"],
          correctAnswer: 0,
        },
        {
          id: 5,
          question: "What is the purpose of Kubernetes?",
          options: [
            "To automate testing",
            "To manage containerized applications",
            "To monitor applications",
            "To deploy code",
          ],
          correctAnswer: 1,
        },
      ],
    },
    "cloud-computing": {
      title: "Cloud Computing",
      emoji: "☁️",
      questions: [
        {
          id: 1,
          question: "What is the main advantage of cloud computing?",
          options: [
            "Higher security",
            "Cost savings and scalability",
            "Faster internet",
            "Better hardware",
          ],
          correctAnswer: 1,
        },
        {
          id: 2,
          question: "Which service model provides hardware and software?",
          options: ["IaaS", "PaaS", "SaaS", "FaaS"],
          correctAnswer: 1,
        },
        {
          id: 3,
          question: "What does AWS stand for?",
          options: [
            "Amazon Web Services",
            "Advanced Web Solutions",
            "Automated Web Systems",
            "Application Web Services",
          ],
          correctAnswer: 0,
        },
        {
          id: 4,
          question: "Which cloud deployment model is for single organization use?",
          options: ["Public Cloud", "Private Cloud", "Hybrid Cloud", "Community Cloud"],
          correctAnswer: 1,
        },
        {
          id: 5,
          question: "What is serverless computing?",
          options: [
            "Running without servers",
            "Cloud provider manages server infrastructure",
            "Using only mobile servers",
            "Peer-to-peer computing",
          ],
          correctAnswer: 1,
        },
      ],
    },
    cybersecurity: {
      title: "Cyber Security",
      emoji: "🔒",
      questions: [
        {
          id: 1,
          question: "What is phishing?",
          options: [
            "A fishing technique",
            "A type of malware",
            "A social engineering attack",
            "A network protocol",
          ],
          correctAnswer: 2,
        },
        {
          id: 2,
          question: "What does VPN stand for?",
          options: [
            "Virtual Private Network",
            "Verified Private Network",
            "Virtual Public Network",
            "Verified Public Network",
          ],
          correctAnswer: 0,
        },
        {
          id: 3,
          question: "Which is the most secure authentication method?",
          options: [
            "Password",
            "Two-factor authentication",
            "Security questions",
            "PIN",
          ],
          correctAnswer: 1,
        },
        {
          id: 4,
          question: "What is encryption used for?",
          options: [
            "To compress data",
            "To hide data from unauthorized access",
            "To speed up data transfer",
            "To backup data",
          ],
          correctAnswer: 1,
        },
        {
          id: 5,
          question: "What is a firewall?",
          options: [
            "A physical security barrier",
            "A network security system",
            "A type of virus",
            "A data encryption tool",
          ],
          correctAnswer: 1,
        },
      ],
    },
    "ai-ml": {
      title: "AI & Machine Learning",
      emoji: "🤖",
      questions: [
        {
          id: 1,
          question: "What is the difference between AI and Machine Learning?",
          options: [
            "They are the same thing",
            "AI is broader, ML is a subset of AI",
            "ML is broader, AI is a subset of ML",
            "They are completely different",
          ],
          correctAnswer: 1,
        },
        {
          id: 2,
          question: "Which algorithm is used for classification problems?",
          options: ["Linear Regression", "K-Means", "Logistic Regression", "Apriori"],
          correctAnswer: 2,
        },
        {
          id: 3,
          question: "What is overfitting in machine learning?",
          options: [
            "Model performs well on training data but poorly on new data",
            "Model performs poorly on all data",
            "Model is too simple",
            "Model takes too long to train",
          ],
          correctAnswer: 0,
        },
        {
          id: 4,
          question: "What is TensorFlow primarily used for?",
          options: [
            "Data analysis",
            "Machine learning and deep learning",
            "Web development",
            "Database management",
          ],
          correctAnswer: 1,
        },
        {
          id: 5,
          question: "What is reinforcement learning?",
          options: [
            "Learning from labeled data",
            "Learning from unlabeled data",
            "Learning through rewards and punishments",
            "Learning from user feedback",
          ],
          correctAnswer: 2,
        },
      ],
    },
  };

  const currentQuiz = quizData[domainId] || quizData["web-dev"];
  const totalQuestions = currentQuiz.questions.length;

  // ✅ UPDATED: Save certificate to backend with production API URL
  const saveToBackend = async (certificateData) => {
    try {
      const response = await fetch(`${API_URL}/certificates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(certificateData)
      });
      
      if (response.ok) {
        console.log('✅ Certificate saved to database');
      } else {
        console.log('❌ Failed to save to database');
      }
    } catch (error) {
      console.error('❌ Error saving to backend:', error);
    }
  };

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !showScore) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showScore) {
      handleSubmit();
    }
  }, [timeLeft, showScore]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleOptionSelect = (questionId, optionIndex) =>
    setSelectedOptions((prev) => ({ ...prev, [questionId]: optionIndex }));

  const handleNext = () =>
    currentQuestion < totalQuestions - 1 &&
    setCurrentQuestion((prev) => prev + 1);

  const handlePrevious = () =>
    currentQuestion > 0 && setCurrentQuestion((prev) => prev - 1);

  const handleSubmit = () => {
    let calculatedScore = 0;
    currentQuiz.questions.forEach((q) => {
      if (selectedOptions[q.id] === q.correctAnswer) calculatedScore++;
    });
    setScore(calculatedScore);
    setShowScore(true);
  };

  const handleGenerateCertificate = () =>
    userName.trim() && setShowCertificate(true);

  // ✅ UPDATED: Generate HTML Certificate (Same as Navbar)
  const handleViewCertificate = async () => {
    if (!userName.trim() || isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      const certificateData = {
        id: `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userName: userName.trim(),
        domain: currentQuiz.title,
        score: score,
        totalQuestions: totalQuestions,
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        timestamp: new Date().toISOString()
      };

      const percentage = Math.round((score / totalQuestions) * 100);
      const performance = score >= totalQuestions * 0.8 ? 'Excellent' : 
                        score >= totalQuestions * 0.6 ? 'Good' : 'Pass';
      const certificateId = certificateData.id.slice(-8);

      // ✅ NAVBAR JESA SAME CERTIFICATE DESIGN
      const certificateHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Certificate - ${certificateData.userName}</title>
          <meta charset="UTF-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Inter', sans-serif; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            .certificate {
              background: white;
              border-radius: 20px;
              padding: 40px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              max-width: 800px;
              width: 100%;
              text-align: center;
              border: 8px solid #f59e0b;
              position: relative;
            }
            .certificate::before {
              content: '';
              position: absolute;
              top: -4px; left: -4px; right: -4px; bottom: -4px;
              border: 4px solid #fbbf24;
              border-radius: 24px;
              pointer-events: none;
            }
            .logo { 
              font-size: 24px; 
              font-weight: 900; 
              color: #1e293b;
              margin-bottom: 10px;
            }
            .title { 
              font-size: 36px; 
              font-weight: 800; 
              color: #1e293b;
              margin-bottom: 30px;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .subtitle {
              font-size: 18px;
              color: #64748b;
              margin-bottom: 40px;
              font-weight: 500;
            }
            .username {
              font-size: 48px;
              font-weight: 900;
              color: #d97706;
              margin: 40px 0;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .achievement {
              font-size: 24px;
              color: #374151;
              margin-bottom: 30px;
              font-weight: 600;
            }
            .score {
              font-size: 20px;
              color: #059669;
              font-weight: 700;
              margin: 20px 0;
            }
            .details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin: 40px 0;
              background: #f8fafc;
              padding: 20px;
              border-radius: 12px;
            }
            .detail-item {
              text-align: center;
            }
            .detail-label {
              font-size: 14px;
              color: #64748b;
              font-weight: 500;
              margin-bottom: 5px;
            }
            .detail-value {
              font-size: 18px;
              color: #1e293b;
              font-weight: 700;
            }
            .date {
              font-size: 16px;
              color: #6b7280;
              margin-top: 30px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .signature {
              text-align: center;
            }
            .signature-line {
              width: 200px;
              height: 1px;
              background: #374151;
              margin: 5px auto;
            }
            @media print {
              body { background: white !important; }
              .certificate { 
                box-shadow: none !important; 
                border: 4px solid #f59e0b !important;
                margin: 0;
                border-radius: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="logo">🎓 Tech Learn</div>
            <h1 class="title">Certificate of Completion</h1>
            <p class="subtitle">This is to certify that</p>
            
            <div class="username">${certificateData.userName}</div>
            
            <div class="achievement">
              has successfully completed the<br>
              <strong>${certificateData.domain} Quiz</strong>
            </div>
            
            <div class="score">
              Score: ${certificateData.score} out of ${certificateData.totalQuestions} 
              (${percentage}%)
            </div>
            
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Domain</div>
                <div class="detail-value">${certificateData.domain}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Performance</div>
                <div class="detail-value">${performance}</div>
              </div>
            </div>
            
            <div class="date">
              Awarded on: ${certificateData.date}
            </div>
            
            <div class="footer">
              <div class="signature">
                <div class="signature-line"></div>
                <div>Tech Learn Team</div>
              </div>
              <div class="signature">
                <div class="signature-line"></div>
                <div>Certificate ID: ${certificateId}</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      // View certificate in new window
      const newWindow = window.open('', '_blank', 'width=900,height=700');
      newWindow.document.write(certificateHTML);
      newWindow.document.close();
      newWindow.focus();

      // ✅ UPDATED: Save to storage (with backend)
      await saveCertificateToStorage(certificateData);
      
    } catch (error) {
      console.error('❌ Error generating certificate:', error);
      alert('Error generating certificate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // ✅ UPDATED: Download HTML Certificate (Same as Navbar)
  const handleDownloadCertificate = async () => {
    if (!userName.trim() || isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      const certificateData = {
        id: `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userName: userName.trim(),
        domain: currentQuiz.title,
        score: score,
        totalQuestions: totalQuestions,
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        timestamp: new Date().toISOString()
      };

      const percentage = Math.round((score / totalQuestions) * 100);
      const performance = score >= totalQuestions * 0.8 ? 'Excellent' : 
                        score >= totalQuestions * 0.6 ? 'Good' : 'Pass';
      const certificateId = certificateData.id.slice(-8);

      // ✅ NAVBAR JESA SAME CERTIFICATE DESIGN
      const certificateHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Certificate - ${certificateData.userName}</title>
          <meta charset="UTF-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Inter', sans-serif; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            .certificate {
              background: white;
              border-radius: 20px;
              padding: 40px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              max-width: 800px;
              width: 100%;
              text-align: center;
              border: 8px solid #f59e0b;
              position: relative;
            }
            .certificate::before {
              content: '';
              position: absolute;
              top: -4px; left: -4px; right: -4px; bottom: -4px;
              border: 4px solid #fbbf24;
              border-radius: 24px;
              pointer-events: none;
            }
            .logo { 
              font-size: 24px; 
              font-weight: 900; 
              color: #1e293b;
              margin-bottom: 10px;
            }
            .title { 
              font-size: 36px; 
              font-weight: 800; 
              color: #1e293b;
              margin-bottom: 30px;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .subtitle {
              font-size: 18px;
              color: #64748b;
              margin-bottom: 40px;
              font-weight: 500;
            }
            .username {
              font-size: 48px;
              font-weight: 900;
              color: #d97706;
              margin: 40px 0;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .achievement {
              font-size: 24px;
              color: #374151;
              margin-bottom: 30px;
              font-weight: 600;
            }
            .score {
              font-size: 20px;
              color: #059669;
              font-weight: 700;
              margin: 20px 0;
            }
            .details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin: 40px 0;
              background: #f8fafc;
              padding: 20px;
              border-radius: 12px;
            }
            .detail-item {
              text-align: center;
            }
            .detail-label {
              font-size: 14px;
              color: #64748b;
              font-weight: 500;
              margin-bottom: 5px;
            }
            .detail-value {
              font-size: 18px;
              color: #1e293b;
              font-weight: 700;
            }
            .date {
              font-size: 16px;
              color: #6b7280;
              margin-top: 30px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .signature {
              text-align: center;
            }
            .signature-line {
              width: 200px;
              height: 1px;
              background: #374151;
              margin: 5px auto;
            }
            @media print {
              body { background: white !important; }
              .certificate { 
                box-shadow: none !important; 
                border: 4px solid #f59e0b !important;
                margin: 0;
                border-radius: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="logo">🎓 Tech Learn</div>
            <h1 class="title">Certificate of Completion</h1>
            <p class="subtitle">This is to certify that</p>
            
            <div class="username">${certificateData.userName}</div>
            
            <div class="achievement">
              has successfully completed the<br>
              <strong>${certificateData.domain} Quiz</strong>
            </div>
            
            <div class="score">
              Score: ${certificateData.score} out of ${certificateData.totalQuestions} 
              (${percentage}%)
            </div>
            
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Domain</div>
                <div class="detail-value">${certificateData.domain}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Performance</div>
                <div class="detail-value">${performance}</div>
              </div>
            </div>
            
            <div class="date">
              Awarded on: ${certificateData.date}
            </div>
            
            <div class="footer">
              <div class="signature">
                <div class="signature-line"></div>
                <div>Tech Learn Team</div>
              </div>
              <div class="signature">
                <div class="signature-line"></div>
                <div>Certificate ID: ${certificateId}</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      // Download as HTML file
      const blob = new Blob([certificateHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${
        certificateData.userName.replace(/\s+/g, '-')
      }-${
        certificateData.domain.replace(/\s+/g, '-')
      }-certificate-${Date.now()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      // ✅ UPDATED: Save to storage (with backend)
      await saveCertificateToStorage(certificateData);
      
    } catch (error) {
      console.error('❌ Error downloading certificate:', error);
      alert('Error downloading certificate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // ✅ UPDATED: Save certificate to both localStorage and backend
  const saveCertificateToStorage = async (certificateData) => {
    try {
      console.log('💾 Saving certificate to localStorage...');
      
      let existingCertificates = [];
      try {
        const stored = localStorage.getItem('userCertificates');
        if (stored) {
          existingCertificates = JSON.parse(stored);
        }
      } catch (e) {
        console.log('No existing certificates or parse error');
      }
      
      console.log('Existing certificates:', existingCertificates.length);

      // Check if certificate already exists
      const existingIndex = existingCertificates.findIndex(
        cert => cert.userName === certificateData.userName && cert.domain === certificateData.domain
      );
      
      if (existingIndex !== -1) {
        // Update existing certificate
        existingCertificates[existingIndex] = certificateData;
        console.log('✅ Updated existing certificate');
      } else {
        // Add new certificate
        existingCertificates.push(certificateData);
        console.log('✅ Added new certificate');
      }

      // Save to localStorage
      localStorage.setItem('userCertificates', JSON.stringify(existingCertificates));
      console.log('💾 Saved to localStorage:', existingCertificates.length, 'certificates');

      // ✅ UPDATED: Save to backend database with production API URL
      await saveToBackend(certificateData);

      // Dispatch events to update Navbar
      window.dispatchEvent(new CustomEvent('certificatesUpdated', {
        detail: { certificates: existingCertificates }
      }));
      
      window.dispatchEvent(new Event('storage'));
      
      console.log('📢 Events dispatched to navbar');
      return true;
      
    } catch (error) {
      console.error('❌ Error saving certificate:', error);
      return false;
    }
  };

  // Certificate View - Updated with Navbar Design
  if (showCertificate) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const performance = score >= totalQuestions * 0.8 ? 'Excellent' : 
                      score >= totalQuestions * 0.6 ? 'Good' : 'Pass';

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center py-12 px-6">
        {/* ✅ NAVBAR JESA SAME CERTIFICATE DESIGN */}
        <div 
          ref={certRef} 
          className="relative w-full max-w-4xl bg-white rounded-2xl p-8 shadow-2xl border-8 border-yellow-500"
          style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            border: '8px solid #f59e0b',
            position: 'relative'
          }}
        >
          {/* Inner border */}
          <div className="absolute inset-1 border-4 border-yellow-300 rounded-xl pointer-events-none"></div>
          
          <div className="text-center">
            {/* Logo */}
            <div className="text-2xl font-black text-gray-900 mb-2">🎓 Tech Learn</div>
            
            {/* Title */}
            <h1 className="text-4xl font-black text-gray-900 mb-6 uppercase tracking-wide">
              Certificate of Completion
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg text-gray-600 mb-10 font-medium">This is to certify that</p>
            
            {/* Username */}
            <div className="text-5xl font-black text-yellow-600 my-10 uppercase tracking-wide">
              {userName}
            </div>
            
            {/* Achievement */}
            <div className="text-2xl text-gray-800 mb-8 font-semibold">
              has successfully completed the<br />
              <strong className="text-3xl">{currentQuiz.title} Quiz</strong>
            </div>
            
            {/* Score */}
            <div className="text-xl text-green-600 font-bold my-6">
              Score: {score} out of {totalQuestions} ({percentage}%)
            </div>
            
            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-6 my-10 bg-gray-50 p-6 rounded-xl">
              <div className="text-center">
                <div className="text-sm text-gray-500 font-medium mb-2">Domain</div>
                <div className="text-lg font-bold text-gray-900">{currentQuiz.title}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 font-medium mb-2">Performance</div>
                <div className="text-lg font-bold text-gray-900">{performance}</div>
              </div>
            </div>
            
            {/* Date */}
            <div className="text-gray-500 mt-8">
              Awarded on: {new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>
            
            {/* Footer Signatures */}
            <div className="flex justify-between mt-12 pt-6 border-t-2 border-gray-300">
              <div className="text-center">
                <div className="w-48 h-0.5 bg-gray-800 mx-auto mb-2"></div>
                <div>Tech Learn Team</div>
              </div>
              <div className="text-center">
                <div className="w-48 h-0.5 bg-gray-800 mx-auto mb-2"></div>
                <div>Certificate ID: {Date.now().toString().slice(-8)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button
            onClick={handleViewCertificate}
            disabled={isGenerating}
            className={`px-8 py-3 font-bold text-lg rounded-xl border border-white/20 transition-all duration-300 flex items-center justify-center space-x-2 ${
              isGenerating 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transform hover:scale-105'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <span>👁️</span>
                <span>View Certificate</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadCertificate}
            disabled={isGenerating}
            className={`px-8 py-3 font-bold text-lg rounded-xl border border-white/20 transition-all duration-300 flex items-center justify-center space-x-2 ${
              isGenerating 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transform hover:scale-105'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <span>📥</span>
                <span>Download Certificate</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={() => setShowCertificate(false)}
          className="mt-6 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300"
        >
          ← Back to Results
        </button>
      </div>
    );
  }

  // SCORE VIEW
  if (showScore) {
    const percentage = (score / totalQuestions) * 100;
    const passed = percentage >= 60;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col items-center justify-center py-12 px-6">
        <h1 className="text-4xl font-bold mb-6">
          {passed ? "🎉 Quiz Completed!" : "😔 Try Again!"}
        </h1>
        
        <div className={`text-2xl mb-4 ${passed ? 'text-green-400' : 'text-red-400'}`}>
          Score: <b>{score}</b> out of <b>{totalQuestions}</b> ({percentage.toFixed(1)}%)
        </div>
        
        <p className="text-lg mb-8">
          {passed 
            ? "Congratulations! You passed the quiz. Generate your certificate below."
            : "You need at least 60% to get a certificate. Please try again!"
          }
        </p>

        {passed && (
          <>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name for certificate"
              className="w-full max-w-md px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleViewCertificate}
                disabled={!userName.trim() || isGenerating}
                className={`px-8 py-3 font-bold text-lg rounded-xl border border-white/20 transition-all duration-300 flex items-center justify-center space-x-2 ${
                  !userName.trim() || isGenerating
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105"
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span>👁️</span>
                    <span>View Certificate</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadCertificate}
                disabled={!userName.trim() || isGenerating}
                className={`px-8 py-3 font-bold text-lg rounded-xl border border-white/20 transition-all duration-300 flex items-center justify-center space-x-2 ${
                  !userName.trim() || isGenerating
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transform hover:scale-105"
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <span>📥</span>
                    <span>Download Certificate</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* ✅ UPDATED: "Take Another Quiz" button fixed */}
        <button
          onClick={() => navigate('/domains')} // ✅ CHANGED: Use navigate instead of window.location.reload()
          className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all"
        >
          {passed ? "Take Another Quiz" : "Retry Quiz"}
        </button>
      </div>
    );
  }

  // QUIZ VIEW (Unchanged)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-6">
          <div className="inline-block bg-red-500/20 border border-red-400/50 px-6 py-2 rounded-full">
            ⏰ Time Left: <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <h1 className="text-center text-5xl font-bold mb-8">
          {currentQuiz.emoji} {currentQuiz.title} Quiz
        </h1>

        <QuizQuestion
          question={currentQuiz.questions[currentQuestion]}
          questionNumber={currentQuestion + 1}
          totalQuestions={totalQuestions}
          selectedOption={
            selectedOptions[currentQuiz.questions[currentQuestion].id]
          }
          onOptionSelect={handleOptionSelect}
          showResult={false}
        />

        <div className="flex justify-between mt-10">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
              currentQuestion === 0
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-white/10 hover:bg-white/20 border border-white/20"
            }`}
          >
            ← Previous
          </button>

          {currentQuestion === totalQuestions - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(selectedOptions).length !== totalQuestions}
              className={`px-8 py-4 font-bold text-lg rounded-xl border border-white/20 ${
                Object.keys(selectedOptions).length === totalQuestions
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-105"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
            >
              🚀 Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all"
            >
              Next →
            </button>
          )}
        </div>

        <div className="mt-6 text-center text-gray-400">
          Question {currentQuestion + 1} of {totalQuestions} • 
          Answered: {Object.keys(selectedOptions).length}/{totalQuestions}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;

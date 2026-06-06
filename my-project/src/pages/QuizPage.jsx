import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import QuizQuestion from "../components/QuizQuestion";

const QuizPage = () => {
  const { domainId } = useParams();
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
      title: "Web Development", emoji: "🖥️",
      questions: [
        { id: 1, question: "What does HTML stand for?", options: ["Hyper Text Markup Language","High Tech Modern Language","Hyper Transfer Markup Language","Home Tool Markup Language"], correctAnswer: 0 },
        { id: 2, question: "Which of the following is NOT a JavaScript framework?", options: ["React","Vue","Angular","Python"], correctAnswer: 3 },
        { id: 3, question: "What is the purpose of CSS?", options: ["To structure web pages","To style and layout web pages","To add interactivity to web pages","To store data"], correctAnswer: 1 },
        { id: 4, question: "Which HTTP method is used to retrieve data from a server?", options: ["POST","GET","PUT","DELETE"], correctAnswer: 1 },
        { id: 5, question: "What is React primarily used for?", options: ["Backend development","Database management","Building user interfaces","Server configuration"], correctAnswer: 2 },
      ],
    },
    android: {
      title: "Android Development", emoji: "📱",
      questions: [
        { id: 1, question: "Which language is officially supported for Android development?", options: ["Java","Kotlin","Swift","Both Java and Kotlin"], correctAnswer: 3 },
        { id: 2, question: "What is an Activity in Android?", options: ["A background service","A single screen with user interface","A database table","A network request"], correctAnswer: 1 },
        { id: 3, question: "Which file contains the app configuration in Android?", options: ["AndroidManifest.xml","config.json","app.settings","build.gradle"], correctAnswer: 0 },
        { id: 4, question: "What is Gradle used for in Android?", options: ["UI design","Build automation","Database management","Network calls"], correctAnswer: 1 },
        { id: 5, question: "Which component is used for background tasks in Android?", options: ["Activity","Service","Fragment","View"], correctAnswer: 1 },
      ],
    },
    "data-science": {
      title: "Data Science", emoji: "📊",
      questions: [
        { id: 1, question: "What is the primary purpose of Pandas in Python?", options: ["Data visualization","Data manipulation and analysis","Machine learning","Web development"], correctAnswer: 1 },
        { id: 2, question: "Which of the following is NOT a supervised learning algorithm?", options: ["Linear Regression","K-Means","Decision Trees","SVM"], correctAnswer: 1 },
        { id: 3, question: "What does 'EDA' stand for in Data Science?", options: ["Exploratory Data Analysis","Extended Data Assessment","External Data Aggregation","Enterprise Data Architecture"], correctAnswer: 0 },
        { id: 4, question: "Which library is commonly used for data visualization in Python?", options: ["Matplotlib","NumPy","Scikit-learn","TensorFlow"], correctAnswer: 0 },
        { id: 5, question: "What is the purpose of feature scaling in machine learning?", options: ["To reduce dataset size","To normalize feature ranges","To remove outliers","To add new features"], correctAnswer: 1 },
      ],
    },
    devops: {
      title: "DevOps", emoji: "🔧",
      questions: [
        { id: 1, question: "What is the main goal of DevOps?", options: ["To separate development and operations","To automate everything","To improve collaboration between development and operations","To reduce costs"], correctAnswer: 2 },
        { id: 2, question: "Which tool is used for containerization?", options: ["Jenkins","Docker","Kubernetes","Ansible"], correctAnswer: 1 },
        { id: 3, question: "What is CI/CD in DevOps?", options: ["Continuous Integration/Continuous Deployment","Code Integration/Code Deployment","Continuous Inspection/Continuous Delivery","Container Integration/Container Deployment"], correctAnswer: 0 },
        { id: 4, question: "Which of the following is an infrastructure as code tool?", options: ["Terraform","Git","Selenium","Nagios"], correctAnswer: 0 },
        { id: 5, question: "What is the purpose of Kubernetes?", options: ["To automate testing","To manage containerized applications","To monitor applications","To deploy code"], correctAnswer: 1 },
      ],
    },
    "cloud-computing": {
      title: "Cloud Computing", emoji: "☁️",
      questions: [
        { id: 1, question: "What is the main advantage of cloud computing?", options: ["Higher security","Cost savings and scalability","Faster internet","Better hardware"], correctAnswer: 1 },
        { id: 2, question: "Which service model provides hardware and software?", options: ["IaaS","PaaS","SaaS","FaaS"], correctAnswer: 1 },
        { id: 3, question: "What does AWS stand for?", options: ["Amazon Web Services","Advanced Web Solutions","Automated Web Systems","Application Web Services"], correctAnswer: 0 },
        { id: 4, question: "Which cloud deployment model is for single organization use?", options: ["Public Cloud","Private Cloud","Hybrid Cloud","Community Cloud"], correctAnswer: 1 },
        { id: 5, question: "What is serverless computing?", options: ["Running without servers","Cloud provider manages server infrastructure","Using only mobile servers","Peer-to-peer computing"], correctAnswer: 1 },
      ],
    },
    cybersecurity: {
      title: "Cyber Security", emoji: "🔒",
      questions: [
        { id: 1, question: "What is phishing?", options: ["A fishing technique","A type of malware","A social engineering attack","A network protocol"], correctAnswer: 2 },
        { id: 2, question: "What does VPN stand for?", options: ["Virtual Private Network","Verified Private Network","Virtual Public Network","Verified Public Network"], correctAnswer: 0 },
        { id: 3, question: "Which is the most secure authentication method?", options: ["Password","Two-factor authentication","Security questions","PIN"], correctAnswer: 1 },
        { id: 4, question: "What is encryption used for?", options: ["To compress data","To hide data from unauthorized access","To speed up data transfer","To backup data"], correctAnswer: 1 },
        { id: 5, question: "What is a firewall?", options: ["A physical security barrier","A network security system","A type of virus","A data encryption tool"], correctAnswer: 1 },
      ],
    },
    "ai-ml": {
      title: "AI & Machine Learning", emoji: "🤖",
      questions: [
        { id: 1, question: "What is the difference between AI and Machine Learning?", options: ["They are the same thing","AI is broader, ML is a subset of AI","ML is broader, AI is a subset of ML","They are completely different"], correctAnswer: 1 },
        { id: 2, question: "Which algorithm is used for classification problems?", options: ["Linear Regression","K-Means","Logistic Regression","Apriori"], correctAnswer: 2 },
        { id: 3, question: "What is overfitting in machine learning?", options: ["Model performs well on training data but poorly on new data","Model performs poorly on all data","Model is too simple","Model takes too long to train"], correctAnswer: 0 },
        { id: 4, question: "What is TensorFlow primarily used for?", options: ["Data analysis","Machine learning and deep learning","Web development","Database management"], correctAnswer: 1 },
        { id: 5, question: "What is reinforcement learning?", options: ["Learning from labeled data","Learning from unlabeled data","Learning through rewards and punishments","Learning from user feedback"], correctAnswer: 2 },
      ],
    },
  };

  const currentQuiz = quizData[domainId] || quizData["web-dev"];
  const totalQuestions = currentQuiz.questions.length;

 const saveToBackend = async (certificateData) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API_URL}/api/certificates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(certificateData)
    });
    if (response.ok) console.log('✅ Certificate saved to database');
    else console.log('❌ Failed:', await response.json());
  } catch (error) {
    console.error('❌ Error saving to backend:', error);
  }
};

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
    currentQuestion < totalQuestions - 1 && setCurrentQuestion((prev) => prev + 1);

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

  const getCertificateData = () => ({
    id: `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userName: userName.trim(),
    domain: currentQuiz.title,
    score,
    totalQuestions,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    timestamp: new Date().toISOString()
  });

const saveCertificateToStorage = async (certificateData) => {
  try {
    // ✅ Certificate userName ko logged-in user se match karo
    const userEmail = localStorage.getItem('userEmail');
    const loggedInUserName = userEmail ? userEmail.split('@')[0] : certificateData.userName;
    
    // Certificate mein logged-in username store karo
    const certToSave = {
      ...certificateData,
      userName: loggedInUserName // ← LOGGED-IN USER KA NAME USE KARO
    };

    let existingCertificates = [];
    try {
      const stored = localStorage.getItem('userCertificates');
      if (stored) existingCertificates = JSON.parse(stored);
    } catch (e) {}

    const existingIndex = existingCertificates.findIndex(
      cert => cert.userName.toLowerCase() === loggedInUserName.toLowerCase() 
           && cert.domain === certToSave.domain
    );
    
    if (existingIndex !== -1) existingCertificates[existingIndex] = certToSave;
    else existingCertificates.push(certToSave);

    localStorage.setItem('userCertificates', JSON.stringify(existingCertificates));
    await saveToBackend(certToSave);
    window.dispatchEvent(new CustomEvent('certificatesUpdated', { detail: { certificates: existingCertificates } }));
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error('❌ Error saving certificate:', error);
  }
};

  // ✅ Common HTML generator - View aur Download dono isme same style use karenge
  const buildCertificateHTML = (certificateData, forPrint = false) => {
    const percentage = Math.round((certificateData.score / certificateData.totalQuestions) * 100);
    const performance = certificateData.score >= certificateData.totalQuestions * 0.8 ? 'Excellent'
                      : certificateData.score >= certificateData.totalQuestions * 0.6 ? 'Good' : 'Pass';
    const certificateId = certificateData.id.slice(-8);

    return `<!DOCTYPE html>
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
    .inner-border {
      position: absolute;
      inset: 6px;
      border: 4px solid #fcd34d;
      border-radius: 14px;
      pointer-events: none;
    }
    .logo { font-size: 24px; font-weight: 900; color: #1e293b; margin-bottom: 10px; }
    .title { font-size: 36px; font-weight: 800; color: #1e293b; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 2px; }
    .subtitle { font-size: 18px; color: #64748b; margin-bottom: 20px; font-weight: 500; }
    .username { font-size: 48px; font-weight: 900; color: #d97706; margin: 30px 0; text-transform: uppercase; letter-spacing: 1px; }
    .achievement { font-size: 22px; color: #374151; margin-bottom: 16px; font-weight: 600; line-height: 1.5; }
    .achievement strong { font-size: 26px; color: #1e293b; }
    .score { font-size: 20px; color: #059669; font-weight: 700; margin: 16px 0; }
    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; background: #f8fafc; padding: 20px; border-radius: 12px; }
    .detail-item { text-align: center; }
    .detail-label { font-size: 13px; color: #64748b; font-weight: 500; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px; }
    .detail-value { font-size: 18px; color: #1e293b; font-weight: 700; }
    .date { font-size: 15px; color: #6b7280; margin-top: 20px; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; display: flex; justify-content: space-between; align-items: flex-end; }
    .signature { text-align: center; }
    .signature-line { width: 180px; height: 1px; background: #374151; margin: 0 auto 8px; }
    .signature-text { font-size: 14px; color: #374151; }

    @media print {
      @page { size: A4 landscape; margin: 0; }
      body {
        background: white !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        padding: 10px;
        min-height: unset;
      }
      .certificate {
        box-shadow: none !important;
        max-width: 100% !important;
        width: 100% !important;
        border-radius: 12px !important;
        padding: 30px !important;
      }
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="inner-border"></div>
    <div class="logo">🎓 Tech Learn</div>
    <h1 class="title">Certificate of Completion</h1>
    <p class="subtitle">This is to certify that</p>
    <div class="username">${certificateData.userName}</div>
    <div class="achievement">
      has successfully completed the<br>
      <strong>${certificateData.domain} Quiz</strong>
    </div>
    <div class="score">Score: ${certificateData.score} out of ${certificateData.totalQuestions} (${percentage}%)</div>
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
    <div class="date">Awarded on: ${certificateData.date}</div>
    <div class="footer">
      <div class="signature">
        <div class="signature-line"></div>
        <div class="signature-text">Tech Learn Team</div>
      </div>
      <div class="signature">
        <div class="signature-line"></div>
        <div class="signature-text">Certificate ID: ${certificateId}</div>
      </div>
    </div>
  </div>
  ${forPrint ? `
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
        window.onafterprint = function() { window.close(); };
      }, 900);
    };
  </script>` : ''}
</body>
</html>`;
  };

  // ✅ View Certificate - same HTML, no print trigger
  const handleViewCertificate = async () => {
    if (!userName.trim() || isGenerating) return;
    setIsGenerating(true);
    try {
      const certificateData = getCertificateData();
      const html = buildCertificateHTML(certificateData, false);
      const newWindow = window.open('', '_blank', 'width=900,height=700');
      newWindow.document.write(html);
      newWindow.document.close();
      newWindow.focus();
     
    } catch (error) {
      alert('Error generating certificate.');
    } finally {
      setIsGenerating(false);
    }
  };

  // ✅ Download Certificate - same HTML + print dialog auto open (Save as PDF)
  const handleDownloadCertificate = async () => {
    if (!userName.trim() || isGenerating) return;
    setIsGenerating(true);
    try {
      const certificateData = getCertificateData();
      const html = buildCertificateHTML(certificateData, true); // forPrint = true
      const printWindow = window.open('', '_blank', 'width=1000,height=750');
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      await saveCertificateToStorage(certificateData);
    } catch (error) {
      console.error('❌ Error downloading certificate:', error);
      alert('Error downloading certificate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // ===== CERTIFICATE PREVIEW VIEW =====
  if (showCertificate) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const performance = score >= totalQuestions * 0.8 ? 'Excellent' : score >= totalQuestions * 0.6 ? 'Good' : 'Pass';

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center py-12 px-6">
        <div ref={certRef} style={{ background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', border: '8px solid #f59e0b', position: 'relative', width: '100%', maxWidth: '800px' }}>
          <div className="absolute inset-1 border-4 border-yellow-300 rounded-xl pointer-events-none"></div>
          <div className="text-center">
            <div className="text-2xl font-black text-gray-900 mb-2">🎓 Tech Learn</div>
            <h1 className="text-4xl font-black text-gray-900 mb-6 uppercase tracking-wide">Certificate of Completion</h1>
            <p className="text-lg text-gray-600 mb-10 font-medium">This is to certify that</p>
            <div className="text-5xl font-black text-yellow-600 my-10 uppercase tracking-wide">{userName}</div>
            <div className="text-2xl text-gray-800 mb-8 font-semibold">
              has successfully completed the<br />
              <strong className="text-3xl">{currentQuiz.title} Quiz</strong>
            </div>
            <div className="text-xl text-green-600 font-bold my-6">Score: {score} out of {totalQuestions} ({percentage}%)</div>
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
            <div className="text-gray-500 mt-8">Awarded on: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <div className="flex justify-between mt-12 pt-6 border-t-2 border-gray-300">
              <div className="text-center"><div className="w-48 h-0.5 bg-gray-800 mx-auto mb-2"></div><div>Tech Learn Team</div></div>
              <div className="text-center"><div className="w-48 h-0.5 bg-gray-800 mx-auto mb-2"></div><div>Certificate ID: {Date.now().toString().slice(-8)}</div></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button onClick={handleViewCertificate} disabled={isGenerating}
            className={`px-8 py-3 font-bold text-lg rounded-xl transition-all duration-300 flex items-center gap-2 ${isGenerating ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'}`}>
            {isGenerating ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div><span>Generating...</span></> : <><span>👁️</span><span>View Certificate</span></>}
          </button>
          <button onClick={handleDownloadCertificate} disabled={isGenerating}
            className={`px-8 py-3 font-bold text-lg rounded-xl transition-all duration-300 flex items-center gap-2 ${isGenerating ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'}`}>
            {isGenerating ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div><span>Downloading...</span></> : <><span>📥</span><span>Download PDF</span></>}
          </button>
        </div>
        <button onClick={() => setShowCertificate(false)} className="mt-6 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-xl">← Back to Results</button>
      </div>
    );
  }

  // ===== SCORE VIEW =====
  if (showScore) {
    const percentage = (score / totalQuestions) * 100;
    const passed = percentage >= 60;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col items-center justify-center py-12 px-6">
        <h1 className="text-4xl font-bold mb-6">{passed ? "🎉 Quiz Completed!" : "😔 Try Again!"}</h1>
        <div className={`text-2xl mb-4 ${passed ? 'text-green-400' : 'text-red-400'}`}>
          Score: <b>{score}</b> out of <b>{totalQuestions}</b> ({percentage.toFixed(1)}%)
        </div>
        <p className="text-lg mb-8">{passed ? "Congratulations! You passed. Generate your certificate below." : "You need at least 60% to get a certificate. Please try again!"}</p>

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
              <button onClick={handleViewCertificate} disabled={!userName.trim() || isGenerating}
                className={`px-8 py-3 font-bold text-lg rounded-xl transition-all duration-300 flex items-center gap-2 ${!userName.trim() || isGenerating ? "bg-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"}`}>
                {isGenerating ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div><span>Generating...</span></> : <><span>👁️</span><span>View Certificate</span></>}
              </button>
              <button onClick={handleDownloadCertificate} disabled={!userName.trim() || isGenerating}
                className={`px-8 py-3 font-bold text-lg rounded-xl transition-all duration-300 flex items-center gap-2 ${!userName.trim() || isGenerating ? "bg-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"}`}>
                {isGenerating ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div><span>Downloading...</span></> : <><span>📥</span><span>Download PDF</span></>}
              </button>
            </div>
          </>
        )}
        <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all">
          {passed ? "Take Another Quiz" : "Retry Quiz"}
        </button>
      </div>
    );
  }

  // ===== QUIZ VIEW =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-6">
          <div className="inline-block bg-red-500/20 border border-red-400/50 px-6 py-2 rounded-full">
            ⏰ Time Left: <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>
        <h1 className="text-center text-5xl font-bold mb-8">{currentQuiz.emoji} {currentQuiz.title} Quiz</h1>
        <QuizQuestion
          question={currentQuiz.questions[currentQuestion]}
          questionNumber={currentQuestion + 1}
          totalQuestions={totalQuestions}
          selectedOption={selectedOptions[currentQuiz.questions[currentQuestion].id]}
          onOptionSelect={handleOptionSelect}
          showResult={false}
        />
        <div className="flex justify-between mt-10">
          <button onClick={handlePrevious} disabled={currentQuestion === 0}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${currentQuestion === 0 ? "bg-gray-600 cursor-not-allowed" : "bg-white/10 hover:bg-white/20 border border-white/20"}`}>
            ← Previous
          </button>
          {currentQuestion === totalQuestions - 1 ? (
            <button onClick={handleSubmit} disabled={Object.keys(selectedOptions).length !== totalQuestions}
              className={`px-8 py-4 font-bold text-lg rounded-xl border border-white/20 ${Object.keys(selectedOptions).length === totalQuestions ? "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600" : "bg-gray-600 cursor-not-allowed"}`}>
              🚀 Submit Quiz
            </button>
          ) : (
            <button onClick={handleNext} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all">
              Next →
            </button>
          )}
        </div>
        <div className="mt-6 text-center text-gray-400">
          Question {currentQuestion + 1} of {totalQuestions} • Answered: {Object.keys(selectedOptions).length}/{totalQuestions}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;

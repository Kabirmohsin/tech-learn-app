import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import QuizQuestion from "../components/QuizQuestion";
import jsPDF from "jspdf";
import { API_URL } from "../config";  // ✅ ADD THIS IMPORT

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
        // ... (rest of your quiz data remains the same)
      ],
    },
    // ... (other quiz domains remain the same)
  };

  const currentQuiz = quizData[domainId] || quizData["web-dev"];
  const totalQuestions = currentQuiz.questions.length;

  // ✅ UPDATED: Save certificate to backend with new API URL
  const saveToBackend = async (certificateData) => {
    try {
      const response = await fetch(`${API_URL}/certificates`, {  // ✅ CHANGED
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

  // Timer (unchanged)
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

  // ✅ UPDATED: Generate HTML Certificate 
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

      // Certificate HTML (unchanged)
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

  // ✅ UPDATED: Download HTML Certificate
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

      // Certificate HTML (unchanged)
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

      // ✅ UPDATED: Save to backend database with new API URL
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

  // ... (rest of your component remains the same - Certificate View, Score View, Quiz View)
  // The UI code doesn't need changes, only the API calls were updated

  return (
    // ... (your existing return JSX remains exactly the same)
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12 px-6">
      {/* ... (all your existing JSX code remains unchanged) */}
    </div>
  );
};

export default QuizPage;

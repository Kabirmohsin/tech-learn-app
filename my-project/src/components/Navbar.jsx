import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCertificationsOpen, setIsCertificationsOpen] = useState(false);
  const [userCertificates, setUserCertificates] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const certButtonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleAuthChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('scroll', handleScroll);
    loadCertificates();
    checkAuthStatus();
    
    // Listen for certificate updates from QuizPage
    window.addEventListener('certificatesUpdated', loadCertificates);
    window.addEventListener('storage', loadCertificates);
    
    // ✅ IMPROVED: Listen for authentication state changes
    window.addEventListener('authStateChanged', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    
    // ✅ ADD: Global function to update auth state
    window.updateAuthState = (loggedIn, email) => {
      setIsLoggedIn(loggedIn);
      if (loggedIn && email) {
        setUserName(email.split('@')[0]);
      } else {
        setUserName('');
      }
    };

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('certificatesUpdated', loadCertificates);
      window.removeEventListener('storage', loadCertificates);
      window.removeEventListener('authStateChanged', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  // Check authentication status
  const checkAuthStatus = () => {
    try {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      const userEmail = localStorage.getItem('userEmail');
      
      console.log('🔄 Navbar: Checking auth status', { isAuthenticated, userEmail });
      
      if (isAuthenticated === 'true' && userEmail) {
        setIsLoggedIn(true);
        setUserName(userEmail.split('@')[0]);
        console.log('✅ User is logged in:', userEmail.split('@')[0]);
      } else {
        setIsLoggedIn(false);
        setUserName('');
        console.log('❌ User is not logged in');
      }
    } catch (error) {
      console.error('❌ Error checking auth status:', error);
      setIsLoggedIn(false);
      setUserName('');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isCertificationsOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        certButtonRef.current &&
        !certButtonRef.current.contains(event.target)
      ) {
        setIsCertificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCertificationsOpen]);

  // ✅ IMPROVED: Load certificates with better error handling
  const loadCertificates = () => {
    try {
      console.log('🔄 Navbar: Loading certificates from localStorage...');
      
      const certificatesData = localStorage.getItem('userCertificates');
      
      if (!certificatesData) {
        console.log('📭 No certificates found in localStorage');
        setUserCertificates([]);
        return;
      }
      
      let certificates = [];
      try {
        certificates = JSON.parse(certificatesData);
        if (!Array.isArray(certificates)) {
          certificates = [];
        }
      } catch (parseError) {
        console.error('❌ Error parsing certificates:', parseError);
        setUserCertificates([]);
        return;
      }
      
      console.log('📜 Raw certificates loaded:', certificates.length);
      
      // Filter out invalid certificates and sort by timestamp (newest first)
      const validCertificates = certificates
        .filter(cert => cert && 
          cert.userName && 
          cert.domain && 
          cert.score !== undefined && 
          cert.totalQuestions !== undefined
        )
        .sort((a, b) => {
          const timeA = a.timestamp || a.date || 0;
          const timeB = b.timestamp || b.date || 0;
          return new Date(timeB) - new Date(timeA);
        });
      
      console.log('✅ Valid certificates to display:', validCertificates.length);
      setUserCertificates(validCertificates);
      
    } catch (error) {
      console.error('❌ Error in loadCertificates:', error);
      setUserCertificates([]);
    }
  };

  // ✅ UPDATED: Community link now routes to /community page
  const navLinks = [
    { name: 'Home', href: '/', type: 'route' },
    { name: 'Domains', href: '/domains', type: 'route' },
    { name: 'Certifications', href: '#certifications', type: 'certifications' },
    { name: 'Community', href: '/community', type: 'route' }
  ];

  // ✅ FIXED: Handle navigation clicks properly
  const handleNavClick = (link, e) => {
    if (link.type === 'route') {
      e.preventDefault();
      navigate(link.href);
    } else if (link.type === 'section') {
      e.preventDefault();
      const element = document.getElementById(link.href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (link.type === 'certifications') {
      e.preventDefault();
      handleCertificationClick(e);
    }
    
    setIsMobileMenuOpen(false);
  };

  // ✅ FIXED: Certification click handler
  const handleCertificationClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newState = !isCertificationsOpen;
    setIsCertificationsOpen(newState);
    
    if (newState) {
      console.log('🔄 Opening certifications dropdown...');
      loadCertificates();
    }
  };

  // ✅ NEW: Handle Login/Logout
  const handleAuthClick = () => {
    if (isLoggedIn) {
      // Logout logic
      handleLogout();
    } else {
      // Navigate to login page
      navigate('/login');
    }
    setIsMobileMenuOpen(false);
  };

  // ✅ IMPROVED: Handle logout
  const handleLogout = () => {
    console.log('🚪 User logging out...');
    
    // Clear localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    
    // Update state
    setIsLoggedIn(false);
    setUserName('');
    
    // Dispatch events to update other components
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('authStateChanged', {
      detail: { isLoggedIn: false }
    }));
    
    // Call global update function if exists
    if (window.updateAuthState) {
      window.updateAuthState(false, null);
    }
    
    console.log('✅ User logged out successfully');
    navigate('/');
  };

  // ✅ NEW: Handle user profile click
  const handleProfileClick = () => {
    navigate('/profile'); // You can create a profile page later
  };

  // ✅ IMPROVED: Handle certificate viewing with same design as QuizPage
  const handleViewCertificate = async (certificate) => {
    if (isGenerating) return;
    
    console.log('👀 Viewing certificate:', certificate);
    
    try {
      setIsGenerating(true);
      setIsCertificationsOpen(false);
      
      if (certificate.pdfData) {
        // View PDF certificate
        await viewPDFCertificate(certificate);
      } else {
        // Generate HTML certificate with same design as QuizPage
        await generateCertificateHTML(certificate, 'view');
      }
      
    } catch (error) {
      console.error('❌ Error viewing certificate:', error);
      alert('❌ Error viewing certificate. Please try downloading it instead.');
    } finally {
      setIsGenerating(false);
    }
  };

  // ✅ IMPROVED: Handle certificate download with same design as QuizPage
  const handleDownloadCertificate = async (certificate) => {
    if (isGenerating) return;
    
    console.log('💾 Downloading certificate:', certificate);
    
    try {
      setIsGenerating(true);
      setIsCertificationsOpen(false);
      
      if (certificate.pdfData) {
        // Download PDF certificate
        await downloadPDFCertificate(certificate);
      } else {
        // Generate HTML certificate with same design as QuizPage for download
        await generateCertificateHTML(certificate, 'download');
      }
      
    } catch (error) {
      console.error('❌ Error downloading certificate:', error);
      alert('❌ Error downloading certificate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // ✅ NEW: View PDF certificate
  const viewPDFCertificate = (certificate) => {
    return new Promise((resolve, reject) => {
      try {
        const newWindow = window.open('', '_blank');
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${certificate.userName} - ${certificate.domain} Certificate</title>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                background: #1e293b;
                display: flex;
                flex-direction: column;
                align-items: center;
                min-height: 100vh;
                font-family: Arial, sans-serif;
              }
              .container {
                max-width: 1000px;
                width: 100%;
                text-align: center;
              }
              .pdf-viewer {
                width: 100%;
                height: 80vh;
                border: 2px solid #334155;
                border-radius: 10px;
                background: white;
              }
              .actions {
                margin: 20px 0;
                display: flex;
                gap: 10px;
                justify-content: center;
              }
              button {
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
              }
              .download-btn {
                background: #10b981;
                color: white;
              }
              .close-btn {
                background: #6b7280;
                color: white;
              }
              .certificate-info {
                color: white;
                margin-bottom: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="certificate-info">
                <h1>${certificate.domain} Certificate</h1>
                <p>Issued to: <strong>${certificate.userName}</strong></p>
                <p>Score: ${certificate.score}/${certificate.totalQuestions} • Date: ${formatDate(certificate.date)}</p>
              </div>
              <iframe 
                src="${certificate.pdfData}" 
                class="pdf-viewer"
                title="${certificate.userName} - ${certificate.domain} Certificate"
              ></iframe>
              <div class="actions">
                <button class="download-btn" onclick="window.location.href='${certificate.pdfData}'" download="${certificate.userName}-${certificate.domain}-certificate.pdf">
                  📥 Download PDF
                </button>
                <button class="close-btn" onclick="window.close()">
                  ❌ Close
                </button>
              </div>
            </div>
          </body>
          </html>
        `);
        newWindow.document.close();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  // ✅ NEW: Download PDF certificate
  const downloadPDFCertificate = (certificate) => {
    return new Promise((resolve, reject) => {
      try {
        const link = document.createElement('a');
        link.href = certificate.pdfData;
        link.download = `${certificate.userName}-${certificate.domain}-certificate.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  // ✅ UPDATED: Certificate generation with same design as QuizPage
  const generateCertificateHTML = (certificate, action) => {
    return new Promise((resolve, reject) => {
      try {
        const percentage = Math.round((certificate.score / certificate.totalQuestions) * 100);
        const performance = certificate.score >= certificate.totalQuestions * 0.8 ? 'Excellent' : 
                          certificate.score >= certificate.totalQuestions * 0.6 ? 'Good' : 'Pass';
        const certificateId = certificate.id ? certificate.id.slice(-8) : Date.now().toString(36);

        // Same certificate design as QuizPage
        const certificateHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Certificate - ${certificate.userName}</title>
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
              
              <div class="username">${certificate.userName}</div>
              
              <div class="achievement">
                has successfully completed the<br>
                <strong>${certificate.domain} Quiz</strong>
              </div>
              
              <div class="score">
                Score: ${certificate.score} out of ${certificate.totalQuestions} 
                (${percentage}%)
              </div>
              
              <div class="details-grid">
                <div class="detail-item">
                  <div class="detail-label">Domain</div>
                  <div class="detail-value">${certificate.domain}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Performance</div>
                  <div class="detail-value">${performance}</div>
                </div>
              </div>
              
              <div class="date">
                Awarded on: ${certificate.date}
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

        if (action === 'view') {
          const newWindow = window.open('', '_blank', 'width=900,height=700');
          newWindow.document.write(certificateHTML);
          newWindow.document.close();
          newWindow.focus();
          
        } else if (action === 'download') {
          const blob = new Blob([certificateHTML], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${
            certificate.userName.replace(/\s+/g, '-')
          }-${
            certificate.domain.replace(/\s+/g, '-')
          }-certificate-${Date.now()}.html`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const debugLocalStorage = () => {
    const data = localStorage.getItem('userCertificates');
    console.log('🔍 LocalStorage userCertificates:', data);
    if (data) {
      try {
        const certificates = JSON.parse(data);
        console.log('📋 Parsed certificates:', certificates);
        console.log('📊 Total certificates:', certificates.length);
        
        certificates.forEach((cert, index) => {
          console.log(`📄 Certificate ${index + 1}:`, {
            id: cert.id,
            userName: cert.userName,
            domain: cert.domain,
            score: `${cert.score}/${cert.totalQuestions}`,
            date: cert.date,
            hasPDF: !!cert.pdfData,
            timestamp: cert.timestamp
          });
        });
      } catch (error) {
        console.error('❌ Error parsing certificates:', error);
      }
    } else {
      console.log('📭 No certificates found in localStorage');
    }
  };

  const clearAllCertificates = () => {
    if (confirm('Are you sure you want to clear all certificates?')) {
      localStorage.removeItem('userCertificates');
      setUserCertificates([]);
      alert('All certificates cleared!');
    }
  };

  return (
    <>
      <nav className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${isScrolled 
          ? 'bg-slate-900/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl' 
          : 'bg-slate-900/90 backdrop-blur-lg'
        }
      `}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={handleHomeClick}>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-sm">TL</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Tech Learn
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-1 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl px-4 py-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(link, e)}
                    ref={link.name === 'Certifications' ? certButtonRef : null}
                    className="px-4 py-2 rounded-xl text-white hover:text-white hover:bg-white/10 transition-all duration-300 font-medium text-sm relative group"
                  >
                    {link.name}
                    {/* ✅ FIXED: Green light only shows for Certifications when there are certificates */}
                    {link.name === 'Certifications' && userCertificates.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    )}
                    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-3/4"></span>
                  </a>
                ))}
              </div>
            </div>

            {/* CTA Button & User Profile */}
            <div className="flex items-center space-x-4">
              {/* Debug buttons */}
              <div className="flex space-x-2">
                <button 
                  onClick={debugLocalStorage}
                  className="text-xs text-gray-400 hover:text-white transition-colors p-1"
                  title="Debug localStorage"
                >
                  🐛
                </button>
                <button 
                  onClick={clearAllCertificates}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors p-1"
                  title="Clear all certificates"
                >
                  🗑️
                </button>
              </div>

              {/* User Profile or Login Button */}
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  {/* User Profile */}
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-sm">{userName}</span>
                  </button>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500/20 border border-red-400/30 text-red-300 font-semibold rounded-xl hover:bg-red-500/30 transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                /* Login Button */
                <button 
                  onClick={handleAuthClick}
                  className="
                    px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 
                    text-white font-semibold rounded-xl
                    shadow-lg shadow-blue-500/25
                    hover:shadow-xl hover:shadow-purple-500/30
                    hover:from-blue-600 hover:to-purple-700
                    transform hover:scale-105
                    transition-all duration-300
                    relative overflow-hidden group
                  "
                >
                  <span className="relative z-10">Login / Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              )}

              <button 
                className="md:hidden p-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                  <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                  <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                  <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Certifications Dropdown */}
        {isCertificationsOpen && (
          <div 
            ref={dropdownRef}
            className="hidden md:block absolute top-full left-0 right-0 bg-slate-800/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl z-50"
          >
            <div className="container mx-auto px-6 py-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold text-xl">My Certificates</h3>
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
                    {userCertificates.length} earned
                  </span>
                  <button 
                    onClick={loadCertificates}
                    disabled={isGenerating}
                    className="text-xs text-gray-400 hover:text-white transition-colors p-1 disabled:opacity-50"
                    title="Refresh certificates"
                  >
                    🔄
                  </button>
                </div>
              </div>
              
              {userCertificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userCertificates.map((certificate) => (
                    <div 
                      key={certificate.id}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-white font-semibold text-lg flex items-center">
                          <span className="mr-2">📜</span>
                          {certificate.domain}
                          {certificate.pdfData && (
                            <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded" title="PDF Available">
                              PDF
                            </span>
                          )}
                        </h4>
                        <span className="text-green-400 text-sm font-bold bg-green-400/20 px-2 py-1 rounded-full">
                          {certificate.score}/{certificate.totalQuestions}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3">
                        Earned by <span className="text-white font-medium">{certificate.userName}</span>
                      </p>
                      
                      <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
                        <span>{formatDate(certificate.date)}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          certificate.pdfData ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {certificate.pdfData ? 'PDF' : 'HTML'}
                        </span>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleViewCertificate(certificate)}
                          disabled={isGenerating}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white py-2 px-3 rounded-lg transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                        >
                          {isGenerating ? <span>⏳</span> : <><span>👁️</span><span>View</span></>}
                        </button>
                        <button
                          onClick={() => handleDownloadCertificate(certificate)}
                          disabled={isGenerating}
                          className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white py-2 px-3 rounded-lg transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                        >
                          {isGenerating ? <span>⏳</span> : <><span>📥</span><span>Download</span></>}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-5xl mb-4">📜</div>
                  <p className="text-lg">No certificates earned yet</p>
                  <p className="text-sm mt-2">Complete quizzes to earn certificates!</p>
                  <div className="mt-4">
                    <button 
                      onClick={() => navigate('/domains')}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                    >
                      Browse Domains
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        <div className={`
          md:hidden absolute top-full left-0 right-0 
          bg-slate-900/95 backdrop-blur-2xl border-b border-white/10
          transition-all duration-500 overflow-hidden
          ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(link, e)}
                  className="px-4 py-3 rounded-xl text-white hover:text-white hover:bg-white/10 transition-all duration-300 font-medium border border-white/10 flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  {/* ✅ FIXED: Green badge only shows for Certifications in mobile menu */}
                  {link.name === 'Certifications' && userCertificates.length > 0 && (
                    <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1">
                      {userCertificates.length}
                    </span>
                  )}
                </a>
              ))}
              
              {/* Mobile Certificates Section */}
              {userCertificates.length > 0 && (
                <div className="border-t border-white/10 pt-4 mt-2">
                  <h3 className="text-white font-bold mb-3 flex items-center">
                    <span className="mr-2">🎓</span>
                    My Certificates ({userCertificates.length})
                    {userCertificates.some(cert => cert.pdfData) && (
                      <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded">
                        PDF
                      </span>
                    )}
                  </h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {userCertificates.slice(0, 3).map((certificate) => (
                      <div 
                        key={certificate.id}
                        className="bg-white/5 border border-white/10 rounded-xl p-3"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-semibold text-sm flex items-center">
                            {certificate.domain}
                            {certificate.pdfData && (
                              <span className="ml-1 text-xs bg-red-500 text-white px-1 rounded">PDF</span>
                            )}
                          </h4>
                          <span className="text-green-400 text-xs font-bold bg-green-400/20 px-2 py-1 rounded-full">
                            {certificate.score}/${certificate.totalQuestions}
                          </span>
                        </div>
                        <p className="text-gray-300 text-xs mb-2">
                          {certificate.userName} • {formatDate(certificate.date)}
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              handleViewCertificate(certificate);
                              setIsMobileMenuOpen(false);
                            }}
                            disabled={isGenerating}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white py-1.5 px-2 rounded text-xs transition-colors"
                          >
                            {isGenerating ? '⏳' : 'View'}
                          </button>
                          <button
                            onClick={() => {
                              handleDownloadCertificate(certificate);
                              setIsMobileMenuOpen(false);
                            }}
                            disabled={isGenerating}
                            className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white py-1.5 px-2 rounded text-xs transition-colors"
                          >
                            {isGenerating ? '⏳' : 'Download'}
                          </button>
                        </div>
                      </div>
                    ))}
                    {userCertificates.length > 3 && (
                      <div className="text-center text-gray-400 text-sm">
                        +{userCertificates.length - 3} more certificates
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t border-white/10">
                {isLoggedIn ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{userName}</div>
                        <div className="text-gray-400 text-sm">Logged In</div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 bg-red-500/20 border border-red-400/30 text-red-300 font-semibold rounded-xl hover:bg-red-500/30 transition-all duration-300"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleAuthClick}
                    className="
                      w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 
                      text-white font-semibold rounded-xl
                      hover:from-blue-600 hover:to-purple-700
                      transition-all duration-300
                    "
                  >
                    Login / Get Started
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer and Overlay */}
      <div className="h-16 md:h-20"></div>
      {isCertificationsOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsCertificationsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;
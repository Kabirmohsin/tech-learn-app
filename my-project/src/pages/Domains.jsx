import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Domains = () => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const domains = [
    {
      id: 'web-dev',
      title: 'Web Development',
      emoji: '🖥️',
      description: 'Build modern, responsive websites and web applications using the latest technologies and frameworks.',
      features: ['HTML/CSS/JavaScript', 'React & Next.js', 'Node.js & Express', 'MongoDB & SQL'],
      gradient: 'from-blue-500 to-purple-600',
      bgGradient: 'from-blue-500/10 to-purple-600/10',
      color: 'blue'
    },
    {
      id: 'android',
      title: 'App Development',
      emoji: '📱',
      description: 'Create powerful mobile applications for Android & iOS with modern development tools and frameworks.',
      features: ['React Native & Flutter', 'Android & iOS', 'Mobile UI/UX', 'App Store Deployment'],
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-500/10 to-emerald-600/10',
      color: 'green'
    },
    {
      id: 'data-science',
      title: 'Data Science',
      emoji: '📊',
      description: 'Unlock insights from data using statistical analysis, machine learning and data visualization techniques.',
      features: ['Python & R', 'Machine Learning', 'Data Visualization', 'Big Data Analytics'],
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-500/10 to-red-600/10',
      color: 'orange'
    },
    {
      id: 'devops',
      title: 'DevOps',
      emoji: '🔧',
      description: 'Master the art of CI/CD, containerization, and infrastructure automation for seamless software delivery.',
      features: ['Docker & Kubernetes', 'CI/CD Pipelines', 'Cloud Platforms', 'Infrastructure as Code'],
      gradient: 'from-gray-500 to-slate-700',
      bgGradient: 'from-gray-500/10 to-slate-700/10',
      color: 'gray'
    }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % domains.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [domains.length]);

  // Update scroll position when currentSlide changes
  useEffect(() => {
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.offsetWidth / 3; // Show 3 slides at a time
      sliderRef.current.scrollTo({
        left: currentSlide * slideWidth,
        behavior: 'smooth'
      });
    }
  }, [currentSlide]);

  // Mouse drag functionality
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  // Touch events for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white pt-20">
      {/* Header Section */}
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Our Domains
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
          Explore the cutting-edge technology domains we specialize in. 
          Each domain represents a pathway to mastering modern tech skills.
        </p>
        
        {/* Progress Indicators */}
        <div className="flex justify-center space-x-3 mb-12">
          {domains.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-white scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Slider Container */}
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Navigation Arrows */}
        <button 
          onClick={() => setCurrentSlide(prev => prev > 0 ? prev - 1 : domains.length - 1)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center transition-all duration-300 group"
        >
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={() => setCurrentSlide(prev => (prev + 1) % domains.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center transition-all duration-300 group"
        >
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slider */}
        <div 
          ref={sliderRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-6 pb-12"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {domains.map((domain, index) => (
            <div
              key={domain.id}
              className="flex-shrink-0 w-80 md:w-96 snap-center"
            >
              <div className={`bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl h-full flex flex-col ${
                currentSlide === index ? 'ring-2 ring-white/30' : ''
              }`}>
                {/* Domain Icon */}
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${domain.gradient} flex items-center justify-center text-3xl mb-6 mx-auto shadow-lg`}>
                  {domain.emoji}
                </div>

                {/* Domain Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-center mb-4">
                  {domain.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 text-center mb-6 flex-grow">
                  {domain.description}
                </p>

                {/* Features */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">What You'll Learn</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {domain.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${domain.gradient}`}></div>
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Domain Info */}
                <div className="mt-auto pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>Career Path</span>
                    <span className={`px-2 py-1 rounded text-xs bg-gradient-to-r ${domain.gradient} text-white`}>
                      High Demand
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Domain Details Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Domain Overview</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get to know each domain in detail and understand how they shape the tech industry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {domains.map((domain) => (
            <div 
              key={domain.id}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${domain.gradient} flex items-center justify-center text-xl`}>
                  {domain.emoji}
                </div>
                <h3 className="text-2xl font-bold">{domain.title}</h3>
              </div>
              <p className="text-gray-300 mb-4">{domain.description}</p>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Core Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {domain.features.map((tech, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300 border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-blue-400 mb-2">{domains.length}</div>
            <div className="text-gray-400">Specialized Domains</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-green-400 mb-2">50+</div>
            <div className="text-gray-400">Technologies Covered</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-purple-400 mb-2">100%</div>
            <div className="text-gray-400">Industry Relevant</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-yellow-400 mb-2">24/7</div>
            <div className="text-gray-400">Learning Support</div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="container mx-auto px-6 py-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Explore More?
        </h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          Dive deeper into each domain and discover how you can master these technologies to advance your career.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Back to Home
          </button>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300"
          >
            Explore Domains Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Domains;
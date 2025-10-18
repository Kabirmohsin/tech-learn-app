import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DomainCard from '../components/DomainCard';

const Homepage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const domains = [
    {
      id: 'web-dev',
      title: 'Web Development',
      description: 'Master modern web technologies including React, Node.js, and full-stack development. Build responsive and scalable web applications.',
      skills: ['React', 'Node.js', 'JavaScript', 'CSS', 'HTML5'],
      image: '🖥️'
    },
    {
      id: 'android',
      title: 'Android Development',
      description: 'Create powerful mobile applications for Android ecosystem using Kotlin, Java, and modern mobile development practices.',
      skills: ['Kotlin', 'Java', 'Android Studio', 'Material Design'],
      image: '📱'
    },
    {
      id: 'data-science',
      title: 'Data Science',
      description: 'Unlock insights from data with machine learning, statistical analysis, and data visualization techniques.',
      skills: ['Python', 'Machine Learning', 'SQL', 'Data Visualization'],
      image: '📊'
    },
    {
      id: 'devops',
      title: 'DevOps',
      description: 'Streamline development workflows with CI/CD, containerization, cloud infrastructure, and automation tools.',
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
      image: '⚙️'
    }
  ];

  const platformFeatures = [
    { icon: '🚀', text: 'Accelerated Learning Paths' },
    { icon: '🎯', text: 'Industry-Ready Projects' },
    { icon: '👨‍💻', text: 'Expert Mentorship' },
    { icon: '📚', text: 'Comprehensive Resources' },
    { icon: '🤝', text: 'Community Support' },
    { icon: '💼', text: 'Career Guidance' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    const searchLower = searchTerm.toLowerCase();
    
    const foundDomain = domains.find(domain => 
      domain.title.toLowerCase().includes(searchLower) ||
      domain.id.toLowerCase().includes(searchLower) ||
      domain.skills.some(skill => skill.toLowerCase().includes(searchLower))
    );

    setTimeout(() => {
      setSelectedDomain(foundDomain || null);
      setIsSearching(false);
    }, 800);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedDomain(null);
  };

  const handleExploreClick = (domain) => {
    // Navigate to DomainDetail.jsx with domain ID
    navigate(`/domain/${domain.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Master <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">IT Domains</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover your path in technology with our comprehensive learning platform. 
            From Web Development to Data Science, we've got you covered.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-16">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search domains: Web Dev, Android, Data Science, DevOps..."
                className="w-full px-6 py-4 pl-14 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {domains.map(domain => (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() => {
                    setSearchTerm(domain.title);
                    setTimeout(() => handleSearch({ preventDefault: () => {} }), 100);
                  }}
                  className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full hover:bg-white/10 transition-all text-sm"
                >
                  {domain.title}
                </button>
              ))}
            </div>
          </form>

          {/* Loading Animation */}
          {isSearching && (
            <div className="flex justify-center items-center mb-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Single Domain Card Result with Explore Button */}
          {selectedDomain && !isSearching && (
            <div className="max-w-2xl mx-auto mb-16 animate-fade-in">
              <DomainCard 
                domain={selectedDomain} 
                onExploreClick={handleExploreClick}
              />
            </div>
          )}

          {/* Platform Features Grid - Show when no search */}
          {!selectedDomain && !isSearching && (
            <div className="mt-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Why Choose Our Platform?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {platformFeatures.map((feature, index) => (
                  <div 
                    key={index}
                    className="group p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-200 group-hover:text-white transition-colors">
                      {feature.text}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="container mx-auto text-center text-gray-400">
          <p>© 2024 Tech Learn. Empowering the next generation of developers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
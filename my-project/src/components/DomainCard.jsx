import { useState } from 'react';

const DomainCard = ({ domain, onExploreClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const domainThemes = {
    'web-dev': {
      gradient: 'from-blue-500 via-purple-500 to-blue-600',
      glow: 'shadow-blue-500/25',
      button: 'from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
    },
    'android': {
      gradient: 'from-blue-500 via-purple-500 to-blue-600',
      glow: 'shadow-green-500/25',
      button: 'from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
    },
    'data-science': {
      gradient: 'from-blue-500 via-purple-500 to-blue-600',
      glow: 'shadow-orange-500/25',
      button: 'from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
    },
    'devops': {
      gradient: 'from-blue-500 via-purple-500 to-blue-600',
      glow: 'shadow-purple-500/25',
      button: 'from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
    }
  };

  const theme = domainThemes[domain.id] || domainThemes['web-dev'];

  return (
    <div 
      className={`
        relative rounded-2xl p-8 bg-gradient-to-br ${theme.gradient} 
        backdrop-blur-lg border border-white/20 ${theme.glow}
        transform transition-all duration-500 
        ${isHovered ? 'scale-105 shadow-2xl' : 'shadow-xl'}
        overflow-hidden group cursor-pointer h-full flex flex-col
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Top-right Corner Emoji */}
      <div className="absolute top-6 right-6">
        <div className="text-4xl transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
          {domain.image}
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 text-white flex-1 flex flex-col">
        
        {/* Domain Title */}
        <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
          {domain.title}
        </h3>

        {/* Description */}
        <p className="text-white/90 mb-6 leading-relaxed text-sm md:text-base flex-1">
          {domain.description}
        </p>

        {/* Skills Pill Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {domain.skills.map((skill, index) => (
            <span 
              key={index}
              className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium border border-white/30 transition-all duration-300 hover:bg-white/30 hover:scale-105"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Explore Button - Bottom */}
        <button
          onClick={() => onExploreClick(domain)}
          className={`
            w-full py-3 px-6 bg-gradient-to-r ${theme.button} text-white font-semibold 
            rounded-xl transition-all duration-300 transform
            flex items-center justify-center space-x-2
            border border-white/20 shadow-lg
            ${isHovered ? 'scale-105 shadow-xl' : ''}
            group/btn mt-auto
          `}
        >
          <span>Explore Details</span>
          <span className="transform transition-transform duration-300 group-hover/btn:translate-x-1">
            →
          </span>
        </button>
      </div>

      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-white/10 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200"></div>
        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-white/10 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300"></div>
      </div>
    </div>
  );
};

export default DomainCard;
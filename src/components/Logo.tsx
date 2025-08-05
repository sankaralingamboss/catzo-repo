import React from 'react';

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: { container: 'w-16 h-20', cat: 'w-12 h-12', text: 'text-lg' },
    md: { container: 'w-24 h-28', cat: 'w-18 h-18', text: 'text-2xl' },
    lg: { container: 'w-32 h-36', cat: 'w-24 h-24', text: 'text-4xl' }
  };

  return (
    <div className={`flex flex-col items-center ${sizes[size].container}`}>
      {/* Cat Face */}
      <div className={`${sizes[size].cat} mb-1 relative`}>
        <svg viewBox="0 0 100 100" className="w-full h-full fill-orange-500">
          {/* Cat Head */}
          <ellipse cx="50" cy="55" rx="35" ry="30" />
          {/* Cat Ears */}
          <polygon points="25,35 35,15 45,35" />
          <polygon points="55,35 65,15 75,35" />
          <polygon points="28,32 33,20 40,32" className="fill-pink-300" />
          <polygon points="60,32 67,20 72,32" className="fill-pink-300" />
          {/* Cat Eyes */}
          <ellipse cx="40" cy="50" rx="4" ry="6" className="fill-green-400" />
          <ellipse cx="60" cy="50" rx="4" ry="6" className="fill-green-400" />
          <ellipse cx="40" cy="48" rx="2" ry="3" className="fill-black" />
          <ellipse cx="60" cy="48" rx="2" ry="3" className="fill-black" />
          {/* Cat Nose */}
          <polygon points="50,58 45,62 55,62" className="fill-pink-400" />
          {/* Cat Mouth */}
          <path d="M 50 65 Q 45 68 40 65" stroke="#333" strokeWidth="2" fill="none" />
          <path d="M 50 65 Q 55 68 60 65" stroke="#333" strokeWidth="2" fill="none" />
          {/* Whiskers */}
          <line x1="20" y1="55" x2="35" y2="58" stroke="#333" strokeWidth="1.5" />
          <line x1="20" y1="62" x2="35" y2="62" stroke="#333" strokeWidth="1.5" />
          <line x1="65" y1="58" x2="80" y2="55" stroke="#333" strokeWidth="1.5" />
          <line x1="65" y1="62" x2="80" y2="62" stroke="#333" strokeWidth="1.5" />
        </svg>
      </div>
      {/* Catzo Text */}
      <div className={`font-bold ${sizes[size].text} text-orange-600 tracking-wide`}>
        Catzo
      </div>
    </div>
  );
};

export default Logo;
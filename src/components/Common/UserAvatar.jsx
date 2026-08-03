import React, { useState } from 'react';

export const UserAvatar = ({ 
  src, 
  name = 'User', 
  className = 'w-10 h-10 rounded-xl',
  borderClass = 'border-2 border-cyan-glow/50',
  textClass = 'text-xs font-extrabold text-cyan-glow'
}) => {
  const [imageError, setImageError] = useState(false);

  // Extract initials (e.g. "DHG GAMING" -> "DG", "Alex Vance" -> "AV")
  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(name);

  if (!src || imageError) {
    return (
      <div 
        className={`${className} ${borderClass} bg-gradient-to-tr from-dark-card to-dark-bg flex items-center justify-center flex-shrink-0 shadow-sm select-none`}
      >
        <span className={textClass}>{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      referrerPolicy="no-referrer"
      onError={() => setImageError(true)}
      className={`${className} ${borderClass} object-cover flex-shrink-0 shadow-sm`}
    />
  );
};

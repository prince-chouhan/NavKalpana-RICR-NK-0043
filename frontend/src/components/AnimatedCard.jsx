import React from 'react';

export const AnimatedCard = ({ children, delay = 0, className = '' }) => {
  return (
    <div 
      className={`card p-6 animate-scale-in ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

export const StatCard = ({ icon, title, value, subtitle, color = 'blue', delay = 0 }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-pink-500',
    red: 'from-red-500 to-red-600',
    orange: 'from-orange-500 to-orange-600',
    indigo: 'from-indigo-500 to-purple-600',
  };

  return (
    <div 
      className={`stat-card bg-gradient-to-br ${colorClasses[color]} text-white animate-slide-up`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <span className="text-4xl">{icon}</span>
      </div>
      <div className="text-6xl font-bold mb-2">{value}</div>
      {subtitle && <div className="text-sm opacity-90">{subtitle}</div>}
    </div>
  );
};

export const PulsingBadge = ({ children, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
  };

  return (
    <span className={`relative inline-flex items-center px-4 py-2 rounded-full text-white font-semibold ${colorClasses[color]}`}>
      <span className={`absolute inline-flex h-full w-full rounded-full ${colorClasses[color]} opacity-75 animate-ping`}></span>
      <span className="relative">{children}</span>
    </span>
  );
};

export const FloatingButton = ({ children, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden group ${className} transition-all duration-300 hover:scale-110 hover:rotate-3`}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></span>
    </button>
  );
};

export const ProgressBar = ({ value, max = 100, color = 'blue', animated = true }) => {
  const percentage = (value / max) * 100;
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
      <div
        className={`h-full ${colorClasses[color]} rounded-full transition-all duration-1000 ease-out ${animated ? 'animate-pulse-slow' : ''}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export const LoadingSpinner = ({ size = 'md', color = 'blue' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const colorClasses = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    purple: 'border-purple-500',
  };

  return (
    <div className={`${sizeClasses[size]} border-4 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`}></div>
  );
};

export default AnimatedCard;

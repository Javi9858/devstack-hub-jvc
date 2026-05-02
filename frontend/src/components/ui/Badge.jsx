import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary/20 text-primary',
    success: 'bg-green-100 text-green-800', // Principiante
    warning: 'bg-orange-100 text-orange-800', // Intermedio
    danger: 'bg-red-100 text-red-800', // Avanzado
  };

  return (
    <span className={`${baseClasses} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;

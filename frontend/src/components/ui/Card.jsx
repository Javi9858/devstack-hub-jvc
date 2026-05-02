import React from 'react';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`glass rounded-2xl p-8 shadow-2xl ${className}`}>
      {children}
    </div>
  );
};

import React, { forwardRef } from 'react';

export const Input = forwardRef(({ label, error, ...props }, ref) => {
  return (
    <div className="flex flex-col space-y-1 mb-4">
      {label && <label className="text-sm font-medium text-textMuted">{label}</label>}
      <input 
        ref={ref}
        className={`input-premium ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
        {...props} 
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

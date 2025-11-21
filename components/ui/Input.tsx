
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  const inputId = id || React.useId();
  
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-3 py-2 bg-dark-950 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-colors
          ${error ? 'border-red-500/50 focus:border-red-500' : 'border-dark-border focus:border-brand-500'}
          text-white placeholder-gray-500 ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default Input;

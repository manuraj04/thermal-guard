
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', id, ...props }) => {
  const textareaId = id || React.useId();
  
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`w-full px-3 py-2 bg-dark-950 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-colors min-h-[80px]
          ${error ? 'border-red-500/50 focus:border-red-500' : 'border-dark-border focus:border-brand-500'}
          text-white placeholder-gray-500 ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default Textarea;

import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, subtitle, children, className = '', action }) => {
  return (
    <div className={`bg-dark-900 border border-dark-border rounded-xl overflow-hidden shadow-sm ${className}`}>
      {(title || action) && (
        <div className="px-6 py-4 border-b border-dark-border flex justify-between items-center">
          <div>
            {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
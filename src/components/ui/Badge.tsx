import React from 'react';
import { RiskLevel } from '../../types';

interface BadgeProps {
  risk?: RiskLevel;
  label?: string;
  color?: 'red' | 'yellow' | 'green' | 'blue' | 'gray';
}

const Badge: React.FC<BadgeProps> = ({ risk, label, color }) => {
  let badgeColor = "bg-gray-500/10 text-gray-400 border-gray-500/20";
  let text = label;

  if (risk) {
    text = risk;
    switch (risk) {
      case RiskLevel.HIGH:
        badgeColor = "bg-red-500/10 text-red-400 border-red-500/20";
        break;
      case RiskLevel.MEDIUM:
        badgeColor = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
        break;
      case RiskLevel.LOW:
        badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        break;
    }
  } else if (color) {
      // Manual override if no risk provided
      switch(color) {
          case 'red': badgeColor = "bg-red-500/10 text-red-400 border-red-500/20"; break;
          case 'yellow': badgeColor = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"; break;
          case 'green': badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"; break;
          case 'blue': badgeColor = "bg-blue-500/10 text-blue-400 border-blue-500/20"; break;
          default: badgeColor = "bg-gray-500/10 text-gray-400 border-gray-500/20"; break;
      }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeColor}`}>
      {text}
    </span>
  );
};

export default Badge;
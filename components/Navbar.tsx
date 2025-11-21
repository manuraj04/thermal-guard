import React from 'react';
import { Zap } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-dark-border bg-dark-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-600/10 rounded-lg">
            <Zap className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-none">Thermal Guard</h1>
            <p className="text-xs text-gray-400">Thermal safety assistant</p>
          </div>
        </div>
        <div>
          {/* Placeholder for settings or user profile if needed */}
          <div className="w-8 h-8 rounded-full bg-dark-800 border border-dark-border flex items-center justify-center">
            <span className="text-xs font-medium text-gray-400">User</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
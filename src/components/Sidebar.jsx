import React from 'react';
import { Home, Image, FolderOpen, Sparkles, Crown } from 'lucide-react';

const Sidebar = ({ activeView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'templates', label: 'Templates', icon: Image },
    { id: 'projects', label: 'My Projects', icon: FolderOpen },
    { id: 'ai-tools', label: 'AI Tools', icon: Sparkles },
  ];

  return (
    <div className="w-64 glass-effect text-white p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">PixelSpark</h1>
        <p className="text-sm text-white/70">Effortless Graphics. Instantly Shareable.</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeView === item.id
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-8 p-4 bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg border border-white/10">
        <div className="flex items-center space-x-2 mb-2">
          <Crown size={16} className="text-accent" />
          <span className="text-sm font-semibold text-white">Free Plan</span>
        </div>
        <p className="text-xs text-white/70 mb-3">
          Upgrade to unlock premium templates and AI features.
        </p>
        <button className="w-full bg-accent hover:bg-accent/90 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors">
          Upgrade Now
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
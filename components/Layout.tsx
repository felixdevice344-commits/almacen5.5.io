import React from 'react';
import { useApp } from '../store/AppContext';
import { CyberButton } from './ui/CyberUI';
import { Activity, AlertTriangle, Box, Home, Trash2, Power, Download } from 'lucide-react';
import { useSound } from '../hooks/useSound';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { view, setView, time, shift, panicMode, exportData } = useApp();
  const { playClick } = useSound();

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'DASHBOARD', color: 'text-cyber-cyan' },
    { id: 'wip', icon: Activity, label: 'PRODUCTION', color: 'text-cyber-purple' },
    { id: 'blackbox', icon: AlertTriangle, label: 'BLACKBOX', color: 'text-cyber-red' },
    { id: 'collector', icon: Box, label: 'COLLECTOR', color: 'text-cyber-cyan' },
    { id: 'scrap', icon: Trash2, label: 'SCRAP DOCK', color: 'text-cyber-yellow' },
  ];

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-cyber-black font-sans relative transition-colors duration-500 ${panicMode ? 'bg-red-900/20' : ''}`}>
      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 z-50 pointer-events-none crt-overlay animate-scanline opacity-30" />
      
      {/* Panic Overlay */}
      {panicMode && (
        <div className="absolute inset-0 z-40 pointer-events-none border-[10px] border-cyber-red animate-pulse flex items-center justify-center">
          <div className="bg-cyber-red text-black text-6xl font-bold p-10 font-mono rotate-12 opacity-50">CRITICAL FAILURE</div>
        </div>
      )}

      {/* Sidebar (Desktop) */}
      <aside className={`hidden md:flex flex-col w-72 bg-cyber-panel border-r border-white/10 z-30 backdrop-blur-md ${panicMode ? 'border-cyber-red' : ''}`}>
        <div className="p-6 border-b border-white/10">
          <h1 className="text-3xl font-black italic tracking-tighter text-white">
            DEVICE<span className="text-cyber-cyan">OS</span>
          </h1>
          <div className="text-xs text-gray-500 font-mono mt-1">v5.0.1 ULTIMATE</div>
        </div>

        <nav className="flex-grow py-6 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = view === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { playClick(); setView(item.id as any); }}
                className={`
                  relative px-6 py-4 flex items-center gap-4 text-sm font-bold tracking-wider transition-all
                  ${isActive ? 'bg-white/5 text-white border-r-4 border-cyber-cyan' : 'text-gray-500 hover:text-white hover:bg-white/5'}
                `}
              >
                <Icon size={20} className={isActive ? item.color : ''} />
                {item.label}
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyber-cyan shadow-[0_0_10px_#00f0ff]" />}
              </button>
            );
          })}
        </nav>

        {/* System Status Footer */}
        <div className="p-6 bg-black/50 border-t border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-mono text-gray-400">STATUS</span>
            <span className="text-xs font-mono text-cyber-green flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" /> ONLINE
            </span>
          </div>
          <div className="text-2xl font-mono text-white font-bold">{time}</div>
          <div className="text-sm font-mono text-cyber-cyan mb-4">{shift}</div>
          
          <CyberButton variant="cyan" className="w-full text-xs" onClick={exportData}>
            <Download size={14} className="inline mr-2" /> EXPORT LOGS
          </CyberButton>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow relative overflow-hidden flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-cyber-panel border-b border-white/10 flex items-center justify-between px-4 z-30">
          <div className="font-bold text-white text-xl">DEVICE<span className="text-cyber-cyan">OS</span></div>
          <div className="text-xs font-mono text-right">
            <div className="text-white">{time}</div>
            <div className="text-cyber-cyan">{shift}</div>
          </div>
        </header>

        <div className="flex-grow p-4 md:p-8 overflow-y-auto bg-grid-pattern bg-[length:40px_40px] relative">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </div>

        {/* Mobile Nav */}
        <nav className="md:hidden h-16 bg-cyber-panel border-t border-white/10 flex items-center justify-around z-30">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { playClick(); setView(item.id as any); }}
                className={`p-2 rounded-lg ${isActive ? 'bg-white/10' : ''}`}
              >
                <Icon size={24} className={isActive ? item.color : 'text-gray-500'} />
              </button>
            );
          })}
        </nav>
      </main>
    </div>
  );
};

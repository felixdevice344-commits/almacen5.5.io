import React from 'react';
import { useSound } from '../../hooks/useSound';

interface CyberProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'cyan' | 'red' | 'purple' | 'yellow' | 'green';
}

const colorMap = {
  cyan: 'border-cyber-cyan text-cyber-cyan shadow-[0_0_10px_rgba(0,240,255,0.3)]',
  red: 'border-cyber-red text-cyber-red shadow-[0_0_10px_rgba(255,0,60,0.3)]',
  purple: 'border-cyber-purple text-cyber-purple shadow-[0_0_10px_rgba(188,19,254,0.3)]',
  yellow: 'border-cyber-yellow text-cyber-yellow shadow-[0_0_10px_rgba(252,238,10,0.3)]',
  green: 'border-cyber-green text-cyber-green shadow-[0_0_10px_rgba(0,255,159,0.3)]',
};

const bgMap = {
  cyan: 'hover:bg-cyber-cyan/10',
  red: 'hover:bg-cyber-red/10',
  purple: 'hover:bg-cyber-purple/10',
  yellow: 'hover:bg-cyber-yellow/10',
  green: 'hover:bg-cyber-green/10',
};

export const CyberCard: React.FC<CyberProps & { title?: string }> = ({ children, className = '', variant = 'cyan', title, ...props }) => {
  return (
    <div className={`relative bg-cyber-panel/80 backdrop-blur-sm border-l-2 border-r-2 ${colorMap[variant].split(' ')[0]} p-1 ${className}`} {...props}>
      {/* Corner accents */}
      <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l ${colorMap[variant].split(' ')[0]}`} />
      <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r ${colorMap[variant].split(' ')[0]}`} />
      
      <div className="bg-cyber-black/50 h-full p-4 border-t border-b border-white/5">
        {title && <h3 className={`text-sm font-bold tracking-widest uppercase mb-4 ${colorMap[variant].split(' ')[1]}`}>{title}</h3>}
        {children}
      </div>
    </div>
  );
};

export const CyberButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof colorMap }> = ({ children, className = '', variant = 'cyan', onClick, ...props }) => {
  const { playClick } = useSound();
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playClick();
    if (onClick) onClick(e);
  };

  return (
    <button 
      onClick={handleClick}
      className={`
        relative px-6 py-2 uppercase font-mono font-bold tracking-wider text-sm transition-all duration-200
        border border-white/10 bg-cyber-dark
        ${colorMap[variant]} 
        ${bgMap[variant]}
        hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]
        active:translate-y-0.5
        disabled:opacity-50 disabled:cursor-not-allowed
        group
        ${className}
      `}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {/* Glitch effect line on hover */}
      <div className="absolute inset-0 bg-white/5 w-0 group-hover:w-full transition-all duration-300 ease-out -skew-x-12 opacity-0 group-hover:opacity-100" />
    </button>
  );
};

export const CyberInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => {
  return (
    <input 
      className={`
        w-full bg-black border border-white/20 text-cyber-cyan font-mono p-3 
        focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.2)]
        placeholder-white/20 transition-all duration-200
        ${className}
      `}
      {...props}
    />
  );
};

export const CyberSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className = '', children, ...props }) => {
  return (
    <div className="relative">
      <select 
        className={`
          w-full bg-black border border-white/20 text-cyber-cyan font-mono p-3 appearance-none
          focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.2)]
          cursor-pointer
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-cyan pointer-events-none text-xs">▼</div>
    </div>
  );
};

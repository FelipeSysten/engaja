
import React from 'react';
import { User, UserLevel } from '../types';

interface NavbarProps {
  user: User;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const getLevelColor = (level: UserLevel) => {
    switch (level) {
      case UserLevel.BRONZE: return 'text-orange-400';
      case UserLevel.PRATA: return 'text-slate-400';
      case UserLevel.OURO: return 'text-yellow-400';
      case UserLevel.DIAMANTE: return 'text-cyan-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center space-x-6">
        <div className="flex items-center bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
          <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center mr-2 text-[10px] font-bold">P</div>
          <span className="text-sm font-bold text-white">{user.points.toLocaleString()} pts</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20 group cursor-help">
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
          <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Conectado</span>
          <div className="absolute top-14 left-48 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-[10px] text-slate-300 p-2 rounded-lg border border-slate-700 w-48 pointer-events-none shadow-2xl">
            Conectado. Sincronização em tempo real ativa.
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2">
            <span className={`text-xs font-bold uppercase ${getLevelColor(user.level)}`}>{user.level}</span>
            <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
            <span className="text-xs text-slate-400 font-medium">{user.plan}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-slate-900"></span>
        </button>
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white group-hover:text-indigo-400 transition">{user.name}</p>
            <p className="text-xs text-slate-500">{user.instagramUsername}</p>
          </div>
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-10 h-10 rounded-full border-2 border-slate-800 group-hover:border-indigo-500 transition-all"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;

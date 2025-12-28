
import React, { useState, useEffect } from 'react';
import { User } from './types';
import { DatabaseService } from './services/db';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Campaigns from './pages/Campaigns';
import Pricing from './pages/Pricing';
import Affiliates from './pages/Affiliates';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';

type ViewState = 'landing' | 'login' | 'signup' | 'dashboard' | 'tasks' | 'campaigns' | 'pricing' | 'affiliates';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const savedUserId = localStorage.getItem('engaja_user_id');
      if (savedUserId) {
        try {
          const userData = await DatabaseService.getUser(savedUserId);
          if (userData) {
            setUser(userData);
            setView('dashboard');
          } else {
            localStorage.removeItem('engaja_user_id');
          }
        } catch (error) {
          console.error("Session restoration failed:", error);
          localStorage.removeItem('engaja_user_id');
        }
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);

  const handleLoginSuccess = (userData: User) => {
    localStorage.setItem('engaja_user_id', userData.id);
    setUser(userData);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('engaja_user_id');
    setUser(null);
    setView('landing');
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Views that don't require the main layout
  if (view === 'landing') return <LandingPage onStart={() => setView('login')} onSignup={() => setView('signup')} />;
  if (view === 'login') return <Auth mode="login" onBack={() => setView('landing')} onToggle={() => setView('signup')} onSuccess={handleLoginSuccess} />;
  if (view === 'signup') return <Auth mode="signup" onBack={() => setView('landing')} onToggle={() => setView('login')} onSuccess={handleLoginSuccess} />;

  // Protected Views
  const renderPage = () => {
    if (!user) return null;
    switch (view) {
      case 'dashboard': return <Dashboard user={user} />;
      case 'tasks': return <Tasks user={user} setUser={setUser} />;
      case 'campaigns': return <Campaigns user={user} setUser={setUser} />;
      case 'pricing': return <Pricing user={user} setUser={setUser} />;
      case 'affiliates': return <Affiliates user={user} />;
      default: return <Dashboard user={user} />;
    }
  };

  // Main Layout for Authenticated Users
  if (!user) {
    return <LandingPage onStart={() => setView('login')} onSignup={() => setView('signup')} />;
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-['Inter']">
      <Sidebar 
        activePage={view} 
        onNavigate={(v) => setView(v as ViewState)} 
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar user={user} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderPage()}
          <div className="mt-20 flex justify-center pb-10">
             <button onClick={handleLogout} className="text-slate-600 hover:text-red-400 text-xs font-bold uppercase tracking-widest transition">
                Encerrar Sessão Atual
             </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;

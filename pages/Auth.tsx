
import React, { useState } from 'react';
import { DatabaseService, SETUP_SQL } from '../services/db';
import { User, UserPlan, UserLevel } from '../types';

interface AuthProps {
  mode: 'login' | 'signup';
  onBack: () => void;
  onToggle: () => void;
  onSuccess: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ mode, onBack, onToggle, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSqlGuide, setShowSqlGuide] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    instagram: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setShowSqlGuide(false);
    
    try {
      const userId = formData.email.toLowerCase().trim();

      if (mode === 'signup') {
        const newUser: User = {
          id: userId,
          name: formData.name,
          instagramUsername: formData.instagram.startsWith('@') ? formData.instagram : `@${formData.instagram}`,
          points: 200,
          dailyPointsEarned: 0,
          plan: UserPlan.FREE,
          level: UserLevel.BRONZE,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
          isCreator: true
        };
        const created = await DatabaseService.createUser(newUser);
        onSuccess(created);
      } else {
        const existingUser = await DatabaseService.getUser(userId);
        if (existingUser) {
          onSuccess(existingUser);
        } else {
          setErrorMsg("Conta não encontrada. Verifique o e-mail ou cadastre-se.");
        }
      }
    } catch (error: any) {
      const rawMsg = error.message || String(error);
      if (rawMsg.includes("TABLE_MISSING")) {
        setErrorMsg("Configuração do Banco de Dados Pendente.");
        setShowSqlGuide(true);
      } else {
        setErrorMsg(rawMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copySql = () => {
    navigator.clipboard.writeText(SETUP_SQL);
    alert("SQL copiado! Cole no SQL Editor do Supabase.");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-indigo-600 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-pink-600 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <button onClick={onBack} className="absolute top-8 left-8 flex items-center space-x-2 text-slate-400 hover:text-white transition group z-20">
        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        <span className="font-bold text-sm uppercase tracking-widest">Voltar</span>
      </button>

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent mb-2">Engaja+</h1>
          <p className="text-slate-400 font-medium italic">
            {mode === 'login' ? 'Identifique-se para gerenciar seus pontos.' : 'Junte-se a milhares de criadores reais.'}
          </p>
        </div>

        <div className="glass-effect p-8 md:p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl">
          {errorMsg && (
            <div className={`mb-6 p-4 border rounded-2xl text-xs font-bold leading-relaxed ${showSqlGuide ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              <p className="mb-2">⚠️ {errorMsg}</p>
              {showSqlGuide && (
                <div className="mt-3 space-y-3">
                  <p className="text-[10px] opacity-70 font-medium">As tabelas necessárias não foram encontradas. Siga os passos:</p>
                  <ol className="list-decimal list-inside space-y-1 text-[10px] opacity-70">
                    <li>Acesse seu painel no Supabase</li>
                    <li>Clique em "SQL Editor" no menu lateral</li>
                    <li>Clique no botão abaixo para copiar o script</li>
                    <li>Cole no editor e clique em "Run"</li>
                  </ol>
                  <button 
                    onClick={copySql}
                    className="w-full py-2 bg-amber-500 text-slate-950 rounded-lg font-black uppercase tracking-tighter hover:bg-amber-400 transition"
                  >
                    Copiar Script SQL
                  </button>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Seu Nome</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Como quer ser chamado?" className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 ring-indigo-500 outline-none transition text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Username Instagram</label>
                  <input type="text" required value={formData.instagram} onChange={(e) => setFormData({...formData, instagram: e.target.value})} placeholder="@seu_perfil" className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 ring-pink-500 outline-none transition text-white" />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">E-mail</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="seu@email.com" className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 ring-indigo-500 outline-none transition text-white" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Senha</label>
              <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 ring-indigo-500 outline-none transition text-white" />
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-pink-600 to-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center disabled:opacity-50">
              {isLoading ? 'Conectando...' : (mode === 'login' ? 'Entrar Agora' : 'Criar minha Conta')}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-500 text-sm">
            {mode === 'login' ? 'Novo por aqui?' : 'Já tem uma conta?'}
            <button onClick={onToggle} className="ml-2 text-indigo-400 font-bold hover:text-indigo-300 transition">
              {mode === 'login' ? 'Cadastre-se' : 'Fazer login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

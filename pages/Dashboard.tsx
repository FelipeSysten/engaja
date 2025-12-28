
import React, { useState, useEffect } from 'react';
import { User, Campaign } from '../types';
import { PLAN_LIMITS } from '../constants';
import { DatabaseService } from '../services/db';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  useEffect(() => {
    async function initDashboard() {
      // 1. Verifica se retornou de um pagamento com sucesso
      const params = new URLSearchParams(window.location.search);
      if (params.get('payment') === 'success') {
        const type = params.get('type') as any;
        const value = params.get('val');
        
        if (type && value) {
          setPaymentStatus('processing');
          try {
            await DatabaseService.processPurchase(user.id, type, value);
            setPaymentStatus('success');
            // Remove os parâmetros da URL para evitar re-processamento no reload
            window.history.replaceState({}, '', window.location.pathname);
            // Pequeno delay para o usuário ver o feedback e recarregar
            setTimeout(() => window.location.reload(), 2000);
          } catch (e) {
            setPaymentStatus('error');
          }
        }
      }

      // 2. Carrega as campanhas normalmente
      try {
        const userCampaigns = await DatabaseService.getCampaigns(user.id);
        setCampaigns(userCampaigns);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    }
    initDashboard();
  }, [user.id]);

  const totalVisibility = campaigns.reduce((acc, curr) => acc + (curr.currentQuantity || 0), 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE');
  const dailyLimit = PLAN_LIMITS[user.plan] || 150;
  const progress = dailyLimit === Infinity ? 100 : (user.dailyPointsEarned / dailyLimit) * 100;

  const chartData = campaigns.length > 0 
    ? campaigns.slice(0, 7).reverse().map((c, i) => ({
        name: `Camp. ${i + 1}`,
        engaj: c.currentQuantity
      }))
    : [
        { name: 'Seg', engaj: 0 }, { name: 'Ter', engaj: 0 }, { name: 'Qua', engaj: 0 },
        { name: 'Qui', engaj: 0 }, { name: 'Sex', engaj: 0 }, { name: 'Sab', engaj: 0 }, { name: 'Dom', engaj: 0 },
      ];

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-20 bg-slate-900 rounded-3xl w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-48 bg-slate-900 rounded-[2.5rem]"></div>
          <div className="h-48 bg-slate-900 rounded-[2.5rem]"></div>
          <div className="h-48 bg-slate-900 rounded-[2.5rem]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Banner de Feedback de Pagamento */}
      {paymentStatus !== 'idle' && (
        <div className={`p-6 rounded-3xl border animate-in slide-in-from-top duration-500 ${
          paymentStatus === 'processing' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' :
          paymentStatus === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
          'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              paymentStatus === 'processing' ? 'animate-spin border-2 border-t-transparent border-indigo-400' : ''
            }`}>
              {paymentStatus === 'success' && '✓'}
              {paymentStatus === 'error' && '!'}
            </div>
            <div>
              <p className="font-black uppercase text-xs tracking-widest">Status da Transação</p>
              <p className="text-lg font-bold">
                {paymentStatus === 'processing' && 'Processando sua compra...'}
                {paymentStatus === 'success' && 'Pagamento confirmado! Seus créditos foram adicionados.'}
                {paymentStatus === 'error' && 'Erro ao processar compra. Entre em contato com o suporte.'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-8">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-white">Olá, {user.name.split(' ')[0]} 👋</h2>
          <p className="text-slate-500 font-medium">Sua conta está em modo de <span className="text-indigo-400 font-black">ALTA PERFORMANCE</span>.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Nível de Influência</p>
           <p className="text-sm font-bold text-indigo-400">{user.level}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-effect p-8 rounded-[2.5rem] relative overflow-hidden group border-indigo-500/20">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Pontos Ganhos Hoje</p>
          <h3 className="text-5xl font-black mt-2 text-white">{Number(user.dailyPointsEarned || 0)}</h3>
          <div className="mt-6">
            <div className="flex justify-between text-[10px] mb-2 font-bold uppercase tracking-tighter">
              <span className="text-slate-500">Cota Diária ({user.plan})</span>
              <span className="text-indigo-400">{Number(user.dailyPointsEarned || 0)} / {dailyLimit === Infinity ? '∞' : dailyLimit} pts</span>
            </div>
            <div className="h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                style={{ width: `${Math.min(100, isNaN(progress) ? 0 : progress)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="glass-effect p-8 rounded-[2.5rem] border-pink-500/20">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Visibilidade Gerada</p>
          <h3 className="text-5xl font-black mt-2 text-pink-500">{totalVisibility.toLocaleString()}</h3>
          <div className="mt-6 flex items-center text-emerald-400 text-sm font-black uppercase tracking-tighter">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            Sincronizado via Supabase
          </div>
        </div>

        <div className="glass-effect p-8 rounded-[2.5rem] bg-indigo-600/5 border-indigo-500/30">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">IA Vision Monitoring</p>
          <div className="flex items-center mt-3">
             <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse mr-3 shadow-[0_0_10px_#10b981]"></div>
             <h3 className="text-2xl font-black text-white">Ativa & Segura</h3>
          </div>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">
            Monitorando fraudes em tempo real. Sua integridade está em <span className="text-white font-black">100%</span>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-effect p-10 rounded-[3rem]">
          <h4 className="text-xl font-black uppercase tracking-tight mb-10">Performance das Campanhas</h4>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 700}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.03)'}} 
                  contentStyle={{backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px', fontWeight: '900'}}
                />
                <Bar dataKey="engaj" radius={[8, 8, 0, 0]} fill="#6366f1">
                   {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.engaj > 0 ? '#4f46e5' : '#1e293b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-effect p-10 rounded-[3rem] flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <h4 className="text-xl font-black uppercase tracking-tight">Fila de Entrega</h4>
            <span className="text-[10px] font-black text-slate-500 uppercase bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              {activeCampaigns.length} Ativas
            </span>
          </div>
          <div className="flex-1 space-y-5">
             {activeCampaigns.length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-800 rounded-[2rem] opacity-50">
                  <p className="text-xs font-bold text-slate-500 uppercase">Sem campanhas ativas</p>
               </div>
             ) : (
               activeCampaigns.slice(0, 3).map((camp) => {
                 const campProgress = Math.round((camp.currentQuantity / camp.targetQuantity) * 100);
                 return (
                   <div key={camp.id} className="flex items-center justify-between p-5 bg-white/[0.02] rounded-3xl border border-white/5 group hover:bg-white/[0.05] transition-colors">
                      <div className="flex items-center space-x-5">
                         <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-white/5">
                            {camp.type === 'LIKE' ? '❤️' : camp.type === 'FOLLOW' ? '👤' : '💬'}
                         </div>
                         <div className="max-w-[150px]">
                            <p className="text-sm font-black text-white truncate">{camp.targetUrl}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{campProgress}% Concluído</p>
                         </div>
                      </div>
                      <div className="w-24 h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                         <div className="h-full bg-indigo-500" style={{width: `${campProgress}%`}}></div>
                      </div>
                   </div>
                 );
               })
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

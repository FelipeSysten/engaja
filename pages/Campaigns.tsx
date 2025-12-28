
import React, { useState, useEffect } from 'react';
import { User, Campaign, TaskType } from '../types';
import { POINTS_COST } from '../constants';
import { DatabaseService } from '../services/db';

const Campaigns: React.FC<{ user: User, setUser: React.Dispatch<React.SetStateAction<User | null>> }> = ({ user, setUser }) => {
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [type, setType] = useState<TaskType>(TaskType.LIKE);
  const [url, setUrl] = useState('');
  const [quantity, setQuantity] = useState(10);

  useEffect(() => {
    async function load() {
      const data = await DatabaseService.getCampaigns(user.id);
      setCampaigns(data);
    }
    load();
  }, [user.id]);

  const cost = (POINTS_COST[type] || 2) * quantity;

  const handleCreate = async () => {
    if (user.points < cost) {
      alert("Saldo de pontos insuficiente!");
      return;
    }

    setIsSaving(true);
    const newCampaign: Campaign = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      targetUrl: url,
      targetQuantity: quantity,
      currentQuantity: 0,
      pointsInvested: cost,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    try {
      const dbResult = await DatabaseService.addCampaign(user.id, newCampaign);
      setUser(dbResult.user);
      setCampaigns(dbResult.campaigns);
      setShowModal(false);
      setUrl('');
      setQuantity(10);
    } catch (e) {
      alert("Erro ao criar campanha.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Minhas Campanhas</h2>
          <p className="text-slate-400">Gerencie sua visibilidade no Instagram.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="bg-gradient-to-r from-pink-600 to-indigo-600 px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 hover:scale-105 transition"
        >
          + Criar Campanha
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {campaigns.length === 0 && (
           <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-[2.5rem]">
              <p className="text-slate-500 font-medium">Você ainda não tem campanhas ativas.</p>
           </div>
         )}
         {campaigns.map((camp) => (
           <div key={camp.id} className="glass-effect p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                   <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                     camp.type === TaskType.LIKE ? 'bg-pink-500/10 text-pink-500' : 
                     camp.type === TaskType.FOLLOW ? 'bg-indigo-500/10 text-indigo-500' : 'bg-emerald-500/10 text-emerald-500'
                   }`}>
                      {camp.type}
                   </div>
                   <span className={`text-[10px] font-bold uppercase ${camp.status === 'ACTIVE' ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {camp.status === 'ACTIVE' ? '● Ativa' : 'Concluída'}
                   </span>
                </div>
                <p className="text-xs text-slate-400 truncate mb-6 italic opacity-60">{camp.targetUrl}</p>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-2">
                   <span className="text-slate-400">Progresso</span>
                   <span className="font-bold text-white">{camp.currentQuantity} / {camp.targetQuantity}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-gradient-to-r from-pink-500 to-indigo-500 transition-all duration-1000" 
                     style={{width: `${Math.min(100, (camp.currentQuantity/camp.targetQuantity)*100)}%`}}
                   ></div>
                </div>
              </div>
           </div>
         ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl">
            <h3 className="text-2xl font-black mb-8">Configurar Visibilidade</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Tipo de Ação</label>
                <div className="grid grid-cols-3 gap-3">
                  {[TaskType.LIKE, TaskType.FOLLOW, TaskType.COMMENT].map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`py-3 rounded-xl text-xs font-bold border transition ${
                        type === t ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {t === TaskType.LIKE ? 'Curtir' : t === TaskType.FOLLOW ? 'Seguir' : 'Comentar'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Link do Post/Perfil</label>
                <input 
                  type="text" 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  placeholder="https://instagram.com/..." 
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 ring-indigo-500 transition" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Quantidade: {quantity}</label>
                <input 
                  type="range" 
                  min="5" 
                  max="100" 
                  step="5"
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value))} 
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-800/50 p-6 rounded-2xl border border-slate-800">
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-500">Investimento Total</p>
                    <p className="text-2xl font-black text-indigo-400">{cost} <span className="text-xs font-bold text-slate-500">pontos</span></p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-slate-500">Saldo Atual</p>
                    <p className="text-sm font-bold">{user.points} pts</p>
                 </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button onClick={() => setShowModal(false)} className="flex-1 text-slate-500 font-bold hover:text-white transition">Cancelar</button>
                <button 
                  onClick={handleCreate} 
                  disabled={isSaving || !url || user.points < cost} 
                  className="flex-[2] bg-gradient-to-r from-pink-600 to-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-500/20 disabled:opacity-50 hover:scale-105 active:scale-95 transition"
                >
                  {isSaving ? 'Processando...' : 'Lançar Campanha'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;

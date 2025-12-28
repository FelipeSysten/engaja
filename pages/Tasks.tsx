
import React, { useState, useEffect, useRef } from 'react';
import { User, TaskType, Campaign } from '../types';
import { DatabaseService } from '../services/db';
import { AIService } from '../services/ai';
import { POINTS_EARNED } from '../constants';

const Tasks: React.FC<{ user: User, setUser: React.Dispatch<React.SetStateAction<User | null>> }> = ({ user, setUser }) => {
  const [tasks, setTasks] = useState<Campaign[]>([]);
  const [activeStep, setActiveStep] = useState<{ id: string, step: 'action' | 'upload' | 'verifying' } | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadTasks() {
      try {
        const available = await DatabaseService.getAvailableTasks(user.id);
        setTasks(available);
      } catch (e) {
        console.error("Erro ao carregar tarefas:", e);
      } finally {
        setIsInitialLoad(false);
      }
    }
    loadTasks();
  }, [user.id]);

  const handleOpenLink = (campaign: Campaign) => {
    window.open(campaign.targetUrl, '_blank');
    setActiveStep({ id: campaign.id, step: 'upload' });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, campaign: Campaign) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setActiveStep({ id: campaign.id, step: 'verifying' });

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        const verification = await AIService.verifyInstagramAction(base64, campaign.type);
        
        if (verification.success) {
          const earned = POINTS_EARNED[campaign.type] || 1;
          const updatedUser = await DatabaseService.completeTask(user.id, campaign.id, earned);
          setUser(updatedUser);
          setTasks(prev => prev.filter(t => t.id !== campaign.id));
          setActiveStep(null);
          alert(`✅ Validado com sucesso! +${earned} pontos ganhos.`);
        } else {
          alert(`❌ Validação Falhou: ${verification.reason}`);
          setActiveStep({ id: campaign.id, step: 'upload' });
        }
      } catch (err) {
        alert("Erro ao processar imagem. Tente novamente.");
        setActiveStep({ id: campaign.id, step: 'upload' });
      }
    };
    reader.readAsDataURL(file);
  };

  if (isInitialLoad) return (
    <div className="h-96 flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Buscando oportunidades...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Ganhar Pontos</h2>
          <p className="text-slate-400 mt-1 italic">Validação assistida por IA para segurança de todos.</p>
        </div>
        <div className="bg-slate-800/80 backdrop-blur-md px-6 py-3 rounded-3xl flex items-center border border-slate-700 shadow-xl">
          <div className="mr-4 text-right">
            <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest">Seu Saldo</p>
            <p className="text-xl font-black text-indigo-400">{user.points.toLocaleString()} pts</p>
          </div>
          <div className="w-10 h-10 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/30">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" /></svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tasks.length === 0 ? (
          <div className="py-20 text-center glass-effect rounded-[2.5rem] border border-slate-800">
            <p className="text-slate-400 font-bold">Tudo limpo por aqui!</p>
            <p className="text-xs text-slate-500 mt-2 italic">Aguarde novos criadores lançarem campanhas.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className={`glass-effect p-6 rounded-[2rem] flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all border-l-4 ${
                activeStep?.id === task.id ? 'border-l-indigo-500 bg-indigo-500/5 shadow-2xl scale-[1.01]' : 'border-l-transparent'
            }`}>
              <div className="flex items-center space-x-5">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${
                  task.type === TaskType.LIKE ? 'bg-pink-500/10 text-pink-500' : 
                  task.type === TaskType.FOLLOW ? 'bg-indigo-500/10 text-indigo-500' : 'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {task.type === TaskType.LIKE ? '❤️' : task.type === TaskType.FOLLOW ? '👤' : '💬'}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-black text-white">{
                      task.type === TaskType.LIKE ? 'Curtir Publicação' : 
                      task.type === TaskType.FOLLOW ? 'Seguir Criador' : 'Deixar Comentário'
                    }</span>
                  </div>
                  <p className="text-slate-500 text-xs font-mono truncate max-w-[150px] sm:max-w-xs">{task.targetUrl}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right mr-2">
                  <p className="text-[10px] font-black uppercase text-slate-500">Recompensa</p>
                  <p className="text-lg font-black text-white">+{POINTS_EARNED[task.type]} pts</p>
                </div>

                {activeStep?.id === task.id && activeStep.step === 'upload' ? (
                  <div className="flex space-x-2">
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={(e) => handleFileUpload(e, task)}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/30 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      ENVIAR PRINT
                    </button>
                    <button onClick={() => setActiveStep(null)} className="p-4 text-slate-500 hover:text-white transition">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ) : activeStep?.id === task.id && activeStep.step === 'verifying' ? (
                  <div className="flex items-center space-x-3 bg-slate-800 px-6 py-4 rounded-2xl border border-indigo-500/30">
                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-black text-indigo-400 uppercase tracking-tighter">IA Analisando...</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenLink(task)}
                    className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs hover:scale-105 active:scale-95 transition shadow-xl"
                  >
                    REALIZAR AÇÃO
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-12 p-8 bg-indigo-600/10 rounded-[2.5rem] border border-indigo-500/20">
         <div className="flex items-start space-x-4">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
               <h4 className="font-bold text-white mb-1 uppercase text-xs tracking-widest">Como validar?</h4>
               <p className="text-slate-400 text-xs leading-relaxed">
                  Após realizar a ação no Instagram, tire um print da tela e envie clicando no botão que aparecerá. 
                  Nossa inteligência artificial validará se você realmente curtiu, seguiu ou comentou para liberar seus pontos instantaneamente.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Tasks;

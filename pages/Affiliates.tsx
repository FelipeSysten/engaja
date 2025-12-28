
import React from 'react';
import { User } from '../types';

const Affiliates: React.FC<{ user: User }> = ({ user }) => {
  const referralCode = `engaja-plus.com/ref/${user.instagramUsername.replace('@', '')}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralCode);
    alert("Link copiado para a área de transferência!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-right duration-700">
      <div className="text-center space-y-4">
         <h2 className="text-4xl font-bold">Programa de Afiliados</h2>
         <p className="text-slate-400 max-w-xl mx-auto">
            Indique o Engaja+ para seus amigos e receba pontos e comissões por cada indicação ativa.
         </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
         <div className="glass-effect p-8 rounded-[2rem] border border-slate-800 text-center">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total Ganho</p>
            <p className="text-4xl font-black text-white">R$ 142,50</p>
            <button className="mt-6 text-indigo-400 font-bold hover:text-indigo-300 text-sm">Solicitar Saque</button>
         </div>
         <div className="glass-effect p-8 rounded-[2rem] border border-slate-800 text-center">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Amigos Indicados</p>
            <p className="text-4xl font-black text-white">24</p>
            <p className="mt-6 text-slate-500 text-sm">8 usuários ativos este mês</p>
         </div>
      </div>

      <div className="glass-effect p-8 md:p-12 rounded-[2.5rem] border border-indigo-500/20 bg-indigo-500/5">
         <h3 className="text-xl font-bold mb-6 text-center">Seu Link de Indicação Único</h3>
         <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 flex items-center justify-between text-slate-400 select-all overflow-hidden">
               <span className="truncate mr-4 text-sm font-medium">{referralCode}</span>
               <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" /></svg>
            </div>
            <button 
              onClick={copyLink}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition shadow-lg shadow-indigo-500/20 active:scale-95"
            >
               Copiar Link
            </button>
         </div>
      </div>

      <div className="space-y-6">
         <h3 className="text-xl font-bold">Como funciona?</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {title: 'Convide', desc: 'Envie seu link para influenciadores e criadores.'},
              {title: 'Cadastro', desc: 'Cada novo usuário te rende 50 pontos imediatos.'},
              {title: 'Comissão', desc: 'Ganhe 15% de toda assinatura recorrente que eles fizerem.'}
            ].map((step, i) => (
              <div key={i} className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl">
                 <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-black text-indigo-400 mb-4">{i+1}</div>
                 <h4 className="font-bold mb-2">{step.title}</h4>
                 <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Affiliates;

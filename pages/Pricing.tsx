
import React, { useState } from 'react';
import { User, UserPlan } from '../types';
import { PRICING } from '../constants';

const Pricing: React.FC<{ user: User, setUser?: (u: User) => void }> = ({ user }) => {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

const handleCheckout = async () => {
  if (!selectedItem?.stripeProductId) return; // Agora usamos o ID do produto/preço
  setIsRedirecting(true);
  
  try {
    // Faz a chamada para o SEU servidor
    const response = await fetch('https://tyrone-unrecollected-heike.ngrok-free.dev/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: selectedItem.stripeProductId, // Passa o ID do Stripe
        userId: user.id,
      
      } ),
    });

    const data = await response.json();

    if (data.url) {
      // Redireciona para a URL gerada pelo servidor
      window.location.assign(data.url);
    } else {
      throw new Error(data.error || 'Erro ao criar sessão');
    }
  } catch (error) {
    console.error('Erro no checkout:', error);
    alert('Erro ao iniciar pagamento. Verifique se o servidor está rodando.');
    setIsRedirecting(false);
  }
};

  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in duration-1000">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black tracking-tight text-white">Planos & Créditos</h2>
        <p className="text-slate-400 max-w-2xl mx-auto font-medium text-lg">
          Escolha seu pacote e impulsione seu perfil com o checkout seguro do <span className="text-[#635bff] font-bold">Stripe</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PRICING.PLANS.map((plan) => (
          <div 
            key={plan.id} 
            className={`glass-effect rounded-[3rem] p-10 flex flex-col relative overflow-hidden transition-all hover:scale-[1.03] ${
              plan.id === UserPlan.PRO ? 'border-2 border-indigo-500 bg-indigo-500/5 shadow-2xl shadow-indigo-500/20' : 'border border-slate-800'
            }`}
          >
            <div className="mb-10">
              <h3 className="text-sm font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">{plan.name}</h3>
              <div className="flex items-baseline">
                <span className="text-5xl font-black text-white">R${plan.price}</span>
                <span className="text-slate-500 ml-2 font-bold">/mês</span>
              </div>
            </div>
            
            <ul className="flex-1 space-y-5 mb-12">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start text-slate-300 text-sm font-medium">
                  <div className="w-5 h-5 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              disabled={user.plan === plan.id || !plan.stripeProductId}
              onClick={() => setSelectedItem(plan)}
              className={`w-full py-5 rounded-2xl font-black text-sm transition-all ${
                user.plan === plan.id 
                  ? 'bg-slate-800 text-slate-500 cursor-default'
                  : 'bg-white text-slate-900 hover:bg-slate-100 active:scale-95'
              }`}
            >
              {user.plan === plan.id ? 'PLANO ATUAL' : 'ASSINAR AGORA'}
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-effect p-10 rounded-[3rem] border border-slate-800">
          <h3 className="text-2xl font-black mb-8">Recarga de Pontos</h3>
          <div className="grid grid-cols-1 gap-4">
            {PRICING.PACKS.map((pack, i) => (
              <button 
                key={i}
                onClick={() => setSelectedItem(pack)}
                className="flex items-center justify-between p-6 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-indigo-500 transition-all group"
              >
                <div className="text-left">
                  <p className="font-black text-white text-lg">{pack.amount.toLocaleString()} pts</p>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Crédito Instantâneo</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-indigo-400">R$ {pack.price}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-effect p-10 rounded-[3rem] border border-indigo-500/20 bg-indigo-500/5">
          <h3 className="text-2xl font-black mb-8 text-white">Boost de Prioridade</h3>
          <div className="grid grid-cols-1 gap-4">
            {PRICING.BOOSTS.map((boost, i) => (
              <button 
                key={i}
                onClick={() => setSelectedItem(boost)}
                className="flex items-center justify-between p-6 bg-indigo-600/10 rounded-2xl border border-indigo-500/20 hover:bg-indigo-600/20 transition-all group"
              >
                <div className="text-left flex items-center space-x-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"/></svg>
                  </div>
                  <div className="text-left">
                    <p className="font-black text-white text-lg">{boost.duration}</p>
                    <p className="text-[10px] text-indigo-400 uppercase font-black tracking-widest">Topo da Fila</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-white">R$ {boost.price}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] overflow-hidden shadow-2xl text-slate-900">
            <div className="p-10 space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="28px" viewBox="0 0 14 16">
                    <path d="M127,50 L126,50 C123.238576,50 121,47.7614237 121,45 C121,42.2385763 123.238576,40 126,40 L135,40 L135,56 L133,56 L133,42 L129,42 L129,56 L127,56 L127,50 Z M127,48 L127,42 L126,42 C124.343146,42 123,43.3431458 123,45 C123,46.6568542 124.343146,48 126,48 L127,48 Z" transform="translate(-121, -40)" fill="#635bff"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold leading-none">{selectedItem.name || (selectedItem.amount ? `${selectedItem.amount} Pontos` : `Boost ${selectedItem.duration}`)}</h3>
                  <p className="text-slate-500 text-sm mt-1">SaaS de Engajamento Real</p>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-500">Valor Total</span>
                  <span className="text-2xl text-slate-900">R$ {selectedItem.price},00</span>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleCheckout}
                  disabled={isRedirecting}
                  className="w-full bg-[#635bff] text-white py-5 rounded-2xl font-black text-lg hover:bg-[#5851e0] transition-all shadow-xl shadow-indigo-100 flex items-center justify-center disabled:opacity-50"
                >
                  {isRedirecting ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>CONECTANDO AO STRIPE...</span>
                    </div>
                  ) : 'IR PARA O PAGAMENTO'}
                </button>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="w-full text-slate-400 font-bold text-sm hover:text-slate-600 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;

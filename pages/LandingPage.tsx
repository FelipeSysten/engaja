
import React from 'react';

interface LandingPageProps {
  onStart: () => void;
  onSignup: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onSignup }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background Orbs Dinâmicos */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/10 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-pink-600/10 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Navigation Premium */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center font-black text-white shadow-2xl shadow-indigo-500/40">E+</div>
            <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Engaja+</h1>
          </div>
          
          <div className="hidden lg:flex items-center space-x-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            <a href="#ia" className="hover:text-white transition-colors cursor-pointer">IA Vision</a>
            <a href="#como-funciona" className="hover:text-white transition-colors cursor-pointer">O Método</a>
            <a href="#planos" className="hover:text-white transition-colors cursor-pointer">Planos</a>
          </div>

          <div className="flex items-center space-x-6">
            <button onClick={onStart} className="text-sm font-bold text-slate-400 hover:text-white transition hidden sm:block">Entrar</button>
            <button 
              onClick={onSignup}
              className="bg-gradient-to-r from-white to-slate-200 text-black px-8 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl active:scale-95"
            >
              Começar Agora
            </button>
          </div>
        </div>
      </nav>

      {/* Hero: A Promessa Forte */}
      <header className="relative pt-48 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-10">
          <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-[0.25em] animate-in fade-in slide-in-from-top duration-1000">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
            <span>A Revolução do Algoritmo Chegou</span>
          </div>

          <h1 className="text-6xl md:text-[7.5rem] font-black leading-[0.85] tracking-tighter max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
            Pare de postar para <span className="text-slate-700">ninguém</span>. <br/>
            <span className="bg-gradient-to-r from-pink-500 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">Engajamento Real</span> Validado.
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
            Conectamos criadores reais em uma rede de troca inteligente. 
            Nossa IA garante que cada curtida e comentário seja feito por humanos, explodindo seu alcance organicamente.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
            <button 
              onClick={onSignup}
              className="group relative bg-indigo-600 px-12 py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-indigo-600/40 hover:scale-105 transition-all w-full sm:w-auto"
            >
              Quero Crescer Meu Perfil
            </button>
            <div className="flex -space-x-3 items-center">
              {[1,2,3,4].map(i => (
                <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} className="w-10 h-10 rounded-full border-2 border-[#020617]" />
              ))}
              <span className="pl-6 text-xs font-bold text-slate-500 uppercase tracking-widest">+42k membros</span>
            </div>
          </div>
        </div>
      </header>

      {/* Seção IA Vision: O Grande Diferencial */}
      <section id="ia" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 text-left">
            <h2 className="text-4xl md:text-6xl font-black leading-tight">
              A única com <br/>
              <span className="text-indigo-500">IA Vision™</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Diferente de plataformas antigas onde as pessoas fingiam fazer as ações, o Engaja+ usa **Visão Computacional** para validar cada print enviado. Se não curtiu de verdade, não ganha pontos. 
              <strong> Justiça total para quem quer crescer.</strong>
            </p>
            <ul className="space-y-4">
              {['Validação instantânea de prints', 'Detecção de perfis fakes', 'Proteção contra Shadowban'].map((text, i) => (
                <li key={i} className="flex items-center space-x-3 text-sm font-bold text-slate-200">
                  <div className="w-6 h-6 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">✓</div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-600/20 blur-[100px] rounded-full"></div>
            <div className="glass-effect rounded-[3rem] p-8 border border-white/10 relative z-10">
               <div className="aspect-video bg-slate-900 rounded-[2rem] overflow-hidden border border-white/5 relative group">
                  <img src="https://i.ibb.co/9HccM9zm/Captura-de-tela-2025-12-29-040800.png" className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-indigo-600/80 p-6 rounded-3xl backdrop-blur-md border border-white/20 text-center animate-bounce">
                      <p className="text-[10px] font-black uppercase tracking-widest mb-1">Status da Validação</p>
                      <p className="text-xl font-black">ANALISANDO PRINT...</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ciclo de Sucesso: Como Funciona */}
      <section id="como-funciona" className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6">Como a Magia Acontece</h2>
          <p className="text-slate-500 font-medium">O ciclo infinito de crescimento orgânico.</p>
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Ganhe Pontos', desc: 'Curta, siga e comente em posts de outros criadores reais da rede.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { step: '02', title: 'Crie Campanhas', desc: 'Use seus pontos para lançar suas próprias fotos e vídeos na vitrine do Engaja+.', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' },
            { step: '03', title: 'Exploda no Explorar', desc: 'O Instagram vê o engajamento imediato e começa a recomendar seu perfil para milhares.', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' }
          ].map((item, i) => (
            <div key={i} className="group p-12 rounded-[3rem] bg-slate-900/50 border border-white/5 hover:border-indigo-500/40 transition-all">
              <span className="text-5xl font-black text-white/5 group-hover:text-indigo-500/20 transition-colors mb-6 block">{item.step}</span>
              <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-8">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-40 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-indigo-500/20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          <h2 className="text-4xl md:text-7xl font-black mb-10 relative z-10 leading-tight">
            Você está a um clique do seu <br/> próximo viral.
          </h2>
          <button 
            onClick={onSignup}
            className="relative z-10 bg-white text-black px-16 py-7 rounded-[2rem] font-black text-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
          >
            Começar Gratuitamente
          </button>
          <p className="mt-8 text-white/60 text-sm font-bold uppercase tracking-widest relative z-10">Sem cartão de crédito — Resultados em 24h</p>
        </div>
      </section>

      <footer className="py-20 px-6 border-t border-white/5 text-center">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">Engaja+ © 2024 — Plataforma de Tecnologia em Influência</p>
      </footer>
    </div>
  );
};

export default LandingPage;

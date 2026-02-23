import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();
  const [hoveredSide, setHoveredSide] = useState<'ai' | 'manual' | null>(null);

  return (
    <div className="h-screen w-full bg-black font-sans selection:bg-orange-500 selection:text-white overflow-hidden flex flex-col relative">
      
      {/* Navbar Absolue */}
      <nav className="absolute top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center pointer-events-none">
        <div className="flex items-center space-x-2 pointer-events-auto">
             <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center font-bold text-xl shadow-xl">M</div>
             <span className="font-bold text-xl tracking-tight text-white mix-blend-difference">Melaniverse.</span>
        </div>
        <button 
            onClick={() => navigate('/login')}
            className="pointer-events-auto px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
        >
            Connexion
        </button>
      </nav>

      {/* Main Split Container */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* --- LEFT SIDE: AI MODE --- */}
        <div 
            className={`relative flex-1 cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col justify-center px-8 md:px-16 overflow-hidden group
            ${hoveredSide === 'manual' ? 'md:flex-[0.8] opacity-50 blur-[2px]' : 'md:flex-[1.2] opacity-100'}
            bg-black text-white border-r border-white/10
            `}
            onMouseEnter={() => setHoveredSide('ai')}
            onMouseLeave={() => setHoveredSide(null)}
            onClick={() => navigate('/create-ai')}
        >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(76,29,149,0.4),_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>

            <div className="relative z-10 max-w-xl mx-auto md:mx-0 transition-transform duration-500 group-hover:translate-x-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                    <span>Recommandé</span>
                </div>
                
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
                    Générative <br/> AI.
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed max-w-md mb-8 group-hover:text-white transition-colors duration-300">
                    L'expérience magique. Décrivez votre idée, et notre IA construit l'intégralité de votre marque, produits et design en 30 secondes.
                </p>

                <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-900/30 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest border-b border-white/0 group-hover:border-white transition-all">Commencer</span>
                </div>
            </div>
        </div>

        {/* --- RIGHT SIDE: MANUAL MODE --- */}
        <div 
            className={`relative flex-1 cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col justify-center px-8 md:px-16 overflow-hidden group
            ${hoveredSide === 'ai' ? 'md:flex-[0.8] opacity-50 blur-[2px]' : 'md:flex-[1.2] opacity-100'}
            bg-white text-black
            `}
            onMouseEnter={() => setHoveredSide('manual')}
            onMouseLeave={() => setHoveredSide(null)}
            onClick={() => navigate('/create-manual')}
        >
            {/* Background Grid Pattern */}
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
            
            <div className="relative z-10 max-w-xl mx-auto md:ml-auto md:mr-0 transition-transform duration-500 group-hover:-translate-x-2 text-right">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-gray-200 bg-white text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-6">
                    <span>Expert</span>
                </div>

                <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-black">
                    Studio <br/> Manuel.
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed max-w-md ml-auto mb-8 group-hover:text-black transition-colors duration-300">
                    Pour les puristes. Configurez chaque détail de votre boutique, importez vos propres assets et gérez votre catalogue ligne par ligne.
                </p>

                <div className="flex items-center space-x-4 justify-end">
                    <span className="text-sm font-bold uppercase tracking-widest border-b border-black/0 group-hover:border-black transition-all">Configurer</span>
                    <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* Footer Text */}
      <div className="absolute bottom-6 w-full text-center pointer-events-none mix-blend-difference text-white">
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-50">Melaniverse Commerce OS v2.5</p>
      </div>

    </div>
  );
};

export default WelcomePage;
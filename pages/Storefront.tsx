import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { useNavigate } from 'react-router-dom';

const Storefront = () => {
  const { storeData } = useApp();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!storeData) return null;
  const isManual = storeData.mode === 'manual';

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white">
      
      {/* --- NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${(scrolled || isManual) ? 'bg-white/90 backdrop-blur-xl py-4 border-b border-gray-100 text-black' : 'bg-transparent py-8 text-white'}`}>
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/store')}>
                <h1 className={`text-2xl font-black tracking-tighter uppercase ${(scrolled || isManual) ? 'text-black' : 'text-white'}`}>
                    {storeData.name}.
                </h1>
            </div>

            {/* Menu Center */}
            <div className={`hidden md:flex items-center space-x-12 text-xs font-bold uppercase tracking-[0.2em] ${(scrolled || isManual) ? 'text-gray-900' : 'text-white/90'}`}>
              <a href="#collection" className="hover:opacity-50 transition-opacity relative group">
                Collection
                <span className={`absolute -bottom-2 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${(scrolled || isManual) ? 'bg-black' : 'bg-white'}`}></span>
              </a>
              {!isManual && (
                  <a href="#vision" className="hover:opacity-50 transition-opacity relative group">
                    Vision
                    <span className={`absolute -bottom-2 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${(scrolled || isManual) ? 'bg-black' : 'bg-white'}`}></span>
                  </a>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-6">
              <button onClick={() => navigate('/dashboard')} className={`hidden sm:block text-[10px] font-bold px-4 py-2 rounded-full border transition-all hover:bg-white hover:text-black ${(scrolled || isManual) ? 'border-black text-black' : 'border-white text-white'}`}>
                ADMIN VIEW
              </button>
              <button onClick={() => navigate('/store/checkout')} className="relative group">
                 <svg className={`w-6 h-6 transition-colors ${(scrolled || isManual) ? 'text-black' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                 <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 rounded-full text-[9px] text-white flex items-center justify-center font-bold">1</span>
              </button>
            </div>
        </div>
      </nav>

      {/* --- HERO SECTION IMMERSIVE (AI Mode Only) --- */}
      {!isManual && (
          <section className="relative h-screen w-full overflow-hidden">
              {/* Background Image with Overlay */}
              <div className="absolute inset-0">
                 <img 
                   src={storeData.banner} 
                   alt="Campaign" 
                   className="w-full h-full object-cover animate-[scale-slow_20s_infinite_alternate]" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30"></div>
              </div>

              {/* Hero Content */}
              <div className="relative z-10 h-full flex flex-col justify-end pb-24 px-6 md:px-12 max-w-[1800px] mx-auto">
                  <div className="animate-fade-in-up">
                      <p className="text-white/80 text-sm font-bold tracking-[0.3em] uppercase mb-4 border-l-2 border-orange-500 pl-4">
                          Nouvelle Collection 2025
                      </p>
                      <h2 className="text-6xl md:text-9xl font-black text-white leading-[0.9] tracking-tighter max-w-5xl uppercase mix-blend-overlay opacity-90">
                          {storeData.slogan}
                      </h2>
                      <div className="mt-12 flex items-center gap-6">
                          <button 
                            style={{backgroundColor: storeData.themeColor}}
                            className="px-12 py-5 text-white font-bold text-sm tracking-widest uppercase hover:scale-105 transition-transform"
                          >
                              Découvrir
                          </button>
                          <button className="px-12 py-5 bg-transparent border border-white/30 text-white font-bold text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all backdrop-blur-sm">
                              Le Lookbook
                          </button>
                      </div>
                  </div>
              </div>

              {/* Scroll Indicator */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white animate-bounce">
                  <svg className="w-6 h-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
              </div>
          </section>
      )}

      {/* --- SCROLLING TEXT MARQUEE --- */}
      <div className={`bg-black py-4 overflow-hidden border-b border-gray-800 ${isManual ? 'mt-20' : ''}`}>
          <div className="flex animate-marquee whitespace-nowrap">
              {[1,2,3,4].map(i => (
                  <div key={i} className="flex items-center mx-8">
                      <span className="text-lg md:text-xl font-medium text-white uppercase tracking-widest">
                          Livraison offerte dès 150€ • Retour sous 30 jours • Paiement sécurisé • {storeData.name} Exclusive •
                      </span>
                  </div>
              ))}
          </div>
      </div>

      {/* --- EDITORIAL / VISION (AI Mode Only) --- */}
      {!isManual && (
          <section id="vision" className="py-24 px-6 md:px-12 bg-white">
              <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                  <div className="lg:col-span-7 relative">
                       <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                            {/* Fallback image if no second product, use banner or placeholder */}
                            <img src={storeData.products[1]?.originalImage || storeData.banner} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt="Vision" />
                       </div>
                       <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-black rounded-full text-white flex items-center justify-center p-6 text-center text-xs font-bold uppercase tracking-widest animate-[spin_10s_linear_infinite] hidden md:flex">
                           {storeData.name} • Est. 2024 • AI Generated •
                       </div>
                  </div>
                  <div className="lg:col-span-5 space-y-8">
                      <h3 className="text-4xl md:text-6xl font-black text-gray-900 leading-[0.95] tracking-tight uppercase">
                          L'Art de <br/> <span className="text-gray-400">l'Innovation.</span>
                      </h3>
                      <p className="text-lg text-gray-500 leading-relaxed font-medium">
                          {storeData.aboutUs} Chaque pièce est conçue par des algorithmes génératifs, repoussant les limites de la mode traditionnelle pour créer une esthétique unique.
                      </p>
                      <a href="#collection" className="inline-block border-b-2 border-black pb-1 text-sm font-bold uppercase tracking-widest hover:text-orange-600 hover:border-orange-600 transition-colors">
                          Lire le manifeste
                      </a>
                  </div>
              </div>
          </section>
      )}

      {/* --- PRODUCT COLLECTION --- */}
      <section id="collection" className={`px-6 md:px-12 bg-[#f9f9f9] ${isManual ? 'py-12 min-h-screen' : 'py-24'}`}>
        <div className="max-w-[1800px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20">
                {!isManual && (
                    <h3 className="text-9xl font-black text-gray-200 absolute left-0 -translate-y-1/2 pointer-events-none select-none hidden md:block opacity-50">
                        SHOP
                    </h3>
                )}
                <div className="relative z-10">
                    <span className="text-orange-600 font-bold uppercase tracking-widest text-xs mb-2 block">Catalogue 2025</span>
                    <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Sélection.</h3>
                </div>
                <div className="flex items-center space-x-8 text-sm font-bold uppercase tracking-widest relative z-10 mt-8 md:mt-0">
                    <button className="text-black border-b border-black">Tout voir</button>
                    <button className="text-gray-400 hover:text-black transition-colors">Best Sellers</button>
                    <button className="text-gray-400 hover:text-black transition-colors">Accessoires</button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {storeData.products.length === 0 ? (
                    <div className="col-span-3 text-center py-20">
                        <p className="text-xl font-bold text-gray-400">Aucun produit dans le catalogue.</p>
                        <button onClick={() => navigate('/dashboard/add-product')} className="mt-4 px-6 py-3 bg-black text-white rounded-lg font-bold">Ajouter un produit</button>
                    </div>
                ) : (
                    storeData.products.map((product) => (
                        <div 
                            key={product.id} 
                            className="group cursor-pointer relative"
                            onClick={() => navigate(`/store/product/${product.id}`)}
                        >
                            <div className="aspect-[3/4] w-full overflow-hidden bg-white relative">
                                <img 
                                    src={product.originalImage} 
                                    alt={product.name} 
                                    className="h-full w-full object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-110" 
                                />
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                {/* Quick Add Button */}
                                <button className="absolute bottom-0 left-0 w-full bg-white text-black py-4 font-bold uppercase tracking-widest text-xs transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 hover:bg-black hover:text-white">
                                    Ajouter au panier — {product.price} €
                                </button>
                            </div>
                            
                            <div className="mt-6 flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">{product.name}</h3>
                                    <p className="text-xs text-gray-500 font-medium mt-1">Édition Limitée</p>
                                </div>
                                <span className="text-lg font-medium font-mono">{product.price} €</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </section>

      {/* --- NEWSLETTER --- */}
      <section className="py-32 px-6 bg-black text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-5xl md:text-7xl font-black mb-8 uppercase tracking-tighter">Join the <br/> Cult.</h3>
              <p className="text-gray-400 mb-10 text-lg">Accès anticipé aux drops, événements privés et contenu exclusif.</p>
              
              <div className="flex flex-col sm:flex-row gap-0 border-b border-white/30 pb-2">
                  <input 
                    type="email" 
                    placeholder="VOTRE EMAIL" 
                    className="flex-1 bg-transparent border-none px-4 py-4 outline-none text-white placeholder-gray-500 font-bold uppercase tracking-widest text-lg focus:ring-0" 
                  />
                  <button className="text-white px-8 py-4 font-bold uppercase tracking-widest hover:text-orange-500 transition-colors">
                      S'inscrire
                  </button>
              </div>
          </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white text-black py-16 px-6 md:px-12 border-t border-gray-100">
          <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="col-span-1 md:col-span-2">
                  <h2 className="text-4xl font-black tracking-tighter uppercase mb-6">{storeData.name}.</h2>
                  <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
                      Une expérience shopping redéfinie.
                  </p>
              </div>
              
              <div>
                  <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-gray-400">Boutique</h4>
                  <ul className="space-y-4 text-sm font-bold">
                      <li><a href="#" className="hover:text-orange-600 transition-colors">Nouveautés</a></li>
                      <li><a href="#" className="hover:text-orange-600 transition-colors">Catalogue</a></li>
                      <li><a href="#" className="hover:text-orange-600 transition-colors">Archives</a></li>
                  </ul>
              </div>

              <div>
                  <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-gray-400">Aide</h4>
                  <ul className="space-y-4 text-sm font-bold">
                      <li><a href="#" className="hover:text-orange-600 transition-colors">Expédition</a></li>
                      <li><a href="#" className="hover:text-orange-600 transition-colors">Retours</a></li>
                      <li><a href="#" className="hover:text-orange-600 transition-colors">FAQ</a></li>
                  </ul>
              </div>
          </div>
          <div className="max-w-[1800px] mx-auto mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-xs font-medium text-gray-400 uppercase tracking-wider">
              <p>© 2025 {storeData.name}. All rights reserved.</p>
              <p>Powered by Melaniverse</p>
          </div>
      </footer>
    </div>
  );
};

export default Storefront;
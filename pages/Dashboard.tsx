import React, { useState } from 'react';
import { useApp } from '../App';
import { useNavigate } from 'react-router-dom';

// Import sub-components
import Overview from '../components/dashboard/Overview';
import ProductsList from '../components/dashboard/ProductsList';
import OrdersList from '../components/dashboard/OrdersList';
import MarketingView from '../components/dashboard/MarketingView';
import SettingsView from '../components/dashboard/SettingsView';
import AIAssistant from '../components/dashboard/AIAssistant'; // New Import

type Tab = 'overview' | 'products' | 'orders' | 'marketing' | 'settings';

const Dashboard = () => {
  const { storeData } = useApp();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<Tab>('overview');

  if (!storeData) return null;

  const renderContent = () => {
    switch (currentTab) {
      case 'overview': return <Overview />;
      case 'products': return <ProductsList />;
      case 'orders': return <OrdersList />;
      case 'marketing': return <MarketingView />;
      case 'settings': return <SettingsView />;
      default: return <Overview />;
    }
  };

  const NavItem = ({ id, label, icon }: { id: Tab, label: string, icon: React.ReactNode }) => (
    <button 
      onClick={() => setCurrentTab(id)}
      className={`group w-full flex items-center space-x-3 px-6 py-4 text-sm font-bold transition-all duration-300 rounded-xl mb-1
        ${currentTab === id 
          ? 'bg-black text-white shadow-lg shadow-gray-200' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
    >
      <div className={`transition-transform duration-300 ${currentTab === id ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </div>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 flex font-sans selection:bg-black selection:text-white">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 hidden md:flex flex-col fixed h-full z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-8 cursor-pointer" onClick={() => navigate('/')}>
             <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-black/20">M</div>
             <span className="font-bold text-xl tracking-tight text-gray-900">Melaniverse.</span>
          </div>
          
          <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 mb-2">
             <div className="flex justify-between items-center mb-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Boutique Active</p>
                {storeData.mode === 'manual' && <span className="bg-gray-200 text-gray-600 text-[9px] font-bold px-1.5 py-0.5 rounded">MANUEL</span>}
                {storeData.mode === 'ai' && <span className="bg-purple-100 text-purple-600 text-[9px] font-bold px-1.5 py-0.5 rounded">IA</span>}
             </div>
             <h2 className="text-sm font-black text-gray-900 truncate">{storeData.name}</h2>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <NavItem id="overview" label="Vue d'ensemble" icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          } />
          <NavItem id="products" label="Produits" icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
          } />
          <NavItem id="orders" label="Commandes" icon={
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          } />
          {/* Only show Marketing AI tab if mode is NOT manual */}
          {storeData.mode !== 'manual' && (
              <NavItem id="marketing" label="Marketing IA" icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
              } />
          )}
          <NavItem id="settings" label="Paramètres" icon={
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          } />
        </nav>
        
        <div className="p-6 border-t border-gray-100">
           <button onClick={() => navigate('/store')} className="group w-full py-4 bg-gray-900 text-white rounded-xl hover:bg-black hover:scale-[1.02] transition-all shadow-lg shadow-gray-300 flex items-center justify-center space-x-2 font-bold">
             <span>Voir la Boutique</span>
             <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 p-8 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-10 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-black text-gray-900 capitalize tracking-tight">
                {currentTab === 'overview' ? "Tableau de Bord" : 
                 currentTab === 'marketing' ? "Studio Marketing IA" :
                 currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Gérez votre empire e-commerce en temps réel.</p>
          </div>
          
          <div className="flex items-center space-x-6">
             <button className="relative p-2 text-gray-400 hover:text-black transition-colors">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                 <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
             <div className="flex items-center space-x-4 pl-6 border-l border-gray-200">
                 <div className="text-right hidden sm:block">
                     <p className="text-sm font-bold text-gray-900">{storeData.ownerEmail.split('@')[0]}</p>
                     <p className="text-xs text-gray-500 font-medium">Propriétaire</p>
                 </div>
                 <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center font-bold shadow-lg ring-4 ring-white cursor-pointer hover:scale-105 transition-transform">
                   {storeData.name.charAt(0)}
                 </div>
             </div>
          </div>
        </header>
        
        <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            {renderContent()}
        </div>
      </main>

      {/* AI Assistant Floating Button & Panel */}
      <AIAssistant />
    </div>
  );
};

export default Dashboard;
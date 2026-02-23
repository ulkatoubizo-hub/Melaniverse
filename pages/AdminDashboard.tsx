import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import Admin Sub-components
import AdminOverview from '../components/admin/AdminOverview';
import AdminUsers from '../components/admin/AdminUsers';
import AdminStores from '../components/admin/AdminStores';
import AdminAI from '../components/admin/AdminAI';
import AdminPayments from '../components/admin/AdminPayments';
// Placeholder for others to keep file size manageable but consistent with request
const Placeholder = ({title}: {title: string}) => (
    <div className="flex flex-col items-center justify-center h-96 text-gray-400">
        <span className="text-4xl mb-4">🚧</span>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p>Section en cours de développement.</p>
    </div>
);

const MENU_STRUCTURE = [
  { id: 'overview', label: 'Dashboard', icon: '🏠', subs: ['Vue générale', 'Activité temps réel', 'Statistiques rapides', 'Alertes système'] },
  { id: 'users', label: 'Utilisateurs', icon: '👥', subs: ['Liste des utilisateurs', 'Détails utilisateur', 'Comptes suspendus', 'Créateurs actifs', 'Historique connexions', 'Activité utilisateurs', 'Rôles & permissions'] },
  { id: 'stores', label: 'Boutiques', icon: '🏪', subs: ['Toutes les boutiques', 'Boutiques actives', 'Boutiques inactives', 'Boutiques suspendues', 'Boutiques signalées', 'Détails boutique', 'Accès dashboard client'] },
  { id: 'products', label: 'Produits IA', icon: '📦', subs: ['Tous les produits', 'Produits générés', 'Produits modifiés', 'Images IA', 'Vidéos IA', 'Descriptions IA', 'Scripts publicitaires'] },
  { id: 'ai', label: 'Intelligence Artificielle', icon: '🤖', subs: ['Générations texte', 'Générations image', 'Générations vidéo', 'File d’attente IA', 'Logs IA', 'Erreurs IA', 'Consommation tokens', 'Coût IA', 'Performance IA'] },
  { id: 'templates', label: 'Templates & Thèmes', icon: '🎨', subs: ['Thèmes boutiques', 'Templates pages', 'Templates produits', 'Templates landing', 'Templates vidéos', 'Templates dashboard', 'Sections dynamiques'] },
  { id: 'payments', label: 'Paiements & Abonnements', icon: '💳', subs: ['Paiements reçus', 'Abonnements actifs', 'Factures', 'Échecs paiement', 'Remboursements', 'Commissions', 'Offres promotionnelles', 'Coupons'] },
  { id: 'analytics', label: 'Analytics', icon: '📊', subs: ['Statistiques globales', 'Performance boutiques', 'Revenus', 'Conversion', 'Trafic', 'Funnels', 'Activité IA'] },
  { id: 'support', label: 'Support & Modération', icon: '🧾', subs: ['Tickets support', 'Chat utilisateurs', 'Signalements', 'Boutiques signalées', 'Produits interdits', 'Contenus bloqués', 'Logs modération'] },
  { id: 'security', label: 'Sécurité', icon: '🔐', subs: ['Connexions admin', 'Tentatives échouées', 'Logs système', 'IP suspectes', 'Permissions', 'Sessions', 'Clés API'] },
  { id: 'settings', label: 'Paramètres Plateforme', icon: '⚙️', subs: ['Paramètres généraux', 'Branding', 'Domaines', 'Sous-domaines', 'Emails système', 'APIs IA', 'Passerelles paiement', 'Limites IA', 'Stockage', 'Sauvegardes', 'Maintenance'] },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('overview');
  const [activeSub, setActiveSub] = useState('');
  const [expandedMenu, setExpandedMenu] = useState<string | null>('overview');

  const toggleMenu = (id: string) => {
      setExpandedMenu(expandedMenu === id ? null : id);
      setCurrentSection(id);
  };

  const renderContent = () => {
    switch(currentSection) {
        case 'overview': return <AdminOverview />;
        case 'users': return <AdminUsers />;
        case 'stores': return <AdminStores />;
        case 'ai': return <AdminAI />;
        case 'payments': return <AdminPayments />;
        default: return <Placeholder title={MENU_STRUCTURE.find(m => m.id === currentSection)?.label || 'Section'} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans text-gray-900">
        {/* Sidebar */}
        <aside className="w-80 bg-black text-white flex flex-col h-screen fixed overflow-y-auto z-20 shadow-2xl">
            <div className="p-8 border-b border-gray-800">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black font-bold text-xl shadow-lg">M</div>
                    <span className="font-bold text-xl tracking-tight">Melaniverse Admin</span>
                </div>
                <p className="mt-4 text-xs text-gray-500 uppercase tracking-widest font-bold">Super Admin • v2.5</p>
            </div>
            
            <nav className="flex-1 p-4 space-y-1">
                {MENU_STRUCTURE.map((item) => (
                    <div key={item.id} className="space-y-1">
                        <button 
                            onClick={() => toggleMenu(item.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${currentSection === item.id ? 'bg-gray-800 text-white font-bold' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}
                        >
                            <div className="flex items-center space-x-3">
                                <span>{item.icon}</span>
                                <span className="text-sm">{item.label}</span>
                            </div>
                            <svg className={`w-3 h-3 transition-transform ${expandedMenu === item.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        
                        {expandedMenu === item.id && (
                            <div className="pl-11 pr-2 space-y-1 pb-2">
                                {item.subs.map((sub, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setActiveSub(sub)}
                                        className={`w-full text-left text-xs py-2 px-2 rounded hover:bg-white/5 transition-colors ${activeSub === sub ? 'text-white font-bold bg-white/10' : 'text-gray-500'}`}
                                    >
                                        {sub}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>
            
            <div className="p-4 border-t border-gray-800">
                <button onClick={() => navigate('/')} className="w-full py-3 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm font-bold flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    <span>Déconnexion</span>
                </button>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-80 p-10 overflow-y-auto">
            <header className="flex justify-between items-center mb-10 animate-fade-in-up">
                <div>
                   <h1 className="text-3xl font-black text-gray-900">{MENU_STRUCTURE.find(m => m.id === currentSection)?.label}</h1>
                   <p className="text-gray-500 text-sm font-medium mt-1">{activeSub || 'Vue d\'ensemble'}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                     <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
                     <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Système Opérationnel</span>
                </div>
            </header>

            <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                {renderContent()}
            </div>
        </main>
    </div>
  );
};

export default AdminDashboard;
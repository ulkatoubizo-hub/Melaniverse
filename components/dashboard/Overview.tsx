import React from 'react';
import { useApp } from '../../App';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Overview = () => {
  const { storeData } = useApp();
  
  if (!storeData) return null;

  const data = [
    { name: 'Lun', sales: 400 },
    { name: 'Mar', sales: 300 },
    { name: 'Mer', sales: 600 },
    { name: 'Jeu', sales: 800 },
    { name: 'Ven', sales: 500 },
    { name: 'Sam', sales: 900 },
    { name: 'Dim', sales: 700 },
  ];

  const copyStoreLink = () => {
      const url = `${window.location.origin}/#/store`;
      navigator.clipboard.writeText(url);
      alert("Lien de la boutique copié !");
  };

  return (
    <div className="space-y-8">
      {/* Share Box */}
      <div className="bg-black rounded-3xl p-8 text-white flex justify-between items-center shadow-xl shadow-gray-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gray-800 rounded-full blur-[80px] opacity-50 -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10">
              <h3 className="text-2xl font-black mb-2">Votre boutique est active.</h3>
              <p className="text-gray-400 max-w-md">Félicitations ! Votre univers est généré. Partagez le lien pour commencer à encaisser.</p>
          </div>
          <button onClick={copyStoreLink} className="relative z-10 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 shadow-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
              Copier le lien
          </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Chiffre d\'Affaires', val: '0,00 €', sub: '+0% vs hier', icon: '💰' },
          { label: 'Visiteurs Uniques', val: '1', sub: 'Juste vous', icon: '👀' },
          { label: 'Commandes', val: '0', sub: 'En attente', icon: '📦' },
          { label: 'Panier Moyen', val: '0,00 €', sub: 'N/A', icon: '🛍️' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-xs font-bold bg-gray-50 text-gray-500 px-2 py-1 rounded-lg">{stat.sub}</span>
            </div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-gray-900">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
          <div className="flex justify-between items-center mb-8">
             <h3 className="font-bold text-xl text-gray-900">Performance des Ventes</h3>
             <select className="bg-gray-50 border-none text-sm font-bold text-gray-600 rounded-xl px-4 py-2 outline-none cursor-pointer hover:bg-gray-100 transition-colors">
               <option>Cette semaine</option>
               <option>Ce mois</option>
             </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 500}} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}} 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', padding: '16px', fontWeight: 'bold'}} 
                />
                <Bar dataKey="sales" fill={storeData.themeColor} radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col">
           <h3 className="font-bold text-xl mb-6 text-gray-900">Fil d'Activité</h3>
           <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 space-y-4 min-h-[200px]">
               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-2xl">💤</div>
               <p className="font-medium text-sm">Aucune activité récente.</p>
               <p className="text-xs">Dès que vous aurez des visiteurs, ils apparaîtront ici.</p>
           </div>
           <button className="w-full mt-6 py-4 rounded-xl text-sm font-bold text-gray-900 bg-gray-50 hover:bg-black hover:text-white transition-all">
             Voir l'historique complet
           </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;
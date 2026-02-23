import React from 'react';
import { useApp } from '../../App';

const SettingsView = () => {
  const { storeData } = useApp();
  if (!storeData) return null;

  return (
      <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden max-w-4xl mx-auto">
          <div className="p-10 border-b border-gray-100">
             <h3 className="font-bold text-2xl text-gray-900">Paramètres Généraux</h3>
             <p className="text-gray-500 text-base mt-2">Gérez les informations sensibles de votre compte.</p>
          </div>
          
          <div className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nom de la boutique</label>
                      <input type="text" defaultValue={storeData.name} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 font-bold text-gray-900 outline-none focus:ring-2 focus:ring-black transition-all" />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Téléphone Support</label>
                      <input type="text" defaultValue={storeData.ownerPhone} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 font-bold text-gray-900 outline-none focus:ring-2 focus:ring-black transition-all" />
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Propriétaire</label>
                      <input type="email" defaultValue={storeData.ownerEmail} disabled className="w-full bg-gray-100 border border-gray-200 rounded-xl px-5 py-4 font-medium text-gray-500 cursor-not-allowed" />
                  </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mot de passe (Admin)</label>
                      <input type="password" defaultValue={storeData.password} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 font-bold text-gray-900 outline-none focus:ring-2 focus:ring-black transition-all" />
                  </div>
              </div>

              <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Vision & Prompt IA</label>
                  <textarea disabled defaultValue={storeData.prompt} className="w-full bg-gray-100 border border-gray-200 text-gray-500 rounded-xl px-5 py-4 text-sm h-32 resize-none leading-relaxed" />
              </div>

              <div className="flex justify-end pt-8 border-t border-gray-100">
                  <button className="px-8 py-4 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 mr-4 transition-colors">Annuler</button>
                  <button className="px-10 py-4 bg-black text-white rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all">Sauvegarder</button>
              </div>
          </div>
      </div>
  );
};

export default SettingsView;
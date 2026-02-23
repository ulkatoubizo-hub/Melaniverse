import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { StoreData } from '../types';

const ManualCreationPage = () => {
  const navigate = useNavigate();
  const { setStoreData } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      storeName: '',
      password: '',
      confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (formData.password !== formData.confirmPassword) {
          alert("Les mots de passe ne correspondent pas.");
          return;
      }

      setLoading(true);

      // Simulation of account creation
      setTimeout(() => {
          const newStore: StoreData = {
              mode: 'manual', // MODE MANUEL
              name: formData.storeName,
              prompt: "Manual creation",
              slogan: "Bienvenue sur ma boutique", // Default
              themeColor: "#000000",
              logo: "https://placehold.co/200x200/black/white?text=" + formData.storeName.charAt(0),
              banner: "https://placehold.co/1920x600/gray/white?text=" + encodeURIComponent(formData.storeName),
              aboutUs: "Découvrez notre sélection de produits uniques.",
              ownerEmail: formData.email,
              ownerPhone: "",
              password: formData.password,
              products: [] // Empty catalog initially
          };

          setStoreData(newStore);
          navigate('/dashboard');
      }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
       <div className="max-w-xl w-full bg-white p-10 rounded-3xl shadow-xl border border-gray-100 animate-fade-in-up">
           
           <div className="text-center mb-10">
               <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
                   🛠️
               </div>
               <h1 className="text-3xl font-black text-gray-900 mb-2">Configuration Manuelle</h1>
               <p className="text-gray-500 text-sm">Créez votre boutique de A à Z sans assistance IA.</p>
           </div>
           
           <form onSubmit={handleSubmit} className="space-y-6">
               <div className="grid grid-cols-2 gap-4">
                   <div>
                       <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Prénom</label>
                       <input 
                            name="firstName" 
                            required 
                            type="text" 
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                            onChange={handleChange}
                        />
                   </div>
                   <div>
                       <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nom</label>
                       <input 
                            name="lastName" 
                            required 
                            type="text" 
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                            onChange={handleChange}
                        />
                   </div>
               </div>

               <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
                   <input 
                        name="email" 
                        required 
                        type="email" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                        onChange={handleChange}
                    />
               </div>

               <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nom de la boutique</label>
                   <input 
                        name="storeName" 
                        required 
                        type="text" 
                        placeholder="Ex: Ma Marque Paris"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                        onChange={handleChange}
                    />
               </div>

               <div className="grid grid-cols-2 gap-4">
                   <div>
                       <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mot de passe</label>
                       <input 
                            name="password" 
                            required 
                            type="password" 
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                            onChange={handleChange}
                        />
                   </div>
                   <div>
                       <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Confirmation</label>
                       <input 
                            name="confirmPassword" 
                            required 
                            type="password" 
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                            onChange={handleChange}
                        />
                   </div>
               </div>
               
               <div className="pt-4">
                   <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-black text-white font-bold rounded-xl shadow-lg hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
                   >
                       {loading ? "Création en cours..." : "Accéder au Dashboard Vendeur"}
                       {!loading && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>}
                   </button>
               </div>
           </form>

           <div className="mt-8 text-center border-t border-gray-100 pt-6">
                <button onClick={() => navigate('/')} className="text-gray-400 hover:text-black text-sm font-bold">Annuler</button>
           </div>
       </div>
    </div>
  );
};

export default ManualCreationPage;
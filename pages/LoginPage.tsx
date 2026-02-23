import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../App';
import { StoreData } from '../types';

// Données de démonstration pour le compte Vendeur (Demo)
const DEMO_STORE: StoreData = {
  mode: 'ai', // Default demo is AI for full showcase
  name: "Melaniverse Concept Store",
  prompt: "Luxury minimalist fashion brand",
  slogan: "L'élégance redéfinie par l'intelligence artificielle.",
  themeColor: "#000000",
  logo: "https://placehold.co/200x200/black/white?text=M",
  banner: "https://placehold.co/1920x600/black/white?text=COLLECTION+2025",
  aboutUs: "Bienvenue dans le futur du retail. Notre boutique est entièrement pilotée par des algorithmes prédictifs pour vous offrir les produits les plus tendances avant tout le monde.",
  ownerEmail: "seller@melaniverse.com",
  ownerPhone: "+33 6 00 00 00 00",
  password: "seller",
  products: [
    {
      id: "demo-1",
      name: "Veste Cyber-Tech",
      price: 249.99,
      description: "Une veste imperméable au design futuriste, conçue avec des matériaux recyclés haute performance.",
      features: ["Tissu respirant", "Poches magnétiques", "Coupe ajustée"],
      originalImage: "https://placehold.co/600x600/1a1a1a/white?text=Cyber+Jacket",
      generatedImages: ["https://placehold.co/600x600/2a2a2a/white?text=View+2"]
    },
    {
      id: "demo-2",
      name: "Sneakers Gravity",
      price: 189.50,
      description: "Sneakers ultra-légères pour un confort quotidien inégalé.",
      features: ["Semelle à mémoire de forme", "Design ergonomique"],
      originalImage: "https://placehold.co/600x600/333/white?text=Sneakers",
      generatedImages: []
    }
  ]
};

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { storeData, setStoreData } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-fill from generation
  useEffect(() => {
    if (location.state?.autoEmail && location.state?.autoPassword) {
        setFormData({
            email: location.state.autoEmail,
            password: location.state.autoPassword
        });
    }
  }, [location.state]);

  const performLogin = (email: string, pass: string) => {
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // Cas 1 : Connexion Super Admin
      if (email === 'admin@melaniverse.com' && pass === 'admin') {
        navigate('/admin-dashboard');
        return;
      }

      // Cas 2 : Connexion Vendeur (Demo)
      if (email === 'seller@melaniverse.com' && pass === 'seller') {
          setStoreData(DEMO_STORE);
          navigate('/dashboard');
          return;
      }

      // Cas 3 : Connexion Utilisateur (Boutique générée en mémoire)
      if (storeData && email === storeData.ownerEmail && pass === storeData.password) {
        navigate('/dashboard');
        return;
      }

      // Cas 4 : Erreur
      setIsLoading(false);
      setError("Identifiants incorrects. Utilisez le bouton démo pour tester.");
    }, 800);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(formData.email, formData.password);
  };

  const loginAsDemo = () => {
      setFormData({email: 'seller@melaniverse.com', password: 'seller'});
      performLogin('seller@melaniverse.com', 'seller');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px] opacity-50"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-100 rounded-full blur-[100px] opacity-50"></div>
      </div>

      <div className="z-10 w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 animate-fade-in-up">
        <div className="text-center mb-8">
           <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-black/20 mx-auto mb-4">M</div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Connexion</h2>
          <p className="text-gray-500 text-sm">Accédez à votre dashboard Melaniverse</p>
          {location.state?.autoEmail && (
              <p className="text-green-600 font-bold text-xs mt-2 bg-green-50 py-1 px-2 rounded-lg inline-block">
                  ✅ Boutique générée avec succès !
              </p>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 flex items-start gap-2">
            <span className="text-lg">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mot de passe</label>
            <input 
              type="password" 
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-black hover:bg-gray-900 text-white font-bold py-4 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
               <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : "Se connecter"}
          </button>
        </form>

        <div className="my-6 flex items-center justify-center">
            <div className="h-px bg-gray-200 w-full"></div>
            <span className="px-4 text-gray-400 text-xs font-bold uppercase">Ou</span>
            <div className="h-px bg-gray-200 w-full"></div>
        </div>

        <button 
            type="button"
            onClick={loginAsDemo}
            className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
        >
            <span className="text-xl">🚀</span> Accès Démo Rapide
        </button>
        
        <div className="mt-8 text-center pt-6 border-t border-gray-100">
          <p className="text-gray-400 text-xs font-medium">
            Pas encore de boutique ? <button onClick={() => navigate('/')} className="text-black font-bold hover:underline">Créer un univers maintenant</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
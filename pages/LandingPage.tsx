import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fileToDataUrl } from '../services/geminiService';

const LandingPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scrolled, setScrolled] = useState(false);
  
  // Updated state: User Prompt and Array of Images/Previews
  const [userPrompt, setUserPrompt] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files) as File[];
      const newUrls = await Promise.all(newFiles.map(file => fileToDataUrl(file)));
      
      setImages(prev => [...prev, ...newFiles]);
      setPreviewUrls(prev => [...prev, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
      setImages(prev => prev.filter((_, i) => i !== index));
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleStart = async () => {
    if (!userPrompt.trim()) return;
    // Pass the array of images and previews to GenerationPage
    navigate('/generating', { state: { userPrompt, images, previewUrls } });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStart();
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white flex flex-col">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-100 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
           <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              </div>
              <span className="font-bold text-sm ml-2">Retour</span>
           </div>
           
           <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <span className="font-bold text-xl tracking-tight">Melaniverse AI</span>
           </div>

           <div className="flex items-center space-x-6">
             <button onClick={() => navigate('/login')} className="text-sm font-bold text-gray-900 hover:opacity-70 transition-opacity">
               Connexion
             </button>
           </div>
        </div>
      </nav>

      {/* Hero Section - Centered & Simple */}
      <section className="flex-1 flex flex-col justify-center items-center px-6 relative overflow-hidden pt-20 pb-20">
         {/* Abstract Background */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-blue-100 via-purple-50 to-orange-100 rounded-full blur-[120px] -z-10 opacity-60"></div>

         <div className="max-w-3xl w-full text-center space-y-8 animate-fade-in-up">
             <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 leading-[1.1]">
                 Imaginez. <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600">L'IA crée.</span>
             </h1>
             <p className="text-xl text-gray-500 max-w-xl mx-auto font-medium">
                 Décrivez votre boutique de rêve. Uploadez un ou plusieurs produits. Melaniverse génère tout le reste.
             </p>

             {/* The Magic Bar */}
             <div className="relative max-w-2xl mx-auto mt-12 group">
                 <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-purple-400 to-blue-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                 <div className="relative bg-white rounded-2xl shadow-2xl flex flex-col p-2 border border-gray-100">
                     
                     <div className="flex items-center w-full">
                        {/* Image Upload Trigger */}
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors mr-2 relative overflow-hidden text-gray-400 hover:text-black"
                            title="Ajouter des photos produits"
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                accept="image/*" 
                                multiple // Allow multiple
                                onChange={handleImageChange} 
                                className="hidden" 
                            />
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        </div>

                        {/* Text Input */}
                        <input 
                            type="text" 
                            value={userPrompt}
                            onChange={(e) => setUserPrompt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Une marque de streetwear futuriste..." 
                            className="flex-1 bg-transparent text-lg font-medium text-gray-900 placeholder-gray-400 outline-none px-2"
                            autoFocus
                        />

                        {/* Generate Button */}
                        <button 
                            onClick={handleStart}
                            disabled={!userPrompt.trim()}
                            className={`px-6 py-3 bg-black text-white rounded-xl font-bold transition-all flex items-center space-x-2 ${!userPrompt.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg'}`}
                        >
                            <span>Générer</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </button>
                     </div>

                     {/* Previews Row */}
                     {previewUrls.length > 0 && (
                         <div className="mt-3 pt-3 border-t border-gray-100 flex items-center space-x-3 overflow-x-auto pb-1 scrollbar-hide">
                             {previewUrls.map((url, idx) => (
                                 <div key={idx} className="relative w-12 h-12 flex-shrink-0 group/img">
                                     <img src={url} className="w-full h-full object-cover rounded-lg border border-gray-200" alt="preview" />
                                     <button 
                                        onClick={() => removeImage(idx)}
                                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover/img:opacity-100 transition-opacity"
                                     >
                                         ×
                                     </button>
                                 </div>
                             ))}
                             <span className="text-xs font-bold text-gray-400 whitespace-nowrap px-2">
                                 {previewUrls.length} produit{previewUrls.length > 1 ? 's' : ''} ajouté{previewUrls.length > 1 ? 's' : ''}
                             </span>
                         </div>
                     )}
                 </div>
             </div>

             {/* Inspiration Chips */}
             <div className="flex flex-wrap justify-center gap-3 pt-4">
                 {["Sneakers de luxe", "Cosmétiques bio", "Mobilier minimaliste", "Café artisanal"].map((tag, i) => (
                     <button 
                        key={i} 
                        onClick={() => setUserPrompt(tag)}
                        className="px-4 py-2 bg-gray-50 text-gray-500 rounded-full text-sm font-bold hover:bg-black hover:text-white transition-colors border border-gray-100"
                     >
                         {tag}
                     </button>
                 ))}
             </div>
         </div>
      </section>

      {/* Footer Minimal */}
      <footer className="py-8 text-center text-gray-400 text-xs font-bold uppercase tracking-widest border-t border-gray-100">
         Powered by Melaniverse AI • Gemini 2.5 Flash
      </footer>
    </div>
  );
};

export default LandingPage;
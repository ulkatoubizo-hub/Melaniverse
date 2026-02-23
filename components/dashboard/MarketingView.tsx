import React, { useState } from 'react';
import { useApp } from '../../App';
import { generateImageVariation } from '../../services/geminiService';

const MarketingView = () => {
  const { storeData, setStoreData } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [newColor, setNewColor] = useState(storeData?.themeColor || '#000000');

  if (!storeData) return null;
  const product = storeData.products[0];

  const handleGenerateMoreImages = async () => {
    setIsGenerating(true);
    try {
        let base64Data = "";
        if (product.originalImage.startsWith('data:')) {
            base64Data = product.originalImage.split(',')[1];
        } else {
             alert("Impossible de générer à partir d'une URL distante dans cette démo.");
             setIsGenerating(false);
             return;
        }

        const newImage = await generateImageVariation(base64Data, "creative advertising shot, colorful background, award winning photography");
        if (newImage) {
            const updatedProducts = [...storeData.products];
            updatedProducts[0] = {
                ...product,
                generatedImages: [...product.generatedImages, newImage]
            };
            setStoreData({ ...storeData, products: updatedProducts });
        }
    } catch (e) {
        console.error(e);
        alert("Erreur lors de la génération");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewColor(e.target.value);
  };

  const saveColor = () => {
      setStoreData({ ...storeData, themeColor: newColor });
      alert("Thème mis à jour !");
  };

  return (
    <div className="space-y-8">
        <div className="bg-black rounded-3xl p-10 text-white shadow-xl shadow-gray-200 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-600 to-purple-600 rounded-full blur-[100px] opacity-40 -translate-y-1/2 translate-x-1/3"></div>
            <div className="relative z-10 max-w-2xl">
                <h3 className="text-3xl font-black mb-4">Studio Créatif Gemini 3.0</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                    Générez des variations visuelles infinies pour vos campagnes Instagram et Facebook. Plus besoin de photographe.
                </p>
            </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
            <div className="flex justify-between items-center mb-8">
                <div>
                   <h3 className="font-bold text-xl text-gray-900">Shooting Photo IA</h3>
                   <p className="text-gray-500 text-sm mt-1">Images générées à partir de votre produit</p>
                </div>
                <button className="text-sm text-black font-bold hover:underline">Télécharger le pack</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-gray-200 shadow-sm hover:shadow-lg transition-all">
                    <img src={product.originalImage} className="w-full h-full object-cover" alt="Original" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                        <span className="font-bold text-sm">Original</span>
                    </div>
                </div>
                {product.generatedImages.map((img, i) => (
                    <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-gray-200 shadow-sm hover:shadow-lg transition-all">
                        <img src={img} className="w-full h-full object-cover" alt="Gen" />
                        <div className="absolute top-2 right-2 bg-white/90 text-black text-[10px] font-black px-2 py-1 rounded shadow-sm">
                            V.{i+1}
                        </div>
                    </div>
                ))}
                
                {/* Generation Button */}
                <div 
                    onClick={!isGenerating ? handleGenerateMoreImages : undefined}
                    className={`border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:text-black hover:border-black hover:bg-gray-50 transition-all cursor-pointer aspect-square ${isGenerating ? 'opacity-50 cursor-wait' : ''}`}
                >
                    {isGenerating ? (
                        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <span className="text-3xl mb-2 font-light">+</span>
                            <span className="text-xs font-bold uppercase tracking-wider">Générer</span>
                        </>
                    )}
                </div>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col h-full">
                <h3 className="font-bold text-xl mb-6 text-gray-900">Identité Visuelle</h3>
                <div className="space-y-6 flex-1">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Slogan</label>
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 font-medium text-lg text-gray-900 italic">
                            "{storeData.slogan}"
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Couleur Dominante</label>
                         <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 justify-between">
                             <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full shadow-lg border-2 border-white ring-2 ring-gray-100" style={{backgroundColor: newColor}}></div>
                                <span className="font-mono font-bold text-gray-900">{newColor}</span>
                             </div>
                             <div className="relative">
                                 <input 
                                    type="color" 
                                    value={newColor} 
                                    onChange={handleColorChange} 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                 />
                                 <button onClick={saveColor} className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800">Modifier</button>
                             </div>
                         </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col h-full">
                <h3 className="font-bold text-xl mb-6 text-gray-900">SEO & Description</h3>
                <div className="relative group flex-1">
                     <textarea 
                        className="w-full h-full min-h-[200px] p-6 bg-gray-50 rounded-2xl text-gray-700 border border-gray-100 text-sm leading-loose resize-none focus:ring-2 focus:ring-black focus:bg-white outline-none transition-all"
                        defaultValue={product.description}
                     />
                     <div className="absolute bottom-4 right-4">
                         <button className="px-4 py-2 bg-black text-white rounded-lg text-xs font-bold shadow-lg hover:scale-105 transition-transform">
                            Sauvegarder
                         </button>
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default MarketingView;
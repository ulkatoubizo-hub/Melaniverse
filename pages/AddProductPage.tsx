import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { fileToDataUrl, blobToBase64Data, generateSingleProductDetails, generateImageVariation } from '../services/geminiService';

const AddProductPage = () => {
  const navigate = useNavigate();
  const { storeData, setStoreData } = useApp();
  const [loading, setLoading] = useState(false);
  const [stepLog, setStepLog] = useState("");
  
  // Form Data for both modes
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    features: '',
    image: null as File | null,
    previewUrl: ''
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = await fileToDataUrl(file);
      setFormData({ ...formData, image: file, previewUrl: url });
    }
  };

  const handleManualAdd = () => {
    if (!formData.image || !formData.name || !formData.price || !storeData) return;
    
    setLoading(true);
    setStepLog("Ajout du produit...");

    const newProduct = {
        id: `prod-${Date.now()}`,
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description || "Pas de description.",
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        originalImage: formData.previewUrl,
        generatedImages: []
    };

    setStoreData({
        ...storeData,
        products: [newProduct, ...storeData.products]
    });
    
    setTimeout(() => navigate('/dashboard'), 500);
  };

  const handleGenerateAndAdd = async () => {
    if (!formData.image || !formData.name || !storeData) return;

    setLoading(true);
    setStepLog("Analyse de l'image du produit...");

    try {
      const base64 = await blobToBase64Data(formData.image);
      
      // 1. Generate Details
      setStepLog("Rédaction description & pricing (Gemini 3 Pro)...");
      const details = await generateSingleProductDetails(formData.name, "Product photo uploaded by user");

      // 2. Generate Variations
      setStepLog("Génération des variations visuelles...");
      const variations = [];
      const var1 = await generateImageVariation(base64, "studio setting, white background");
      if(var1) variations.push(var1);
      const var2 = await generateImageVariation(base64, "lifestyle context, warm lighting");
      if(var2) variations.push(var2);

      // 3. Add to Store
      const newProduct = {
        id: `prod-${Date.now()}`,
        name: formData.name,
        price: details.price || 99,
        description: details.description || "Un produit exceptionnel.",
        features: details.features || [],
        originalImage: formData.previewUrl,
        generatedImages: variations
      };

      setStoreData({
        ...storeData,
        products: [newProduct, ...storeData.products]
      });

      setStepLog("Terminé !");
      setTimeout(() => navigate('/dashboard'), 1000);

    } catch (e) {
      console.error(e);
      setStepLog("Erreur lors de la génération.");
      setLoading(false);
    }
  };

  if (!storeData) return null;
  const isManual = storeData.mode === 'manual';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
                {isManual ? "Ajouter un Produit (Manuel)" : "Ajouter un Produit (IA)"}
            </h2>
            <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-black">Fermer</button>
        </div>

        {loading ? (
           <div className="text-center py-12">
               {isManual ? (
                   <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
               ) : (
                   <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-6"></div>
               )}
               <p className="text-lg font-medium text-gray-700 animate-pulse">{stepLog}</p>
           </div>
        ) : (
           <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Nom du produit</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="Ex: Montre Chrono Luxe"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                   </div>
                   {isManual && (
                       <div>
                           <label className="block text-sm font-bold text-gray-700 mb-2">Prix (€)</label>
                           <input 
                                type="number" 
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
                                placeholder="49.99"
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: e.target.value})}
                            />
                       </div>
                   )}
               </div>

               {isManual && (
                   <>
                       <div>
                           <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                           <textarea 
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none h-32 resize-none"
                                placeholder="Décrivez votre produit..."
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                            />
                       </div>
                       <div>
                           <label className="block text-sm font-bold text-gray-700 mb-2">Caractéristiques (séparées par virgule)</label>
                           <input 
                                type="text" 
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
                                placeholder="Cuir véritable, Étanche, Garantie 2 ans..."
                                value={formData.features}
                                onChange={e => setFormData({...formData, features: e.target.value})}
                            />
                       </div>
                   </>
               )}

               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Photo principale</label>
                  <div className="relative h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center overflow-hidden hover:bg-gray-100 transition-colors">
                      <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleImageChange} />
                      {formData.previewUrl ? (
                          <img src={formData.previewUrl} className="w-full h-full object-contain" alt="Preview" />
                      ) : (
                          <div className="text-center text-gray-400">
                              <span className="block text-2xl mb-2">+</span>
                              <span className="text-sm">Cliquez pour uploader</span>
                          </div>
                      )}
                  </div>
               </div>

               {!isManual && (
                   <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                       <p><strong>Note :</strong> L'IA générera automatiquement la description, le prix suggéré, les caractéristiques et 2 variations d'images supplémentaires.</p>
                   </div>
               )}

               <button 
                 onClick={isManual ? handleManualAdd : handleGenerateAndAdd}
                 disabled={!formData.name || !formData.image || (isManual && !formData.price)}
                 className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-transform ${(!formData.name || !formData.image) ? 'bg-gray-300 cursor-not-allowed' : 'bg-black hover:scale-[1.01]'}`}
               >
                   {isManual ? "Ajouter au Catalogue" : "Générer & Ajouter au Catalogue"}
               </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default AddProductPage;
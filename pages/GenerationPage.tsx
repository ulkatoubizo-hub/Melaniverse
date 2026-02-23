import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { GenerationStep, StoreData } from '../types';
import { generateFullStoreStrategy, generateImageVariation, blobToBase64Data, generateAsset, generateSingleProductDetails } from '../services/geminiService';

const GenerationPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { setStoreData } = useApp();
  const [step, setStep] = useState<GenerationStep>(GenerationStep.IDLE);
  const [progress, setProgress] = useState(0);
  const [currentAction, setCurrentAction] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Check if we have the minimal required data (userPrompt)
    if (!state?.userPrompt) {
      navigate('/');
      return;
    }

    startGeneration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCount]);

  const startGeneration = async () => {
      setStep(GenerationStep.ANALYZING);
      const { userPrompt, images, previewUrls } = state; // Expect arrays now
      
      const updateStatus = (s: GenerationStep, action: string, prog: number) => {
          setStep(s);
          setCurrentAction(action);
          setProgress(prog);
      };

      try {
        // 1. Full Strategy Generation (Text, Prices, Names)
        updateStatus(GenerationStep.TEXT_GEN, "Invention du concept & branding...", 15);
        
        // Pass context about number of products
        const context = (images && images.length > 0) ? `User uploaded ${images.length} product images.` : "User uploaded no images.";
        const strategyData = await generateFullStoreStrategy(userPrompt, context);
        
        updateStatus(GenerationStep.TEXT_GEN, `Boutique "${strategyData.storeName}" créée...`, 30);

        // 2. Assets (Logo & Banner)
        updateStatus(GenerationStep.ASSETS_GEN, "Design du Logo...", 45);
        const logo = await generateAsset(`Minimalist vector logo for ${strategyData.storeName}. ${strategyData.logoPrompt}`, 'logo');
        
        updateStatus(GenerationStep.ASSETS_GEN, "Design de la Bannière...", 60);
        const banner = await generateAsset(`High end e-commerce website header for ${strategyData.storeName}. ${strategyData.bannerPrompt}.`, 'banner');

        // 3. Process Products (Multi-image support)
        updateStatus(GenerationStep.IMAGE_VAR, "Analyse et Création des produits...", 75);
        
        let finalProducts = [];
        
        if (images && images.length > 0) {
            // User uploaded images: Create a product for each image
            for (let i = 0; i < images.length; i++) {
                updateStatus(GenerationStep.IMAGE_VAR, `Traitement produit ${i + 1}/${images.length}...`, 75 + Math.floor((20/images.length) * i));
                
                const base64 = await blobToBase64Data(images[i]);
                const originalUrl = previewUrls[i];
                
                // Generate details for this specific image
                const details = await generateSingleProductDetails(strategyData.productName || "Product", "Image provided by user");
                
                // Generate 1 variation (to be fast)
                const variation = await generateImageVariation(base64, "studio lighting, clean background");
                const generatedImages = variation ? [variation] : [];

                finalProducts.push({
                    id: `gen-prod-${i}`,
                    name: details.name || strategyData.productName || "Produit",
                    price: details.price || 99,
                    description: details.description || "Description générée par IA.",
                    features: details.features || [],
                    originalImage: originalUrl,
                    generatedImages: generatedImages
                });
            }
        } else {
            // No images uploaded: Use placeholders or strategy data
            const mainProductImage = `https://placehold.co/600x600/black/white?text=${encodeURIComponent(strategyData.productName || "Product")}`;
            finalProducts.push({
              id: '1',
              name: strategyData.productName || "Produit Principal",
              price: strategyData.price || 99,
              description: strategyData.products?.[0]?.description || "Description générée manquante",
              features: strategyData.products?.[0]?.features || ["Qualité premium"],
              originalImage: mainProductImage,
              generatedImages: []
            });
            
            // Add suggested products from strategy as placeholders
            if (strategyData.products && strategyData.products.length > 1) {
                strategyData.products.slice(1).forEach((p: any, idx: number) => {
                    finalProducts.push({
                        id: `gen-extra-${idx}`,
                        name: p.name,
                        price: p.price,
                        description: p.description,
                        features: p.features || [],
                        originalImage: `https://placehold.co/600x600/${idx % 2 === 0 ? 'orange' : 'blue'}/white?text=${encodeURIComponent(p.name)}`,
                        generatedImages: []
                    });
                });
            }
        }
        
        // Finalize
        updateStatus(GenerationStep.COMPLETED, "Finalisation de la boutique...", 100);

        // Auto-generate credentials
        const autoEmail = `admin@${strategyData.storeName.toLowerCase().replace(/\s+/g, '')}.com`;
        const autoPassword = "admin";

        const finalStoreData: StoreData = {
          mode: 'ai', // EXPLICIT AI MODE
          name: strategyData.storeName || "My Store",
          prompt: userPrompt,
          slogan: strategyData.slogan || "L'excellence par l'IA",
          aboutUs: strategyData.aboutUs || "Bienvenue sur notre boutique.",
          themeColor: strategyData.themeColor || '#000000',
          logo: logo,
          banner: banner,
          ownerEmail: autoEmail,
          ownerPhone: "+33 6 00 00 00 00",
          password: autoPassword,
          products: finalProducts
        };

        setStoreData(finalStoreData);
        
        // Redirect to Login (Auto-fill experience)
        // Pass credentials in state so Login page can pre-fill or user knows what to type
        setTimeout(() => navigate('/login', { state: { autoEmail, autoPassword } }), 1500);

      } catch (error: any) {
        console.error("Generation Error:", error);
        setStep(GenerationStep.ERROR);
        
        let niceMessage = "Une erreur inattendue est survenue.";
        const errStr = (error.message || '') + JSON.stringify(error);
        
        if (errStr.includes('429') || errStr.includes('quota') || errStr.includes('resource exhausted')) {
            niceMessage = "Quota gratuit atteint (Rate Limit). Veuillez attendre environ 60 secondes avant de réessayer.";
        } else {
             niceMessage = "Erreur lors de la génération. Vérifiez votre connexion.";
        }

        setCurrentAction(niceMessage);
      }
  };

  const handleRetry = () => {
      setStep(GenerationStep.IDLE);
      setCurrentAction("Nouvelle tentative...");
      setRetryCount(c => c + 1);
  };

  const StepItem = ({ label, isActive, isCompleted, icon }: any) => (
      <div className={`flex items-center space-x-4 transition-all duration-500 ${isActive ? 'scale-105' : 'opacity-50'}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-500
              ${isCompleted ? 'bg-green-500 text-white shadow-green-200' : isActive ? 'bg-black text-white shadow-xl' : 'bg-gray-100 text-gray-400'}`}>
              {isCompleted ? '✓' : icon}
          </div>
          <div>
              <p className={`font-bold text-lg ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{label}</p>
              {isActive && <div className="h-1 w-12 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-black animate-[loading_2s_infinite]"></div>
              </div>}
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-gray-900 font-sans">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center">
         
         {/* Left: Visuals */}
         <div className="relative order-2 lg:order-1">
             <div className="absolute inset-0 bg-gradient-to-tr from-green-100 to-blue-100 rounded-[3rem] blur-3xl -z-10 opacity-60"></div>
             
             <div className="bg-white p-2 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative">
                 <div className="aspect-square rounded-2xl overflow-hidden relative bg-gray-50 flex items-center justify-center bg-gray-100">
                    {/* Show grid of images if multiple, else single */}
                    {state?.previewUrls && state.previewUrls.length > 0 ? (
                        <div className={`w-full h-full grid ${state.previewUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-1 p-1`}>
                            {state.previewUrls.slice(0, 4).map((url: string, i: number) => (
                                <img key={i} src={url} className="w-full h-full object-cover rounded-lg opacity-80" alt="Source" />
                            ))}
                        </div>
                    ) : (
                         <div className="text-6xl">✨</div>
                    )}
                    
                    {/* Scanning Effect */}
                    {step !== GenerationStep.ERROR && (
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent w-full h-full animate-[scan_1.5s_ease-in-out_infinite]"></div>
                    )}
                    
                    <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                {step === GenerationStep.ERROR ? "Erreur" : "IA en cours..."}
                            </p>
                            <p className={`font-bold truncate max-w-[200px] ${step === GenerationStep.ERROR ? 'text-red-600' : 'text-gray-900'}`}>
                                {step === GenerationStep.ERROR ? "Arrêt" : currentAction}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full border-2 border-black border-t-transparent animate-spin"></div>
                    </div>
                 </div>
             </div>
         </div>

         {/* Right: Steps */}
         <div className="order-1 lg:order-2 space-y-10">
             <div>
                <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Création de<br/>l'Univers.</h2>
                <p className="text-gray-500 text-lg">
                    L'IA analyse votre idée : <span className="font-bold text-black">"{state?.userPrompt}"</span>.
                </p>
             </div>

             <div className="space-y-8 pl-4 border-l-2 border-gray-100">
                <StepItem 
                    label="Concept & Branding" 
                    icon="💡"
                    isActive={step === GenerationStep.ANALYZING || step === GenerationStep.TEXT_GEN}
                    isCompleted={step !== GenerationStep.ANALYZING && step !== GenerationStep.TEXT_GEN && step !== GenerationStep.ERROR}
                />
                <StepItem 
                    label="Design Visuel" 
                    icon="🎨"
                    isActive={step === GenerationStep.ASSETS_GEN}
                    isCompleted={[GenerationStep.IMAGE_VAR, GenerationStep.COMPLETED].includes(step)}
                />
                <StepItem 
                    label="Catalogue Produit" 
                    icon="🛍️"
                    isActive={step === GenerationStep.IMAGE_VAR}
                    isCompleted={step === GenerationStep.COMPLETED}
                />
             </div>
             
             {/* Global Progress */}
             <div className="space-y-2">
                 <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
                     <span>Progression</span>
                     <span>{progress}%</span>
                 </div>
                 <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                     <div 
                        className={`h-full transition-all duration-300 ease-out ${step === GenerationStep.ERROR ? 'bg-red-500' : 'bg-black'}`}
                        style={{width: `${progress}%`}}
                     ></div>
                 </div>
             </div>
         </div>

      </div>

      {step === GenerationStep.ERROR && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white px-6 py-6 rounded-2xl shadow-2xl border border-red-100 flex flex-col items-center w-full max-w-lg animate-bounce-small z-50">
              <div className="flex items-start space-x-3 w-full mb-4">
                 <div className="bg-red-100 text-red-600 p-2 rounded-lg text-2xl">⚠️</div>
                 <div>
                     <h3 className="font-bold text-gray-900">Pause nécessaire.</h3>
                     <p className="text-sm text-gray-600 leading-relaxed mt-1">{currentAction}</p>
                 </div>
              </div>
              <button 
                onClick={handleRetry} 
                className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg"
              >
                  Réessayer
              </button>
          </div>
      )}
    </div>
  );
};

export default GenerationPage;
import React, { useState } from 'react';
import { useApp } from '../App';
import { useNavigate, useParams } from 'react-router-dom';

const StoreProductPage = () => {
  const { storeData } = useApp();
  const navigate = useNavigate();
  const { id } = useParams();
  
  if (!storeData) return null;

  const product = storeData.products.find(p => p.id === id) || storeData.products[0];
  
  // Combine all images
  const allImages = [product.originalImage, ...(product.generatedImages || [])].filter((v, i, a) => a.indexOf(v) === i);
  // Ensure we display something if generated images failed
  const displayImages = allImages.length > 0 ? allImages : [product.originalImage];

  // eslint-disable-next-line
  const [activeImage, setActiveImage] = useState<string>(displayImages[0]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Minimal Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 
                className="text-2xl font-black cursor-pointer" 
                style={{color: storeData.themeColor}}
                onClick={() => navigate('/store')}
            >
                {storeData.name}.
            </h1>
            <div className="flex items-center space-x-6">
              <div className="relative cursor-pointer" onClick={() => navigate('/store/checkout')}>
                 <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
          
          {/* Gallery Section */}
          <div className="flex flex-col-reverse gap-4">
             {/* Thumbnails Row */}
             <div className="grid grid-cols-4 gap-4">
                {displayImages.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all
                        ${activeImage === img ? 'border-black opacity-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
             </div>
             
             {/* Main Image */}
             <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 shadow-sm border border-gray-100">
               <img 
                 src={activeImage} 
                 alt={product.name} 
                 className="w-full h-full object-cover transition-all duration-500" 
               />
             </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 lg:mt-0">
            <div className="mb-2">
                <span className="text-orange-600 font-bold uppercase text-xs tracking-wider bg-orange-50 px-2 py-1 rounded">Nouveauté</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">{product.name}</h1>
            <p className="text-3xl font-medium text-gray-900 mb-8">{product.price} €</p>

            <div className="prose prose-sm text-gray-600 mb-8 leading-relaxed">
               <p>{product.description}</p>
            </div>

            <div className="mb-8">
               <h3 className="font-bold text-gray-900 mb-3">Caractéristiques</h3>
               <ul className="space-y-2">
                 {product.features.map((feature, i) => (
                   <li key={i} className="flex items-center text-sm text-gray-600">
                     <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3"></span>
                     {feature}
                   </li>
                 ))}
               </ul>
            </div>

            <div className="flex space-x-4 border-t border-gray-100 pt-8">
              <button
                onClick={() => navigate('/store/checkout')}
                className="flex-1 bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-900 shadow-xl transition-transform active:scale-95 flex items-center justify-center space-x-2"
              >
                <span>Ajouter au Panier</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
              <button className="p-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </button>
            </div>
            
            <div className="mt-6 flex items-center justify-center space-x-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
               <span>Livraison Gratuite</span>
               <span>•</span>
               <span>Paiement Sécurisé</span>
               <span>•</span>
               <span>Support 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreProductPage;
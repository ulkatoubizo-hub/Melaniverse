import React from 'react';
import { useApp } from '../App';
import { useNavigate } from 'react-router-dom';

const StoreCheckoutPage = () => {
  const { storeData } = useApp();
  const navigate = useNavigate();

  if (!storeData) return null;
  const product = storeData.products[0];

  const handlePay = () => {
      // Simulate processing
      setTimeout(() => {
          navigate('/store/success');
      }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
       <div className="max-w-3xl mx-auto px-4 py-12">
           <div className="mb-8 flex items-center cursor-pointer text-gray-500 hover:text-black" onClick={() => navigate(-1)}>
               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
               Retour
           </div>

           <h1 className="text-3xl font-black mb-8">Paiement</h1>

           <div className="grid md:grid-cols-3 gap-8">
               
               {/* Form */}
               <div className="md:col-span-2 space-y-6">
                   {/* Contact */}
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                       <h2 className="text-lg font-bold mb-4">Contact</h2>
                       <input type="email" placeholder="Email" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-orange-500 transition-colors" />
                   </div>

                   {/* Shipping */}
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                       <h2 className="text-lg font-bold mb-4">Livraison</h2>
                       <div className="grid grid-cols-2 gap-4 mb-4">
                           <input type="text" placeholder="Prénom" className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-orange-500" />
                           <input type="text" placeholder="Nom" className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-orange-500" />
                       </div>
                       <input type="text" placeholder="Adresse" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-4 outline-none focus:border-orange-500" />
                       <div className="grid grid-cols-2 gap-4">
                           <input type="text" placeholder="Code Postal" className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-orange-500" />
                           <input type="text" placeholder="Ville" className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-orange-500" />
                       </div>
                   </div>

                   {/* Payment */}
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                       <h2 className="text-lg font-bold mb-4">Paiement</h2>
                       <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between mb-4 cursor-pointer hover:border-orange-500 bg-gray-50">
                           <span className="font-medium">Carte Bancaire</span>
                           <div className="flex space-x-2">
                               <div className="w-8 h-5 bg-gray-300 rounded"></div>
                               <div className="w-8 h-5 bg-gray-300 rounded"></div>
                           </div>
                       </div>
                       <input type="text" placeholder="Numéro de carte" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-4 outline-none" />
                       <div className="grid grid-cols-2 gap-4">
                           <input type="text" placeholder="MM / AA" className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none" />
                           <input type="text" placeholder="CVC" className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none" />
                       </div>
                   </div>
                   
                   <button 
                    onClick={handlePay}
                    className="w-full py-5 bg-black text-white font-bold rounded-xl shadow-lg hover:scale-[1.01] transition-transform"
                   >
                       Payer {product.price} €
                   </button>
               </div>

               {/* Summary */}
               <div className="md:col-span-1">
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                       <h2 className="text-lg font-bold mb-6">Récapitulatif</h2>
                       <div className="flex items-start space-x-4 mb-6">
                           <img src={product.originalImage} className="w-16 h-16 rounded-lg object-cover bg-gray-100" alt="" />
                           <div>
                               <p className="font-bold text-sm">{product.name}</p>
                               <p className="text-gray-500 text-sm">Qté: 1</p>
                           </div>
                           <div className="flex-1 text-right font-medium">
                               {product.price} €
                           </div>
                       </div>
                       
                       <div className="border-t border-gray-100 pt-4 space-y-2">
                           <div className="flex justify-between text-sm text-gray-600">
                               <span>Sous-total</span>
                               <span>{product.price} €</span>
                           </div>
                           <div className="flex justify-between text-sm text-gray-600">
                               <span>Livraison</span>
                               <span>Gratuit</span>
                           </div>
                       </div>
                       <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between font-black text-xl">
                           <span>Total</span>
                           <span>{product.price} €</span>
                       </div>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
};

export default StoreCheckoutPage;
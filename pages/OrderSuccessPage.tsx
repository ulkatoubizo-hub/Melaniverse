import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
       <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-lg w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Commande Reçue !</h1>
          <p className="text-gray-500 mb-8">Merci pour votre achat. Vous recevrez un email de confirmation dans quelques instants.</p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-8 text-sm text-gray-600">
              <p>Numéro de commande : <span className="font-mono font-bold text-black">#CMD-{Math.floor(Math.random()*10000)}</span></p>
          </div>

          <button 
            onClick={() => navigate('/store')}
            className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
          >
              Retour à la boutique
          </button>
       </div>
    </div>
  );
};

export default OrderSuccessPage;
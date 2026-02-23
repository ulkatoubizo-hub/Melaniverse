import React from 'react';
import { useApp } from '../../App';

const OrdersList = () => {
  const { storeData } = useApp();
  if (!storeData) return null;

  return (
     <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden min-h-[400px]">
      <div className="p-8 border-b border-gray-100 bg-white">
        <h3 className="font-bold text-xl text-gray-900">Commandes Récentes</h3>
      </div>
      
      {/* Empty State for Demo */}
      <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">
             📦
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">Aucune commande</h4>
          <p className="text-gray-500 max-w-sm text-center">Vos premières commandes apparaîtront ici une fois que votre boutique sera partagée.</p>
      </div>
     </div>
  );
};

export default OrdersList;
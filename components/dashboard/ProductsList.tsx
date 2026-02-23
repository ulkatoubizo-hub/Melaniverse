import React from 'react';
import { useApp } from '../../App';
import { useNavigate } from 'react-router-dom';

const ProductsList = () => {
  const { storeData, setStoreData } = useApp();
  const navigate = useNavigate();
  
  if (!storeData) return null;

  const copyProductLink = (id: string) => {
     const url = `${window.location.origin}/#/store/product/${id}`;
     navigator.clipboard.writeText(url);
     alert("Lien produit copié !");
  };

  const handleDelete = (id: string) => {
      if(window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
          const updatedProducts = storeData.products.filter(p => p.id !== id);
          setStoreData({
              ...storeData,
              products: updatedProducts
          });
      }
  };

  const handleEdit = (id: string) => {
      // Pour la démo, nous faisons une édition simple via prompt.
      // Idéalement, cela redirigerait vers une page d'édition complète.
      const product = storeData.products.find(p => p.id === id);
      if(!product) return;

      const newName = window.prompt("Modifier le nom du produit :", product.name);
      if (newName !== null) {
          const newPriceStr = window.prompt("Modifier le prix :", product.price.toString());
          const newPrice = newPriceStr ? parseFloat(newPriceStr) : product.price;

          const updatedProducts = storeData.products.map(p => {
              if (p.id === id) {
                  return { ...p, name: newName || p.name, price: newPrice };
              }
              return p;
          });

          setStoreData({
              ...storeData,
              products: updatedProducts
          });
      }
  };

  return (
    <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white">
        <div>
           <h3 className="font-bold text-xl text-gray-900">Inventaire</h3>
           <p className="text-sm text-gray-500 mt-1 font-medium">Gérez votre catalogue produit (IA).</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/add-product')}
          className="px-6 py-3 bg-black text-white rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-gray-200 flex items-center gap-2"
        >
          <span>+</span> Ajouter un produit
        </button>
      </div>
      <table className="w-full text-left">
        <thead className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-wider font-bold">
          <tr>
            <th className="px-8 py-5">Produit</th>
            <th className="px-8 py-5">Prix</th>
            <th className="px-8 py-5">Lien Direct</th>
            <th className="px-8 py-5">Statut</th>
            <th className="px-8 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {storeData.products.length === 0 ? (
              <tr>
                  <td colSpan={5} className="px-8 py-10 text-center text-gray-500">
                      Aucun produit dans l'inventaire. Ajoutez-en un !
                  </td>
              </tr>
          ) : (
            storeData.products.map((product) => (
                <tr key={product.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-5">
                    <div className="flex items-center space-x-5">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 shadow-sm">
                            <img src={product.originalImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                        </div>
                        <div>
                            <span className="font-bold text-gray-900 block text-base">{product.name}</span>
                            <span className="text-xs text-gray-400 font-mono mt-1 block">ID: {product.id}</span>
                        </div>
                    </div>
                    </td>
                    <td className="px-8 py-5 font-bold text-gray-900">{product.price} €</td>
                    <td className="px-8 py-5">
                    <button onClick={() => copyProductLink(product.id)} className="px-3 py-1.5 rounded-lg bg-gray-100 text-xs font-bold text-gray-600 hover:bg-black hover:text-white transition-all flex items-center gap-2 w-fit">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                        Copier
                    </button>
                    </td>
                    <td className="px-8 py-5">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                            En ligne
                        </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end space-x-3">
                            <button 
                                onClick={() => handleEdit(product.id)}
                                className="text-gray-400 hover:text-black font-bold text-sm transition-colors"
                            >
                                Éditer
                            </button>
                            <button 
                                onClick={() => handleDelete(product.id)}
                                className="text-red-300 hover:text-red-600 font-bold text-sm transition-colors p-2 hover:bg-red-50 rounded-lg"
                                title="Supprimer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        </div>
                    </td>
                </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsList;
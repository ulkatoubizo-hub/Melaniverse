import React from 'react';

const AdminStores = () => {
    const stores = [
        { name: "Urban Style", owner: "Alice Martin", revenue: "12,450 €", products: 45, status: "En ligne" },
        { name: "Eco Life", owner: "Bob Dupont", revenue: "3,200 €", products: 12, status: "En ligne" },
        { name: "Tech Haven", owner: "David Lemoine", revenue: "45,000 €", products: 120, status: "En ligne" },
        { name: "Fake Brand", owner: "Spammer123", revenue: "0 €", products: 1, status: "Signalé" },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold">Boutiques Hébergées</h3>
                <div className="space-x-2">
                    <button className="px-4 py-2 bg-black text-white rounded-lg text-xs font-bold">Suspendre une boutique</button>
                </div>
            </div>
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider font-bold">
                    <tr>
                        <th className="px-8 py-4">Boutique</th>
                        <th className="px-8 py-4">Propriétaire</th>
                        <th className="px-8 py-4">Produits</th>
                        <th className="px-8 py-4">Revenu Total</th>
                        <th className="px-8 py-4">État</th>
                        <th className="px-8 py-4 text-right">Accès</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {stores.map((store, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="px-8 py-4 font-bold text-gray-900">{store.name}</td>
                            <td className="px-8 py-4 text-sm text-gray-600">{store.owner}</td>
                            <td className="px-8 py-4 text-sm text-gray-600">{store.products}</td>
                            <td className="px-8 py-4 font-mono text-gray-900">{store.revenue}</td>
                            <td className="px-8 py-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${store.status === 'Signalé' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                    {store.status}
                                </span>
                            </td>
                            <td className="px-8 py-4 text-right">
                                <button className="text-blue-600 hover:text-blue-800 font-bold text-xs underline">Login As</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default AdminStores;
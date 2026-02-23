import React from 'react';

const AdminAI = () => {
    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-2">Consommation Gemini API</h2>
                    <p className="text-gray-400 mb-6">Suivi en temps réel de l'utilisation des tokens et des coûts.</p>
                    <div className="flex space-x-8">
                        <div>
                            <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Tokens Aujourd'hui</p>
                            <p className="text-4xl font-black mt-1">45.2M</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Coût Estimé</p>
                            <p className="text-4xl font-black mt-1">124.50 €</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg mb-4">Dernières Générations</h3>
                    <ul className="space-y-3">
                        {[1,2,3,4,5].map(i => (
                            <li key={i} className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Image Gen: "Sneakers neon..."</span>
                                <span className="font-mono text-xs text-gray-400">1.2s • 0.02€</span>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg mb-4">Erreurs API</h3>
                     <ul className="space-y-3">
                        {[1,2].map(i => (
                            <li key={i} className="flex justify-between items-center text-sm p-3 bg-red-50 rounded-lg border border-red-100">
                                <span className="text-red-700 font-medium">Rate Limit Exceeded (429)</span>
                                <span className="font-mono text-xs text-red-400">14:02:23</span>
                            </li>
                        ))}
                         <li className="text-center text-gray-400 text-sm pt-2">Tout fonctionne normalement.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
export default AdminAI;
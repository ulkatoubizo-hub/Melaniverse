import React from 'react';

const AdminPayments = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Flux Financiers</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider font-bold">
                        <tr>
                            <th className="px-6 py-4">ID Transaction</th>
                            <th className="px-6 py-4">Utilisateur</th>
                            <th className="px-6 py-4">Montant</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {[1,2,3,4,5].map(i => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-mono text-gray-500">#TX-{1000+i}</td>
                                <td className="px-6 py-4 font-bold">Client {i}</td>
                                <td className="px-6 py-4">29.00 €</td>
                                <td className="px-6 py-4">Abonnement Pro</td>
                                <td className="px-6 py-4"><span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded">Payé</span></td>
                                <td className="px-6 py-4 text-gray-500">Auj. 14:30</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default AdminPayments;
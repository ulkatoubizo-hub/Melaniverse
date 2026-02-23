import React from 'react';

const AdminUsers = () => {
    const users = [
        { id: 1, name: "Alice Martin", email: "alice@example.com", role: "Vendeur", status: "Actif", plan: "Pro" },
        { id: 2, name: "Bob Dupont", email: "bob@example.com", role: "Vendeur", status: "Actif", plan: "Starter" },
        { id: 3, name: "Charlie Roy", email: "charlie@example.com", role: "Suspendu", status: "Inactif", plan: "Free" },
        { id: 4, name: "David Lemoine", email: "david@example.com", role: "Vendeur", status: "Actif", plan: "Enterprise" },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold">Liste des Utilisateurs</h3>
                <input type="text" placeholder="Rechercher..." className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none" />
            </div>
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider font-bold">
                    <tr>
                        <th className="px-8 py-4">Utilisateur</th>
                        <th className="px-8 py-4">Rôle</th>
                        <th className="px-8 py-4">Abonnement</th>
                        <th className="px-8 py-4">Statut</th>
                        <th className="px-8 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {users.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-8 py-4">
                                <div>
                                    <p className="font-bold text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                            </td>
                            <td className="px-8 py-4 text-sm font-medium">{user.role}</td>
                            <td className="px-8 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${user.plan === 'Enterprise' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                                    {user.plan}
                                </span>
                            </td>
                            <td className="px-8 py-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${user.status === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {user.status}
                                </span>
                            </td>
                            <td className="px-8 py-4 text-right">
                                <button className="text-gray-400 hover:text-black font-bold text-xs">Gérer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default AdminUsers;
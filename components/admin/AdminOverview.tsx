import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';

const AdminOverview = () => {
    const data = [
        { name: '00h', users: 120 }, { name: '04h', users: 80 }, { name: '08h', users: 450 },
        { name: '12h', users: 1200 }, { name: '16h', users: 950 }, { name: '20h', users: 1500 }, { name: '23h', users: 600 },
    ];

    const revenueData = [
        { name: 'Lun', amt: 4000 }, { name: 'Mar', amt: 3000 }, { name: 'Mer', amt: 2000 },
        { name: 'Jeu', amt: 2780 }, { name: 'Ven', amt: 1890 }, { name: 'Sam', amt: 2390 }, { name: 'Dim', amt: 3490 },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { title: "Utilisateurs Totaux", val: "12,450", change: "+12%", color: "bg-blue-50 text-blue-600" },
                    { title: "Boutiques Actives", val: "8,932", change: "+5%", color: "bg-green-50 text-green-600" },
                    { title: "Revenus (30j)", val: "450k €", change: "+24%", color: "bg-purple-50 text-purple-600" },
                    { title: "Générations IA", val: "1.2M", change: "+45%", color: "bg-orange-50 text-orange-600" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{stat.title}</p>
                        <div className="flex justify-between items-end">
                            <h3 className="text-3xl font-black text-gray-900">{stat.val}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${stat.color}`}>{stat.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-6">Trafic Temps Réel</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#000" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                                <Area type="monotone" dataKey="users" stroke="#000" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                     <h3 className="text-lg font-bold mb-6">Alertes Système</h3>
                     <div className="space-y-4">
                         {[
                             { msg: "Latence élevée API Gemini", time: "2 min", type: "red" },
                             { msg: "Nouveau pic d'inscriptions", time: "15 min", type: "green" },
                             { msg: "Maintenance base de données prévue", time: "1 h", type: "yellow" },
                         ].map((alert, i) => (
                             <div key={i} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                 <div className={`w-2 h-2 rounded-full mt-1.5 bg-${alert.type}-500`}></div>
                                 <div>
                                     <p className="text-sm font-bold text-gray-800">{alert.msg}</p>
                                     <p className="text-xs text-gray-500">{alert.time}</p>
                                 </div>
                             </div>
                         ))}
                     </div>
                </div>
            </div>
        </div>
    );
};
export default AdminOverview;
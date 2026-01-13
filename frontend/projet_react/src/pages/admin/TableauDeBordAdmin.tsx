// src/Pages/Admin/AdminDashboard.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";
import { User, ShoppingCart, Package, FileText, DollarSign, Sun } from "lucide-react";
import API_BASE_URL from "../../services/api";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

interface Totaux {
    utilisateurs: number;
    commandes: number;
    produits: number;
    fichiers: number;
    revenu: number;
}

interface Commande {
    id: number;
    utilisateur__nom: string;
    utilisateur__prenom: string;
    statut: string;
    montant_total: number;
    date_commande: string;
}

interface Utilisateur {
    nom: string;
    prenom: string;
    email: string;
    date_inscription: string;
}

const AdminDashboard = () => {
    const { t } = useTranslation();
    const [totaux, setTotaux] = useState<Totaux | null>(null);
    const [commandesParMois, setCommandesParMois] = useState<any[]>([]);
    const [commandesParStatut, setCommandesParStatut] = useState<any[]>([]);
    const [dernieresCommandes, setDernieresCommandes] = useState<Commande[]>([]);
    const [utilisateursRecents, setUtilisateursRecents] = useState<Utilisateur[]>([]);
    // const [meteo, setMeteo] = useState<number | null>(null);

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    useEffect(() => {
        if (!token) return;

        axios.get(`${API_BASE_URL}/api/admin/dashboard/`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setTotaux(res.data.totaux);
                setCommandesParMois(res.data.commandes_par_mois);
                setCommandesParStatut(res.data.commandes_par_statut);
                setDernieresCommandes(res.data.dernieres_commandes);
                setUtilisateursRecents(res.data.utilisateurs_recents);
            })
            .catch(err => console.error(err));

        // Météo temporaire
        // setMeteo(25);
    }, [token]);

    if (!totaux) return <p className="text-center mt-10 text-gray-500">Chargement du dashboard...</p>;

    const statsCards = [
        { title: t("TableauAdmin.users"), value: totaux.utilisateurs, color: "bg-blue-500", icon: <User size={32} className="text-white" /> },
        { title: t("TableauAdmin.orders"), value: totaux.commandes, color: "bg-green-500", icon: <ShoppingCart size={32} className="text-white" /> },
        { title: t("TableauAdmin.products"), value: totaux.produits, color: "bg-purple-500", icon: <Package size={32} className="text-white" /> },
        { title: t("TableauAdmin.files"), value: totaux.fichiers, color: "bg-red-500", icon: <FileText size={32} className="text-white" /> },
        { title: t("TableauAdmin.revenue"), value: totaux.revenu + " Ar", color: "bg-yellow-500", icon: <DollarSign size={32} className="text-white" /> },
    ];

    return (
        <div className="p-6 space-y-8 bg-base-200 min-h-screen">

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:justify-between ">
                {/* Widget météo */}
                <div className="bg-gradient-to-r from-violet-500 to-pink-600 p-6 shadow rounded-xl w-64 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-white">{t("TableauAdmin.weather")}</h3>
                        <p className="text-2xl font-bold text-white mt-1">😉👏☺️</p>
                    </div>
                    <Sun size={48} className="text-white" />
                </div>
                <div className="text-center mb-6">
                    <h2 className="text-3xl mt-2 font-bold text-base-content">{t("TableauAdmin.title")} 👑</h2>
                    <p className="text-gray-600 mt-2">
                        {t("TableauAdmin.overview")}<span className="font-semibold"> Print.mg</span>
                    </p>
                </div>
            </div>

            {/* Cartes statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {statsCards.map((card, i) => (
                    <div key={i} className={`flex items-center justify-between p-6 rounded-xl shadow-lg hover:shadow-2xl transition bg-gradient-to-r ${card.color} text-white`}>
                        <div>
                            <p className="text-sm opacity-80">{card.title}</p>
                            <p className="text-2xl font-bold mt-1">{card.value}</p>
                        </div>
                        <div>{card.icon}</div>
                    </div>
                ))}
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Commandes par mois */}
                <div className="bg-base-100 p-6 shadow rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">{t("TableauAdmin.ordersByMonth")}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={commandesParMois}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="mois" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="nombre" stroke="#3B82F6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Commandes par statut */}
                <div className="bg-base-100 p-6 shadow rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">{t("TableauAdmin.ordersByStatus")}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={commandesParStatut}
                                dataKey="count"
                                nameKey="statut"
                                outerRadius={100}
                                fill="#8884d8"
                                label
                            >
                                {commandesParStatut.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Dernières commandes et utilisateurs récents */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Dernières commandes */}
                <div className="bg-base-100 p-6 shadow rounded-xl overflow-x-auto">
                    <h3 className="text-lg font-semibold mb-4">{t("TableauAdmin.latestOrders")}</h3>
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b text-base-content">
                                <th className="p-2">{t("TableauAdmin.table.id")}</th>
                                <th className="p-2">{t("TableauAdmin.table.user")}</th>
                                <th className="p-2">{t("TableauAdmin.table.status")}</th>
                                <th className="p-2">{t("TableauAdmin.table.amount")}</th>
                                <th className="p-2">{t("TableauAdmin.table.date")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dernieresCommandes.map(cmd => (
                                <tr key={cmd.id} className="border-b">
                                    <td className="p-2 font-semibold text-base-content">#{cmd.id}</td>
                                    <td className="p-2">{cmd.utilisateur__nom} {cmd.utilisateur__prenom}</td>
                                    <td className="p-2">{cmd.statut}</td>
                                    <td className="p-2 text-green-600 font-semibold">{cmd.montant_total} Ar</td>
                                    <td className="p-2">{new Date(cmd.date_commande).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Utilisateurs récents */}
                <div className="bg-base-100 p-6 shadow rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">{t("TableauAdmin.recentUsers")}</h3>
                    <ul className="space-y-3">
                        {utilisateursRecents.map(user => (
                            <li key={user.email} className="flex items-center p-3 border rounded-lg hover:bg-blue-50 transition">
                                <User size={24} className="text-indigo-500 mr-2" />
                                <div>
                                    <p className="text-base-content">{user.nom} {user.prenom}</p>
                                    <span className="text-sm text-gray-400">{user.email} | {new Date(user.date_inscription).toLocaleDateString()}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;

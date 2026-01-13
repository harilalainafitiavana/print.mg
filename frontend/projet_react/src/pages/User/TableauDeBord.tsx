// src/Pages/User/TableauDeBord.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from "recharts";
import { useTranslation } from "react-i18next";
import API_BASE_URL from "../../services/api";

const TableauDeBord = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<any>(null);

  // 🔹 Récupérer le token directement depuis localStorage/sessionStorage
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) return; // 🔹 si pas de token, ne rien faire
    axios.get(`${API_BASE_URL}/api/user/dashboard-stats/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, [token]);

  if (!stats) return <p className="text-center mt-10 text-gray-500">Chargement des statistiques...</p>;

  const commandesParMois = stats.commandes_par_mois.map((item: any) => ({
    mois: item.mois,
    nombre: item.nombre,
    montant: item.montant || 0
  }));

  //   const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  return (
    <div className="p-6 space-y-8 bg-base-200 min-h-screen">

      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-base-content">
          {t("TableauUser.title")} <span className="text-violet-600">{stats.user_email}</span> 👋
        </h2>
        <p className="text-gray-500 mt-2">
          {t("TableauUser.secondtitle")}<span className="font-semibold">Print.mg</span>
        </p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-base-100 shadow-lg rounded-xl p-6 hover:shadow-xl transition">
          <p className="text-base-content">{t("TableauUser.total")}</p>
          <p className="text-3xl font-bold text-blue-600">{stats.total_commandes}</p>
        </div>
        <div className="bg-base-100 shadow-lg rounded-xl p-6 hover:shadow-xl transition">
          <p className="text-base-content">{t("TableauUser.totalprice")}</p>
          <p className="text-3xl font-bold text-green-600">{stats.montant_total} Ar</p>
        </div>
        <div className="bg-base-100 shadow-lg rounded-xl p-6 hover:shadow-xl transition">
          <p className="text-base-content">{t("TableauUser.files")}</p>
          <p className="text-3xl font-bold text-purple-600">{stats.total_fichiers}</p>
        </div>
        <div className="bg-base-100 shadow-lg rounded-xl p-6 hover:shadow-xl transition">
          <p className="text-base-content">{t("TableauUser.notification")}</p>
          <p className="text-3xl font-bold text-red-600">{stats.notifications_non_lues}</p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Commandes par mois */}
        <div className="bg-base-100 p-6 shadow rounded-xl">
          <h3 className="text-lg font-semibold mb-4">{t("TableauUser.evolution")}</h3>
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

        {/* Dépenses par mois */}
        <div className="bg-base-100 p-6 shadow rounded-xl">
          <h3 className="text-lg font-semibold mb-4">{t("TableauUser.depence")}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={commandesParMois}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="montant" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dernières commandes & notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Dernières commandes */}
        <div className="bg-base-100 p-6 shadow rounded-xl">
          <h3 className="text-lg font-semibold mb-4">{t("TableauUser.firstcommande")}</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-base-content">
                <th className="p-2">ID</th>
                <th className="p-2">{t("TableauUser.date")}</th>
                <th className="p-2">{t("TableauUser.price")}</th>
              </tr>
            </thead>
            <tbody>
              {stats.dernières_commandes.map((cmd: any) => (
                <tr key={cmd.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-semibold text-base-content">#{cmd.id}</td>
                  <td className="p-2">{new Date(cmd.date_commande).toLocaleDateString()}</td>
                  <td className="p-2 text-green-600 font-semibold">{cmd.montant_total} Ar</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dernières notifications */}
        <div className="bg-base-100 p-6 shadow rounded-xl">
          <h3 className="text-lg font-semibold mb-4">{t("TableauUser.firstnotification")}</h3>
          <ul className="space-y-3">
            {stats.dernières_notifications.map((notif: any) => (
              <li key={notif.id} className="p-3 border rounded-lg hover:bg-blue-50 transition">
                <p className="text-base-content">{notif.message}</p>
                <span className="text-sm text-gray-700">
                  {new Date(notif.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
};

export default TableauDeBord;

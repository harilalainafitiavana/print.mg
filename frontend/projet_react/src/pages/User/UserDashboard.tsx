import { useState, useEffect } from "react";
import DashboardLayout from "../../Components/DashboardLayout";
import { Home, Folder, Trash, BarChart3, Settings, Search } from "lucide-react";
import Commande from "./Commande";
import Setting from "../../Components/Settings";
import Profils from "../../Components/Profils";
import Notification from "./NotificationsUser"
import Corbeille from "./Corbeille";
import MesCommande from "./Mes_commande";
import TableauDeBord from "./TableauDeBord";
import { useTranslation } from "react-i18next";

export default function UserDashboard() {
    const { t } = useTranslation();
    const [activeMenu, setActiveMenu] = useState("home");
    const [user, setUser] = useState<{ nom: string; prenom: string; profils?: string } | null>(null);
    const [query, setQuery] = useState("");

    // 🔹 Récupération des infos de l'utilisateur connecté
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token") || sessionStorage.getItem("token");
                const res = await fetch("http://localhost:8000/api/me/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                }
            } catch (error) {
                console.error("Erreur récupération utilisateur :", error);
            }
        };

        fetchUser();
    }, []);

    const menus = [
        { id: "home", label: t("dashboard.menus.home"), icon: <Home size={20} /> },
        { id: "orders", label: t("userDashboard.orders"), icon: <Folder size={20} /> },
        { id: "trash", label: t("userDashboard.trash"), icon: <Trash size={20} /> },
        { id: "stats", label: t("userDashboard.stats"), icon: <BarChart3 size={20} /> },
        { id: "settings", label: t("userDashboard.settings"), icon: <Settings size={20} /> },
    ];

    const renderContent = () => {
        switch (activeMenu) {
            case "orders":
                return <MesCommande onMenuClick={setActiveMenu} searchQuery={query} />;
            case "order":
                return <Commande />;
            case "trash":
                return <Corbeille />;
            case "settings":
                return <Setting />;
            case "notification":
                return <Notification />;
            case "profil":
                return <div className="p-6"><Profils /></div>;
            default:
                return (
                    <div>
                        <TableauDeBord />
                    </div>
                );
        }
    };

    return (
        <DashboardLayout
            userName={user ? `${user.nom} ${user.prenom}` : "Utilisateur"}
            userPhoto={user?.profils ? `http://localhost:8000${user.profils}` : "../../assets/Utilisateur.png"}
            menus={menus}
            onMenuClick={setActiveMenu}
            headerContent={
                <label className="relative flex-1">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t("userDashboard.search")}
                        className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} />
                </label>
            }
        >
            {renderContent()}

        </DashboardLayout>
    );
}


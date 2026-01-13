import { useState, useEffect } from "react";
import DashboardLayout from "../../Components/DashboardLayout";
import { Home, Folder, Trash, Settings, Search, User } from "lucide-react";
import Commande from "./Commande";
import Setting from "../../Components/Settings";
import Profils from "../../Components/Profils";
import Notification from "./NotificationsUser"
import Corbeille from "./Corbeille";
import MesCommande from "./Mes_commande";
import TableauDeBord from "./TableauDeBord";
import { useTranslation } from "react-i18next";
import Abouts from "../../Components/About";
import Logo from "../../assets/logo.png";
import { getAvatarUrl } from '../../Components/avatarUtils';
import API_BASE_URL from "../../services/api";

export default function UserDashboard() {
    const { t } = useTranslation();
    const [activeMenu, setActiveMenu] = useState("home");
    const [user, setUser] = useState<{ nom: string; prenom: string; email: string; profils?: string } | null>(null);
    const [query, setQuery] = useState("");

    // 🔹 Récupération des infos de l'utilisateur connecté
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token") || sessionStorage.getItem("token");
                const res = await fetch(`${API_BASE_URL}/api/me/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);

                    // ⭐⭐ AJOUTEZ ICI - DEBUG
                    console.log("=== DEBUG AVATAR DASHBOARD ===");
                    console.log("Data reçue de l'API:", data);
                    console.log("User profils:", data.profils);
                    console.log("Avatar URL calculée:", getAvatarUrl(data));
                    console.log("=====================");
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
        { id: "settings", label: t("userDashboard.settings"), icon: <Settings size={20} /> },
        { id: "help", label: t("userDashboard.about"), icon: <Trash size={20} /> },
    ];

    // Composant pour afficher le profil utilisateur
    const UserProfileSection = () => (
        <div className="p-4 border-b border-gray-200 bg-base-150 from-blue-50 to-indigo-50">
            <div className="flex flex-col items-center space-x-3">
                {/* Photo de profil ou icône par défaut */}
                <div className="flex-shrink-0">
                    {getAvatarUrl(user) ? (
                        // Si l'utilisateur a une photo
                        <img
                            src={getAvatarUrl(user)!}
                            alt="Profile de l'utilisateur"
                            className="w-28 h-28 rounded-full object-cover border-2 border-white shadow-sm"
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                        />

                    ) : (
                        // Si l'utilisateur n'a pas de photo
                        <div className="w-28 h-28 rounded-full bg-violet-100 flex items-center justify-center border-2 border-white shadow-sm">
                            <User size={48} className="text-violet-600" />
                        </div>
                    )}
                </div>

                {/* Informations utilisateur */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-base-content truncate">
                        {user ? `${user.prenom} ${user.nom}` : "Utilisateur"}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                        {user?.email || "email@exemple.com"}
                    </p>
                </div>
            </div>
        </div>
    );

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
            case "help":
                return <Abouts />;
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
            userEmail={user?.email || "utilisateur@example.com"}
            userPhoto={Logo}
            menus={menus}
            onMenuClick={setActiveMenu}
            headerContent={
                <label className="relative flex-1 hidden md:block">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t("userDashboard.search")}
                        className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} />
                </label>
            }
            // Ajout de la section profil au-dessus du menu
            sidebarHeader={<UserProfileSection />}
        >
            {renderContent()}
        </DashboardLayout>
    );
}
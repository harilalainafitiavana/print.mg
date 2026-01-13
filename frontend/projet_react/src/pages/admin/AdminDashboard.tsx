import { useState, useEffect } from "react";
import DashboardLayout from "../../Components/DashboardLayout";
import Setting from "../../Components/Settings"
import { Home, ShoppingCart, Package, Users, Trash } from "lucide-react";
import Profils from "../../Components/Profils";
import CommandeList from "./CommandeList";
import AdminCorbeil from "./AdminCorbeil";
import Product from "./Product";
import UserList from "./UserList";
import Notifications from "./NotificationAdmin"
import AdminProfil from "../../assets/icone.png"
import TableauDeBordAdmin from "./TableauDeBordAdmin";
import { useTranslation } from "react-i18next";
import Abouts from "../../Components/About";
import API_BASE_URL from "../../services/api";

export default function AdminDashboard() {
    const { t } = useTranslation();
    const [activeMenu, setActiveMenu] = useState("home");
    const [user, setUser] = useState<{ email: string; } | null>(null);

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
                }
            } catch (error) {
                console.error("Erreur récupération utilisateur :", error);
            }
        };

        fetchUser();
    }, []);

    // 👉 Menus spécifiques à l'admin
    const menus = [
        { id: "home", label: t("dashboard.menus.home"), icon: <Home size={20} /> },
        { id: "orders", label: t("dashboard.menus.orders"), icon: <ShoppingCart size={20} /> },
        { id: "products", label: t("dashboard.menus.products"), icon: <Package size={20} /> },
        { id: "users", label: t("dashboard.menus.users"), icon: <Users size={20} /> },
        { id: "trash", label: t("dashboard.menus.trash"), icon: <Trash size={20} /> },
        { id: "help", label: t("userDashboard.about"), icon: <Trash size={20} /> },

    ];

    // 👉 Contenu affiché selon le menu cliqué
    const renderContent = () => {
        switch (activeMenu) {
            case "orders":
                return <div><CommandeList /></div>;

            case "trash":
                return <AdminCorbeil />

            case "products":
                return <Product />

            case "users":
                return <UserList />

            case "settings":
                return <Setting />

            case "notification":
                return <Notifications />;

            case "help":
                return <Abouts />;

            case "profil":
                return <div className="p-6"> <Profils /> </div>


            default:
                return (
                    <div>
                        <TableauDeBordAdmin />
                    </div>
                );
        }
    };

    return (
        <DashboardLayout
            userName="Administrateur"
            userEmail={user?.email || "admin@example.com"}
            userPhoto={AdminProfil}
            menus={menus}
            onMenuClick={setActiveMenu}
            headerContent={
                <div className="flex gap-2">
                    <select
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={activeMenu}  // 🔹 synchronisé avec l'état
                        onChange={(e) => setActiveMenu(e.target.value)}
                    >
                        <option value="">{t("dashboard.quickLinks.title")}</option>
                        <option value="orders">📦 {t("dashboard.menus.orders")}</option>
                        <option value="products">🛒 {t("dashboard.menus.products")}</option>
                        <option value="users">👤 {t("dashboard.menus.users")}</option>
                    </select>
                </div>
            }
        >
            {renderContent()}
        </DashboardLayout >
    );
}

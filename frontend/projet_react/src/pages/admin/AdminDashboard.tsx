import { useState, useEffect } from "react";
import DashboardLayout from "../../Components/DashboardLayout";
import Setting from "../../Components/Settings"
import { Home, ShoppingCart, Package, Users, Settings, Trash } from "lucide-react";
import Profils from "../../Components/Profils";
import CommandeList from "./CommandeList";
import AdminCorbeil from "./AdminCorbeil";
import Product from "./Product";
import UserList from "./UserList";
import Notifications from "./NotificationAdmin"
import AdminProfil from "../../assets/icone.png"
import TableauDeBordAdmin from "./TableauDeBordAdmin";

export default function AdminDashboard() {
    const [activeMenu, setActiveMenu] = useState("home");
    const [user, setUser] = useState<{ email: string; } | null>(null);

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

    // 👉 Menus spécifiques à l'admin
    const menus = [
        { id: "home", label: "Tableau de bord", icon: <Home size={20} /> },
        { id: "orders", label: "Commandes", icon: <ShoppingCart size={20} /> },
        { id: "products", label: "Produits", icon: <Package size={20} /> },
        { id: "users", label: "Utilisateurs", icon: <Users size={20} /> },
        { id: "trash", label: "Corbeille", icon: <Trash size={20} /> },

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

            case "profil":
                return <div className="p-6"> <Profils /> </div>


            default:
                return (
                    <div>
                        {/* <h2 className="text-xl font-bold mb-4">Bonjour <span className="text-blue-500">{user?.email}</span>, Bienvenue sur l’Admin Dashboard</h2>
                        <p>Vue d’ensemble : statistiques globales, commandes récentes, revenus, etc.</p> */}
                        <TableauDeBordAdmin />
                    </div>
                );
        }
    };

    return (
        <DashboardLayout
            userName="Administrateur"
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
                        <option value="">Lien rapide 😉</option>
                        <option value="orders">📦 Commandes</option>
                        <option value="products">🛒 Produits</option>
                        <option value="users">👤 Utilisateurs</option>
                    </select>
                </div>
            }
        >
            {renderContent()}
        </DashboardLayout >
    );
}

import { useState } from "react";
import DashboardLayout from "../../Components/DashboardLayout";
import Setting from "../../Components/Settings"
import { Home, ShoppingCart, Package, Users, CreditCard, Settings, Trash } from "lucide-react";
import Profils from "../../Components/Profils";

export default function AdminDashboard() {
    const [activeMenu, setActiveMenu] = useState("home");

    // 👉 Menus spécifiques à l'admin
    const menus = [
        { id: "home", label: "Dashboard", icon: <Home size={20} /> },
        { id: "orders", label: "Commandes", icon: <ShoppingCart size={20} /> },
        { id: "products", label: "Produits", icon: <Package size={20} /> },
        { id: "users", label: "Utilisateurs", icon: <Users size={20} /> },
        { id: "payments", label: "Paiements", icon: <CreditCard size={20} /> },
        { id: "trash", label: "Corbeille", icon: <Trash size={20} /> },
        { id: "settings", label: "Paramètres", icon: <Settings size={20} /> },
    ];

    // 👉 Contenu affiché selon le menu cliqué
    const renderContent = () => {
        switch (activeMenu) {
            case "orders":
                return <div>📦 Liste et gestion des commandes (en attente, en cours, livrées)...</div>;

            case "products":
                return <div>🛍️ Gestion des produits et services d’impression...</div>;

            case "users":
                return <div>👥 Liste des utilisateurs + détails...</div>;

            case "payments":
                return <div>💳 Suivi des paiements + factures...</div>;

            case "settings":
                return <div className="p-6"> <Setting /> </div>

            case "notification":
                return <div> Votre notification</div>;
                
            case "profil":
                return <div className="p-6"> <Profils /> </div>


            default:
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Bienvenue sur l’Admin Dashboard</h2>
                        <p>Vue d’ensemble : statistiques globales, commandes récentes, revenus, etc.</p>
                    </div>
                );
        }
    };

    return (
        <DashboardLayout
            userName="Administrateur"
            userPhoto="/images/user1.jpg"
            menus={menus}
            onMenuClick={setActiveMenu}
        >
            {renderContent()}
        </DashboardLayout>
    );
}

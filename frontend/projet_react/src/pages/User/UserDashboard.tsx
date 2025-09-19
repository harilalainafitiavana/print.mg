import { useState } from "react";
import DashboardLayout from "../../Components/DashboardLayout";
import { Home, Folder, Trash, BarChart3, CheckSquare, Settings } from "lucide-react";
import Commande from "../../Components/Commande";
import Setting from "../../Components/Settings";
import Profils from "../../Components/Profils";

export default function UserDashboard() {
    const [activeMenu, setActiveMenu] = useState("home");

    const menus = [
        { id: "home", label: "Dashboard", icon: <Home size={20} /> },
        { id: "orders", label: "Mes Commandes", icon: <Folder size={20} /> },
        { id: "trash", label: "Corbeille", icon: <Trash size={20} /> },
        { id: "stats", label: "Statistiques", icon: <BarChart3 size={20} /> },
        { id: "tasks", label: "Mes Tâches", icon: <CheckSquare size={20} /> },
        { id: "settings", label: "Paramètres", icon: <Settings size={20} /> },
    ];

    const renderContent = () => {
        switch (activeMenu) {
            case "orders":
                return <div> <Commande /> </div>;
            case "tasks":
                return <div>🗓️ Tout les tâches ici...</div>;
            case "trash":
                return <div>🗑️ Historique corbeille ici...</div>;
            case "settings":
                return <div className="p-6"> <Setting /> </div>

            case "notification":
                return <div> Votre notification</div>;

            case "profil":
                return <div className="p-6"> <Profils /> </div>

            default:
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Bienvenue !</h2>
                        <p>Ceci est ton tableau de bord.</p>
                    </div>
                );
        }
    };

    return (
        <DashboardLayout
            userName="Uitlisateur"
            userPhoto="/images/user1.jpg"
            menus={menus}
            onMenuClick={setActiveMenu}
        >
            {renderContent()}
        </DashboardLayout>
    );
}

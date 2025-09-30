import { useState, useEffect } from "react";
import DashboardLayout from "../../Components/DashboardLayout";
import { Home, Folder, Trash, BarChart3, CheckSquare, Settings, Search } from "lucide-react";
import Commande from "./Commande";
import Setting from "../../Components/Settings";
import Profils from "../../Components/Profils";
import Corbeille from "./Corbeille";
import MesCommande from "./Mes_commande";

export default function UserDashboard() {
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
                return <MesCommande onMenuClick={setActiveMenu} searchQuery={query} />;
            case "order":
                return <Commande />;
            case "tasks":
                return <div>🗓️ Toutes les tâches ici...</div>;
            case "trash":
                return <Corbeille onMenuClick={function (): void { throw new Error("Function not implemented."); }} />;
            case "settings":
                return <div className="p-6"><Setting /></div>;
            case "notification":
                return <div>Votre notification</div>;
            case "profil":
                return <div className="p-6"><Profils /></div>;
            default:
                return (
                    <div>
                        <h2 className="text-4xl font-bold mb-4">Bonjour  <span className="text-blue-500">{user?.prenom} ☺️!</span> Bienvenue</h2>
                        <p>Ceci est ton tableau de bord.</p>
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
                        placeholder="Rechercher une commande........."
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


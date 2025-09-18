import { useState } from "react";
import DashboardLayout from "../../Components/DashboardLayout";
import { Home, ShoppingCart, Package, Users, CreditCard, Settings, Trash } from "lucide-react";

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
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6">⚙️ Paramètres</h2>

                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Profil utilisateur */}
                            <div className="border p-6 rounded-xl shadow-sm bg-white">
                                <h3 className="text-lg font-semibold mb-4">Profil utilisateur</h3>
                                <form className="space-y-4">
                                    {/* Photo de profil */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Photo de profil</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Nom */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                        <input
                                            type="text"
                                            placeholder="Votre nom"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Prenom */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Prenom</label>
                                        <input
                                            type="text"
                                            placeholder="Votre prenom"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            placeholder="exemple@email.com"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Téléphone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                        <input
                                            type="tel"
                                            placeholder="+261 ..."
                                            pattern="^\d{10}$"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                    >
                                        Sauvegarder
                                    </button>
                                </form>
                            </div>

                            {/* Préférences */}
                            <div className="border p-6 rounded-xl shadow-sm bg-white">
                                <h3 className="text-lg font-semibold mb-4">Préférences</h3>
                                <form className="space-y-4">
                                    {/* Thème */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Thème</label>
                                        <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                            <option value="light">Clair</option>
                                            <option value="dark">Sombre</option>
                                        </select>
                                    </div>

                                    {/* Langue */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
                                        <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                            <option value="fr">Français</option>
                                            <option value="en">Anglais</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                    >
                                        Sauvegarder
                                    </button>
                                </form>
                            </div>

                            {/* Sécurité */}
                            <div className="border p-6 rounded-xl shadow-sm bg-white lg:col-span-2">
                                <h3 className="text-lg font-semibold mb-4">Sécurité</h3>
                                <form className="space-y-4 lg:w-1/2">
                                    {/* Ancien mot de passe */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ancien mot de passe</label>
                                        <input
                                            type="password"
                                            placeholder="********"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Nouveau mot de passe */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                                        <input
                                            type="password"
                                            placeholder="********"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Confirmation du Nouveau mot de passe */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation du mot de passe</label>
                                        <input
                                            type="password"
                                            placeholder="********"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                    >
                                        Changer le mot de passe
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                );

            case "notification":
                return <div> Votre notification</div>;
            case "profil":
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6">Changer votre profil ici</h2>

                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Profil utilisateur */}
                            <div className="border p-6 rounded-xl shadow-sm bg-white">
                                <h3 className="text-lg font-semibold mb-4">Profil utilisateur</h3>
                                <form className="space-y-4">
                                    {/* Photo de profil */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Photo de profil</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Nom */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                        <input
                                            type="text"
                                            placeholder="Votre nom"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Prenom */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Prenom</label>
                                        <input
                                            type="text"
                                            placeholder="Votre prenom"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            placeholder="exemple@email.com"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Téléphone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                        <input
                                            type="tel"
                                            placeholder="+261 ..."
                                            pattern="^\d{10}$"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                    >
                                        Sauvegarder
                                    </button>
                                </form>
                            </div>

                            {/* Sécurité */}
                            <div className="border p-6 rounded-xl shadow-sm bg-white">
                                <h3 className="text-lg font-semibold mb-4">Sécurité</h3>
                                <form className="space-y-4">
                                    {/* Ancien mot de passe */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ancien mot de passe</label>
                                        <input
                                            type="password"
                                            placeholder="********"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Nouveau mot de passe */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                                        <input
                                            type="password"
                                            placeholder="********"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Confirmation du Nouveau mot de passe */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation du mot de passe</label>
                                        <input
                                            type="password"
                                            placeholder="********"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                    >
                                        Changer le mot de passe
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                );
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

import { LogOut, Settings, Printer, Menu, X, CalendarIcon, ChevronDown, User } from "lucide-react";
import type { JSX } from "react";
import { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import user from "../assets/Utilisateur.png";
import { useNavigate } from "react-router-dom";
import NotificationButton from "./NotificationButton";
import '../calendar.css';
import { useTranslation } from "react-i18next";
import axios from "axios";

interface DashboardLayoutProps {
    children: React.ReactNode;
    userName: string;
    userEmail?: string;
    userPhoto?: string;
    menus: { label: string; icon: JSX.Element; id: string }[];
    onMenuClick: (id: string) => void;
    headerContent?: React.ReactNode;
    sidebarHeader?: React.ReactNode; // Pour le profil utilisateur
}

// Interface pour les données de la sidebar
interface SidebarStats {
    commandesParStatut: { statut: string; count: number }[];
    commandesAujourdhui: number;
    commandesEnAttente: number;
    totalCommandes: number;
}

export default function DashboardLayout({
    children,
    userPhoto,
    userName,
    userEmail,
    menus,
    headerContent,
    sidebarHeader,
    onMenuClick
}: DashboardLayoutProps) {
    const { t } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);
    // 🔹 Ajouter un état pour rôle
    const [userRole, setUserRole] = useState<string | null>(null);

    // 🔹 AJOUTEZ un useEffect POUR RÉCUPÉRER LE RÔLE
    useEffect(() => {
        // Récupérer le rôle depuis le localStorage ou sessionStorage
        const role = localStorage.getItem("role") || sessionStorage.getItem("role");
        setUserRole(role);
        console.log("Rôle utilisateur détecté:", role); // Pour debug
    }, []);

    // États pour la gestion des données réelles
    const [sidebarStats, setSidebarStats] = useState<SidebarStats>({
        commandesParStatut: [],
        commandesAujourdhui: 0,
        commandesEnAttente: 0,
        totalCommandes: 0
    });

    const [loadingSidebar, setLoadingSidebar] = useState(false);
    const [lastFetchTime, setLastFetchTime] = useState(0);
    const CACHE_DURATION = 30000; // 30 secondes de cache

    // Fonction pour récupérer le total des commandes
    const fetchTotalCommandes = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/admin/commandes/count/");
            setSidebarStats(prev => ({
                ...prev,
                totalCommandes: response.data.count
            }));
        } catch (error) {
            console.error("Erreur lors du chargement du total des commandes:", error);
        }
    };

    // Charger les données réelles de la sidebar
    useEffect(() => {
        const fetchSidebarStats = async () => {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            if (!token) return;

            const now = Date.now();
            if (now - lastFetchTime < CACHE_DURATION && sidebarStats.commandesParStatut.length > 0) {
                return;
            }

            try {
                setLoadingSidebar(true);

                // Appel parallèle pour le dashboard et le total des commandes
                const [dashboardResponse, countResponse] = await Promise.all([
                    axios.get("http://localhost:8000/api/admin/dashboard/", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get("http://localhost:8000/api/admin/commandes/count/")
                ]);

                const data = dashboardResponse.data;
                const aujourdhui = new Date().toDateString();
                const commandesAujourdhui = data.dernieres_commandes.filter((cmd: any) =>
                    new Date(cmd.date_commande).toDateString() === aujourdhui
                ).length;

                const commandesEnAttente = data.commandes_par_statut
                    .filter((statut: any) => ['EN_ATTENTE', 'RECU'].includes(statut.statut))
                    .reduce((total: number, statut: any) => total + statut.count, 0);

                setSidebarStats({
                    commandesParStatut: data.commandes_par_statut,
                    commandesAujourdhui: commandesAujourdhui,
                    commandesEnAttente: commandesEnAttente,
                    totalCommandes: countResponse.data.count // ← Utilisez la vraie valeur
                });

                setLastFetchTime(now);

            } catch (error) {
                console.error("Erreur lors du chargement des stats sidebar:", error);
                setSidebarStats({
                    commandesParStatut: [
                        { statut: 'EN_ATTENTE', count: 0 },
                        { statut: 'RECU', count: 0 },
                        { statut: 'EN_COURS_IMPRESSION', count: 0 },
                        { statut: 'TERMINE', count: 0 },
                        { statut: 'LIVREE', count: 0 }
                    ],
                    commandesAujourdhui: 0,
                    commandesEnAttente: 0,
                    totalCommandes: 0
                });
            } finally {
                setLoadingSidebar(false);
            }
        };

        if (isRightSidebarVisible) {
            fetchSidebarStats();
            const interval = setInterval(fetchSidebarStats, 30000);
            return () => clearInterval(interval);
        }
    }, [isRightSidebarVisible, lastFetchTime]);


    // 👇 Fermer le menu quand on clique en dehors
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleRightSidebar = () => {
        setIsRightSidebarVisible(!isRightSidebarVisible);
    };

    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmLogout = window.confirm(t("dashboard.sidebar.confirmLogout"));
        if (!confirmLogout) return;

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");

        navigate("/login");
    };

    // Fonction pour formater les statuts
    const formatStatut = (statut: string) => {
        const statutMap: { [key: string]: string } = {
            'EN_ATTENTE': 'En attente',
            'RECU': 'Reçues',
            'EN_COURS_IMPRESSION': 'En impression',
            'TERMINE': 'Terminées',
            'LIVREE': 'Livrées'
        };
        return statutMap[statut] || statut.replace('_', ' ').toLowerCase();
    };

    return (
        <div className="flex h-screen bg-base-200 text-base-content">
            {/* Overlay pour mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar gauche */}
            <aside className={`fixed md:relative z-30 w-64 bg-base-100 text-base-content flex flex-col transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:flex h-full`}>
                <div className="p-4 font-bold text-2xl flex items-center justify-between">
                    <div className="flex text-violet-600 items-center gap-2">
                        <Printer size={20} />
                        {t("dashboard.sidebar.title")}
                    </div>
                    <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                {/* ⚠️ AJOUTEZ ICI LA SECTION PROFIL ⚠️ */}
                {userRole === 'USER' && (
                    sidebarHeader ? (
                        <div className="sidebar-header-section">
                            {sidebarHeader}
                        </div>
                    ) : (
                        // Version par défaut pour USER si sidebarHeader n'est pas fourni
                        <div className="p-4 border-b border-base-300 bg-gradient-to-r from-violet-50 to-indigo-50">
                            <div className="flex items-center space-x-3">
                                <img
                                    src={userPhoto}
                                    alt="Profil"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white"
                                    // onError={(e) => {
                                    //     e.currentTarget.src = user;
                                    // }}
                                    onError={(e) => {
                                        e.currentTarget.src = '../../assets/logo.png';
                                    }}
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                                        {/* {userName} */}
                                    </h3>
                                    <p className="text-xs text-gray-500 truncate">Utilisateur</p>
                                </div>
                            </div>
                        </div>
                    )
                )}

                <nav className="flex-1 px-2 space-y-2">
                    {menus.map((menu) => (
                        <button
                            key={menu.id}
                            onClick={() => {
                                onMenuClick(menu.id);
                                if (windowWidth < 768) setIsSidebarOpen(false);
                            }}
                            className="flex items-center text-base-content hover:text-white space-x-3 w-full px-3 py-4 rounded-lg hover:bg-violet-400 hover:font-bold"
                        >
                            <span className="text-violet-800 font-bold">{menu.icon}</span>
                            <span>{t(menu.label)}</span>
                        </button>
                    ))}
                </nav>
                <button
                    className="flex items-center text-base-content space-x-3 px-3 py-2 hover:bg-violet-500 hover:text-white hover:font-bold mb-4"
                    onClick={handleLogout}
                >
                    <LogOut size={20} /> <span>{t("dashboard.sidebar.logout")}</span>
                </button>
            </aside>

            {/* Contenu principal */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="flex justify-between items-center bg-base-100 px-4 md:px-6 py-4 shadow text-base-content">
                    <div className="flex items-center">
                        <button
                            className="mr-4 text-base-content md:hidden"
                            onClick={toggleSidebar}
                        >
                            <Menu size={24} />
                        </button>

                        {/* Barre de recherche */}
                        {headerContent && <div>{headerContent}</div>}
                    </div>

                    {/* Zone utilisateur */}
                    <div className="flex items-center space-x-4 md:space-x-6">
                        {/* Bouton toggle sidebar droite seulement sur desktop */}
                        {windowWidth >= 1024 && (
                            <button
                                onClick={toggleRightSidebar}
                                aria-label="Toggle calendar"
                                className={`
                                    relative flex items-center justify-center 
                                    w-10 h-10 rounded-full 
                                    transition-all duration-300 
                                    ${isRightSidebarVisible ? 'bg-base-200 text-base-content shadow-lg' : 'bg-base-200 text-base-content hover:bg-violet-400 hover:text-white'}
                                `}
                            >
                                <CalendarIcon size={20} />
                                {/* Petit point animé pour attirer l'attention */}
                                {!isRightSidebarVisible && (
                                    <span className="absolute top-0 right-0 block w-2 h-2 bg-red-400 rounded-full animate-ping"></span>
                                )}
                            </button>
                        )}

                        <NotificationButton onClick={() => onMenuClick("notification")} />
                        <button
                            className="text-base-content hover:text-white hover:bg-violet-400 p-2 rounded-full"
                            onClick={() => onMenuClick("settings")}
                        >
                            <Settings size={22} />
                        </button>
                        <div ref={dropdownRef} className="relative">
                            {/* Avatar bouton amélioré */}
                            <button
                                onClick={() => setOpen(!open)}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-base-200 transition-all duration-200 group"
                            >
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
                                        <img
                                            src={userPhoto && userPhoto.trim() !== "" ? userPhoto : user}
                                            onError={(e) => (e.currentTarget.src = user)}
                                            alt="Profil utilisateur"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>

                                <div className="hidden lg:block text-left">
                                    <p className="text-sm font-semibold text-base-content">
                                        {userName || "Utilisateur"}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                        {/* Maintenant userEmail est disponible depuis les props */}
                                        {userEmail || "utilisateur@email.com"}
                                    </p>
                                </div>

                                <ChevronDown
                                    size={16}
                                    className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {/* Menu déroulant amélioré */}
                            {open && (
                                <div className="absolute right-0 mt-2 w-64 bg-base-100 rounded-xl shadow-xl border border-base-300 z-50 overflow-hidden">
                                    {/* En-tête du menu avec infos utilisateur */}
                                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-base-300">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-full overflow-hidden border-3 border-white shadow">
                                                    <img
                                                        src={userPhoto && userPhoto.trim() !== "" ? userPhoto : user}
                                                        alt="Profil"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 truncate">
                                                    {userName || "Utilisateur"}
                                                </h3>
                                                <p className="text-sm text-gray-600 truncate">
                                                    {userEmail || "utilisateur@email.com"}
                                                </p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                                        {userRole === 'USER' ? 'Utilisateur' : 'Administrateur'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Options du menu */}
                                    <div className="py-2">
                                        <ul className="text-base-content">
                                            <li>
                                                <button
                                                    onClick={() => {
                                                        onMenuClick("profil");
                                                        setOpen(false);
                                                    }}
                                                    className="flex items-center w-full px-4 py-3 text-left hover:bg-base-100 transition-colors duration-150 group"
                                                >
                                                    <div className="mr-3 p-2 rounded-lg bg-violet-50 group-hover:bg-violet-100 transition-colors">
                                                        <User size={18} className="text-violet-600" />
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">{t("dashboard.menus.profil")}</span>
                                                        <p className="text-xs text-gray-500 mt-0.5">{t("dashboard.menus.gerer")}</p>
                                                    </div>
                                                </button>
                                            </li>

                                            <li>
                                                <button
                                                    onClick={() => {
                                                        onMenuClick("settings");
                                                        setOpen(false);
                                                    }}
                                                    className="flex items-center w-full px-4 py-3 text-left hover:bg-base-100 transition-colors duration-150 group"
                                                >
                                                    <div className="mr-3 p-2 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors">
                                                        <Settings size={18} className="text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">{t("dashboard.menus.settings")}</span>
                                                        <p className="text-xs text-gray-500 mt-0.5">{t("dashboard.menus.preferred")}</p>
                                                    </div>
                                                </button>
                                            </li>

                                            <div className="my-2 border-t border-base-300"></div>

                                            <li>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center w-full px-4 py-3 text-left hover:bg-red-50 text-red-600 transition-colors duration-150 group"
                                                >
                                                    <div className="mr-3 p-2 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors">
                                                        <LogOut size={18} className="text-red-600" />
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">{t("dashboard.sidebar.logout")}</span>
                                                        <p className="text-xs text-red-500 mt-0.5">{t("dashboard.sidebar.logout")}</p>
                                                    </div>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="px-4 py-3 bg-base-100 border-t border-base-300">
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>{t("dashboard.sidebar.dernière")}</span>
                                            <span className="font-medium">
                                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Zone de contenu */}
                <div className="flex flex-1 overflow-hidden"> {/* Changé de overflow-y-auto à overflow-hidden */}
                    {/* Contenu dynamique - Scrollable */}
                    <div className={`flex-1 p-4 md:p-6 bg-base-200 min-w-0 transition-all duration-300 ${isRightSidebarVisible && windowWidth >= 1024 ? 'lg:mr-0' : 'mr-0'} overflow-y-auto`}> {/* Ajout de overflow-y-auto */}
                        {children}
                    </div>

                    {/* Sidebar droite - Fixe */}
                    {isRightSidebarVisible && windowWidth >= 1024 && (
                        <aside className="w-80 bg-base-100 border-l border-base-300 shadow-sm flex flex-col">
                            {/* Header fixe */}
                            <div className="p-4 border-b border-base-300 flex-shrink-0">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">{t("dashboard.header.calendar")}</h3>
                                </div>
                            </div>

                            {/* Contenu scrollable de la sidebar */}
                            <div className="flex-1 overflow-y-auto p-4">
                                {/* Graphique des commandes par statut */}
                                <div className="mb-6">
                                    <h4 className="font-semibold text-sm mb-3 text-base-content">{t("dashboard.header.statut")}</h4>
                                    <div className="bg-base-200 p-4 rounded-lg border">
                                        {loadingSidebar ? (
                                            <div className="flex justify-center items-center h-20">
                                                <div className="loading loading-spinner loading-md text-blue-500"></div>
                                                <span className="ml-2 text-sm text-gray-600">{t("dashboard.sidebar.loading")}</span>
                                            </div>
                                        ) : (
                                            <>
                                                {/* Graphique en barres horizontales */}
                                                <div className="space-y-3">
                                                    {sidebarStats.commandesParStatut.map((statut, index) => {
                                                        const maxCount = Math.max(...sidebarStats.commandesParStatut.map(s => s.count));
                                                        const percentage = maxCount > 0 ? (statut.count / maxCount) * 100 : 0;
                                                        const colors = ['bg-yellow-500', 'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-emerald-500'];

                                                        return (
                                                            <div key={statut.statut} className="space-y-1">
                                                                <div className="flex justify-between text-xs">
                                                                    <span className="font-medium">
                                                                        {formatStatut(statut.statut)}
                                                                    </span>
                                                                    <span className="text-gray-600">{statut.count} cmd</span>
                                                                </div>
                                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                                    <div
                                                                        className={`${colors[index % colors.length]} h-2 rounded-full transition-all duration-500`}
                                                                        style={{ width: `${percentage}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Résumé du jour */}
                                                <div className="mt-4 pt-3 border-t border-gray-200 space-y-2">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-base-content">{t("dashboard.header.commande")}:</span>
                                                        <span className="font-semibold text-blue-600">
                                                            {sidebarStats.commandesAujourdhui}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-base-content">{t("dashboard.header.total")}:</span>
                                                        <span className="font-semibold text-green-600">
                                                            {sidebarStats.totalCommandes}
                                                        </span>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Calendrier */}
                                <div className="mb-6">
                                    <h4 className="font-semibold text-sm mb-3 text-base-content">{t("dashboard.header.calendar")}</h4>
                                    <div className="border rounded-lg p-2 bg-base-200">
                                        <Calendar
                                            value={new Date()}
                                            view="month"
                                            selectRange={false}
                                            showNeighboringMonth={true}
                                            onClickDay={() => { }}
                                            className="w-full rounded-lg"
                                            tileClassName={({ date }) => {
                                                const isToday = date.toDateString() === new Date().toDateString();
                                                return `
                                    p-2 rounded-md
                                    ${isToday ? 'bg-primary text-primary-content font-bold' : ''}
                                `;
                                            }}
                                        />
                                    </div>
                                </div>


                                {/* Formats populaires */}
                                <div className="mb-6">
                                    <h4 className="font-semibold text-sm mb-3 text-base-content">{t("dashboard.header.format")}</h4>
                                    <div className="space-y-2">
                                        {[
                                            { format: 'A4', count: 45, color: 'bg-blue-500' },
                                            { format: 'A3', count: 23, color: 'bg-green-500' },
                                            { format: 'A5', count: 18, color: 'bg-yellow-500' },
                                            { format: 'Grand format', count: 12, color: 'bg-purple-500' },
                                        ].map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 bg-base-200 rounded-lg">
                                                <div className="flex items-center">
                                                    <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
                                                    <span className="text-sm">{item.format}</span>
                                                </div>
                                                <span className="text-xs bg-base-300 px-2 py-1 rounded-full">
                                                    {item.count}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </aside>
                    )}
                </div>
            </main>
        </div>
    );
}
import { LogOut, Bell, Settings, Printer, Menu, X, CalendarIcon } from "lucide-react";
import type { JSX } from "react";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import user from "../assets/Utilisateur.png";
import { useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
    children: React.ReactNode;
    userName: string;
    userPhoto?: string;
    menus: { label: string; icon: JSX.Element; id: string }[];
    onMenuClick: (id: string) => void;
}

export default function DashboardLayout({ children, userPhoto, menus, onMenuClick }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

    // Sur desktop ET mobile : sidebar droite cachée par défaut
    const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            setWindowWidth(window.innerWidth);

            if (window.innerWidth >= 768 && isSidebarOpen) {
                setIsSidebarOpen(false);
            }


            if (window.innerWidth < 1024) {
                setIsRightSidebarVisible(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isSidebarOpen]);


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleRightSidebar = () => {
        setIsRightSidebarVisible(!isRightSidebarVisible);
    };

    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmLogout = window.confirm("Voulez-vous vraiment vous déconnecter ?");
        if (!confirmLogout) return; // annuler si l'utilisateur clique sur "Annuler
        
        // Supprimer le token et le rôle
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");

        // Rediriger vers login
        navigate("/login");
    };
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Overlay pour mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar gauche */}
            <aside className={`fixed md:relative z-30 w-64 bg-white text-blue-500 flex flex-col transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:flex h-full`}>
                <div className="p-4 font-bold text-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Printer size={20} />
                        Print.mg
                    </div>
                    <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>
                <nav className="flex-1 px-2 space-y-2">
                    {menus.map((menu) => (
                        <button
                            key={menu.id}
                            onClick={() => {
                                onMenuClick(menu.id);
                                if (windowWidth < 768) setIsSidebarOpen(false);
                            }}
                            className="flex items-center text-black hover:text-white space-x-3 w-full px-3 py-4 rounded-lg hover:bg-blue-400 hover:font-bold"
                        >
                            <span className="text-red-500 font-bold">{menu.icon}</span>
                            <span>{menu.label}</span>
                        </button>
                    ))}
                </nav>
                <button
                    className="flex items-center text-black space-x-3 px-3 py-2 hover:bg-blue-400 hover:text-white hover:font-bold mb-4"
                    onClick={handleLogout}
                >
                    <LogOut size={20} /> <span>Déconnexion</span>
                </button>
            </aside>

            {/* Contenu principal */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="flex justify-between items-center bg-white px-4 md:px-6 py-4 shadow">
                    <div className="flex items-center">
                        <button
                            className="mr-4 text-gray-600 md:hidden"
                            onClick={toggleSidebar}
                        >
                            <Menu size={24} />
                        </button>

                        {/* Barre de recherche */}
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="w-32 sm:w-48 md:w-64 lg:w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
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
                                        ${isRightSidebarVisible ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-200 text-gray-600 hover:bg-blue-400 hover:text-white'}
                                    `}
                            >
                                <CalendarIcon size={20} />
                                {/* Petit point animé pour attirer l'attention */}
                                {!isRightSidebarVisible && (
                                    <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                                )}
                            </button>
                        )}

                        <button
                            className="text-gray-600 hover:text-blue-500"
                            onClick={() => onMenuClick("notification")}
                        >
                            <Bell size={22} />
                        </button>
                        <button
                            className="text-gray-600 hover:text-blue-500"
                            onClick={() => onMenuClick("settings")}
                        >
                            <Settings size={22} />
                        </button>
                        <button
                            onClick={() =>
                                onMenuClick("profil")
                            }
                            className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-500 transition-all"
                        >

                            <button
                                onClick={() => onMenuClick("profil")}
                                className="w-10 h-15 rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-500 transition-all"
                            >
                                <img
                                    src={userPhoto && userPhoto.trim() !== "" ? userPhoto : user}
                                    onError={(e) => (e.currentTarget.src = user)} // fallback si image cassée
                                    alt="Profil utilisateur"
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        </button>
                    </div>
                </header>

                {/* Zone de contenu */}
                <div className="flex flex-1 overflow-y-auto">
                    {/* Contenu dynamique */}
                    <div className={`flex-1 p-4 md:p-6 bg-gray-50 min-w-100 transition-all duration-300 ${isRightSidebarVisible && windowWidth >= 1024 ? 'lg:mr-0' : 'mr-0'}`}>
                        {children}
                    </div>

                    {/* Sidebar droite */}
                    {isRightSidebarVisible && windowWidth >= 1024 && (
                        <aside className="w-80 bg-white p-4 border-l shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Calendrier</h3>
                            </div>
                            <div className="border rounded-lg p-2 bg-gray-50">
                                <Calendar
                                    value={new Date()}
                                    view="month"
                                    selectRange={false}
                                    showNeighboringMonth={true}
                                    onClickDay={() => { }}
                                    className="w-full border-none text-gray-700"
                                    tileClassName={({ date }) =>
                                        `p-2 hover:bg-blue-100 rounded-md ${date.getDate() === new Date().getDate() ? 'bg-blue-200 font-bold' : ''}`
                                    }
                                />
                            </div>
                        </aside>
                    )}
                </div>
            </main>
        </div>
    );
}

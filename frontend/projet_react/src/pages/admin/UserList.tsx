import { useState, useEffect } from "react";
import { Eye, Users, Search, ChevronLeft, ChevronRight, Mail, Phone, MapPin, User, Calendar, Globe, Hash, X, Camera } from "lucide-react";
import { authFetch } from "../../Components/Utils";
import { useTranslation } from "react-i18next";
import { getAvatarUrl } from "../../Components/avatarUtils";
import API_BASE_URL from "../../services/api";

interface User {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    num_tel?: string;
    code_postal: string;
    ville: string;
    pays: string;
    role?: string;
    profils?: string | null;
    google_avatar_url?: string;
    date_inscription: string;
}

const AdminUsersDashboard = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false); // Nouvel état pour la modal photo
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const usersPerPage = 10;

    // 🔹 Charger les utilisateurs depuis l'API Django
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await authFetch(`${API_BASE_URL}/api/users/`);

                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    console.error("Erreur lors du chargement des utilisateurs :", response.statusText);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des utilisateurs :", error);
            }
        };
        fetchUsers();
    }, []);

    const openModal = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };

    // 🔹 Fonctions pour la modal photo
    const openPhotoModal = (user: User) => {
        setSelectedUser(user);
        setIsPhotoModalOpen(true);
    };

    const closePhotoModal = () => {
        setIsPhotoModalOpen(false);
    };

    const handlePhotoModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    // 🔹 Gestion de la touche Escape pour fermer les modals
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isPhotoModalOpen) {
                    closePhotoModal();
                } else if (isModalOpen) {
                    closeModal();
                }
            }
        };

        if (isModalOpen || isPhotoModalOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen, isPhotoModalOpen]);

    // 🔹 Filtrer selon la recherche
    const filteredUsers = users.filter((user) =>
        user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 🔹 Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="p-4 md:p-6 bg-base-200 min-h-screen">
            {/* En-tête */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <Users className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-base-content">{t("usersadmin.title") || "Gestion des Utilisateurs"}</h1>
                        <p className="text-base-content/70 mt-1">
                            {filteredUsers.length} {filteredUsers.length === 1 ? "utilisateur inscrit" : "utilisateurs inscrits"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Carte de contrôle */}
            <div className="bg-base-100 rounded-2xl shadow-lg p-5 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Statistiques */}
                    <div className="flex flex-wrap gap-4">
                        <div className="px-4 py-3 bg-primary/10 rounded-xl">
                            <p className="text-2xl font-bold text-primary">{filteredUsers.length}</p>
                            <p className="text-sm text-base-content/70">Utilisateurs</p>
                        </div>
                        <div className="px-4 py-3 bg-success/10 rounded-xl">
                            <p className="text-2xl font-bold text-success">
                                {users.filter(u => u.role === 'ADMIN').length}
                            </p>
                            <p className="text-sm text-base-content/70">Administrateurs</p>
                        </div>
                    </div>

                    {/* Barre de recherche */}
                    <div className="relative w-full md:w-auto">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-base-content/50" />
                        </div>
                        <input
                            type="text"
                            placeholder={t("usersadmin.search") || "Rechercher un utilisateur..."}
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-10 pr-4 py-3 w-full md:w-80 border border-base-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 bg-base-100"
                        />
                    </div>
                </div>
            </div>

            {/* Tableau des utilisateurs */}
            <div className="bg-base-100 rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-base-300">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        {t("usersadmin.name") || "Nom"}
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">
                                    {t("usersadmin.firstname") || "Prénom"}
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        {t("usersadmin.email") || "Email"}
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {t("usersadmin.registrationDate") || "Inscription"}
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-base-content">
                                    {t("usersadmin.action") || "Actions"}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-base-300">
                            {currentUsers.map((user) => (
                                <tr 
                                    key={user.id} 
                                    className="hover:bg-base-200 transition-colors duration-200"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {/* Photo de profil cliquable */}
                                            <div 
                                                className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                                                onClick={() => openPhotoModal(user)}
                                            >
                                                {(() => {
                                                    const avatarUrl = getAvatarUrl(user);
                                                    if (avatarUrl) {
                                                        return (
                                                            <img
                                                                src={avatarUrl.replace(/s\d+-c$/, 's100-c')}
                                                                alt={`${user.prenom} ${user.nom}`}
                                                                className="w-full h-full object-cover"
                                                                crossOrigin="anonymous"
                                                                referrerPolicy="no-referrer"
                                                                onError={(e) => {
                                                                    const parent = e.currentTarget.parentNode as HTMLElement;
                                                                    parent.className = 'w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center';
                                                                    e.currentTarget.style.display = 'none';
                                                                }}
                                                            />
                                                        );
                                                    }
                                                    return (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <User className="w-5 h-5 text-primary" />
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-base-content">{user.nom}</p>
                                                {user.role === 'ADMIN' && (
                                                    <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                                                        Admin
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-base-content">{user.prenom}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-base-content/60" />
                                            <p className="text-base-content">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-base-content/60" />
                                            <span className="text-sm text-base-content/80">
                                                {new Date(user.date_inscription).toLocaleDateString("fr-FR")}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => openModal(user)}
                                                className="btn btn-primary btn-sm btn-outline gap-2 hover:scale-105 transition-transform"
                                            >
                                                <Eye size={16} />
                                                {t("usersadmin.view") || "Voir"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Message si aucun utilisateur */}
                {currentUsers.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
                        <h3 className="text-lg font-medium text-base-content mb-2">Aucun utilisateur trouvé</h3>
                        <p className="text-base-content/60">
                            {searchTerm ? "Essayez une autre recherche" : "Aucun utilisateur n'est inscrit"}
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {filteredUsers.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                    <div className="text-sm text-base-content/70">
                        Affichage de {indexOfFirstUser + 1} à {Math.min(indexOfLastUser, filteredUsers.length)} sur {filteredUsers.length} utilisateurs
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                            className="btn btn-ghost btn-sm gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={16} />
                            {t("usersadmin.previous") || "Précédent"}
                        </button>
                        
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }
                                
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                            currentPage === pageNum
                                                ? 'bg-primary text-white'
                                                : 'hover:bg-base-300 text-base-content'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        
                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className="btn btn-ghost btn-sm gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t("usersadmin.next") || "Suivant"}
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de détails utilisateur */}
            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-base-100 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal-in">
                        <div className="p-6">
                            {/* En-tête du modal */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    {/* Photo de profil cliquable */}
                                    <div 
                                        className="relative group w-20 h-20 rounded-full overflow-hidden border-4 border-primary/20 cursor-pointer hover:border-primary/40 transition-all duration-300"
                                        onClick={() => {
                                            closeModal();
                                            openPhotoModal(selectedUser);
                                        }}
                                    >
                                        {(() => {
                                            const avatarUrl = getAvatarUrl(selectedUser);
                                            if (avatarUrl) {
                                                return (
                                                    <img
                                                        src={avatarUrl.replace(/s\d+-c$/, 's200-c')}
                                                        alt={`${selectedUser.prenom} ${selectedUser.nom}`}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                        crossOrigin="anonymous"
                                                        referrerPolicy="no-referrer"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                        }}
                                                    />
                                                );
                                            }
                                            return (
                                                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-gray-400">
                                                    <User size={32} />
                                                </div>
                                            );
                                        })()}
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                            <Camera size={24} className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-base-content">
                                            {selectedUser.prenom} {selectedUser.nom}
                                        </h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                selectedUser.role === 'ADMIN' 
                                                    ? 'bg-primary/20 text-primary' 
                                                    : 'bg-base-300 text-base-content/70'
                                            }`}>
                                                {selectedUser.role || 'UTILISATEUR'}
                                            </span>
                                            <span className="text-sm text-base-content/60">
                                                ID: {selectedUser.id}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="btn btn-ghost btn-sm btn-circle hover:bg-base-300"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Grille d'informations */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Informations personnelles */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg text-base-content border-b pb-2">
                                        Informations personnelles
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-base-200 rounded-lg">
                                                <Mail className="w-5 h-5 text-base-content/60" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-base-content/60">Email</p>
                                                <p className="font-medium">{selectedUser.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-base-200 rounded-lg">
                                                <Phone className="w-5 h-5 text-base-content/60" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-base-content/60">Téléphone</p>
                                                <p className="font-medium">{selectedUser.num_tel || "Non renseigné"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Adresse */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg text-base-content border-b pb-2">
                                        Adresse
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-base-200 rounded-lg">
                                                <MapPin className="w-5 h-5 text-base-content/60" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-base-content/60">Ville</p>
                                                <p className="font-medium">{selectedUser.ville}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-base-200 rounded-lg">
                                                <Hash className="w-5 h-5 text-base-content/60" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-base-content/60">Code postal</p>
                                                <p className="font-medium">{selectedUser.code_postal}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-base-200 rounded-lg">
                                                <Globe className="w-5 h-5 text-base-content/60" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-base-content/60">Pays</p>
                                                <p className="font-medium">{selectedUser.pays}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Inscription */}
                            <div className="mt-6 pt-6 border-t border-base-300">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-base-200 rounded-lg">
                                        <Calendar className="w-5 h-5 text-base-content/60" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-base-content/60">Date d'inscription</p>
                                        <p className="font-medium">
                                            {new Date(selectedUser.date_inscription).toLocaleString("fr-FR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex gap-3 mt-8 pt-6 border-t border-base-300">
                                <button
                                    onClick={closeModal}
                                    className="btn btn-ghost flex-1"
                                >
                                    Fermer
                                </button>
                                <a
                                    href={`mailto:${selectedUser.email}`}
                                    className="btn btn-primary flex-1 gap-2"
                                >
                                    <Mail size={16} />
                                    Envoyer un email
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal pour afficher la photo en grand */}
            {isPhotoModalOpen && selectedUser && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
                    onClick={closePhotoModal}
                >
                    <div 
                        className="relative bg-base-100 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                        onClick={handlePhotoModalClick}
                    >
                        <button
                            onClick={closePhotoModal}
                            className="absolute top-4 right-4 z-50 bg-base-100 hover:bg-base-200 rounded-full p-2 transition-colors shadow-lg"
                            aria-label="Fermer"
                        >
                            <X size={28} />
                        </button>
                        
                        <div className="p-6 md:p-8 flex flex-col items-center">
                            {/* Image en grand */}
                            <div className="w-full max-w-2xl">
                                {(() => {
                                    const avatarUrl = getAvatarUrl(selectedUser);
                                    if (avatarUrl) {
                                        return (
                                            <img
                                                src={avatarUrl.replace(/s\d+-c$/, 's800-c')}
                                                alt={`Photo de ${selectedUser.prenom} ${selectedUser.nom}`}
                                                className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-xl"
                                                crossOrigin="anonymous"
                                                referrerPolicy="no-referrer"
                                                onError={(e) => {
                                                    console.error("Erreur chargement image en modal:", avatarUrl);
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        );
                                    }
                                    return (
                                        <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-indigo-100 flex flex-col items-center justify-center text-gray-400 rounded-lg">
                                            <User size={120} />
                                            <p className="mt-4 text-lg">Aucune photo de profil</p>
                                        </div>
                                    );
                                })()}
                            </div>
                            
                            {/* Informations utilisateur */}
                            <div className="mt-8 text-center">
                                <h3 className="text-2xl font-bold text-base-content">
                                    {selectedUser.prenom} {selectedUser.nom}
                                </h3>
                                <div className="flex flex-wrap gap-2 justify-center mt-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        selectedUser.role === 'ADMIN' 
                                            ? 'bg-primary/20 text-primary' 
                                            : 'bg-base-300 text-base-content/70'
                                    }`}>
                                        {selectedUser.role || 'UTILISATEUR'}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-base-300 text-base-content/70">
                                        ID: {selectedUser.id}
                                    </span>
                                </div>
                                <p className="text-base-content/70 mt-4">{selectedUser.email}</p>
                                
                                {/* Boutons d'action */}
                                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                                    <a
                                        href={`mailto:${selectedUser.email}`}
                                        className="btn btn-primary gap-2"
                                    >
                                        <Mail size={18} />
                                        Envoyer un email
                                    </a>
                                    
                                    {(() => {
                                        const avatarUrl = getAvatarUrl(selectedUser);
                                        if (avatarUrl) {
                                            return (
                                                <button
                                                    onClick={() => {
                                                        const link = document.createElement('a');
                                                        link.href = avatarUrl.replace(/s\d+-c$/, 's800-c');
                                                        link.download = `photo-${selectedUser.prenom}-${selectedUser.nom}.jpg`;
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                    }}
                                                    className="btn btn-outline gap-2"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                    Télécharger
                                                </button>
                                            );
                                        }
                                        return null;
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Styles d'animation */}
            <style>{`
                @keyframes modal-in {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                .animate-modal-in {
                    animation: modal-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default AdminUsersDashboard;
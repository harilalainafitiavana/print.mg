import { useEffect, useState } from "react";
import { authFetch } from "../../Components/Utils";
import {
    User, Calendar, X, Check, Trash, Eye,
    Bell, Send, Mail, Search, Filter, Clock,
    MessageSquare, AlertCircle, ChevronDown, RefreshCw, Users, Inbox
} from "lucide-react";
import { useTranslation } from "react-i18next";
import API_BASE_URL from "../../services/api";

type NotificationType = {
    id: number;
    message: string;
    created_at: string;
    sender_info: {
        id: number;
        nom: string;
        prenom: string;
        email: string;
    } | null;
    recipient_info: {
        id: number;
        nom: string;
        prenom: string;
        email: string;
    } | null;
    is_read?: boolean;
};

// Clé pour le localStorage
const LOCAL_STORAGE_KEY = 'admin_read_notifications';

export default function AdminUserNotifications() {
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showSendModal, setShowSendModal] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<NotificationType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
    const [notifyMessage, setNotifyMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error">("success");
    const [readNotifications, setReadNotifications] = useState<Set<number>>(new Set());

    // Charger les notifications marquées comme lues depuis localStorage
    useEffect(() => {
        const savedReadNotifications = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedReadNotifications) {
            try {
                const parsed = JSON.parse(savedReadNotifications);
                setReadNotifications(new Set(parsed));
            } catch (error) {
                console.error("Erreur lors du chargement des notifications lues:", error);
                // Réinitialiser si le format est invalide
                localStorage.removeItem(LOCAL_STORAGE_KEY);
            }
        }
    }, []);

    // Sauvegarder dans localStorage quand readNotifications change
    useEffect(() => {
        if (readNotifications.size > 0) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(readNotifications)));
        }
    }, [readNotifications]);

    // Récupérer notifications depuis l'API
    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const res = await authFetch(`${API_BASE_URL}/api/notifications-admin/`);
            const data = await res.json();

            // Combiner les données de l'API avec l'état lu depuis localStorage
            const enhancedData = data.map((notif: NotificationType) => ({
                ...notif,
                // Marquer comme lu si présent dans readNotifications OU si déjà lu dans l'API
                is_read: notif.is_read || readNotifications.has(notif.id)
            }));

            setNotifications(enhancedData);
            showNotificationToast(`${data.length} notifications chargées`, "success");
        } catch (err) {
            console.error("Erreur:", err);
            showNotificationToast("Erreur lors du chargement", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const showNotificationToast = (message: string, type: "success" | "error" = "success") => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    // Marquer une notification comme lue
    const markAsRead = (notification: NotificationType) => {
        try {
            // Ajouter à l'ensemble des notifications lues
            setReadNotifications(prev => {
                const newSet = new Set(prev);
                newSet.add(notification.id);
                return newSet;
            });

            // Mettre à jour l'état local
            setNotifications(prev => prev.map(n =>
                n.id === notification.id ? { ...n, is_read: true } : n
            ));

            showNotificationToast("Marqué comme lu", "success");
        } catch (err) {
            console.error(err);
            showNotificationToast("Erreur", "error");
        }
    };

    // Marquer une notification comme non lue
    const markAsUnread = (notification: NotificationType) => {
        try {
            // Retirer de l'ensemble des notifications lues
            setReadNotifications(prev => {
                const newSet = new Set(prev);
                newSet.delete(notification.id);
                return newSet;
            });

            // Mettre à jour l'état local
            setNotifications(prev => prev.map(n =>
                n.id === notification.id ? { ...n, is_read: false } : n
            ));

            showNotificationToast("Marqué comme non lu", "success");
        } catch (err) {
            console.error(err);
            showNotificationToast("Erreur", "error");
        }
    };

    // Marquer toutes les notifications comme lues
    const markAllAsRead = () => {
        try {
            // Ajouter toutes les notifications visibles à l'ensemble
            const newReadNotifications = new Set(readNotifications);
            filteredNotifications.forEach(notif => {
                newReadNotifications.add(notif.id);
            });

            setReadNotifications(newReadNotifications);

            // Mettre à jour l'état local pour toutes les notifications
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

            showNotificationToast(`Toutes les notifications marquées comme lues`, "success");
        } catch (err) {
            console.error(err);
            showNotificationToast("Erreur", "error");
        }
    };

    // Filtrer les notifications
    const filteredNotifications = notifications.filter(notif => {
        // Filtre par statut
        const statusMatch = filter === "all" ||
            (filter === "unread" && !notif.is_read) ||
            (filter === "read" && notif.is_read);

        // Filtre par recherche
        const searchMatch = !searchTerm ||
            notif.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (notif.sender_info?.email && notif.sender_info.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (notif.sender_info?.nom && notif.sender_info.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (notif.sender_info?.prenom && notif.sender_info.prenom.toLowerCase().includes(searchTerm.toLowerCase()));

        return statusMatch && searchMatch;
    });

    // Pagination
    const totalPages = Math.ceil(filteredNotifications.length / pageSize);
    const paginatedNotifications = filteredNotifications.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Formater la date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) {
            return `Il y a ${diffMins} min`;
        } else if (diffHours < 24) {
            return `Il y a ${diffHours} h`;
        } else if (diffDays < 7) {
            return `Il y a ${diffDays} j`;
        } else {
            return date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        }
    };

    const handleView = (notification: NotificationType) => {
        setSelectedNotification(notification);
        setShowViewModal(true);

        // Marquer automatiquement comme lu quand on visualise
        if (!notification.is_read) {
            markAsRead(notification);
        }
    };

    const handleDeleteClick = (notification: NotificationType) => {
        setSelectedNotification(notification);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedNotification) return;

        setIsLoading(true);
        try {
            const res = await authFetch(
                `${API_BASE_URL}/api/notifications/delete/${selectedNotification.id}/`,
                { method: "POST" }
            );

            if (res.ok) {
                // Supprimer aussi de l'ensemble des notifications lues
                setReadNotifications(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(selectedNotification.id);
                    return newSet;
                });

                setNotifications(prev => prev.filter(n => n.id !== selectedNotification.id));
                showNotificationToast("Notification supprimée", "success");
            } else {
                showNotificationToast("Erreur lors de la suppression", "error");
            }
        } catch (err) {
            console.error(err);
            showNotificationToast("Erreur réseau", "error");
        } finally {
            setIsLoading(false);
            setShowDeleteModal(false);
            setSelectedNotification(null);
        }
    };

    // Envoyer une notification
    const handleSendClick = (notification: NotificationType) => {
        setSelectedNotification(notification);
        setShowSendModal(true);
    };

    const sendNotification = async () => {
        if (!notifyMessage.trim() || !selectedNotification) {
            showNotificationToast("Veuillez écrire un message", "error");
            return;
        }

        setIsLoading(true);
        try {
            const res = await authFetch(`${API_BASE_URL}/api/send-notification/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_email: selectedNotification.sender_info?.email,
                    message: notifyMessage,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Erreur lors de l'envoi");
            }

            showNotificationToast("Notification envoyée avec succès !", "success");
            setNotifyMessage("");
            setShowSendModal(false);
            setSelectedNotification(null);

        } catch (err: any) {
            console.error("Erreur:", err);
            showNotificationToast(err.message || "Impossible d'envoyer la notification", "error");
        } finally {
            setIsLoading(false);
        }
    };

    // Fonction pour réinitialiser toutes les lectures
    const resetAllReadStatus = () => {
        if (window.confirm("Êtes-vous sûr de vouloir réinitialiser toutes les notifications marquées comme lues ?")) {
            setReadNotifications(new Set());
            localStorage.removeItem(LOCAL_STORAGE_KEY);

            // Réinitialiser aussi l'état local
            setNotifications(prev => prev.map(n => ({ ...n, is_read: false })));

            showNotificationToast("Toutes les notifications réinitialisées", "success");
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header avec statistiques */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-base-content mb-2 flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-2xl shadow-lg">
                                <Bell size={28} className="text-white" />
                            </div>
                            <span>Notifications Administrateur</span>
                        </h1>
                        <p className="text-base-content/70">Gérez les notifications des utilisateurs</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={markAllAsRead}
                            disabled={filteredNotifications.length === 0 || filteredNotifications.every(n => n.is_read)}
                            className="flex items-center gap-2 px-4 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Check size={18} />
                            <span className="font-medium">Tout marquer comme lu</span>
                        </button>

                        <button
                            onClick={fetchNotifications}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-3 bg-base-200 text-base-content rounded-xl hover:bg-base-300 transition-all duration-200 shadow-sm"
                        >
                            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                            <span className="font-medium">Actualiser</span>
                        </button>
                    </div>
                </div>

                {/* Cartes de statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-base-100 p-5 rounded-2xl shadow-sm border border-base-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-base-content/70 mb-1">Total notifications</p>
                                <p className="text-2xl font-bold text-base-content">{notifications.length}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <Inbox className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-base-100 p-5 rounded-2xl shadow-sm border border-base-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-base-content/70 mb-1">Non lues</p>
                                <p className="text-2xl font-bold text-base-content">
                                    {notifications.filter(n => !n.is_read).length}
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-50 rounded-xl">
                                <Bell className="text-yellow-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-base-100 p-5 rounded-2xl shadow-sm border border-base-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-base-content/70 mb-1">Utilisateurs</p>
                                <p className="text-2xl font-bold text-base-content">
                                    {new Set(notifications.map(n => n.sender_info?.id)).size}
                                </p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-xl">
                                <Users className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-base-100 p-5 rounded-2xl shadow-sm border border-base-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-base-content/70 mb-1">Marquées lues</p>
                                <p className="text-2xl font-bold text-base-content">
                                    {readNotifications.size}
                                </p>
                            </div>
                            <button
                                onClick={resetAllReadStatus}
                                className="p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
                                title="Réinitialiser les lectures"
                            >
                                <Calendar className="text-purple-600" size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Barre de recherche et filtres */}
                <div className="bg-base-100 p-5 rounded-2xl shadow-sm border border-base-300 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 w-full md:w-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50" size={20} />
                                <input
                                    type="text"
                                    placeholder="Rechercher par message, email ou nom..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full pl-12 pr-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base-content"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" size={20} />
                                <select
                                    value={filter}
                                    onChange={(e) => {
                                        setFilter(e.target.value as "all" | "unread" | "read");
                                        setCurrentPage(1);
                                    }}
                                    className="pl-10 pr-8 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-base-content"
                                >
                                    <option value="all">Toutes les notifications</option>
                                    <option value="unread">Non lues seulement</option>
                                    <option value="read">Lues seulement</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50" size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Liste des notifications */}
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="loading loading-spinner loading-lg text-violet-500"></div>
                    <p className="mt-4 text-base-content/70">Chargement des notifications...</p>
                </div>
            ) : paginatedNotifications.length === 0 ? (
                <div className="text-center py-12 bg-base-100 rounded-2xl border border-base-300">
                    <div className="p-4 bg-base-200 rounded-full inline-block mb-4">
                        <MessageSquare size={48} className="text-base-content/30" />
                    </div>
                    <h3 className="text-xl font-semibold text-base-content mb-2">
                        {searchTerm
                            ? "Aucune notification correspondante"
                            : "Aucune notification"}
                    </h3>
                    <p className="text-base-content/70 mb-6">
                        {searchTerm
                            ? "Essayez de modifier vos critères de recherche"
                            : "Les utilisateurs n'ont pas encore envoyé de messages"}
                    </p>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                        >
                            Réinitialiser la recherche
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="space-y-3 mb-8">
                        {paginatedNotifications.map((n) => (
                            <div
                                key={n.id}
                                className={`group bg-base-100 rounded-2xl border ${n.is_read ? 'border-base-300' : 'border-violet-300 border-l-4 border-l-violet-500'} 
                  shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden animate-fadeIn`}
                            >
                                <div className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            {/* Informations expéditeur */}
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="relative">
                                                    <div className="p-2 bg-violet-100 rounded-lg">
                                                        <User size={18} className="text-violet-600" />
                                                    </div>
                                                    {!n.is_read && (
                                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                                                    )}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-semibold text-base-content">
                                                            {n.sender_info ? `${n.sender_info.prenom} ${n.sender_info.nom}` : "Utilisateur"}
                                                        </h4>
                                                        {!n.is_read && (
                                                            <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full animate-pulse">
                                                                Nouveau
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-base-content/70 flex items-center gap-2">
                                                        <Mail size={14} />
                                                        {n.sender_info?.email || "Email non disponible"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Message */}
                                            <div className="ml-10 mb-3">
                                                <p className="text-base-content line-clamp-2">
                                                    {n.message}
                                                </p>
                                            </div>

                                            {/* Métadonnées */}
                                            <div className="ml-10 flex items-center gap-4 text-sm text-base-content/60">
                                                <div className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    <span>{formatDate(n.created_at)}</span>
                                                </div>
                                                <span className="mx-1">•</span>
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    <span>{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <span className="mx-1">•</span>
                                                <div className={`text-xs px-2 py-1 rounded-full ${n.is_read ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                                    {n.is_read ? '✓ Lu' : 'Non lu'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 ml-4">
                                            {n.is_read ? (
                                                <button
                                                    onClick={() => markAsUnread(n)}
                                                    className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"
                                                    title="Marquer comme non lu"
                                                >
                                                    <Bell size={18} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => markAsRead(n)}
                                                    className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                                    title="Marquer comme lu"
                                                >
                                                    <Check size={18} />
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleView(n)}
                                                className="p-2 rounded-lg bg-base-200 text-base-content hover:bg-base-300 transition-colors"
                                                title="Voir le message"
                                            >
                                                <Eye size={18} />
                                            </button>

                                            <button
                                                onClick={() => handleSendClick(n)}
                                                className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                                                title="Répondre"
                                            >
                                                <Send size={18} />
                                            </button>

                                            <button
                                                onClick={() => handleDeleteClick(n)}
                                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                                title="Supprimer"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination améliorée */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-300">
                            <div className="text-sm text-base-content/70">
                                Affichage de {((currentPage - 1) * pageSize) + 1} à {Math.min(currentPage * pageSize, filteredNotifications.length)} sur {filteredNotifications.length} notifications
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    className={`px-4 py-2 rounded-xl border transition-all duration-200 ${currentPage === 1
                                        ? 'border-base-300 text-base-content/30 cursor-not-allowed'
                                        : 'border-base-300 text-base-content hover:bg-base-200 hover:border-base-400'
                                        }`}
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => p - 1)}
                                >
                                    ‹ Précédent
                                </button>

                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
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
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${currentPage === pageNum
                                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                                                : 'border border-base-300 hover:bg-base-200 text-base-content'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    className={`px-4 py-2 rounded-xl border transition-all duration-200 ${currentPage === totalPages
                                        ? 'border-base-300 text-base-content/30 cursor-not-allowed'
                                        : 'border-base-300 text-base-content hover:bg-base-200 hover:border-base-400'
                                        }`}
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                >
                                    Suivant ›
                                </button>
                            </div>

                            <div className="text-sm text-base-content/70">
                                Page <span className="font-semibold text-base-content">{currentPage}</span> sur <span className="font-semibold text-base-content">{totalPages}</span>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-4 right-4 z-50 animate-slideIn">
                    <div className={`bg-base-100 border ${toastType === 'success' ? 'border-green-300' : 'border-red-300'} rounded-xl shadow-xl p-4 max-w-md`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 ${toastType === 'success' ? 'bg-green-100' : 'bg-red-100'} rounded-lg`}>
                                {toastType === 'success' ? (
                                    <Check size={20} className="text-green-600" />
                                ) : (
                                    <AlertCircle size={20} className="text-red-600" />
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-base-content">{toastMessage}</p>
                            </div>
                            <button
                                onClick={() => setShowToast(false)}
                                className="p-1 hover:bg-base-200 rounded-lg transition-colors"
                            >
                                <X size={18} className="text-base-content/70" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de visualisation */}
            {showViewModal && selectedNotification && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
                    <div className="bg-base-100 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-base-100 border-b border-base-300 p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-base-content">📨 Message de l'utilisateur</h3>
                                <p className="text-base-content/70 text-sm mt-1">Détail du message reçu</p>
                            </div>
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="p-2 hover:bg-base-200 rounded-xl transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Informations expéditeur */}
                            <div className="bg-base-200 rounded-xl p-5">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <User size={24} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base-content text-lg">
                                            {selectedNotification.sender_info
                                                ? `${selectedNotification.sender_info.prenom} ${selectedNotification.sender_info.nom}`
                                                : "Utilisateur"
                                            }
                                        </h4>
                                        <p className="text-base-content/70 flex items-center gap-2">
                                            <Mail size={16} />
                                            {selectedNotification.sender_info?.email || "Email non disponible"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-base-content/70">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        <span>{new Date(selectedNotification.created_at).toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} />
                                        <span>{new Date(selectedNotification.created_at).toLocaleTimeString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <h4 className="font-semibold text-base-content mb-3">Message :</h4>
                                <div className="bg-base-200 rounded-xl p-5">
                                    <p className="text-base-content whitespace-pre-wrap">{selectedNotification.message}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-6 border-t border-base-300">
                                <button
                                    onClick={() => {
                                        setShowViewModal(false);
                                        handleSendClick(selectedNotification);
                                    }}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Send size={20} />
                                        <span>Répondre</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="flex-1 px-6 py-3 border-2 border-base-300 text-base-content rounded-xl hover:bg-base-200 transition-colors font-medium"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal d'envoi de réponse */}
            {showSendModal && selectedNotification && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
                    <div className="bg-base-100 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-base-100 border-b border-base-300 p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-base-content">✉️ Répondre à l'utilisateur</h3>
                                <p className="text-base-content/70 text-sm mt-1">
                                    Envoyer une réponse à {selectedNotification.sender_info?.email}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowSendModal(false)}
                                className="p-2 hover:bg-base-200 rounded-xl transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Rappel du message original */}
                            <div className="bg-base-200 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertCircle size={18} className="text-blue-600" />
                                    <span className="font-medium text-base-content">Message original :</span>
                                </div>
                                <p className="text-base-content/80 text-sm italic">
                                    "{selectedNotification.message}"
                                </p>
                            </div>

                            {/* Formulaire de réponse */}
                            <div>
                                <label className="block text-sm font-medium text-base-content mb-2">
                                    Votre réponse *
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base-content resize-none"
                                    rows={5}
                                    placeholder="Écrivez votre réponse ici..."
                                    value={notifyMessage}
                                    onChange={(e) => setNotifyMessage(e.target.value)}
                                    maxLength={500}
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <div className="text-sm text-base-content/70">
                                        Maximum 500 caractères
                                    </div>
                                    <div className={`text-sm ${notifyMessage.length >= 450 ? 'text-red-500' : 'text-base-content/70'}`}>
                                        {notifyMessage.length}/500
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6 border-t border-base-300">
                                <button
                                    type="button"
                                    onClick={() => setShowSendModal(false)}
                                    className="flex-1 px-6 py-3 border-2 border-base-300 text-base-content rounded-xl hover:bg-base-200 transition-colors font-medium"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={sendNotification}
                                    disabled={!notifyMessage.trim() || isLoading}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-xl hover:from-violet-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        {isLoading ? (
                                            <>
                                                <div className="loading loading-spinner loading-sm text-white"></div>
                                                <span>Envoi en cours...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send size={20} />
                                                <span>Envoyer la réponse</span>
                                            </>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de suppression */}
            {showDeleteModal && selectedNotification && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
                    <div className="bg-base-100 rounded-2xl max-w-md w-full p-8">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trash className="text-red-600" size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-base-content mb-2">Confirmer la suppression</h3>
                            <p className="text-base-content/70 mb-4">
                                Êtes-vous sûr de vouloir supprimer cette notification ?
                            </p>

                            <div className="bg-base-200 rounded-xl p-4 mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <User size={16} className="text-blue-600" />
                                    <span className="font-medium text-base-content">
                                        {selectedNotification.sender_info?.prenom} {selectedNotification.sender_info?.nom}
                                    </span>
                                </div>
                                <p className="text-base-content/80 italic text-sm">"{selectedNotification.message}"</p>
                                <div className="mt-3 pt-3 border-t border-base-300">
                                    <p className="text-sm text-base-content/70">
                                        {formatDate(selectedNotification.created_at)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedNotification(null);
                                    }}
                                    className="flex-1 px-6 py-3 border-2 border-base-300 text-base-content rounded-xl hover:bg-base-200 transition-colors font-medium"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={isLoading}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium disabled:opacity-50"
                                >
                                    {isLoading ? "Suppression..." : "Supprimer définitivement"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Styles d'animation */}
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </div>
    );
}
import { useEffect, useState } from "react";
import { authFetch } from "../../Components/Utils";
import {
  Bell, Check, Send, Trash, X,
  Clock, User, Mail, AlertCircle,
  Eye, EyeOff, Inbox, RefreshCw, Reply, History, MailOpen
} from "lucide-react";
import { useTranslation } from "react-i18next";
import API_BASE_URL from "../../services/api";

type NotificationType = {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  sender_info?: {
    nom: string;
    prenom: string;
    email: string;
  } | null;
  is_sent_by_me?: boolean;
};

type TabType = "received" | "sent";

export default function UserNotifications() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [activeTab, setActiveTab] = useState<TabType>("received");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Récupérer notifications
  useEffect(() => {
    fetchNotifications();
  }, []);

  const isNotificationNew = (notification: NotificationType): boolean => {
    const createdDate = new Date(notification.created_at);
    const now = new Date();
    const hoursDiff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
    return !notification.is_read && hoursDiff < 24;
  };

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      // Récupérer les notifications reçues
      const resReceived = await authFetch(`${API_BASE_URL}/api/notifications/`);
      const receivedData = await resReceived.json();

      // Récupérer les notifications envoyées
      let sentData = [];
      try {
        const resSent = await authFetch(`${API_BASE_URL}/api/sent-notifications/`);
        sentData = await resSent.json();
      } catch (sentErr) {
        console.log("API sent-notifications non disponible:", sentErr);
      }

      // Combiner les données avec identification
      const allNotifications = [
        ...receivedData.map((n: any) => ({ ...n, is_sent_by_me: false })),
        ...sentData.map((n: any) => ({ ...n, is_sent_by_me: true }))
      ];

      // Trier par date
      allNotifications.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setNotifications(allNotifications);
      showNotificationToast("Notifications mises à jour", "success");

    } catch (err) {
      console.error("Erreur lors du chargement:", err);
      showNotificationToast("Erreur lors du chargement", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les notifications selon l'onglet actif
  const getFilteredNotifications = () => {
    let baseList = notifications.filter(notif => 
      activeTab === "received" ? !notif.is_sent_by_me : notif.is_sent_by_me
    );

    // Appliquer les filtres supplémentaires pour les notifications reçues
    if (activeTab === "received") {
      if (filter === "unread") baseList = baseList.filter(n => !n.is_read);
      if (filter === "read") baseList = baseList.filter(n => n.is_read);
    }

    return baseList;
  };

  const filteredNotifications = getFilteredNotifications();
  
  // Pagination
  const totalPages = Math.ceil(filteredNotifications.length / pageSize);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Toast notification
  const showNotificationToast = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Marquer comme lu/non lu
  const toggleReadStatus = (notif: NotificationType) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notif.id ? { ...n, is_read: !n.is_read } : n
      )
    );
    showNotificationToast(
      notif.is_read ? "Marquée comme non lue" : "Marquée comme lue",
      "success"
    );
  };

  // Envoyer notification à l'admin
  const sendNotificationToAdmin = async () => {
    if (!newMessage.trim()) {
      showNotificationToast("Veuillez écrire un message", "error");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/api/send-notification-admin/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });

      if (!res.ok) throw new Error("Erreur lors de l'envoi");

      // Ajouter la notification envoyée localement
      const newSentNotification: NotificationType = {
        id: Date.now(),
        message: `À l'admin: ${newMessage}`,
        is_read: true,
        created_at: new Date().toISOString(),
        is_sent_by_me: true,
        sender_info: null
      };

      setNotifications(prev => [newSentNotification, ...prev]);
      showNotificationToast("Message envoyé avec succès !", "success");
      setNewMessage("");
      setShowModal(false);
      
      // Basculer vers l'onglet "Envoyés"
      setActiveTab("sent");
      setCurrentPage(1);

    } catch (err) {
      console.error(err);
      showNotificationToast("Impossible d'envoyer le message", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion de la suppression
  const handleDeleteClick = (notif: NotificationType) => {
    setSelectedNotification(notif);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedNotification) return;

    setIsLoading(true);
    try {
      // Si c'est une vraie notification (pas locale)
      if (selectedNotification.id < 1000000) {
        const res = await authFetch(
          `${API_BASE_URL}/api/notifications/delete/${selectedNotification.id}/`,
          { method: "POST" }
        );
        if (!res.ok) throw new Error("Erreur API");
      }

      // Supprimer localement
      setNotifications(prev => prev.filter(n => n.id !== selectedNotification.id));
      showNotificationToast("Notification supprimée", "success");
      
    } catch (err) {
      console.error(err);
      showNotificationToast("Erreur lors de la suppression", "error");
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
      setSelectedNotification(null);
    }
  };

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
        month: 'short'
      });
    }
  };

  // Statistiques
  const receivedCount = notifications.filter(n => !n.is_sent_by_me).length;
  const sentCount = notifications.filter(n => n.is_sent_by_me).length;
  const unreadCount = notifications.filter(n => !n.is_read && !n.is_sent_by_me).length;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header principal */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-base-content mb-2 flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-2xl shadow-lg">
                <Bell size={28} className="text-white" />
              </div>
              <span>Centre de notifications</span>
            </h1>
            <p className="text-base-content/70">Gérez vos conversations avec l'administration</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchNotifications}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-3 bg-base-200 text-base-content rounded-xl hover:bg-base-300 transition-all duration-200 shadow-sm"
            >
              <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
              <span className="font-medium">Actualiser</span>
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-xl hover:from-violet-600 hover:to-violet-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Reply size={20} />
              <span className="font-semibold">Nouveau message</span>
            </button>
          </div>
        </div>

        {/* Cartes de statistiques améliorées */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={`bg-base-100 p-5 rounded-2xl shadow-sm border transition-all duration-300 ${activeTab === "received" ? "border-blue-300 shadow-md" : "border-base-300"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70 mb-1">Reçues</p>
                <p className="text-2xl font-bold text-base-content">{receivedCount}</p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-base-content/70">Messages de l'admin</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Inbox className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className={`bg-base-100 p-5 rounded-2xl shadow-sm border transition-all duration-300 ${activeTab === "sent" ? "border-green-300 shadow-md" : "border-base-300"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70 mb-1">Envoyées</p>
                <p className="text-2xl font-bold text-base-content">{sentCount}</p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-base-content/70">Vos messages</span>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <Send className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-base-100 p-5 rounded-2xl shadow-sm border border-base-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70 mb-1">En attente</p>
                <p className="text-2xl font-bold text-base-content">{unreadCount}</p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-base-content/70">Non lues</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <Bell className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-base-100 p-5 rounded-2xl shadow-sm border border-base-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70 mb-1">Total</p>
                <p className="text-2xl font-bold text-base-content">{notifications.length}</p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-xs text-base-content/70">Tous les messages</span>
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <History className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Onglets principaux */}
        <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300 mb-6 overflow-hidden">
          <div className="border-b border-base-300">
            <div className="flex">
              <button
                onClick={() => {
                  setActiveTab("received");
                  setCurrentPage(1);
                }}
                className={`flex-1 px-6 py-4 text-center transition-all duration-200 ${activeTab === "received"
                  ? "bg-gradient-to-r from-violet-500 to-indigo-600 text-white"
                  : "text-base-content hover:bg-base-200"
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <Inbox size={20} />
                  <span className="font-semibold">Messages reçus</span>
                  {unreadCount > 0 && (
                    <span className="bg-white text-violet-600 text-xs font-bold px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab("sent");
                  setCurrentPage(1);
                }}
                className={`flex-1 px-6 py-4 text-center transition-all duration-200 ${activeTab === "sent"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                  : "text-base-content hover:bg-base-200"
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <Send size={20} />
                  <span className="font-semibold">Messages envoyés</span>
                  {sentCount > 0 && (
                    <span className="bg-white text-green-600 text-xs font-bold px-2 py-1 rounded-full">
                      {sentCount}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Filtres pour l'onglet reçu */}
          {activeTab === "received" && (
            <div className="p-5 border-b border-base-300">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-base-content mb-2">Filtrer les messages</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilter("all")}
                      className={`px-4 py-2 rounded-xl transition-all duration-200 ${filter === "all"
                        ? "bg-gradient-to-r from-violet-500 to-indigo-600 text-white"
                        : "bg-base-200 text-base-content hover:bg-base-300"
                      }`}
                    >
                      Tous
                    </button>
                    <button
                      onClick={() => setFilter("unread")}
                      className={`px-4 py-2 rounded-xl transition-all duration-200 ${filter === "unread"
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
                        : "bg-base-200 text-base-content hover:bg-base-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <EyeOff size={16} />
                        Non lus
                      </div>
                    </button>
                    <button
                      onClick={() => setFilter("read")}
                      className={`px-4 py-2 rounded-xl transition-all duration-200 ${filter === "read"
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                        : "bg-base-200 text-base-content hover:bg-base-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Eye size={16} />
                        Lus
                      </div>
                    </button>
                  </div>
                </div>

                <div className="text-sm text-base-content/70">
                  {filteredNotifications.length} message{filteredNotifications.length > 1 ? 's' : ''}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contenu des onglets */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="loading loading-spinner loading-lg text-violet-500"></div>
          <p className="mt-4 text-base-content/70">Chargement des messages...</p>
        </div>
      ) : paginatedNotifications.length === 0 ? (
        <div className="text-center py-12 bg-base-100 rounded-2xl border border-base-300">
          <div className="p-4 bg-base-200 rounded-full inline-block mb-4">
            {activeTab === "received" ? (
              <MailOpen size={48} className="text-base-content/30" />
            ) : (
              <Send size={48} className="text-base-content/30" />
            )}
          </div>
          <h3 className="text-xl font-semibold text-base-content mb-2">
            {activeTab === "received" 
              ? filter === "unread" 
                ? "Aucun message non lu"
                : "Aucun message reçu"
              : "Aucun message envoyé"
            }
          </h3>
          <p className="text-base-content/70 mb-6">
            {activeTab === "received"
              ? filter === "unread"
                ? "Tous vos messages ont été lus"
                : "Vous n'avez pas encore reçu de messages"
              : "Vous n'avez pas encore envoyé de messages"
            }
          </p>
          {activeTab === "sent" && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-xl hover:from-violet-600 hover:to-indigo-700 transition-all duration-200"
            >
              <Reply size={20} />
              Envoyer votre premier message
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Liste des messages */}
          <div className="space-y-3 mb-8">
            {paginatedNotifications.map((n) => (
              <div
                key={n.id}
                className={`group bg-base-100 rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden animate-fadeIn
                  ${activeTab === "received" 
                    ? n.is_read 
                      ? 'border-base-300' 
                      : 'border-violet-300 border-l-4 border-l-violet-500'
                    : 'border-green-300 border-l-4 border-l-green-500'
                  }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${activeTab === "received"
                            ? n.is_read ? 'bg-base-200' : 'bg-violet-200'
                            : 'bg-green-100'
                          }`}>
                          {activeTab === "received" ? (
                            <Bell size={18} className={n.is_read ? 'text-base-content/70' : 'text-violet-600'} />
                          ) : (
                            <Send size={18} className="text-green-600" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className={`font-medium ${activeTab === "received" && n.is_read ? 'text-base-content/80' : 'text-base-content'}`}>
                              {activeTab === "sent" && "À l'admin : "}{n.message}
                            </p>
                            {activeTab === "received" && isNotificationNew(n) && (
                              <span className="px-2 py-1 bg-violet-500 text-white text-xs font-semibold rounded-full animate-pulse">
                                Nouveau
                              </span>
                            )}
                            {activeTab === "sent" && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                Envoyé
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Informations détaillées */}
                      <div className="ml-10 space-y-2">
                        {activeTab === "received" && n.sender_info && (
                          <div className="flex items-center gap-2 text-sm text-base-content/70">
                            <User size={14} />
                            <span className="font-medium">{n.sender_info.prenom} {n.sender_info.nom}</span>
                            <span className="mx-1">•</span>
                            <Mail size={14} />
                            <span className="text-violet-900">{n.sender_info.email}</span>
                          </div>
                        )}
                        
                        {activeTab === "sent" && (
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <Send size={14} />
                            <span className="font-medium">Message envoyé à l'administrateur</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm text-base-content/60">
                          <Clock size={14} />
                          <span>{formatDate(n.created_at)}</span>
                          <span className="mx-1">•</span>
                          <span>{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      {activeTab === "received" && (
                        <button
                          onClick={() => toggleReadStatus(n)}
                          className={`p-2 rounded-lg transition-colors ${n.is_read 
                            ? 'bg-base-200 text-base-content/70 hover:bg-base-300 hover:text-blue-600' 
                            : 'bg-blue-100 text-violet-600 hover:bg-violet-200'
                          }`}
                          title={n.is_read ? "Marquer comme non lue" : "Marquer comme lue"}
                        >
                          {n.is_read ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteClick(n)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-300">
              <div className="text-sm text-base-content/70">
                {activeTab === "received" ? "Messages reçus" : "Messages envoyés"}: {((currentPage - 1) * pageSize) + 1} à {Math.min(currentPage * pageSize, filteredNotifications.length)} sur {filteredNotifications.length}
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
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${currentPage === pageNum
                        ? activeTab === "received" 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                          : 'bg-gradient-to-r from-green-500 to-green-600'
                        : 'border border-base-300 hover:bg-base-200'
                      } text-white shadow-md`}
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

      {/* Modal d'envoi de message */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-base-100 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-base-100 border-b border-base-300 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-base-content">📨 Nouveau message</h3>
                <p className="text-base-content/70 text-sm mt-1">Envoyez un message à l'administrateur</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-base-200 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-violet-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-violet-900">Comment ça fonctionne ?</p>
                    <p className="text-indigo-700 text-sm mt-1">
                      Votre message sera envoyé directement à l'administrateur du système. 
                      Vous recevrez une réponse dans cette section des notifications.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  Votre message *
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base-content resize-none"
                  rows={5}
                  placeholder="Décrivez votre problème, suggestion ou demande..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="text-sm text-base-content/70">
                    Maximum 500 caractères
                  </div>
                  <div className={`text-sm ${newMessage.length >= 450 ? 'text-red-500' : 'text-base-content/70'}`}>
                    {newMessage.length}/500
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-base-300">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-base-300 text-base-content rounded-xl hover:bg-base-200 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={sendNotificationToAdmin}
                  disabled={!newMessage.trim() || isLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <span>Envoyer le message</span>
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
                Êtes-vous sûr de vouloir supprimer ce message ?
              </p>
              <div className="bg-base-200 rounded-xl p-4 mb-6">
                <p className="text-base-content font-medium mb-2">Contenu :</p>
                <p className="text-base-content/80 italic">"{selectedNotification.message}"</p>
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
                  {isLoading ? "Suppression..." : "Supprimer"}
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
      `}</style>
    </div>
  );
}
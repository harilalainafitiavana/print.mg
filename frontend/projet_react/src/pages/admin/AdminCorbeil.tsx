import { useState, useEffect } from "react";
import { RotateCcw, Trash, X, Check, Archive, Package, Bell, User, Mail, Phone, Calendar, FileText, Hash, DollarSign } from "lucide-react";
import { authFetch } from "../../Components/Utils";
import { useTranslation } from "react-i18next";
import API_BASE_URL from "../../services/api";

// ------------------- Types -------------------
interface Fichier {
  id: number;
  nom_fichier: string;
  format: string;
  resolution_dpi: string;
  profil_couleur: string;
  taille: string;
}

interface Configuration {
  quantity: number;
  format_type: string;
  small_format?: string;
  largeur?: string;
  hauteur?: string;
  paper_type?: string;
  finish?: string;
  duplex?: string;
  binding?: string;
  cover_paper?: string;
  options?: string;
}

interface DeletedOrder {
  id: number;
  name: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  date_commande: string;
  fichiers: Fichier[];
  configuration: Configuration;
}

interface DeletedNotification {
  id: number;
  message: string;
  sender_info: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  } | null;
  created_at: string;
}

// ------------------- Composant principal -------------------
export default function AdminCorbeille() {
  const { t } = useTranslation();
  // Commandes
  const [deletedOrders, setDeletedOrders] = useState<DeletedOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<DeletedOrder | null>(null);

  // Notifications
  const [deletedNotifications, setDeletedNotifications] = useState<DeletedNotification[]>([]);
  const [selectedNotif, setSelectedNotif] = useState<DeletedNotification | null>(null);

  // Modals
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showDeletePermanentModal, setShowDeletePermanentModal] = useState(false);
  const [showRestoreNotifModal, setShowRestoreNotifModal] = useState(false);
  const [showDeleteNotifModal, setShowDeleteNotifModal] = useState(false);

  const [activeTab, setActiveTab] = useState<"orders" | "notifications">("orders");

  // ------------------- Fetch commandes supprimées -------------------
  useEffect(() => {
    const fetchDeletedOrders = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/api/commandes/deleted/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data: DeletedOrder[] = await res.json();
          setDeletedOrders(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDeletedOrders();
  }, []);

  // ------------------- Fetch notifications supprimées -------------------
  useEffect(() => {
    const fetchDeletedNotifications = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/api/notifications/deleted/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data: DeletedNotification[] = await res.json();
          setDeletedNotifications(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDeletedNotifications();
  }, []);

  // ------------------- Actions Commandes -------------------
  const confirmRestore = async () => {
    if (!selectedOrder) return;
    try {
      const res = await authFetch(`${API_BASE_URL}/api/commandes/${selectedOrder.id}/restore/`, { method: "POST" });
      if (res.ok) {
        setDeletedOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
      }
    } catch (err) {
      console.error(err);
    }
    setShowRestoreModal(false);
  };

  const confirmDeletePermanent = async () => {
    if (!selectedOrder) return;
    try {
      const res = await authFetch(`${API_BASE_URL}/api/commandes/${selectedOrder.id}/delete_forever/`, { method: "DELETE" });
      if (res.ok) {
        setDeletedOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
      }
    } catch (err) {
      console.error(err);
    }
    setShowDeletePermanentModal(false);
  };

  // ------------------- Actions Notifications -------------------
  const confirmRestoreNotification = async () => {
    if (!selectedNotif) return;
    try {
      const res = await authFetch(`${API_BASE_URL}/api/notifications/restore/${selectedNotif.id}/`, { method: "POST" });
      if (res.ok) {
        setDeletedNotifications(prev => prev.filter(n => n.id !== selectedNotif.id));
      }
    } catch (err) {
      console.error(err);
    }
    setShowRestoreNotifModal(false);
  };

  const confirmDeletePermanentNotif = async () => {
    if (!selectedNotif) return;
    try {
      const res = await authFetch(`${API_BASE_URL}/api/notifications/delete-forever/${selectedNotif.id}/`, { method: "DELETE" });
      if (res.ok) {
        setDeletedNotifications(prev => prev.filter(n => n.id !== selectedNotif.id));
      }
    } catch (err) {
      console.error(err);
    }
    setShowDeleteNotifModal(false);
  };

  // ------------------- Render -------------------
  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-6">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Archive className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-base-content">{t("trash.title") || "Corbeille Admin"}</h1>
        </div>
        <p className="text-base-content/70">
          Gestion des éléments supprimés par les utilisateurs et administrateurs
        </p>
      </div>

      {/* Onglets */}
      <div className="flex mb-6 border-b border-base-300">
        <button
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${activeTab === "orders"
              ? "text-primary border-b-2 border-primary"
              : "text-base-content/70 hover:text-base-content"
            }`}
          onClick={() => setActiveTab("orders")}
        >
          <Package className="w-5 h-5" />
          Commandes
          {deletedOrders.length > 0 && (
            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">
              {deletedOrders.length}
            </span>
          )}
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${activeTab === "notifications"
              ? "text-primary border-b-2 border-primary"
              : "text-base-content/70 hover:text-base-content"
            }`}
          onClick={() => setActiveTab("notifications")}
        >
          <Bell className="w-5 h-5" />
          Notifications
          {deletedNotifications.length > 0 && (
            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">
              {deletedNotifications.length}
            </span>
          )}
        </button>
      </div>

      {/* Contenu des onglets */}
      <div className="space-y-6">
        {/* Section Commandes */}
        {activeTab === "orders" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Package className="w-5 h-5" />
                {t("trash.deletedOrders") || "Commandes Supprimées"}
              </h2>
              <div className="text-sm text-base-content/70">
                {deletedOrders.length} {deletedOrders.length === 1 ? "commande" : "commandes"}
              </div>
            </div>

            {deletedOrders.length === 0 ? (
              <div className="bg-base-100 rounded-2xl p-8 text-center shadow-sm">
                <Package className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
                <h3 className="text-lg font-medium mb-2">{t("trash.noOrders") || "Aucune commande supprimée"}</h3>
                <p className="text-base-content/60">Les commandes supprimées par les utilisateurs apparaîtront ici</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {deletedOrders.map(order => (
                  <div key={order.id} className="bg-base-100 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300">
                    {/* En-tête de la carte */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Hash className="w-4 h-4 text-base-content/60" />
                          <h3 className="font-bold text-lg">{order.id}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-base-content/60">
                          <Calendar className="w-3 h-3" />
                          {new Date(order.date_commande).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-error/10 text-error text-xs font-medium">
                        Supprimée
                      </div>
                    </div>

                    {/* Informations utilisateur */}
                    <div className="mb-4 p-3 bg-base-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-base-content/60" />
                        <span className="font-medium">Client</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{order.user_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          <span>{order.user_email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          <span>{order.user_phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Détails de la commande */}
                    <div className="space-y-2 mb-4">
                      <div className="text-sm">
                        <span className="font-medium">Commande:</span> #{order.id}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Format:</span>{" "}
                        {order.configuration.format_type === "petit"
                          ? `Petit - ${order.configuration.small_format}`
                          : `Grand - ${order.configuration.largeur}x${order.configuration.hauteur} cm`}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Quantité:</span> {order.configuration.quantity}
                      </div>
                      {order.configuration.options && (
                        <div className="text-sm">
                          <span className="font-medium">Options:</span> {order.configuration.options}
                        </div>
                      )}
                    </div>

                    {/* Fichiers */}
                    {order.fichiers.length > 0 && (
                      <div className="pt-3 border-t border-base-300">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-base-content/60" />
                          <span className="text-sm font-medium">Fichiers ({order.fichiers.length})</span>
                        </div>
                        <div className="space-y-1 max-h-20 overflow-y-auto">
                          {order.fichiers.map((f, idx) => (
                            <div key={f.id} className="text-xs bg-base-200 rounded px-2 py-1">
                              {f.nom_fichier} • {f.format}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-base-300">
                      <button
                        onClick={() => { setSelectedOrder(order); setShowRestoreModal(true); }}
                        className="flex-1 btn btn-outline btn-primary btn-sm gap-2"
                      >
                        <RotateCcw size={16} />
                        Restaurer
                      </button>
                      <button
                        onClick={() => { setSelectedOrder(order); setShowDeletePermanentModal(true); }}
                        className="flex-1 btn btn-outline btn-error btn-sm gap-2"
                      >
                        <Trash size={16} />
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section Notifications */}
        {activeTab === "notifications" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5" />
                {t("trash.deletedNotifications") || "Notifications Supprimées"}
              </h2>
              <div className="text-sm text-base-content/70">
                {deletedNotifications.length} {deletedNotifications.length === 1 ? "notification" : "notifications"}
              </div>
            </div>

            {deletedNotifications.length === 0 ? (
              <div className="bg-base-100 rounded-2xl p-8 text-center shadow-sm">
                <Bell className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
                <h3 className="text-lg font-medium mb-2">{t("trash.noNotifications") || "Aucune notification supprimée"}</h3>
                <p className="text-base-content/60">Les notifications supprimées apparaîtront ici</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {deletedNotifications.map(notif => (
                  <div key={notif.id} className="bg-base-100 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300">
                    {/* En-tête de la notification */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Bell className="w-4 h-4 text-primary" />
                          <h3 className="font-bold">Notification #{notif.id}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-base-content/60">
                          <Calendar className="w-3 h-3" />
                          {new Date(notif.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-error/10 text-error text-xs font-medium">
                        Supprimée
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mb-4">
                      <p className="text-base-content/80 line-clamp-3">{notif.message}</p>
                    </div>

                    {/* Informations de l'expéditeur */}
                    {notif.sender_info && (
                      <div className="mb-4 p-3 bg-base-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-3 h-3 text-base-content/60" />
                          <span className="text-sm font-medium">Expéditeur</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3 text-base-content/60" />
                          <span>{notif.sender_info.email}</span>
                        </div>
                        <div className="text-xs text-base-content/60 mt-1">
                          {notif.sender_info.prenom} {notif.sender_info.nom}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-base-300">
                      <button
                        onClick={() => { setSelectedNotif(notif); setShowRestoreNotifModal(true); }}
                        className="flex-1 btn btn-outline btn-primary btn-sm gap-2"
                      >
                        <RotateCcw size={16} />
                        Restaurer
                      </button>
                      <button
                        onClick={() => { setSelectedNotif(notif); setShowDeleteNotifModal(true); }}
                        className="flex-1 btn btn-outline btn-error btn-sm gap-2"
                      >
                        <Trash size={16} />
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ------------------- MODALS ------------------- */}
      {showRestoreModal && selectedOrder && (
        <Modal 
          title={t("trash.restore_commande") || "Restaurer la commande"}
          message={t("trash.confirmRestore") || "Êtes-vous sûr de vouloir restaurer cette commande ?"}
          onCancel={() => setShowRestoreModal(false)}
          onConfirm={confirmRestore}
          icon={<RotateCcw className="w-6 h-6 text-primary" />}
          type="restore"
        />
      )}

      {showDeletePermanentModal && selectedOrder && (
        <Modal 
          title={t("trash.deletePermanent") || "Suppression définitive"}
          message={t("trash.confirmDelete") || "Êtes-vous sûr de vouloir supprimer définitivement cette commande ? Cette action est irréversible."}
          onCancel={() => setShowDeletePermanentModal(false)}
          onConfirm={confirmDeletePermanent}
          icon={<Trash className="w-6 h-6 text-error" />}
          type="delete"
        />
      )}

      {showRestoreNotifModal && selectedNotif && (
        <Modal 
          title={t("trash.restore_notification") || "Restaurer la notification"}
          message={t("trash.confirmRestore") || "Êtes-vous sûr de vouloir restaurer cette notification ?"}
          onCancel={() => setShowRestoreNotifModal(false)}
          onConfirm={confirmRestoreNotification}
          icon={<RotateCcw className="w-6 h-6 text-primary" />}
          type="restore"
        />
      )}

      {showDeleteNotifModal && selectedNotif && (
        <Modal 
          title={t("trash.deletePermanent") || "Suppression définitive"}
          message={t("trash.confirmDelete") || "Êtes-vous sûr de vouloir supprimer définitivement cette notification ? Cette action est irréversible."}
          onCancel={() => setShowDeleteNotifModal(false)}
          onConfirm={confirmDeletePermanentNotif}
          icon={<Trash className="w-6 h-6 text-error" />}
          type="delete"
        />
      )}

      {/* Styles */}
      <style>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes modal-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// ------------------- Modal amélioré -------------------
function Modal({ 
  title, 
  message, 
  onCancel, 
  onConfirm, 
  icon,
  type = "restore"
}: {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  icon: React.ReactNode;
  type: "restore" | "delete";
}) {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-base-100 p-6 rounded-2xl max-w-md w-full shadow-2xl animate-modal-in">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-full ${type === "restore" ? "bg-primary/20" : "bg-error/20"}`}>
            {icon}
          </div>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>

        <p className="mb-6 text-base-content/80">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="btn btn-ghost btn-sm gap-2"
          >
            <X size={16} /> {t("trash.cancel") || "Annuler"}
          </button>
          <button
            onClick={onConfirm}
            className={`btn btn-sm gap-2 ${type === "restore" ? "btn-primary" : "btn-error"}`}
          >
            <Check size={16} /> {t("trash.confirm") || "Confirmer"}
          </button>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { RotateCcw, Trash2, X, Check, Archive, Bell, Package, FileText, Phone, DollarSign, Hash, Calendar, User, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import API_BASE_URL from "../../services/api";

// ================================
// 🔹 Types
// ================================
type Fichier = {
  nom_fichier: string;
  resolution_dpi: number;
  profil_couleur: string;
  format: string;
};

type Configuration = {
  format_type: string;
  small_format?: string;
  largeur?: number;
  hauteur?: number;
  paper_type?: string;
  finish?: string;
  quantity: number;
  duplex?: boolean;
  binding?: string;
  cover_paper?: string;
  options?: string;
};

type Commande = {
  id: number;
  montant_total: number;
  user_phone: string;
  configuration: Configuration;
  fichiers: Fichier[];
  is_deleted: boolean;
};

type DeletedNotification = {
  id: number;
  message: string;
  created_at: string;
  sender_info?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  } | null;
  recipient_info?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  } | null;
};

type SelectedItem = {
  type: "order" | "notification";
  id: number;
  name?: string;
  message?: string;
};

// ================================
// 🔹 Composant principal
// ================================
export default function Trash() {
  const { t } = useTranslation();
  // 🔹 États
  const [deletedOrders, setDeletedOrders] = useState<Commande[]>([]);
  const [deletedNotifications, setDeletedNotifications] = useState<DeletedNotification[]>([]);
  const [showModal, setShowModal] = useState<false | "restore" | "delete">(false);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "notifications">("orders");

  // ================================
  // 🔹 Récupération des données
  // ================================
  useEffect(() => {
    fetchDeletedOrders();
    fetchDeletedNotifications();
  }, []);

  const fetchDeletedOrders = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/commandes/deleted/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDeletedOrders(data);
    } catch (err) {
      console.error("Erreur fetch commandes :", err);
      alert("Impossible de récupérer les commandes, vous avez perdu le token");
    }
  };

  const fetchDeletedNotifications = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/notifications/deleted/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDeletedNotifications(data);
    } catch (err) {
      console.error("Erreur fetch notifications :", err);
      alert("Impossible de récupérer les notifications, vous avez perdu le token");
    }
  };

  // ================================
  // 🔹 Actions: restaurer ou supprimer
  // ================================
  const handleRestore = (item: SelectedItem) => {
    setSelectedItem(item);
    setShowModal("restore");
  };

  const handleDeleteForever = (item: SelectedItem) => {
    setSelectedItem(item);
    setShowModal("delete");
  };

  const confirmAction = async () => {
    if (!selectedItem) return;

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return;

    try {
      // 🔹 Commande
      if (selectedItem.type === "order") {
        if (showModal === "restore") {
          await fetch(`${API_BASE_URL}/api/commandes/${selectedItem.id}/restore/`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
          setDeletedOrders(prev => prev.filter(o => o.id !== selectedItem.id));
        } else if (showModal === "delete") {
          await fetch(`${API_BASE_URL}/api/commandes/${selectedItem.id}/delete_forever/`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
          setDeletedOrders(prev => prev.filter(o => o.id !== selectedItem.id));
        }
      }

      // 🔹 Notification
      if (selectedItem.type === "notification") {
        if (showModal === "restore") {
          await fetch(`${API_BASE_URL}/api/notifications/restore/${selectedItem.id}/`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
          setDeletedNotifications(prev => prev.filter(n => n.id !== selectedItem.id));
        } else if (showModal === "delete") {
          await fetch(`${API_BASE_URL}/api/notifications/delete-forever/${selectedItem.id}/`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
          setDeletedNotifications(prev => prev.filter(n => n.id !== selectedItem.id));
        }
      }
    } catch (err) {
      console.error("Erreur action :", err);
    } finally {
      setShowModal(false);
      setSelectedItem(null);
    }
  };

  // ================================
  // 🔹 Rendu
  // ================================
  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-6">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Archive className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-base-content">{t("corbeille.title")}</h1>
        </div>
        <p className="text-base-content/70">
          {t("corbeille.subtitle") || "Gérez vos éléments supprimés. Vous pouvez restaurer ou supprimer définitivement."}
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
                {t("corbeille.deletedOrders")}
              </h2>
              <div className="text-sm text-base-content/70">
                {deletedOrders.length} {deletedOrders.length === 1 ? "commande" : "commandes"}
              </div>
            </div>

            {deletedOrders.length === 0 ? (
              <div className="bg-base-100 rounded-2xl p-8 text-center shadow-sm">
                <Package className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
                <h3 className="text-lg font-medium mb-2">{t("corbeille.noDeletedOrders")}</h3>
                <p className="text-base-content/60">Aucune commande n'a été supprimée</p>
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
                          <h3 className="font-bold text-lg">Commande #{order.id}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-base-content/60">
                          <Calendar className="w-3 h-3" />
                          Supprimée récemment
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-error/10 text-error text-xs font-medium">
                        Supprimée
                      </div>
                    </div>

                    {/* Détails de la commande */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-base-content/60" />
                        <span className="text-sm">{order.user_phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-base-content/60" />
                        <span className="text-sm font-medium">{order.montant_total} Ariary</span>
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

                      {/* Fichiers */}
                      {order.fichiers.length > 0 && (
                        <div className="pt-3 border-t border-base-300">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-base-content/60" />
                            <span className="text-sm font-medium">Fichiers ({order.fichiers.length})</span>
                          </div>
                          <div className="space-y-1 max-h-24 overflow-y-auto">
                            {order.fichiers.map((f, idx) => (
                              <div key={idx} className="text-xs bg-base-200 rounded px-2 py-1">
                                {f.nom_fichier} • {f.format} • {f.resolution_dpi} DPI
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-base-300">
                      <button
                        className="flex-1 btn btn-outline btn-primary btn-sm gap-2"
                        onClick={() => handleRestore({ type: "order", id: order.id })}
                      >
                        <RotateCcw size={16} />
                        {t("corbeille.restore")}
                      </button>
                      <button
                        className="flex-1 btn btn-outline btn-error btn-sm gap-2"
                        onClick={() => handleDeleteForever({ type: "order", id: order.id })}
                      >
                        <Trash2 size={16} />
                        {t("corbeille.delete")}
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
                {t("corbeille.deletedNotifications")}
              </h2>
              <div className="text-sm text-base-content/70">
                {deletedNotifications.length} {deletedNotifications.length === 1 ? "notification" : "notifications"}
              </div>
            </div>

            {deletedNotifications.length === 0 ? (
              <div className="bg-base-100 rounded-2xl p-8 text-center shadow-sm">
                <Bell className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
                <h3 className="text-lg font-medium mb-2">{t("corbeille.noDeletedNotifications")}</h3>
                <p className="text-base-content/60">Aucune notification n'a été supprimée</p>
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
                          <h3 className="font-bold">Notification</h3>
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
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-base-300">
                      <button
                        className="flex-1 btn btn-outline btn-primary btn-sm gap-2"
                        onClick={() => handleRestore({ type: "notification", id: notif.id, message: notif.message })}
                      >
                        <RotateCcw size={16} />
                        {t("corbeille.restore")}
                      </button>
                      <button
                        className="flex-1 btn btn-outline btn-error btn-sm gap-2"
                        onClick={() => handleDeleteForever({ type: "notification", id: notif.id, message: notif.message })}
                      >
                        <Trash2 size={16} />
                        {t("corbeille.delete")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* -------------------- Modal confirmation -------------------- */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-base-100 p-6 rounded-2xl max-w-md w-full shadow-2xl animate-modal-in">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-full ${showModal === "restore" ? "bg-primary/20" : "bg-error/20"}`}>
                {showModal === "restore" ? (
                  <RotateCcw className="w-6 h-6 text-primary" />
                ) : (
                  <Trash2 className="w-6 h-6 text-error" />
                )}
              </div>
              <h3 className="text-xl font-bold">
                {showModal === "restore" ? t("corbeille.modal.restoreTitle") : t("corbeille.modal.deleteTitle")}
              </h3>
            </div>

            <p className="mb-6 text-base-content/80">
              {showModal === "restore"
                ? t("corbeille.modal.restoreConfirm")
                : t("corbeille.modal.deleteConfirm")}
            </p>

            {selectedItem.message && (
              <div className="mb-6 p-3 bg-base-200 rounded-lg">
                <p className="text-sm font-medium mb-1">Contenu:</p>
                <p className="text-sm text-base-content/70">{selectedItem.message}</p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-ghost btn-sm gap-2"
              >
                <X size={16} /> {t("corbeille.cancel")}
              </button>
              <button
                onClick={confirmAction}
                className={`btn btn-sm gap-2 ${showModal === "restore" ? "btn-primary" : "btn-error"}`}
              >
                <Check size={16} /> {t("corbeille.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles d'animation */}
      <style>{`
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
        .animate-modal-in {
          animation: modal-in 0.2s ease-out forwards;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
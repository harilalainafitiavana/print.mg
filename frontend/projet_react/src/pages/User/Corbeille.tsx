import { useEffect, useState } from "react";
import { RotateCcw, Trash2, X, Check } from "lucide-react";

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
  phone: string;
  configuration: Configuration;
  fichiers: Fichier[];
  is_deleted: boolean;
};

type DeletedNotification = {
  id: number;
  message: string;
  user_email: string;
  created_at: string;
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
  // 🔹 États
  const [deletedOrders, setDeletedOrders] = useState<Commande[]>([]);
  const [deletedNotifications, setDeletedNotifications] = useState<DeletedNotification[]>([]);
  const [showModal, setShowModal] = useState<false | "restore" | "delete">(false);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

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

      const res = await fetch("http://localhost:8000/api/commandes/deleted/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDeletedOrders(data);
    } catch (err) {
      console.error("Erreur fetch commandes :", err);
      alert("Impossible de récupérer les commandes, vous avez perdu le token")
    }
  };

  const fetchDeletedNotifications = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:8000/api/notifications/deleted/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDeletedNotifications(data);
    } catch (err) {
      console.error("Erreur fetch notifications :", err);
      alert("Impossible de récupérer les notifications, vous avez perdu le token")
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
          await fetch(`http://localhost:8000/api/commandes/${selectedItem.id}/restore/`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
          setDeletedOrders(prev => prev.filter(o => o.id !== selectedItem.id));
        } else if (showModal === "delete") {
          await fetch(`http://localhost:8000/api/commandes/${selectedItem.id}/delete_forever/`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
          setDeletedOrders(prev => prev.filter(o => o.id !== selectedItem.id));
        }
      }

      // 🔹 Notification
      if (selectedItem.type === "notification") {
        if (showModal === "restore") {
          await fetch(`http://localhost:8000/api/notifications/restore/${selectedItem.id}/`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
          setDeletedNotifications(prev => prev.filter(n => n.id !== selectedItem.id));
        } else if (showModal === "delete") {
          await fetch(`http://localhost:8000/api/notifications/delete-forever/${selectedItem.id}/`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🗑️ Corbeille</h1>

      {/* -------------------- Commandes -------------------- */}
      <h2 className="text-xl font-bold mb-4">Commandes supprimées</h2>
      {deletedOrders.length === 0 ? (
        <p className="text-base-content mb-6">Aucune commande supprimée.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
          {deletedOrders.map(order => (
            <div key={order.id} className="border rounded-xl p-4 shadow-sm bg-base-100 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg">Commande #{order.id}</h3>
                <p className="text-sm">Téléphone: {order.phone}</p>
                <p className="text-sm">Montant: {order.montant_total} Ariary</p>
                <p className="text-sm">
                  Format: {order.configuration.format_type}{" "}
                  {order.configuration.format_type === "petit"
                    ? `- ${order.configuration.small_format}`
                    : `- ${order.configuration.largeur}x${order.configuration.hauteur} cm`}
                </p>
                <p className="text-sm">Quantité: {order.configuration.quantity}</p>
                <p className="text-sm">Options: {order.configuration.options || "-"}</p>

                <div className="mt-2">
                  <strong>Fichiers:</strong>
                  {order.fichiers.map((f, idx) => (
                    <div key={idx} className="text-sm ml-2">
                      {f.nom_fichier} ({f.format}, {f.resolution_dpi} DPI, {f.profil_couleur})
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 shadow"
                  onClick={() => handleRestore({ type: "order", id: order.id })}
                >
                  <RotateCcw size={16} /> Restaurer
                </button>
                <button
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow"
                  onClick={() => handleDeleteForever({ type: "order", id: order.id })}
                >
                  <Trash2 size={16} /> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* -------------------- Notifications -------------------- */}
      <h2 className="text-xl font-bold mb-4">Notifications supprimées</h2>
      {deletedNotifications.length === 0 ? (
        <p className="text-base-content">Aucune notification supprimée.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deletedNotifications.map(notif => (
            <div key={notif.id} className="border rounded-xl p-4 shadow-sm bg-base-100 flex flex-col justify-between">
              <div>
                <p className="font-semibold">{notif.message}</p>
                <p className="text-sm text-gray-500">Envoyée par: {notif.user_email}</p>
                <p className="text-sm text-gray-500">Date: {new Date(notif.created_at).toLocaleString()}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 shadow"
                  onClick={() => handleRestore({ type: "notification", id: notif.id, message: notif.message })}
                >
                  <RotateCcw size={16} /> Restaurer
                </button>
                <button
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow"
                  onClick={() => handleDeleteForever({ type: "notification", id: notif.id, message: notif.message })}
                >
                  <Trash2 size={16} /> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* -------------------- Modal confirmation -------------------- */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              {showModal === "restore" ? "⚡ Restaurer" : "⚠️ Supprimer définitivement"}
            </h3>
            <p className="mb-4">
              {showModal === "restore"
                ? `Voulez-vous vraiment restaurer ${
                    selectedItem.type === "order" ? `la commande #${selectedItem.id}` : `"${selectedItem.message}"`
                  } ?`
                : `Êtes-vous sûr de supprimer définitivement ${
                    selectedItem.type === "order" ? `la commande #${selectedItem.id}` : `"${selectedItem.message}"`
                  } ? Cette action est irréversible.`}
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex items-center gap-2 px-3 py-1 rounded-lg border"
              >
                <X size={16} /> Annuler
              </button>
              <button
                onClick={confirmAction}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                  showModal === "restore" ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                <Check size={16} /> Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

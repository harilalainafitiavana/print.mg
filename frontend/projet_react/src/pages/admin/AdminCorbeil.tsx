import { useState, useEffect } from "react";
import { RotateCcw, Trash, X, Check } from "lucide-react";
import { authFetch } from "../../Components/Utils";

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


// ------------------- Component -------------------
export default function AdminCorbeille() {
  // Commandes
  const [deletedOrders, setDeletedOrders] = useState<DeletedOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<DeletedOrder | null>(null);

  // Notifications
  const [deletedNotifications, setDeletedNotifications] = useState<DeletedNotification[]>([]);
  const [selectedNotif, setSelectedNotif] = useState<DeletedNotification | null>(null);

  // Modals commandes
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showDeletePermanentModal, setShowDeletePermanentModal] = useState(false);

  // Modals notifications
  const [showRestoreNotifModal, setShowRestoreNotifModal] = useState(false);
  const [showDeleteNotifModal, setShowDeleteNotifModal] = useState(false);

  // ------------------- Fetch commandes supprimées -------------------
  useEffect(() => {
    const fetchDeletedOrders = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:8000/api/commandes/deleted/", {
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

        const res = await fetch("http://localhost:8000/api/notifications/deleted/", {
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
      const res = await authFetch(`http://localhost:8000/api/commandes/${selectedOrder.id}/restore/`, { method: "POST" });
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
      const res = await authFetch(`http://localhost:8000/api/commandes/${selectedOrder.id}/delete_forever/`, { method: "DELETE" });
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
      const res = await authFetch(`http://localhost:8000/api/notifications/restore/${selectedNotif.id}/`, { method: "POST" });
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
      const res = await authFetch(`http://localhost:8000/api/notifications/delete-forever/${selectedNotif.id}/`, { method: "DELETE" });
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🗑️ Corbeille</h1>

      {/* ------------------- SECTION COMMANDES ------------------- */}
      <h2 className="text-xl font-semibold mb-4">📦 Commandes supprimées</h2>
      {deletedOrders.length === 0 ? (
        <p className="text-base-content">Aucune commande supprimée.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {deletedOrders.map(order => (
            <div key={order.id} className="bg-base-100 shadow rounded-xl p-4">
              <p className="font-semibold">{order.name}</p>
              <p className="text-sm">Utilisateur : {order.user_name}</p>
              <p className="text-sm">Email : {order.user_email}</p>
              <p className="text-sm">
                Format: {order.configuration.format_type}{" "}
                {order.configuration.format_type === "petit"
                  ? `- ${order.configuration.small_format}`
                  : `- ${order.configuration.largeur}x${order.configuration.hauteur} cm`}
              </p>
              <p className="text-sm">Quantité: {order.configuration.quantity}</p>
              <p className="text-sm">Options: {order.configuration.options || "-"}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => { setSelectedOrder(order); setShowRestoreModal(true); }}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg"><RotateCcw size={16} /></button>
                <button onClick={() => { setSelectedOrder(order); setShowDeletePermanentModal(true); }}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg"><Trash size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ------------------- SECTION NOTIFICATIONS ------------------- */}
      <h2 className="text-xl font-semibold mt-8 mb-4">🔔 Notifications supprimées</h2>
      {deletedNotifications.length === 0 ? (
        <p className="text-base-content">Aucune notification supprimée.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {deletedNotifications.map(notif => (
            <div key={notif.id} className="bg-base-100 shadow rounded-xl p-4">
              <p className="font-bold">{notif.message}</p>
              <p className="text-sm text-base-content">  Envoyée par : {notif.sender_info ? notif.sender_info.email : "Inconnu"}</p>
              <p className="text-sm text-base-content">Date : {new Date(notif.created_at).toLocaleString()}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => { setSelectedNotif(notif); setShowRestoreNotifModal(true); }}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg"><RotateCcw size={16} /></button>
                <button onClick={() => { setSelectedNotif(notif); setShowDeleteNotifModal(true); }}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg"><Trash size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ------------------- MODALS COMMANDES ------------------- */}
      {showRestoreModal && selectedOrder && (
        <Modal title="⚡ Restaurer la commande"
          message={`Voulez-vous vraiment restaurer ${selectedOrder.name} ?`}
          onCancel={() => setShowRestoreModal(false)}
          onConfirm={confirmRestore} />
      )}

      {showDeletePermanentModal && selectedOrder && (
        <Modal title="⚠️ Suppression définitive"
          message={`La commande ${selectedOrder.name} sera supprimée définitivement.`}
          onCancel={() => setShowDeletePermanentModal(false)}
          onConfirm={confirmDeletePermanent} danger />
      )}

      {/* ------------------- MODALS NOTIFICATIONS ------------------- */}
      {showRestoreNotifModal && selectedNotif && (
        <Modal title="⚡ Restaurer la notification"
          message={`Voulez-vous vraiment restaurer cette notification ?`}
          onCancel={() => setShowRestoreNotifModal(false)}
          onConfirm={confirmRestoreNotification} />
      )}

      {showDeleteNotifModal && selectedNotif && (
        <Modal title="⚠️ Suppression définitive"
          message={`Cette notification sera supprimée définitivement.`}
          onCancel={() => setShowDeleteNotifModal(false)}
          onConfirm={confirmDeletePermanentNotif} danger />
      )}
    </div>
  );
}

// ------------------- Modal générique -------------------
function Modal({ title, message, onCancel, onConfirm, danger = false }:
  { title: string, message: string, onCancel: () => void, onConfirm: () => void, danger?: boolean }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-base-100 p-6 rounded-xl max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-4">
          <button onClick={onCancel} className="px-3 py-1 rounded-lg border flex items-center gap-2">
            <X size={16} /> Annuler
          </button>
          <button onClick={onConfirm}
            className={`px-3 py-1 rounded-lg text-white flex items-center gap-2 ${danger ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}>
            <Check size={16} /> Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

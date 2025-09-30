import { useState, useEffect } from "react";
import { RotateCcw, Trash, X, Check } from "lucide-react";
import { authFetch } from "../../Components/Utils";

// Types pour fichiers et configuration
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

export default function AdminCorbeille() {
  const [deletedOrders, setDeletedOrders] = useState<DeletedOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<DeletedOrder | null>(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showDeletePermanentModal, setShowDeletePermanentModal] = useState(false);

  // 🔹 Récupération des commandes supprimées
  useEffect(() => {
    const fetchDeletedOrders = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) return alert("Vous devez être connecté pour effectuer cette action.");

        const res = await fetch("http://localhost:8000/api/commandes/deleted/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Erreur lors de la récupération des commandes supprimées");

        const data: DeletedOrder[] = await res.json();
        setDeletedOrders(data);
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la récupération des commandes supprimées");
      }
    };

    fetchDeletedOrders();
  }, []);

  // 🔹 Gestion des modals
  const handleRestoreClick = (order: DeletedOrder) => {
    setSelectedOrder(order);
    setShowRestoreModal(true);
  };

  const handleDeletePermanentClick = (order: DeletedOrder) => {
    setSelectedOrder(order);
    setShowDeletePermanentModal(true);
  };

  // 🔹 Restaurer une commande
  const confirmRestore = async () => {
    if (!selectedOrder) return;

    try {
      const res = await authFetch(
        `http://localhost:8000/api/commandes/${selectedOrder.id}/restore/`,
        { method: "POST" }
      );
      if (res.ok) {
        setDeletedOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
        alert(`Commande ${selectedOrder.name} restaurée ✅`);
      } else {
        alert("Impossible de restaurer la commande");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau");
    }

    setShowRestoreModal(false);
  };

  // 🔹 Supprimer définitivement
  const confirmDeletePermanent = async () => {
    if (!selectedOrder) return;

    try {
      const res = await authFetch(
        `http://localhost:8000/api/commandes/${selectedOrder.id}/delete_forever/`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setDeletedOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
        alert(`Commande ${selectedOrder.name} supprimée définitivement ✅`);
      } else {
        alert("Impossible de supprimer la commande");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau");
    }

    setShowDeletePermanentModal(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🗑️ Corbeille des commandes</h1>

      {deletedOrders.length === 0 ? (
        <p className="text-gray-500">Aucune commande supprimée.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {deletedOrders.map(order => (
            <div key={order.id} className="bg-white shadow rounded-xl p-4 flex flex-col justify-between">
              {/* Informations de la commande */}
              <div>
                <p className="font-semibold">{order.name}</p>
                <p className="text-sm text-gray-500">Utilisateur : {order.user_name}</p>
                <p className="text-sm text-gray-500">Email : {order.user_email}</p>
                <p className="text-sm text-gray-500">Téléphone : {order.user_phone}</p>
                <p className="text-sm text-gray-500">Date : {new Date(order.date_commande).toLocaleString()}</p>
                <p className="text-sm text-gray-500">
                  Fichier : {order.fichiers?.map(f => f.nom_fichier).join(", ")}
                </p>
                <p className="text-sm text-gray-500">
                  Quantité : {order.configuration?.quantity}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleRestoreClick(order)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  <RotateCcw size={16} /> Restaurer
                </button>
                <button
                  onClick={() => handleDeletePermanentClick(order)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  <Trash size={16} /> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Restaurer */}
      {showRestoreModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">⚡ Restaurer la commande</h3>
            <p className="mb-4">
              Voulez-vous vraiment restaurer <strong>{selectedOrder.name}</strong> ?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowRestoreModal(false)}
                className="flex items-center gap-2 px-3 py-1 rounded-lg border"
              >
                <X size={16} /> Annuler
              </button>
              <button
                onClick={confirmRestore}
                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                <Check size={16} /> Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Supprimer définitivement */}
      {showDeletePermanentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">⚠️ Suppression définitive</h3>
            <p className="mb-4">
              La commande <strong>{selectedOrder.name}</strong> sera supprimée définitivement.
              Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeletePermanentModal(false)}
                className="flex items-center gap-2 px-3 py-1 rounded-lg border"
              >
                <X size={16} /> Annuler
              </button>
              <button
                onClick={confirmDeletePermanent}
                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
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

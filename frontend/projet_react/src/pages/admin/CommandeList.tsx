import { useState } from "react";
import { Bell, Eye, X, Check, Download, Trash } from "lucide-react";

export default function AdminCommande() {
  // Exemple de commandes (mock data)
  const allOrders = [
    {
      id: 1,
      name: "Commande #001",
      user: "Alice",
      date: "2025-09-15",
      status: "En attente",
      fileName: "brochure.pdf",
      dpi: 300,
      colorProfile: "CMJN",
      formatType: "petit",
      smallFormat: "A4",
      paperType: "Papier glacé",
      finish: "Brillant",
      quantity: 50,
      phone: "0341234567",
      amount: 20000,
      options: "Reliure spirale",
    },
    {
      id: 2,
      name: "Commande #002",
      user: "Bob",
      date: "2025-09-16",
      status: "Reçue",
      fileName: "poster.jpg",
      dpi: 150,
      colorProfile: "CYMK",
      formatType: "grand",
      customSize: { width: 120, height: 80 },
      paperType: "Papier mat",
      finish: "Standard",
      quantity: 10,
      phone: "0349876543",
      amount: 15000,
      options: "",
    },
  ];

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");

  // ✅ Voir les détails
  const handleView = (order: any) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  // ✅ Notifier
  const handleNotify = (order: any) => {
    setSelectedOrder(order);
    setShowNotifyModal(true);
  };

  // Ouverture du modal Supprimer
  const handleDeleteClick = (order: any) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  // Confirmation réelle
  const confirmDelete = () => {
    alert(
      `Commande ${selectedOrder.id} déplacée dans la corbeille (30 jours avant suppression automatique)`
    );
    // TODO: Appel API Django pour déplacer la commande dans la corbeille
    setShowDeleteModal(false);
  };

  // ✅ Envoyer notification
  const sendNotification = () => {
    alert(
      `Notification envoyée à ${selectedOrder?.user} : "${notifyMessage}"`
    );
    // 👉 Ici appel API Django (ex: POST /api/notify) avec { userId, notifyMessage }
    setNotifyMessage("");
    setShowNotifyModal(false);
  };

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">📋 Liste des commandes</h1>
      </header>

      {/* TABLE DES COMMANDES */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Commande</th>
              <th className="px-4 py-3">Utilisateur</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 font-medium">{order.id}</td>
                <td className="px-4 py-3">{order.name}</td>
                <td className="px-4 py-3">{order.user}</td>
                <td className="px-4 py-3">{order.date}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${order.status === "Reçue"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                      }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex justify-center gap-2">
                  <button
                    onClick={() => window.open(`http://localhost:8000/media/commandes/${order.fileName}`, "_blank")}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600"
                  >
                    <Download size={16} />
                  </button>

                  <button
                    onClick={() => handleView(order)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    onClick={() => handleNotify(order)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600"
                  >
                    <Bell size={16} />
                  </button>
                  
                  {/* Supprimer */}
                  <button
                    onClick={() => handleDeleteClick(order)}
                    className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                    title="Supprimer"
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DETAILS */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">📄 Détails de la commande</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Fichier :</strong> {selectedOrder.fileName}
              </p>
              <p>
                <strong>DPI :</strong> {selectedOrder.dpi}
              </p>
              <p>
                <strong>Profil :</strong> {selectedOrder.colorProfile}
              </p>
              <p>
                <strong>Format :</strong>{" "}
                {selectedOrder.formatType === "petit"
                  ? `Petit - ${selectedOrder.smallFormat}`
                  : `Grand - ${selectedOrder.customSize?.width}x${selectedOrder.customSize?.height} cm`}
              </p>
              <p>
                <strong>Papier :</strong> {selectedOrder.paperType}
              </p>
              <p>
                <strong>Finition :</strong> {selectedOrder.finish}
              </p>
              <p>
                <strong>Quantité :</strong> {selectedOrder.quantity}
              </p>
              <p>
                <strong>Téléphone :</strong> {selectedOrder.phone}
              </p>
              <p>
                <strong>Montant :</strong> {selectedOrder.amount} Ariary
              </p>
              <p>
                <strong>Options :</strong>{" "}
                {selectedOrder.options || "-"}
              </p>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowDetailModal(false)}
                className="btn btn-outline flex items-center gap-2"
              >
                <X size={16} /> Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOTIFICATION */}
      {showNotifyModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              🔔 Envoyer une notification à {selectedOrder.user}
            </h3>
            <textarea
              className="textarea textarea-bordered w-full mb-4"
              rows={3}
              placeholder="Votre commande est bien reçue..."
              value={notifyMessage}
              onChange={(e) => setNotifyMessage(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowNotifyModal(false)}
                className="btn btn-outline flex items-center gap-2"
              >
                <X size={16} /> Annuler
              </button>
              <button
                onClick={sendNotification}
                className="btn btn-primary flex items-center gap-2"
              >
                <Check size={16} /> Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL SUPPRESSION */}
      {showDeleteModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">⚠️ Confirmer la suppression</h3>
            <p className="mb-4">
              La commande <strong>{selectedOrder.name}</strong> sera déplacée dans la corbeille.
              Elle sera supprimée automatiquement après 30 jours.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-outline flex items-center gap-2"
              >
                <X size={16} /> Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="btn btn-primary flex items-center gap-2"
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

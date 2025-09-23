import { useState } from "react";
import { RotateCcw, Trash, X, Check } from "lucide-react";

export default function AdminCorbeille() {
  const deletedOrders = [
    {
      id: 1,
      name: "Commande #001",
      user: "Alice",
      date: "2025-09-15",
      fileName: "brochure.pdf",
      quantity: 50,
    },
    {
        id: 2,
        name: "Commande #001",
        user: "Alice",
        date: "2025-09-15",
        fileName: "brochure.pdf",
        quantity: 50,
      },
    {
      id: 3,
      name: "Commande #002",
      user: "Bob",
      date: "2025-09-16",
      fileName: "poster.jpg",
      quantity: 10,
    },
  ];

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showDeletePermanentModal, setShowDeletePermanentModal] = useState(false);

  const handleRestoreClick = (order: any) => {
    setSelectedOrder(order);
    setShowRestoreModal(true);
  };

  const handleDeletePermanentClick = (order: any) => {
    setSelectedOrder(order);
    setShowDeletePermanentModal(true);
  };

  const confirmRestore = () => {
    alert(`Commande ${selectedOrder.name} restaurée avec succès !`);
    setShowRestoreModal(false);
    // TODO: API pour restaurer
  };

  const confirmDeletePermanent = () => {
    alert(`Commande ${selectedOrder.name} supprimée définitivement !`);
    setShowDeletePermanentModal(false);
    // TODO: API pour suppression définitive
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🗑️ Corbeille des commandes</h1>

      <div className="grid md:grid-cols-2 gap-4">
        {deletedOrders.map((order) => (
          <div key={order.id} className="bg-white shadow rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <p className="font-semibold">{order.name}</p>
              <p className="text-sm text-gray-500">Utilisateur : {order.user}</p>
              <p className="text-sm text-gray-500">Date : {order.date}</p>
              <p className="text-sm text-gray-500">Fichier : {order.fileName}</p>
              <p className="text-sm text-gray-500">Quantité : {order.quantity}</p>
            </div>

            <div className="flex gap-2 mt-2 md:mt-0">
              <button
                onClick={() => handleRestoreClick(order)}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                title="Restaurer"
              >
                <RotateCcw size={16} /> Restaurer
              </button>

              <button
                onClick={() => handleDeletePermanentClick(order)}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
                title="Supprimer définitivement"
              >
                <Trash size={16} /> Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

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
                className="btn btn-outline flex items-center gap-2"
              >
                <X size={16} /> Annuler
              </button>
              <button
                onClick={confirmRestore}
                className="btn btn-primary flex items-center gap-2"
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
                className="btn btn-outline flex items-center gap-2"
              >
                <X size={16} /> Annuler
              </button>
              <button
                onClick={confirmDeletePermanent}
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

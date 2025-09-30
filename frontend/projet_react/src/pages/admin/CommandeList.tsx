import { useEffect, useState } from "react";
import { Eye, Bell, Trash, Download, X, Check } from "lucide-react";
import { authFetch } from "../../Components/Utils";

export default function AdminCommande() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await authFetch("http://localhost:8000/api/admin/commandes/");
        const data = await res.json();
        setOrders(data);
      } catch (err: any) {
        alert(err.message);
      }
    }
    loadOrders();
  }, []);

  const handleView = (order: any) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleNotify = (order: any) => {
    setSelectedOrder(order);
    setShowNotifyModal(true);
  };

  const handleDeleteClick = (order: any) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedOrder) return;
    try {
      const res = await authFetch(`http://localhost:8000/api/commandes/${selectedOrder.id}/soft_delete/`, {
        method: "POST"
      });
      if (res.ok) {
        // ✅ Filtrer la commande supprimée pour la retirer de la liste principale
        setOrders(prev => prev.filter(o => o.id !== selectedOrder.id));

        alert("Commande déplacée dans la corbeille ✅");
      } else {
        alert("Impossible de supprimer la commande");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau");
    }
    setShowDeleteModal(false);
  };



  const sendNotification = async () => {
    if (!selectedOrder) return;
    try {
      const res = await authFetch("http://localhost:8000/api/notify/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedOrder.utilisateur, // adapte selon ton backend
          message: notifyMessage,
        }),
      });
      if (res.ok) alert("Notification envoyée ✅");
    } catch (err) {
      console.error(err);
      alert("Erreur réseau");
    }
    setNotifyMessage("");
    setShowNotifyModal(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📋 Liste des commandes</h1>

      <table className="w-full text-left border-collapse">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Prenom et nom</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Téléphone</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{order.id}</td>
              <td className="px-4 py-2">{order.user_name}</td>
              <td className="px-4 py-2">{order.user_email}</td>
              <td className="px-4 py-2">{order.user_phone}</td>
              <td className="px-4 py-2 flex gap-2 justify-center">
                <a
                  href={`http://127.0.0.1:8000/download/${order.fichiers[0]?.id}/`}
                  download
                  className="bg-indigo-500 text-white p-2 rounded"
                >
                  <Download size={16} />
                </a>
                <button onClick={() => handleView(order)} className="bg-blue-500 text-white p-2 rounded">
                  <Eye size={16} />
                </button>
                <button onClick={() => handleNotify(order)} className="bg-green-500 text-white p-2 rounded">
                  <Bell size={16} />
                </button>
                <button
                  onClick={() => handleDeleteClick(order)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal détail complet Admin */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-lg w-full overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-4">📄 Détails de la commande #{selectedOrder.id}</h3>

            <p><strong>Utilisateur :</strong> {selectedOrder.user_name} ({selectedOrder.user_email})</p>
            <p><strong>Date commande :</strong> {new Date(selectedOrder.date_commande).toLocaleString()}</p>
            <p><strong>Montant :</strong> {selectedOrder.montant_total} Ariary</p>
            <p><strong>Statut paiement :</strong> {selectedOrder.paiement?.statut_paiement || "-"}</p>
            <p><strong>Téléphone :</strong> {selectedOrder.paiement?.phone || "-"}</p>

            <hr className="my-2" />

            <h4 className="font-semibold mt-2">📂 Fichiers :</h4>
            {selectedOrder.fichiers.map((f: any) => (
              <div key={f.id} className="border-b border-gray-200 py-4 flex justify-between items-center">
                <div className="space-y-1">
                  <p><strong>Nom :</strong> {f.nom_fichier}</p>
                  <p><strong>Format :</strong> {f.format}</p>
                  <p><strong>Profil_couleur :</strong> {f.resolution_dpi}</p>
                  <p><strong>Profil :</strong> {f.profil_couleur}</p>
                  <p><strong>Taille :</strong> {f.taille}</p>
                </div>

                <div>
                  <a
                    href={`http://127.0.0.1:8000/download/${f.id}/`}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-all"
                  >
                    <Download size={16} /> Télécharger
                  </a>
                </div>
              </div>
            ))}

            {/* <hr className="my-2" /> */}

            <h4 className="font-semibold mt-2">⚙️ Configuration :</h4>
            <p><strong>Type format :</strong> {selectedOrder.configuration.format_type}</p>
            {selectedOrder.configuration.format_type === "petit" && (
              <p><strong>Small format :</strong> {selectedOrder.configuration.small_format || "-"}</p>
            )}
            <p><strong>Largeur x Hauteur :</strong> {selectedOrder.configuration.largeur || "-"} x {selectedOrder.configuration.hauteur || "-"}</p>
            <p><strong>Papier :</strong> {selectedOrder.configuration.paper_type || "-"}</p>
            <p><strong>Finition :</strong> {selectedOrder.configuration.finish || "-"}</p>
            <p><strong>Quantité :</strong> {selectedOrder.configuration.quantity}</p>
            {selectedOrder.configuration.duplex && <p><strong>Duplex :</strong> {selectedOrder.configuration.duplex}</p>}
            {selectedOrder.configuration.binding && <p><strong>Reliure :</strong> {selectedOrder.configuration.binding}</p>}
            {selectedOrder.configuration.cover_paper && <p><strong>Couverture :</strong> {selectedOrder.configuration.cover_paper}</p>}
            <p><strong>Options :</strong> {selectedOrder.configuration.options || "-"}</p>

            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 rounded-lg border flex items-center gap-2 hover:bg-red-600 hover:text-white">
                <X size={16} /> Fermer
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Modal notification */}
      {showNotifyModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">🔔 Envoyer notification à {selectedOrder.user_name}</h2>
            <textarea className="textarea textarea-bordered w-full mb-4" rows={3} placeholder="Votre message..." value={notifyMessage} onChange={(e) => setNotifyMessage(e.target.value)} />
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowNotifyModal(false)} className="btn btn-outline flex items-center gap-2"><X size={16} /> Annuler</button>
              <button onClick={sendNotification} className="btn btn-primary flex items-center gap-2"><Check size={16} /> Envoyer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal suppression */}
      {showDeleteModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">⚠️ Confirmer la suppression</h2>
            <p>La commande <strong>{selectedOrder.user_name}</strong> sera déplacée dans la corbeille.</p>
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setShowDeleteModal(false)} className="btn btn-outline flex items-center gap-2"><X size={16} /> Annuler</button>
              <button onClick={confirmDelete} className="btn btn-primary flex items-center gap-2"><Check size={16} /> Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

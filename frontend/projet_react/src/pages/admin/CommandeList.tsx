import { useEffect, useState } from "react";
import { Eye, Bell, Trash, Download, X, Check, Printer } from "lucide-react";
import { authFetch } from "../../Components/Utils";

export default function AdminCommande() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showClickModal, setShowClickModal] = useState(false);


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

  const handlePrintClick = (order: any) => {
    setSelectedOrder(order);
    setShowClickModal(true);
  }

  const confirmDelete = async () => {
    if (!selectedOrder) return;
    try {
      const res = await authFetch(`http://localhost:8000/api/commandes/${selectedOrder.id}/soft_delete/`, {
        method: "POST"
      });
      if (res.ok) {
        // ✅ Filtrer la commande supprimée pour la retirer de la liste principale
        setOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
      } else {
        alert("Impossible de supprimer la commande");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau");
    }
    setShowDeleteModal(false);
  };

  const handleFinishClick = (order: any) => {
    setSelectedOrder(order);
    setShowFinishModal(true);
  };


  const handleFinish = async (order: any) => {
    try {
      const res = await authFetch(`http://localhost:8000/api/commandes/${order.id}/terminer/`, {
        method: "POST",
      });

      if (res.ok) {
        setShowFinishModal(false); // 🔹 Ferme le modal
        setSelectedOrder(null);    // 🔹 Réinitialise l'ordre sélectionné
      } else {
        alert("❌ Erreur lors de l'envoi de la notification");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau");
    }
  };

  const handleEncours = async (order: any) => {
    try {
      const res = await authFetch(`http://localhost:8000/api/commandes/${order.id}/encours/`, {
        method: "POST",
      });

      if (res.ok) {
        setShowClickModal(false); // 🔹 Ferme le modal
        setSelectedOrder(null);    // 🔹 Réinitialise l'ordre sélectionné
      } else {
        alert("❌ Erreur lors de l'envoi de la notification");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau");
    }
  };


  const sendNotification = async () => {
    if (!notifyMessage.trim()) {
      return alert("Veuillez écrire un message");
    }

    console.log("selectedOrder:", selectedOrder);

    try {
      const res = await authFetch("http://localhost:8000/api/send-notification/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: selectedOrder.user_email, // email de l'user depuis modèle Utilisateurs
          message: notifyMessage,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Erreur lors de l'envoi");
      }

      const data = await res.json();
      console.log("✅ Notification envoyée :", data);

      // UI update
      alert("Notification envoyée !");
      setNotifyMessage("");
      setShowNotifyModal(false);
    } catch (err) {
      console.error("❌ Erreur envoi notification:", err);
      alert("Impossible d'envoyer la notification");
    }
  };


  // --- Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 7; // nombre d’éléments par page

  // Calcul des indices
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Nombre total de pages
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
          {currentOrders.map(order => (
            <tr key={order.id} className="border-b hover:bg-base-200">
              <td className="px-4 py-2">{order.id}</td>
              <td className="px-4 py-2">{order.user_name}</td>
              <td className="px-4 py-2">{order.user_email}</td>
              <td className="px-4 py-2">{order.user_phone}</td>
              <td className="px-4 py-2 flex gap-2 justify-center">
                <button
                  onClick={() => handlePrintClick(order)}
                  className="bg-blue-600 hover:bg-blue-400 text-white p-2 rounded flex items-center gap-1"
                >
                  <Printer size={16} />
                </button>
                <button
                  onClick={() => handleFinishClick(order)}
                  className="bg-purple-500 text-white p-2 rounded"
                >
                  <Check size={16} />
                </button>

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

      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {page}
          </button>
        ))}
      </div>


      {/* Modal détail complet Admin */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-xl max-w-lg w-full overflow-y-auto max-h-[90vh]">
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
            <p><strong>Nombre de pages :</strong> {selectedOrder.configuration.book_pages || "-"} </p>
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
          <div className="bg-base-100 p-6 rounded-xl max-w-md w-full">
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
          <div className="bg-base-100 p-6 rounded-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">⚠️ Confirmer la suppression</h2>
            <p>La commande <strong>{selectedOrder.user_name}</strong> sera déplacée dans la corbeille.</p>
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setShowDeleteModal(false)} className="btn btn-outline flex items-center gap-2"><X size={16} /> Annuler</button>
              <button onClick={confirmDelete} className="btn btn-primary flex items-center gap-2"><Check size={16} /> Confirmer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmation Terminer */}
      {showFinishModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">⚡ Confirmer l’action</h2>
            <p>Êtes-vous sûr de vouloir marquer la commande <strong>#{selectedOrder.id}</strong> de <strong> {selectedOrder.user_email} </strong> comme <span className="text-purple-600 font-semibold">terminée</span> ?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowFinishModal(false)}
                className="btn btn-outline flex items-center gap-2"
              >
                <X size={16} /> Annuler
              </button>
              <button
                onClick={() => handleFinish(selectedOrder)}
                className="btn btn-primary bg-purple-600 text-white flex items-center gap-2"
              >
                <Check size={16} /> Envoyer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmation En cours */}
      {showClickModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">⚡ Confirmer l’action</h2>
            <p>Êtes-vous sûr de vouloir marquer la commande <strong>#{selectedOrder.id}</strong> de <strong> {selectedOrder.user_email} </strong> comme <span className="text-purple-600 font-semibold">En cours!</span> ?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowClickModal(false)}
                className="btn btn-outline flex items-center gap-2"
              >
                <X size={16} /> Annuler
              </button>
              <button
                onClick={() => handleEncours(selectedOrder)}
                className="btn btn-primary bg-purple-600 text-white flex items-center gap-2"
              >
                <Check size={16} /> Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from "react";
import { Eye, Bell, Trash, Download, X, Check, Printer, Wrench } from "lucide-react";
import { authFetch } from "../../Components/Utils";
import { useTranslation } from "react-i18next";
import API_BASE_URL from "../../services/api";


export default function AdminCommande() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showClickModal, setShowClickModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false)
  // const lang = "fr"; // ou "en", "mg"


  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await authFetch(`${API_BASE_URL}/api/admin/commandes/`);
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
      const res = await authFetch(`${API_BASE_URL}/api/commandes/${selectedOrder.id}/soft_delete/`, {
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
      const res = await authFetch(`${API_BASE_URL}/api/commandes/${order.id}/terminer/`, {
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
      const res = await authFetch(`${API_BASE_URL}/api/commandes/${order.id}/encours/`, {
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
      const res = await authFetch(`${API_BASE_URL}/api/send-notification/`, {
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

  const handleChangeStatut = async (id: number, nouveauStatut: string) => {
    try {
      const res = await authFetch(`${API_BASE_URL}/commandes/${id}/update_statut/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statut: nouveauStatut }),
      });

      if (!res.ok) throw new Error("Erreur lors du changement de statut");

      const data = await res.json();
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === id ? { ...order, statut: nouveauStatut } : order
        )
      );
      console.log("✅ Statut mis à jour :", data.message);
    } catch (err) {
      console.error(err);
      alert("❌ Impossible de changer le statut de la commande");
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
      <h1 className="text-2xl font-bold mb-4">📋 {t("orders.title")}</h1>

      <table className="w-full text-left border-collapse">
        <thead className="bg-gradient-to-r from-violet-600 to-pink-500 text-white">
          <tr>
            <th className="px-4 py-2">{t("orders.table.id")}</th>
            <th className="px-4 py-2">{t("orders.table.name")}</th>
            <th className="px-4 py-2">{t("orders.table.email")}</th>
            <th className="px-4 py-2">{t("orders.table.phone")}</th>
            <th className="px-4 py-2 text-center">{t("orders.table.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map(order => (
            <tr key={order.id} className="border-b hover:bg-base-200">
              <td className="px-4 py-2">{order.id}</td>
              <td className="px-4 py-2">{order.user_name}</td>
              <td className="px-4 py-2">{order.user_email}</td>
              <td className="px-4 py-2">{order.user_phone}</td>
              <td className="px-4 py-2 text-center flex">
                {/* Sélecteur de statut */}
                <select
                  value={order.statut}
                  onChange={(e) => handleChangeStatut(order.id, e.target.value)}
                  className={`border text-sm rounded-lg px-2 py-1 font-medium transition-colors
                    ${order.statut === "TERMINE"
                      ? "bg-green-100 text-green-800 border-green-300"
                      : order.statut === "EN_COURS_IMPRESSION"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                        : order.statut === "RECU"
                          ? "bg-orange-100 text-orange-800 border-orange-300"
                          : order.statut === "EN_ATTENTE"
                            ? "bg-gray-100 text-gray-700 border-gray-300"
                            : order.statut === "EN_COURS_LIVRAISON"
                              ? "bg-blue-100 text-blue-800 border-blue-300"
                              : "bg-red-100 text-red-800 border-red-200"
                    }`}
                >
                  <option value="EN_ATTENTE">{t("orders.status.pending")}</option>
                  <option value="RECU">{t("orders.status.received")}</option>
                  <option value="EN_COURS_IMPRESSION">{t("orders.status.printing")}</option>
                  <option value="TERMINE">{t("orders.status.finished")}</option>
                  <option value="EN_COURS_LIVRAISON">{t("orders.status.shipping")}</option>
                  <option value="LIVREE">{t("orders.status.delivered")}</option>
                </select>
                {/* Action modale */}
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowActionModal(true);
                  }}

                  className="bg-gradient-to-r from-violet-600 to-pink-500 text-white ml-4 px-4 py-2 rounded-lg hover:bg-indigo-600 flex items-center gap-2"
                >
                  {t("orders.table.actions")} <Wrench size={16} />
                </button>

                {/* Modal des actions */}
                {showActionModal && selectedOrder && (
                  <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex justify-center items-center z-50 transition-all duration-300">
                    <div className="bg-base-100 p-6 rounded-xl max-w-md w-full shadow-2xl">
                      <h2 className="text-xl font-bold mb-4">⚡ {t("orders.modal.actions_for_order", { id: selectedOrder.id })}</h2>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Imprimer → En cours */}
                        <button
                          onClick={() => handlePrintClick(selectedOrder)}
                          className="bg-blue-500 text-white p-3 rounded-lg flex flex-col items-center gap-1 hover:bg-blue-600"
                        >
                          <Printer size={24} />
                          <span>{t("orders.actions.in_progress")}</span>
                        </button>

                        {/* Terminé */}
                        <button
                          onClick={() => handleFinishClick(selectedOrder)}
                          className="bg-purple-500 text-white p-3 rounded-lg flex flex-col items-center gap-1 hover:bg-purple-600"
                        >
                          <Check size={24} />
                          <span>{t("orders.actions.finished")}</span>
                        </button>

                        {/* Télécharger */}
                        <a
                          href={`http://127.0.0.1:8000/download/${selectedOrder.fichiers[0]?.id}/`}
                          download
                          className="bg-indigo-500 text-white p-3 rounded-lg flex flex-col items-center gap-1 hover:bg-indigo-600"
                        >
                          <Download size={24} />
                          <span>{t("orders.actions.download")}</span>
                        </a>

                        {/* Voir détails */}
                        <button
                          onClick={() => handleView(selectedOrder)}
                          className="bg-green-500 text-white p-3 rounded-lg flex flex-col items-center gap-1 hover:bg-green-600"
                        >
                          <Eye size={24} />
                          <span>{t("orders.actions.details")}</span>
                        </button>

                        {/* Envoyer notification */}
                        <button
                          onClick={() => handleNotify(selectedOrder)}
                          className="bg-yellow-500 text-white p-3 rounded-lg flex flex-col items-center gap-1 hover:bg-yellow-600"
                        >
                          <Bell size={24} />
                          <span>{t("orders.actions.notification")}</span>
                        </button>

                        {/* Supprimer */}
                        <button
                          onClick={() => handleDeleteClick(selectedOrder)}
                          className="bg-red-500 text-white p-3 rounded-lg flex flex-col items-center gap-1 hover:bg-red-600"
                        >
                          <Trash size={24} />
                          <span>{t("orders.actions.delete")}</span>
                        </button>
                      </div>

                      <div className="flex justify-end mt-4">
                        <button
                          onClick={() => setShowActionModal(false)}
                          className="px-4 py-2 rounded-lg border hover:bg-gray-200"
                        >
                          {t("orders.modal.close")}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
            <h3 className="text-xl font-bold mb-4">📄 {t("orders.modal.details_for_order", { id: selectedOrder.id })}</h3>

            <p><strong>{t("orders.modal.user")} :</strong> {selectedOrder.user_name} ({selectedOrder.user_email})</p>
            <p><strong>{t("orders.modal.order_date")} :</strong> {new Date(selectedOrder.date_commande).toLocaleString()}</p>
            <p><strong>{t("orders.modal.total_amount")} :</strong> {selectedOrder.montant_total} Ariary</p>
            <p><strong>{t("orders.modal.payment_status")} :</strong> {selectedOrder.paiement?.statut_paiement || "-"}</p>
            <p><strong>{t("orders.modal.phone")}:</strong> {selectedOrder.paiement?.phone || "-"}</p>

            <hr className="my-2" />

            <h4 className="font-semibold mt-2">📂 {t("orders.modal.files")} :</h4>
            {selectedOrder.fichiers.map((f: any) => (
              <div key={f.id} className="border-b border-gray-200 py-4 flex justify-between items-center">
                <div className="space-y-1">
                  <p><strong>{t("orders.modal.name")} :</strong> {f.nom_fichier}</p>
                  <p><strong>{t("orders.modal.format")} :</strong> {f.format}</p>
                  <p><strong>{t("orders.modal.dpi")} :</strong> {f.resolution_dpi}</p>
                  <p><strong>{t("orders.modal.color_profile")} :</strong> {f.profil_couleur}</p>
                  <p><strong>{t("orders.modal.size")} :</strong> {f.taille}</p>
                </div>

                <div>
                  <a
                    href={`http://127.0.0.1:8000/download/${f.id}/`}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-all"
                  >
                    <Download size={16} /> {t("orders.actions.download")}
                  </a>
                </div>
              </div>
            ))}

            {/* <hr className="my-2" /> */}

            <h4 className="font-semibold mt-2">⚙️ {t("orders.modal.configuration")} :</h4>
            <p><strong>{t("orders.modal.format_type")} :</strong> {selectedOrder.configuration.format_type}</p>
            {selectedOrder.configuration.format_type === "petit" && (
              <p><strong>Small format :</strong> {selectedOrder.configuration.small_format || "-"}</p>
            )}
            <p><strong>{t("orders.modal.largeur_hauteur")} :</strong> {selectedOrder.configuration.largeur || "-"} x {selectedOrder.configuration.hauteur || "-"}</p>
            <p><strong>{t("orders.modal.paper")} :</strong> {selectedOrder.configuration.paper_type || "-"}</p>
            <p><strong>{t("orders.modal.finish")} :</strong> {selectedOrder.configuration.finish || "-"}</p>
            <p><strong>{t("orders.modal.quantity")} :</strong> {selectedOrder.configuration.quantity}</p>
            <p><strong>{t("orders.modal.number_page")} :</strong> {selectedOrder.configuration.book_pages || "-"} </p>
            {selectedOrder.configuration.duplex && <p><strong>{t("orders.modal.duplex")} :</strong> {selectedOrder.configuration.duplex}</p>}
            {selectedOrder.configuration.binding && <p><strong>{t("orders.modal.binding")} :</strong> {selectedOrder.configuration.binding}</p>}
            {selectedOrder.configuration.cover_paper && <p><strong>{t("orders.modal.cover")} :</strong> {selectedOrder.configuration.cover_paper}</p>}
            <p><strong>{t("orders.modal.option")} :</strong> {selectedOrder.configuration.options || "-"}</p>

            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 rounded-lg border flex items-center gap-2 hover:bg-red-600 hover:text-white">
                <X size={16} /> {t("orders.modal.close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal notification */}
      {showNotifyModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">🔔 {t("orders.modal.send_notification_to", { user: selectedOrder.user_name })}</h2>
            <textarea className="textarea textarea-bordered w-full mb-4" rows={3} placeholder={t("orders.modal.your_message")} value={notifyMessage} onChange={(e) => setNotifyMessage(e.target.value)} />
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowNotifyModal(false)} className="btn btn-outline flex items-center gap-2"><X size={16} /> {t("orders.modal.cancel")}</button>
              <button onClick={sendNotification} className="btn btn-primary flex items-center gap-2"><Check size={16} /> {t("orders.modal.send")}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal suppression */}
      {showDeleteModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">⚠️ {t("orders.modal.confirm_delete")}</h2>
            {/* <p>La commande <strong>{selectedOrder.user_name}</strong> sera déplacée dans la corbeille.</p> */}
            <p>{t("orders.modal.order_will_be_moved", { user: selectedOrder.user_name })}</p>
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setShowDeleteModal(false)} className="btn btn-outline flex items-center gap-2"><X size={16} /> {t("orders.modal.cancel")}</button>
              <button onClick={confirmDelete} className="btn btn-primary flex items-center gap-2"><Check size={16} /> {t("orders.actions.delete")}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmation Terminer */}
      {showFinishModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">⚡ {t("orders.modal.confirm_action")}</h2>
            {/* <p>Êtes-vous sûr de vouloir marquer la commande <strong>#{selectedOrder.id}</strong> de <strong> {selectedOrder.user_email} </strong> comme <span className="text-purple-600 font-semibold">terminée</span> ?</p> */}
            <p>{t("orders.modal.confirm_finish_text", { id: selectedOrder.id, email: selectedOrder.user_email })}</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowFinishModal(false)}
                className="btn btn-outline flex items-center gap-2"
              >
                <X size={16} /> {t("orders.modal.cancel")}
              </button>
              <button
                onClick={() => handleFinish(selectedOrder)}
                className="btn btn-primary bg-purple-600 text-white flex items-center gap-2"
              >
                <Check size={16} /> {t("orders.modal.send")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmation En cours */}
      {showClickModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">⚡ {t("orders.modal.confirm_action")}</h2>
            {/* <p>Êtes-vous sûr de vouloir marquer la commande <strong>#{selectedOrder.id}</strong> de <strong> {selectedOrder.user_email} </strong> comme <span className="text-purple-600 font-semibold">En cours!</span> ?</p> */}
            <p>{t("orders.modal.confirm_in_progressing_text", { id: selectedOrder.id, email: selectedOrder.user_email })}</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowClickModal(false)}
                className="btn btn-outline flex items-center gap-2"
              >
                <X size={16} /> {t("orders.modal.cancel")}
              </button>
              <button
                onClick={() => handleEncours(selectedOrder)}
                className="btn btn-primary bg-purple-600 text-white flex items-center gap-2"
              >
                <Check size={16} /> {t("orders.modal.send")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

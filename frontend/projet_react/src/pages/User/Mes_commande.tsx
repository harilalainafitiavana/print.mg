import { useState, useEffect } from "react";
import {
  Trash2, Eye, PlusCircle, X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import API_BASE_URL from "../../services/api";
// import { strong } from "framer-motion/client";

type MesCommandeProps = {
  onMenuClick: (menu: string) => void;
  searchQuery?: string;
};

export type Order = {
  id: string;
  date_commande: string;
  statut: string;
  montant_total: number;
  mode_paiement: string;
  configuration: any;
  fichiers: any[];
  phone?: string;
  options?: string;
  quantity?: number;
  duplex?: string;
  binding?: string;
  coverPaper?: string;
};

export default function MesCommande({ onMenuClick, searchQuery }: MesCommandeProps) {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  // const [query, setQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/api/commandes/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          console.error("Erreur chargement commandes", res.statusText);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, []);

  const filtered = orders.filter((o) =>
    (o.fichiers.map(f => f.nom_fichier).join(" ") + o.id + o.statut)
      .toLowerCase()
      // .includes(query.toLowerCase())
      .includes((searchQuery || "").toLowerCase())
  );

  const handleDeleteClick = (order: Order) => {
    setSelectedOrder(order);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedOrder) return;

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        alert(t("mesCommandes.alerts.mustBeLoggedIn"));
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/commandes/${selectedOrder.id}/soft_delete/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ajoute le token JWT dans les en-têtes
        },
      });

      const data = await response.json();
      console.log("Data:", data);

      if (data.success) {
        // Retirer la commande de la liste principale
        setOrders((prev) => prev.filter((o) => o.id !== selectedOrder.id));

        // Réinitialiser l'état
        setSelectedOrder(null);
        setShowConfirm(false);
      } else {
        alert(t("mesCommandes.alerts.deleteFail", { message: data.message }));
      }
    } catch (err) {
      console.error(err);
      alert(t("mesCommandes.alerts.deleteError"));
    }
  };


  const cancelDelete = () => {
    setSelectedOrder(null);
    setShowConfirm(false);
  };

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleCancel = () => setShowDetailModal(false);
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-4xl font-bold">{t("mesCommandes.title")}</h1>
          <p className="text-sm text-base-content">{t("mesCommandes.description")}</p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">

          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow hover:bg-violet-800"
            onClick={() => onMenuClick("order")}
          >
            <PlusCircle size={18} />
            {t("mesCommandes.newOrder")}
          </button>
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">{t("mesCommandes.noOrder")}</p>
        </div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((order) => (
            <article key={order.id} className="bg-base-100 rounded-2xl p-4 shadow-md border-l-4" style={{ borderLeftColor: '#3b82f6' }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-semibold text-lg">
                      {t("mesCommandes.title")} {order.id}
                    </h2>
                    <span className={`text-sm px-2 py-1 rounded-full text-white ${order.statut === 'TERMINE' ? 'bg-green-500' :
                      order.statut === 'EN_ATTENTE' || order.statut === 'RECU' ? 'bg-yellow-500' :
                        order.statut === 'EN_COURS_IMPRESSION' || order.statut === 'EN_COURS_LIVRAISON' ? 'bg-blue-500' :
                          order.statut === 'LIVREE' ? 'bg-indigo-500' : 'bg-gray-500'
                      }`}>
                      {t(`mesCommandes.orderStatus.${order.statut}`, { defaultValue: order.statut })}
                    </span>
                  </div>
                  <p className="text-sm text-base-content mt-2">
                    {t("mesCommandes.modal.date", { defaultValue: "Date" })} : {new Date(order.date_commande).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-base-content mt-2 font-medium">
                    {t("mesCommandes.modal.amount", { defaultValue: "Montant" })} : {order.montant_total.toLocaleString()} Ariary
                  </p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <button
                    title={t("mesCommandes.view")}
                    onClick={() => handleViewDetail(order)}
                    className="p-2 rounded-lg border border-gray-100 hover:bg-violet-300"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    title={t("mesCommandes.delete")}
                    onClick={() => handleDeleteClick(order)}
                    className="p-2 rounded-lg border border-gray-100 hover:bg-violet-300 text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Modal détail complet */}
      {/* Modal élégant et compact - Version optimisée */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 backdrop-blur-sm p-4">
          <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-base-300">
            {/* En-tête compact */}
            <div className="p-4 border-b border-base-300 bg-gradient-to-r from-violet-50 to-pink-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-base-100 rounded-lg shadow-sm">
                    <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-indigo-600">Commande #{typeof selectedOrder.id === 'string' ? selectedOrder.id.slice(0, 6) : selectedOrder.id}</h2>
                    <p className="text-xs text-pink-600">
                      {new Date(selectedOrder.date_commande).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-white/50 rounded-full transition-colors"
                  aria-label="Fermer"
                >
                  <X size={18} className="text-base-content/70" />
                </button>
              </div>
            </div>

            {/* Contenu principal - Layout horizontal */}
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                {/* Statut */}
                <div className="bg-base-200 rounded-lg p-3">
                  <p className="text-xs text-base-content/60 mb-1">Statut</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${selectedOrder.statut === 'TERMINE' ? 'bg-green-100 text-green-800' :
                      selectedOrder.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-violet-100 text-violet-800'
                    }`}>
                    {selectedOrder.statut}
                  </span>
                </div>

                {/* Montant */}
                <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-lg p-3 border border-violet-100">
                  <p className="text-sm text-violet-500 mb-1">Total</p>
                  <p className="font-bold text-pink-600 text-lg">{selectedOrder.montant_total?.toLocaleString()} Ar</p>
                </div>

                {/* Contact */}
                <div className="bg-base-200 rounded-lg p-3">
                  <p className="text-xs text-base-content/60 mb-1">Contact</p>
                  <p className="font-medium text-sm">{selectedOrder.phone || "-"}</p>
                </div>
              </div>

              {/* Fichier principal - Design horizontal */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-base-content/60 mb-2">FICHIER</h3>

                {selectedOrder.fichiers?.slice(0, 1).map((f, idx) => (
                  <div key={idx} className="bg-base-200 rounded-xl p-3">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-base-content truncate text-sm">{f.nom_fichier}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-base-content/60">
                          <span>DPI: {f.resolution_dpi}</span>
                          <span>•</span>
                          <span>{f.profil_couleur}</span>
                        </div>
                      </div>
                    </div>

                    {/* Infos techniques en grille */}
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-base-100 p-2 rounded">
                        <p className="text-xs text-base-content/60 mb-1">Format</p>
                        <p className="font-medium text-xs">
                          {selectedOrder.configuration?.format_type === "petit"
                            ? selectedOrder.configuration?.small_format?.slice(0, 8) || "-"
                            : `${selectedOrder.configuration?.largeur || ''}x${selectedOrder.configuration?.hauteur || ''}`
                          }
                        </p>
                      </div>

                      <div className="bg-base-100 p-2 rounded">
                        <p className="text-xs text-base-content/60 mb-1">Papier</p>
                        <p className="font-medium text-xs truncate">{selectedOrder.configuration?.paper_type || "-"}</p>
                      </div>

                      <div className="bg-base-100 p-2 rounded">
                        <p className="text-xs text-base-content/60 mb-1">Finition</p>
                        <p className="font-medium text-xs truncate">{selectedOrder.configuration?.finish || "-"}</p>
                      </div>

                      <div className="bg-violet-50 p-2 rounded border border-violet-100">
                        <p className="text-xs text-violet-600 mb-1">Qté</p>
                        <p className="font-bold text-violet-600 text-sm">{selectedOrder.configuration?.quantity || "0"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Options en badges horizontaux */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-base-content/60 mb-2">OPTIONS</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedOrder.configuration?.book_pages && (
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                      <span className="text-xs">📖</span> {selectedOrder.configuration.book_pages}p
                    </span>
                  )}
                  {selectedOrder.configuration?.duplex && (
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs">
                      <span className="text-xs">🔄</span> {selectedOrder.configuration.duplex}
                    </span>
                  )}
                  {selectedOrder.configuration?.binding && (
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs">
                      <span className="text-xs">📎</span> {selectedOrder.configuration.binding}
                    </span>
                  )}
                  {selectedOrder.configuration?.cover_paper && (
                    <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs">
                      <span className="text-xs">🛡️</span> {selectedOrder.configuration.cover_paper}
                    </span>
                  )}
                </div>
              </div>

              {/* Info fichiers multiples - Barre horizontale */}
              {selectedOrder.fichiers && selectedOrder.fichiers.length > 1 && (
                <div className="bg-violet-50 border border-violet-100 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span className="text-sm font-medium text-violet-700">
                        + {selectedOrder.fichiers.length - 1} autre(s) fichier(s)
                      </span>
                    </div>
                    <span className="text-xs text-violet-600">Voir tout</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bouton fermer - Compact */}
            <div className="p-4 border-t border-base-300">
              <button
                onClick={handleCancel}
                className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity text-sm"
              >
                Fermer le détail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation suppression */}
      {showConfirm && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-base-100 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">{t("mesCommandes.confirmDeleteTitle")}</h3>
              <button onClick={cancelDelete} className="p-1 rounded">
                <X />
              </button>
            </div>
            <p className="mt-4 text-sm text-base-content">{t("mesCommandes.confirmDeleteText", { orderId: selectedOrder.id })}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={cancelDelete} className="px-4 py-2 rounded-lg border">
                {t("mesCommandes.cancelButton")}
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded-lg bg-red-500 text-white">
                {t("mesCommandes.confirmButton")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

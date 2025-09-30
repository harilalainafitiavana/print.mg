import { useState, useEffect } from "react";
import {
  Trash2, Eye, PlusCircle, X, 
} from "lucide-react";

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

        const res = await fetch("http://127.0.0.1:8000/api/commandes/", {
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
        alert("Vous devez être connecté pour effectuer cette action.");
        return;
      }

      const response = await fetch(`http://localhost:8000/api/commandes/${selectedOrder.id}/soft_delete/`, {
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
        alert("Commande déplacée dans la corbeille ✅");
      } else {
        alert("Erreur : " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
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
          <h1 className="text-2xl font-bold">Mes commandes</h1>
          <p className="text-sm text-gray-500">Toutes les commandes que tu as passées sur la plateforme.</p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">

          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white shadow hover:bg-blue-600"
            onClick={() => onMenuClick("order")}
          >
            <PlusCircle size={18} />
            Nouvelle
          </button>
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">Aucune commande trouvée.</p>
        </div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((order) => (
            <article key={order.id} className="bg-white rounded-2xl p-4 shadow-md border-l-4" style={{ borderLeftColor: '#3b82f6' }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-semibold text-lg">Commande {order.id}</h2>
                    <span className={`text-sm px-2 py-1 rounded-full text-white ${order.statut === 'Terminé' ? 'bg-green-500' : order.statut === 'Annulé' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                      {order.statut}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Date: {new Date(order.date_commande).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-800 mt-2 font-medium">Montant: {order.montant_total.toLocaleString()} Ariary</p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <button
                    title="Voir"
                    onClick={() => handleViewDetail(order)}
                    className="p-2 rounded-lg border border-gray-100 hover:bg-gray-50"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    title="Supprimer"
                    onClick={() => handleDeleteClick(order)}
                    className="p-2 rounded-lg border border-gray-100 hover:bg-gray-50 text-red-600"
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
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">📄 Résumé de la commande</h3>
            <div className="space-y-2 text-sm">
              {selectedOrder.fichiers.map((f, idx) => (
                <div key={idx} className="border-b border-gray-200 pb-2 mb-2">
                  <p><strong>Fichier :</strong> {f.nom_fichier}</p>
                  <p><strong>DPI :</strong> {f.resolution_dpi}</p>
                  <p><strong>Profil :</strong> {f.profil_couleur}</p>
                  <p><strong>Format :</strong> {f.format} {selectedOrder.configuration.format_type === "petit"
                    ? `- ${selectedOrder.configuration.small_format}`
                    : `- ${selectedOrder.configuration.largeur}x${selectedOrder.configuration.hauteur} cm`
                  }</p>
                  <p><strong>Type format :</strong> {selectedOrder.configuration.format_type}</p>
                  <p><strong>Papier :</strong> {selectedOrder.configuration.paper_type}</p>
                  <p><strong>Finition :</strong> {selectedOrder.configuration.finish}</p>
                  <p><strong>Quantité :</strong> {selectedOrder.configuration.quantity}</p>
                  {selectedOrder.configuration.duplex && <p><strong>Duplex :</strong> {selectedOrder.configuration.duplex}</p>}
                  {selectedOrder.configuration.binding && <p><strong>Reliure :</strong> {selectedOrder.configuration.binding}</p>}
                  {selectedOrder.configuration.cover_paper && <p><strong>Couverture :</strong> {selectedOrder.configuration.cover_paper}</p>}
                  <p><strong>Téléphone :</strong> {selectedOrder.phone}</p>
                  <p><strong>Montant :</strong> {selectedOrder.montant_total} Ariary</p>
                  <p><strong>Options :</strong> {selectedOrder.configuration.options || "-"}</p>
                </div>
              ))}

            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={handleCancel} className="px-4 py-2 rounded-lg border flex items-center gap-2 hover:bg-red-600 hover:text-white">
                <X size={16} /> Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation suppression */}
      {showConfirm && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">Confirmer la suppression</h3>
              <button onClick={cancelDelete} className="p-1 rounded">
                <X />
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-600">Es-tu sûr(e) de vouloir supprimer la commande <span className="font-mono">{selectedOrder.id}</span> ?</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={cancelDelete} className="px-4 py-2 rounded-lg border">Annuler</button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded-lg bg-blue-500 text-white">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

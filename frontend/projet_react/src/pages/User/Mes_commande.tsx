import { useState } from "react";
import {
  Trash2,
  Eye,
  PlusCircle,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type MesCommandeProps = {
  onMenuClick: (menu: string) => void;
};

export type Order = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  amount: number;
  status: "En cours" | "Terminé" | "Annulé";
  thumbnail?: string; // url/local path
};


const defaultOrders: Order[] = [
  {
    id: "CMD-20250918-001",
    title: "Affiche A2 - Événement",
    date: "2025-09-15",
    amount: 45000,
    status: "Terminé",
    thumbnail: "",
  },
  {
    id: "CMD-20250917-022",
    title: "Dépliant A4 - Pack 50",
    date: "2025-09-16",
    amount: 120000,
    status: "En cours",
    thumbnail: "",
  },
  {
    id: "CMD-20250916-105",
    title: "Carte de visite - 250 ex.",
    date: "2025-09-10",
    amount: 30000,
    status: "Annulé",
    thumbnail: "",
  },
];

export default function MesCommande({ onMenuClick }: MesCommandeProps) {
  const [orders, setOrders] = useState<Order[]>(defaultOrders);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Filtre simple local (sera remplacé par un call backend quand prêt)
  const filtered = orders.filter((o) =>
    (o.title + o.id + o.status).toLowerCase().includes(query.toLowerCase())
  );

  const handleDeleteClick = (order: Order) => {
    setSelected(order);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (!selected) return;
    setOrders((prev) => prev.filter((o) => o.id !== selected.id));
    setSelected(null);
    setShowConfirm(false);
  };

  const cancelDelete = () => {
    setSelected(null);
    setShowConfirm(false);
  };

  // Placeholder pour integration backend
  // async function fetchOrders() {
  //   const res = await fetch('/api/orders');
  //   const data = await res.json();
  //   setOrders(data);
  // }
  // useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mes commandes</h1>
          <p className="text-sm text-gray-500">Toutes les commandes que tu as passées sur la plateforme.</p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <label className="relative flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher par titre, id ou statut"
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} />
          </label>

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
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600" onClick={() => setOrders(defaultOrders)}>
            Restaurer la liste par défaut
          </button>
        </div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((order) => (
            <article key={order.id} className="bg-white rounded-2xl p-4 shadow-md border-l-4" style={{ borderLeftColor: '#3b82f6' }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-semibold text-lg">{order.title}</h2>
                    <span className={`text-sm px-2 py-1 rounded-full text-white ${order.status === 'Terminé' ? 'bg-green-500' : order.status === 'Annulé' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                      {order.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">ID: <span className="font-mono">{order.id}</span></p>
                  <p className="text-sm text-gray-600 mt-2">Date: {order.date}</p>
                  <p className="text-sm text-gray-800 mt-2 font-medium">Montant: {order.amount.toLocaleString()} Ariary</p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <button
                    title="Voir"
                    onClick={() => alert(`Détail commande ${order.id} (remplacer par un modal ou route)`)}
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

      {/* Simple pagination skeleton (UI only) */}
      <footer className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-500">Affichage {filtered.length} commande(s)</div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg border" aria-label="prev"><ChevronLeft /></button>
          <button className="p-2 rounded-lg border" aria-label="next"><ChevronRight /></button>
        </div>
      </footer>

      {/* Modal de confirmation suppression */}
      {showConfirm && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">Confirmer la suppression</h3>
              <button onClick={cancelDelete} className="p-1 rounded">
                <X />
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-600">Es-tu sûr(e) de vouloir supprimer la commande <span className="font-mono">{selected.id}</span>? Cette fichier est stocké dans le corbeille pendant 30j</p>
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

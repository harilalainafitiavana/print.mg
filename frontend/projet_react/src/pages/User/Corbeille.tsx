import { useEffect, useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";

// 🔹 Types
type Fichier = {
  nom_fichier: string;
  resolution_dpi: number;
  profil_couleur: string;
  format: string;
};

type Configuration = {
  format_type: string;
  small_format?: string;
  largeur?: number;
  hauteur?: number;
  paper_type?: string;
  finish?: string;
  quantity: number;
  duplex?: boolean;
  binding?: string;
  cover_paper?: string;
  options?: string;
};

type Commande = {
  id: number;
  montant_total: number;
  phone: string;
  configuration: Configuration;
  fichiers: Fichier[];
  is_deleted: boolean;
};

type TrashProps = {
  onMenuClick?: (menu: string) => void;
};

export default function Trash({ }: TrashProps) {
  const [deletedOrders, setDeletedOrders] = useState<Commande[]>([]);

  // 🔹 Récupérer les commandes supprimées
  const fetchDeletedOrders = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return alert("Vous devez être connecté pour effectuer cette action.");

      const res = await fetch("http://localhost:8000/api/commandes/deleted/", {
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erreur HTTP " + res.status);

      const data = await res.json();
      setDeletedOrders(data);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la récupération des commandes supprimées");
    }
  };

  useEffect(() => {
    fetchDeletedOrders();
  }, []);

  // 🔹 Restaurer une commande
  const handleRestore = async (id: number) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return alert("Vous devez être connecté pour effectuer cette action.");

      const res = await fetch(`http://localhost:8000/api/commandes/${id}/restore/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setDeletedOrders(prev => prev.filter(order => order.id !== id));
        alert("Commande restaurée ✅");
      } else {
        alert("Erreur : " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la restauration");
    }
  };

  // 🔹 Supprimer définitivement une commande
  const handleDeleteForever = async (id: number) => {
    if (!confirm("Supprimer définitivement cette commande ?")) return;

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return alert("Vous devez être connecté pour effectuer cette action.");

      const res = await fetch(`http://localhost:8000/api/commandes/${id}/delete_forever/`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setDeletedOrders(prev => prev.filter(order => order.id !== id));
        alert("Commande supprimée définitivement ✅");
      } else {
        alert("Erreur : " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression définitive");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🗑️ Corbeille</h1>

      {deletedOrders.length === 0 ? (
        <p className="text-gray-500">Aucune commande supprimée.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deletedOrders.map((order) => (
            <div key={order.id} className="border rounded-xl p-4 shadow-sm bg-white flex flex-col justify-between">
              {/* Informations commande */}
              <div>
                <h2 className="font-semibold text-lg">Commande #{order.id}</h2>
                <p className="text-sm">Téléphone: {order.phone}</p>
                <p className="text-sm">Montant: {order.montant_total} Ariary</p>
                <p className="text-sm">
                  Format: {order.configuration.format_type}{" "}
                  {order.configuration.format_type === "petit"
                    ? `- ${order.configuration.small_format}`
                    : `- ${order.configuration.largeur}x${order.configuration.hauteur} cm`}
                </p>
                <p className="text-sm">Quantité: {order.configuration.quantity}</p>
                <p className="text-sm">Options: {order.configuration.options || "-"}</p>

                {/* Liste des fichiers */}
                <div className="mt-2">
                  <strong>Fichiers:</strong>
                  {order.fichiers.map((f, idx) => (
                    <div key={idx} className="text-sm ml-2">
                      {f.nom_fichier} ({f.format}, {f.resolution_dpi} DPI, {f.profil_couleur})
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 shadow"
                  onClick={() => handleRestore(order.id)}
                >
                  <RotateCcw size={16} /> Restaurer
                </button>
                <button
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow"
                  onClick={() => handleDeleteForever(order.id)}
                >
                  <Trash2 size={16} /> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

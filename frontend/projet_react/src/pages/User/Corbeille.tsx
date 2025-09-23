import { RotateCcw, Trash2 } from "lucide-react";

type TrashProps = {
  onMenuClick: (menu: string) => void;
};

export default function Trash({ }: TrashProps) {
  // 🔹 Exemple de commandes supprimées (mock data)
  const deletedOrders = [
    { id: 1, name: "Commande #001", description: "10 articles supprimés" },
    { id: 2, name: "Commande #002", description: "5 articles supprimés" },
    { id: 3, name: "Commande #003", description: "1 article supprimé" },
  ];

  const handleRestore = (id: number) => {
    alert(`Commande restaurée: ${id}`);
    // TODO: appel API pour restaurer la commande
  };

  const handleDeleteForever = (id: number) => {
    if (confirm("Supprimer définitivement cette commande ?")) {
      alert(`Commande supprimée définitivement: ${id}`);
      // TODO: appel API pour supprimer définitivement
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
            <div
              key={order.id}
              className="border rounded-xl p-4 shadow-sm bg-white flex flex-col justify-between"
            >
              <div>
                <h2 className="font-semibold text-lg">{order.name}</h2>
                <p className="text-sm text-gray-500">{order.description}</p>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 shadow"
                  onClick={() => handleRestore(order.id)}
                >
                  <RotateCcw size={16} />
                  Restaurer
                </button>
                <button
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow"
                  onClick={() => handleDeleteForever(order.id)}
                >
                  <Trash2 size={16} />
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

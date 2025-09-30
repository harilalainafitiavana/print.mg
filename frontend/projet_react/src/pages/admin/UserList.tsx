import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { authFetch } from "../../Components/Utils";

interface User {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    num_tel?: string;
    role?: string;
    profils?: string;
    date_inscription: string;
}

const AdminUsersDashboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;


    // 🔹 Charger les utilisateurs depuis l'API Django
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await authFetch("http://127.0.0.1:8000/api/users/");

                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    console.error("Erreur lors du chargement des utilisateurs :", response.statusText);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des utilisateurs :", error);
            }
        };
        fetchUsers();
    }, []);


    const openModal = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };

    // Recherche
    const [searchTerm, setSearchTerm] = useState("");


    // 🔹 Filtrer selon la recherche
    const filteredUsers = users.filter((user) =>
        user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 🔹 Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                {/* Titre à gauche */}
                <h1 className="text-3xl font-bold text-blue-500 mb-4 md:mb-0">
                    Liste des Utilisateurs
                </h1>

                {/* Barre de recherche à droite */}
                <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // 🔹 Remet la page 1 lors d’une nouvelle recherche
                    }}
                    className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

            </div>

            {/* Tableau des utilisateurs */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium">Nom</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Prénom</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Date d'inscription</th>
                            <th className="px-6 py-3 text-center text-sm font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm">{user.nom}</td>
                                <td className="px-6 py-4 text-sm">{user.prenom}</td>
                                <td className="px-6 py-4 text-sm">{user.email}</td>
                                <td className="px-6 py-4 text-sm">
                                    {new Date(user.date_inscription).toLocaleString("fr-FR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    })}
                                </td>

                                <td className="px-6 py-4 text-center">
                                    <button
                                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                                        onClick={() => openModal(user)}
                                    >
                                        <Eye size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                >
                    Précédent
                </button>
                <span className="text-gray-700">
                    Page {currentPage} / {totalPages}
                </span>
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                >
                    Suivant
                </button>
            </div>


            {/* Modal */}
            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-6 relative">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                            onClick={closeModal}
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold text-blue-500 mb-4">Détails de l'utilisateur</h2>

                        {/* Flex container pour infos + image */}
                        <div className="flex items-start space-x-6">
                            {/* Informations à gauche */}
                            <div className="flex-1 space-y-2 text-gray-700">
                                <p><strong>Nom:</strong> {selectedUser.nom}</p>
                                <p><strong>Prénom:</strong> {selectedUser.prenom}</p>
                                <p><strong>Email:</strong> {selectedUser.email}</p>
                                <p><strong>Téléphone:</strong> {selectedUser.num_tel || "N/A"}</p>
                                <p><strong>Rôle:</strong> {selectedUser.role || "USER"}</p>
                                <p><strong>Date d'inscription:</strong> {new Date(selectedUser.date_inscription).toLocaleString()}</p>
                            </div>

                            {/* Image à droite */}
                            {selectedUser.profils && (
                                <div className="flex-shrink-0">
                                    <img
                                        src={`http://127.0.0.1:8000${selectedUser.profils}`}
                                        alt="Profil"
                                        className="w-32 h-32 rounded-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            )}
        </div>
    );
};

export default AdminUsersDashboard;

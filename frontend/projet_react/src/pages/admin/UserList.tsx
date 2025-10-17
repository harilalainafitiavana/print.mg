import { useState, useEffect } from "react";
import { Eye, Users } from "lucide-react";
import { authFetch } from "../../Components/Utils";
import { useTranslation } from "react-i18next";

interface User {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    num_tel?: string;
    code_postal: string;
    ville: string;
    pays: string;
    role?: string;
    profils?: string;
    date_inscription: string;
}

const AdminUsersDashboard = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    // const [theme, setTheme] = useState("light");



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
        <div className="p-6 bg-base-200 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                {/* Titre à gauche */}
                <h1 className="text-3xl font-bold flex gap-2 text-blue-500 mb-4 md:mb-0">
                    <Users size={35} /> {t("usersadmin.title")}
                </h1>

                {/* Barre de recherche à droite */}
                <input
                    type="text"
                    placeholder={t("usersadmin.search")}
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // 🔹 Remet la page 1 lors d’une nouvelle recherche
                    }}
                    className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

            </div>

            {/* Tableau des utilisateurs */}
            <div className="bg-base-100 shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-500 text-white text-lg">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium">{t("usersadmin.name")}</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">{t("usersadmin.firstname")}</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">{t("usersadmin.email")}</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">{t("usersadmin.registrationDate")}</th>
                            <th className="px-6 py-3 text-center text-sm font-medium">{t("usersadmin.action")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentUsers.map((user) => (
                            <tr key={user.id} className="">
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
                    {t("usersadmin.previous")}
                </button>
                <span className="text-base-content">
                    {t("usersadmin.page")} {currentPage} / {totalPages}
                </span>
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                >
                    {t("usersadmin.next")}
                </button>
            </div>


            {/* Modal */}
            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-base-100 rounded-lg shadow-lg w-11/12 max-w-lg p-6 relative">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                            onClick={closeModal}
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold text-blue-500 mb-4">{t("usersadmin.userdetails")}</h2>

                        {/* Flex container pour infos + image */}
                        <div className="flex items-start space-x-6">
                            {/* Informations à gauche */}
                            <div className="flex-1 space-y-2 text-base-content">
                                <p><strong>{t("usersadmin.name")}:</strong> {selectedUser.nom}</p>
                                <p><strong>{t("usersadmin.firstname")}:</strong> {selectedUser.prenom}</p>
                                <p><strong>{t("usersadmin.email")}:</strong> {selectedUser.email}</p>
                                <p><strong>{t("usersadmin.phone")}:</strong> {selectedUser.num_tel || "N/A"}</p>
                                <p><strong>{t("usersadmin.postalcode")}:</strong> {selectedUser.code_postal} </p>
                                <p><strong>{t("usersadmin.city")}:</strong> {selectedUser.ville} </p>
                                <p><strong>{t("usersadmin.country")}:</strong> {selectedUser.pays} </p>
                                <p><strong>{t("usersadmin.role")}:</strong> {selectedUser.role || "USER"}</p>
                                <p><strong>{t("usersadmin.registrationDate")}:</strong> {new Date(selectedUser.date_inscription).toLocaleString()}</p>
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

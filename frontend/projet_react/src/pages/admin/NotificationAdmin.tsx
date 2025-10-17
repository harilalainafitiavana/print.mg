import { useEffect, useState } from "react";
import { authFetch } from "../../Components/Utils";
import { User, Calendar, X, Check, Trash, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";

type NotificationType = {
    id: number;
    message: string;
    created_at: string;
    sender_info: {      // info de celui qui a envoyé
        id: number;
        nom: string;
        prenom: string;
        email: string;
    } | null;
    recipient_info: {   // info du destinataire
        id: number;
        nom: string;
        prenom: string;
        email: string;
    } | null;
};

export default function AdminUserNotifications() {
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await authFetch("http://localhost:8000/api/notifications-admin/");
                const data = await res.json();
                setNotifications(data);
            } catch (err) {
                console.error("Impossible de récupérer les notifications:", err);
            }
        };
        fetchNotifications();
    }, []);

    const totalPages = Math.ceil(notifications.length / pageSize);
    const paginatedNotifications = notifications.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleView = (notification: NotificationType) => {
        setSelectedOrder(notification);
        setShowViewModal(true);
    }

    const handleDeleteClick = (notif: NotificationType) => {
        setSelectedOrder(notif);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedOrder) return;
        try {
            const res = await authFetch(`http://localhost:8000/api/notifications/delete/${selectedOrder.id}/`, {
                method: "POST"
            });
            if (res.ok) {
                // ✅ Ici on met à jour la liste notifications
                setNotifications(prev => prev.filter(n => n.id !== selectedOrder.id));
            } else {
                alert("Impossible de supprimer la notification");
            }
        } catch (err) {
            console.error(err);
            alert("Erreur réseau");
        }
        setShowDeleteModal(false);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">📬 {t("notification.title")}</h2>

            {paginatedNotifications.length === 0 ? (
                <p className="text-base-content">{t("notification.noNotification")}.</p>
            ) : (
                <ul className="space-y-4">
                    {paginatedNotifications.map((n) => (
                        <li
                            key={n.id}
                            className="p-4 border rounded-xl shadow-sm bg-base-100 flex flex-col md:flex-row justify-between items-center gap-4"
                        >
                            {/* Info de l'utilisateur qui a envoyé le message */}
                            <div className="flex-1 flex-col text-base-content text-sm md:w-1/3 gap-1">
                                {n.sender_info ? (
                                    <>
                                        <span className="flex items-center gap-1">
                                            <User size={14} /> {n.sender_info.email}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <User size={14} /> {n.sender_info.nom} {n.sender_info.prenom}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-gray-400">{t("notification.sender")}</span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} /> {new Date(n.created_at).toLocaleString()}
                                </span>
                            </div>

                            {/* Message centré à droite */}
                            <button onClick={() => handleView(n)}
                                className="bg-blue-500 text-white p-2 rounded">
                                <Eye size={16} />
                            </button>
                            <button
                                onClick={() => handleDeleteClick(n)}   // ✅ Ici on passe bien la notif n
                                className="bg-red-500 text-white p-2 rounded"
                            >
                                <Trash size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        className="btn btn-outline"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                    >
                        Précédent
                    </button>
                    <span>
                        Page {currentPage} / {totalPages}
                    </span>
                    <button
                        className="btn btn-outline"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                    >
                        Suivant
                    </button>
                </div>
            )}

            {/* Modal suppression */}
            {showDeleteModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-base-100 p-6 rounded-xl max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">⚠️ {t("notification.modal.confirmDeletion")}</h2>
                        <p>{t("notification.modal.trashNotification")}.</p>
                        <div className="flex justify-end gap-4 mt-4">
                            <button onClick={() => setShowDeleteModal(false)} className="btn btn-outline flex items-center gap-2"><X size={16} /> {t("notification.modal.cancel")}</button>
                            <button onClick={confirmDelete} className="btn btn-primary flex items-center gap-2"><Check size={16} /> {t("notification.modal.confirm")}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal notification */}
            {showViewModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-base-100 p-6 rounded-xl max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">🔔 {t("notification.modal.title")}</h2>

                        <p className="text-base-content font-medium text-center break-words border border-blue-200 p-4 rounded">
                            {selectedOrder.message} 
                        </p>

                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="btn bg-blue-400 text-white"
                            >
                                <X size={16} /> {t("notification.modal.cancel")}
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}

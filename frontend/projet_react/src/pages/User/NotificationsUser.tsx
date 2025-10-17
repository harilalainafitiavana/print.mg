import { useEffect, useState } from "react";
import { authFetch } from "../../Components/Utils";
import { Bell, Check, Send, Trash, X } from "lucide-react";
import { useTranslation } from "react-i18next";

type NotificationType = {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  sender_info?: {
    nom: string;
    prenom: string;
    email: string;
  } | null;
};


export default function UserNotifications() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5); // notifications par page
  const [showModal, setShowModal] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // 🔹 Récupérer notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await authFetch("http://localhost:8000/api/notifications/");
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Impossible de récupérer les notifications:", err);
      }
    };
    fetchNotifications();
  }, []);

  // 🔹 Pagination
  const totalPages = Math.ceil(notifications.length / pageSize);
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 🔹 Envoyer notification à l'admin
  const sendNotificationToAdmin = async () => {
    if (!newMessage.trim()) return alert("Écrivez un message");
    try {
      const res = await authFetch("http://localhost:8000/api/send-notification-admin/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'envoi");
      alert("Message envoyé à l'admin !");
      setNewMessage("");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Impossible d'envoyer le message");
    }
  };

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
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bell size={24} /> {t("notifications.title")}
        </h2>
        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <Send size={16} /> {t("notifications.bouton")}
        </button>
      </div>

      {paginatedNotifications.length === 0 ? (
        <p className="text-base-content">{t("notifications.noNotification")}</p>
      ) : (
        <ul className="space-y-3">
          {paginatedNotifications.map((n) => (
            <li
              key={n.id}
              className={`p-4 border rounded-lg shadow-sm flex justify-between items-start ${n.is_read}`}
            >
              <div>
                <p className="text-base-content"><strong>{n.message}</strong></p>
                <hr className="my-2 border-gray-300" />
                {n.sender_info && (
                  <small className="text-base-content block">
                    {t("corbeille.sentBy")} : {n.sender_info.email}
                  </small>
                )}
                <small className="text-base-content block">
                  {new Date(n.created_at).toLocaleString()}
                </small>
              </div>
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
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            className="btn btn-outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            {t("usersadmin.previous")}
          </button>
          <span>
            {t("usersadmin.page")} {currentPage} / {totalPages}
          </span>
          <button
            className="btn btn-outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            {t("usersadmin.next")}
          </button>
        </div>
      )}

      {/* Modal pour envoyer message à admin */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">📨 {t("notifications.modal.title")}</h2>
            <textarea
              className="textarea textarea-bordered w-full mb-4"
              rows={4}
              placeholder={t("notifications.modal.placeholder")}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-outline"
              >
                {t("trash.cancel")}
              </button>
              <button
                onClick={sendNotificationToAdmin}
                className="btn btn-primary"
              >
                {t("notifications.modal.send")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal suppression */}
      {showDeleteModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">{t("notifications.modal.deleteConfirm")}</h2>
            <p>{t("notifications.modal.notif")}</p>
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setShowDeleteModal(false)} className="btn btn-outline flex items-center gap-2"><X size={16} /> {t("trash.cancel")}</button>
              <button onClick={confirmDelete} className="btn btn-primary flex items-center gap-2"><Check size={16} /> {t("trash.confirm")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

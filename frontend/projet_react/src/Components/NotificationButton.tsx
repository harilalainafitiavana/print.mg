import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { authFetch } from "./Utils";
import API_BASE_URL from "../services/api";

export default function NotificationButton({ onClick }: { onClick: () => void }) {
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await authFetch(`${API_BASE_URL}/api/unread-count/`);
                if (res.ok) {
                    const data = await res.json();
                    setCount(data.unread_count);
                }
            } catch (err) {
                console.error("Erreur fetch unread_count:", err);
            }
        };

        fetchCount();

        // rafraîchir toutes les 30 secondes
        const interval = setInterval(fetchCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleClick = async () => {
        onClick();
        try {
            // Marquer comme lu quand on ouvre la page notif
            await authFetch(`${API_BASE_URL}/api/mark-notifications-read/`, {
                method: "POST",
            });
            setCount(0);
        } catch (err) {
            console.error("Erreur mark read:", err);
        }
    };

    return (
        <button className="relative text-base-content p-2 rounded-full hover:text-white hover:bg-blue-400" onClick={handleClick}>
            <Bell size={22} />
            {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-1 rounded-full leading-none">
                    {count}
                </span>
            )}
        </button>
    );
}

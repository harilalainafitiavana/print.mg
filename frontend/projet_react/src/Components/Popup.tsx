import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

export default function PublicationPopup() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // 🔹 Timer : 30 seconde (30 000 ms) après ouverture
        const timer = setTimeout(() => {
            setShow(true);
        }, 30000);

        return () => clearTimeout(timer);
    }, []);

    // 🔹 Fermer le popup
    const handleClose = () => {
        setShow(false);
    };

    return (
        <>
            {show && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    {/* Contenu du popup */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full relative">
                        {/* Bouton de fermeture */}
                        <button
                            className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
                            onClick={handleClose}
                        >
                            <X size={20} />
                        </button>

                        {/* Titre */}
                        <h2 className="text-2xl font-bold text-center text-violet-500 mb-4">
                            Bienvenue sur Print.mg 🎉
                        </h2>

                        {/* Message */}
                        <p className="text-gray-700 text-center mb-6">
                            Commandez vos impressions en ligne dès maintenant et <span className="font-semibold text-red-600">Merci beaucoup de nous avoir choisi!! 🙏😊</span> Print.mg est là pour votre première commande !
                        </p>

                        {/* Bouton d’action */}
                        <div className="flex justify-center">
                            <Link
                                to="/login"
                                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-pink-600 text-white rounded-full hover:bg-blue-700 transition"
                            >
                                Commander maintenant
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

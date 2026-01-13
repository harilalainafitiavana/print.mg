import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, Lock } from "lucide-react";
import { motion } from "framer-motion";
import API_BASE_URL from "../services/api";

export default function ResetPassword() {
    const { uidb64, token } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Empêche le rechargement de la page par défaut
        setError("");
        setMessage("");

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/reinitialiser-mot-de-passe/${uidb64}/${token}/`,
                { password, confirm_password: confirmPassword }
            );
            setMessage(res.data.message);
            setPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            setError(err.response?.data?.error || "Erreur lors de la réinitialisation");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-100 via-white to-blue-100">
            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden"
            >
                {/* Déco top */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-400 rounded-full opacity-20 blur-2xl"></div>

                <div className="flex flex-col items-center mb-6">
                    <div className="bg-green-600 p-3 rounded-full mb-3">
                        <Lock className="text-white w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 text-center">
                        Réinitialiser le mot de passe
                    </h2>
                    <p className="text-gray-500 text-sm mt-1 text-center">
                        Entrez et confirmez votre nouveau mot de passe sécurisé
                    </p>
                    {/* Messages */}
                    {message && (
                        <p className="text-green-600 mt-4 text-center font-medium">{message}</p>
                    )}
                    {error && (
                        <p className="text-red-600 mt-4 text-center font-medium">{error}</p>
                    )}
                </div>

                {/* Champ : nouveau mot de passe */}
                <div className="relative mb-4">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nouveau mot de passe"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                {/* Champ : confirmer le mot de passe */}
                <div className="relative mb-6">
                    <input
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirmer le mot de passe"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                    >
                        {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                <div className="text-sm mt-0 mb-5">
                    <p className="font-medium text-blue-500 text-md hover:text-blue-600 text-center transition">
                        😉Quitter cette page  après la réinitialisation, revenez vers la page login
                    </p>
                </div>


                {/* Bouton */}
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold shadow-md hover:bg-green-700 transition-all duration-200"
                >
                    Réinitialiser
                </motion.button>

            </motion.form>
        </div>
    );
}

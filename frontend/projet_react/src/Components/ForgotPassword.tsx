import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();  // Empêche le rechargement de la page par défaut
        setMessage("");
        setError("");

        try {
            const res = await axios.post("http://127.0.0.1:8000/api/mot-de-passe-oublie/",
                { email }  // corps JSON envoyé à Django
            );
            // Si Django répond avec succès
            setMessage(res.data.message);
        } catch (err: any) {
            // Si Django répond avec une erreur (status 400/404/500)
            setError(err.response?.data?.error || "Une erreur est survenue");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-base-300">
            <form onSubmit={handleSubmit} className="bg-base-100 p-6 rounded-2xl shadow-md w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-center">Mot de passe oublié</h2>
                {message && <p className="text-green-600 mt-3 text-center">{message}</p>}
                {error && <p className="text-red-600 mt-3 text-center">{error}</p>}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Entrez votre email"
                    required
                    className="w-full p-2 mt-4 border rounded-md mb-4"
                />
                <button type="submit" className="w-full bg-green-600 text-white py-2 mb-4 rounded-md hover:bg-green-700">
                    Envoyer
                </button>
                <Link to="/login" className="w-lg px-5 bg-blue-400 text-white py-2 mt-5 rounded-md hover:bg-blue-700">
                    Retour
                </Link>

            </form>
        </div>
    );
}

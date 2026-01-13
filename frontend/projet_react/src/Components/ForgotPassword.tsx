import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import API_BASE_URL from "../services/api";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setIsLoading(true);

        try {
            const res = await axios.post(`${API_BASE_URL}/api/mot-de-passe-oublie/`,
                { email }
            );
            setMessage(res.data.message);
        } catch (err: any) {
            setError(err.response?.data?.error || "Une erreur est survenue");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Carte principale */}
                <div className="bg-base-100 rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
                    {/* En-tête */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                            <Mail className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-base-content mb-2">
                            Mot de passe oublié
                        </h1>
                        <p className="text-base-content/70">
                            Entrez votre adresse email pour recevoir un lien de réinitialisation
                        </p>
                    </div>

                    {/* Formulaire */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Champ email - CORRIGÉ */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-medium">Adresse email</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                                    <Mail className="h-5 w-5 text-base-content/70" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="exemple@email.com"
                                    required
                                    className="input input-bordered w-full pl-10 pr-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Messages de succès/erreur */}
                        {message && (
                            <div className="alert alert-success shadow-lg animate-fade-in">
                                <CheckCircle className="w-5 h-5" />
                                <div>
                                    <h3 className="font-medium">Succès !</h3>
                                    <p className="text-sm">{message}</p>
                                </div>
                            </div>
                        )}
                        
                        {error && (
                            <div className="alert alert-error shadow-lg animate-fade-in">
                                <AlertCircle className="w-5 h-5" />
                                <div>
                                    <h3 className="font-medium">Erreur</h3>
                                    <p className="text-sm">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Bouton d'envoi */}
                        <button 
                            type="submit" 
                            className="btn btn-primary w-full py-3 text-lg font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Envoi en cours...
                                </>
                            ) : (
                                <>
                                    Envoyer le lien
                                    <Mail className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </button>

                        {/* Lien de retour */}
                        <div className="pt-4 border-t border-base-300">
                            <Link 
                                to="/login" 
                                className="btn btn-ghost w-full hover:bg-base-300 transition-all duration-300 group"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                                Retour à la connexion
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Styles CSS inline pour l'animation fade-in */}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
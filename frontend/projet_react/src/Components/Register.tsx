import { useState } from "react";
import { Mail, Phone, Lock, User, Printer, Truck, Shield, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import Slide_show from "./Slide_show";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        photo: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [notification, setNotification] = useState(""); // 🔥 Message d'erreur ou succès

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validatePassword = (password: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return regex.test(password);
    };

    const nextStep = () => {
        if (step === 1) {
            if (!formData.nom || !formData.prenom) {
                setNotification("Veuillez remplir tous les champs.");
                return;
            }
        }

        if (step === 2) {
            // Vérification email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!formData.email || !emailRegex.test(formData.email)) {
                setNotification("Veuillez entrer un email valide.");
                return;
            }

            // Vérification téléphone
            const phoneRegex = /^\d{10}$/; // exactement 10 chiffres
            if (!formData.phone || !phoneRegex.test(formData.phone)) {
                setNotification("Veuillez entrer un numéro de téléphone valide à 10 chiffres.");
                return;
            }
        }

        setNotification("");
        setStep((prev) => prev + 1);
    };


    const prevStep = () => {
        setNotification("");
        setStep((prev) => prev - 1);
    };


    // Navigué vers la page de login après avoir fait l'inscription
    const navigate = useNavigate();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        // Vérification des champs mot de passe
        if (!formData.password || !formData.confirmPassword) {
            setNotification("Veuillez remplir tous les champs.");
            return;
        }
        if (!validatePassword(formData.password)) {
            setNotification("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre.");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setNotification("Les mots de passe ne correspondent pas.");
            return;
        }
    
        try {
            // Préparation des données à envoyer (FormData pour texte + fichier)
            const formDataToSend = new FormData();
            formDataToSend.append("nom", formData.nom);
            formDataToSend.append("prenom", formData.prenom);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("num_tel", formData.phone);
            formDataToSend.append("mdp", formData.password);
    
            if ((formData as any).photoFile) {
                formDataToSend.append("profils", (formData as any).photoFile);
            }
    
            // Envoi vers Django REST API
            const response = await fetch("http://127.0.0.1:8000/api/register/", {
                method: "POST",
                body: formDataToSend,
            });
    
            if (response.ok) {
                // Redirection vers login après succès
                navigate("/login");
            } else {
                const errorData = await response.json();
                setNotification("❌ Erreur : " + JSON.stringify(errorData));
            }
        } catch (error) {
            setNotification("⚠️ Erreur de connexion au serveur.");
        }
    };
    


    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="min-h-screen flex">
            <Slide_show />

            <div className="w-full md:w-1/2 bg-white flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-blue-500 mb-2">Print.mg</h1>
                        <p className="text-gray-600">Inscrivez-vous pour continuer</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {step === 1 && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="nom"
                                            value={formData.nom}
                                            onChange={handleChange}
                                            placeholder="Votre nom"
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="prenom"
                                            value={formData.prenom}
                                            onChange={handleChange}
                                            placeholder="Votre prénom"
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Champ photo de profil */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Photo de profil</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    const file = e.target.files[0];
                                                    setFormData((prev) => ({ ...prev, photo: URL.createObjectURL(file), photoFile: file }));
                                                }
                                            }}                                            
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer"
                                        />
                                        {formData.photo && (
                                            <img
                                                src={formData.photo}
                                                alt="Aperçu profil"
                                                className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                            />
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                >
                                    Suivant
                                </button>
                            </>
                        )}


                        {step === 2 && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="votre@email.com"
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="0123456789"
                                            required
                                            maxLength={10}
                                            pattern="\d{10}"
                                            inputMode="numeric"
                                            className="block w-full pl-10 pr-3 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />

                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                                    >
                                        Précédent
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                    >
                                        Suivant
                                    </button>
                                </div>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Mot de passe"
                                            required
                                            className="block w-full pl-10 pr-12 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmez le mot de passe</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirmez"
                                            required
                                            className="block w-full pl-10 pr-12 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                                    >
                                        Précédent
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                    >
                                        S'inscrire
                                    </button>
                                </div>
                            </>
                        )}
                    </form>

                    {/* 🔥 Notification stylée */}
                    {notification && (
                        <div className="mt-4 p-3 text-sm bg-red-100 text-red-700 border border-red-300 rounded">
                            {notification}
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Vous avez déjà un compte ?{" "}
                            <Link to="/login" className="font-medium text-blue-500 hover:text-blue-600 transition">
                                Se connecter
                            </Link>
                        </p>
                    </div>

                    <div className="mt-10 border-t border-gray-200 pt-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <Printer className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                                <p className="text-xs text-gray-500">Impression haute qualité</p>
                            </div>
                            <div className="text-center">
                                <Truck className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                                <p className="text-xs text-gray-500">Livraison rapide</p>
                            </div>
                            <div className="text-center">
                                <Shield className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                                <p className="text-xs text-gray-500">Paiement sécurisé</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

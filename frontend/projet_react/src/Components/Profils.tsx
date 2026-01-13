import { useState, useEffect } from "react";
import { authFetch } from "./Utils";
import { Eye, EyeOff, Camera, Lock, User, MapPin, Phone, Mail, Save, Key, X, Check, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getAvatarUrl } from './avatarUtils';
import API_BASE_URL from "../services/api";

export default function Profils() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        phone: "",
        code_postal: "",
        ville: "",
        pays: "",
        photo: null as File | null,
    });
    const [userProfilUrl, setUserProfilUrl] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const [showPhotoModal, setShowPhotoModal] = useState(false);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Nouveaux états pour la validation du mot de passe
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
        score: 0
    });
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    useEffect(() => {
        const fetchProfil = async () => {
            try {
                const res = await authFetch(`${API_BASE_URL}/api/profil/`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (res.ok) {
                    const data = await res.json();
                    setUserData(data);

                    setFormData({
                        nom: data.nom || "",
                        prenom: data.prenom || "",
                        email: data.email || "",
                        phone: data.num_tel || "",
                        code_postal: data.code_postal || "",
                        ville: data.ville || "",
                        pays: data.pays || "",
                        photo: null,
                    });

                    const avatarUrl = getAvatarUrl(data);
                    if (avatarUrl) {
                        setUserProfilUrl(avatarUrl);
                    } else {
                        setUserProfilUrl(null);
                    }
                } else {
                    console.error("Erreur récupération profil", await res.text());
                }
            } catch (error) {
                alert(error);
            }
        };

        fetchProfil();
    }, []);

    // Fonction pour ouvrir la modal
    const openPhotoModal = () => {
        if (formData.photo || userProfilUrl) {
            setShowPhotoModal(true);
        }
    };

    // Fonction pour fermer la modal
    const closePhotoModal = () => {
        setShowPhotoModal(false);
    };

    // Empêcher la propagation du clic dans la modal
    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const handlePhotoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.photo) {
            alert("Veuillez sélectionner une photo");
            return;
        }

        const data = new FormData();
        data.append("profils", formData.photo);

        try {
            const res = await authFetch(`${API_BASE_URL}/api/profil/photo/`, {
                method: "PUT",
                body: data,
            });

            if (res.ok) {
                const responseData = await res.json();
                alert("Photo modifiée avec succès!");
                const fullUrl = `${API_BASE_URL}${responseData.profils}`;
                setUserProfilUrl(fullUrl);
                setFormData({ ...formData, photo: null });
            } else {
                const errorText = await res.text();
                alert("Erreur: " + errorText);
            }
        } catch (error) {
            console.error("❌ Erreur:", error);
            alert(error);
        }
    };

    const handleInfoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append("nom", formData.nom);
        data.append("prenom", formData.prenom);
        data.append("num_tel", formData.phone);
        data.append("email", formData.email);
        data.append("code_postal", formData.code_postal);
        data.append("ville", formData.ville);
        data.append("pays", formData.pays);

        try {
            const res = await authFetch(`${API_BASE_URL}/api/profil/`, {
                method: "PUT",
                body: data,
            });

            if (res.ok) {
                alert("Profil modifié avec succès!");
            } else {
                alert("Erreur lors de la modification");
            }
        } catch (error) {
            alert(error);
        }
    };

    // Fonction de validation du mot de passe
    const validatePassword = (password: string) => {
        const validations = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        
        const score = Object.values(validations).filter(Boolean).length;
        
        setPasswordValidation({
            ...validations,
            score: score
        });
        
        const isValid = Object.values(validations).every(Boolean);
        setIsPasswordValid(isValid);
        return isValid;
    };

    // Gestion du changement du nouveau mot de passe
    const handleNewPasswordChange = (value: string) => {
        setNewPassword(value);
        validatePassword(value);
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(null);

        // Validation côté client améliorée
        if (!oldPassword) {
            setPasswordError("L'ancien mot de passe est requis");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError(t("profil.errorPassword") || "Les mots de passe ne correspondent pas");
            return;
        }

        if (!isPasswordValid) {
            setPasswordError("Le mot de passe ne respecte pas tous les critères de sécurité");
            return;
        }

        try {
            const res = await authFetch(`${API_BASE_URL}/api/profil/change-password/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword,
                }),
            });

            if (res.ok) {
                setPasswordSuccess(t("profil.succesPassword") || "Mot de passe changé avec succès");
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setPasswordValidation({
                    length: false,
                    uppercase: false,
                    lowercase: false,
                    number: false,
                    special: false,
                    score: 0
                });
                setIsPasswordValid(false);
                
                // Auto-clear le message de succès après 5 secondes
                setTimeout(() => setPasswordSuccess(null), 5000);
            } else {
                const errorText = await res.text();
                console.error(errorText);
                
                // Gestion des erreurs spécifiques
                if (errorText.includes("ancien mot de passe") || errorText.includes("Ancien mot de passe")) {
                    setPasswordError("L'ancien mot de passe est incorrect");
                } else {
                    setPasswordError(t("profil.nosuccessPassword") || "Échec du changement de mot de passe");
                }
            }
        } catch (error) {
            console.error("Erreur réseau:", error);
            setPasswordError("Erreur réseau. Veuillez réessayer.");
        }
    };

    // Gestion de la touche Escape pour fermer la modal
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && showPhotoModal) {
                closePhotoModal();
            }
        };

        if (showPhotoModal) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'auto';
        };
    }, [showPhotoModal]);

    return (
        <div className="min-h-screen bg-base-200 from-gray-50 to-blue-50 p-4 md:p-6">
            {/* En-tête avec titre principal */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">
                    {t("profil.title") || "Mon Profil"}
                </h1>
                <p className="text-base-content">
                    {t("profil.gerer")}
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Colonne gauche - Carte utilisateur et photo */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Carte utilisateur */}
                    <div className="card bg-base-100 shadow-xl border border-gray-200 rounded-2xl overflow-hidden">
                        <div className="card-body p-6">
                            <div className="flex flex-col items-center text-center mb-6">
                                {/* Avatar avec effet hover et badge de modification */}
                                <div className="relative mb-4 group">
                                    <div 
                                        className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
                                        onClick={openPhotoModal}
                                    >
                                        {formData.photo ? (
                                            <img
                                                src={URL.createObjectURL(formData.photo)}
                                                alt="Aperçu profil"
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        ) : userProfilUrl ? (
                                            <img
                                                src={userProfilUrl.replace(/s\d+-c$/, 's400-c')}
                                                alt="Photo profil"
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                crossOrigin="anonymous"
                                                referrerPolicy="no-referrer"
                                                onError={(e) => {
                                                    console.error("Erreur chargement image profil:", userProfilUrl);
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div 
                                                className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-gray-400 cursor-pointer"
                                                onClick={openPhotoModal}
                                            >
                                                <User size={60} />
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-all shadow-lg z-10">
                                        <Camera size={20} />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setFormData({ ...formData, photo: e.target.files ? e.target.files[0] : null })
                                            }
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                <h2 className="text-2xl font-bold text-base-content">
                                    {formData.prenom} <span className="text-indigo-600">{formData.nom}</span>
                                </h2>
                                <p className="text-base-content flex items-center gap-1 mt-1">
                                    <Mail size={16} />
                                    {formData.email}
                                </p>
                                <p className="text-base-content flex items-center gap-1 mt-1">
                                    <Phone size={16} />
                                    {formData.phone || "Non renseigné"}
                                </p>
                            </div>

                            {/* Localisation */}
                            <div className="bg-base-200 rounded-xl p-4 mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <MapPin size={18} className="text-blue-500" />
                                    <h3 className="font-semibold text-base-content">{t("profil.localization")}</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-base-content mb-1">
                                            {t("profil.code")}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.code_postal}
                                            onChange={(e) => setFormData({ ...formData, code_postal: e.target.value })}
                                            className="input input-bordered w-full bg-base-100"
                                            placeholder={t("profil.codePlaceholder")}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-base-content mb-1">
                                            {t("profil.Ville")}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.ville}
                                            onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                                            readOnly
                                            className="input input-bordered w-full bg-base-200 cursor-not-allowed"
                                            placeholder={t("profil.villePlaceholder")}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-medium text-base-content mb-1">
                                            {t("profil.pays")}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.pays}
                                            onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                                            readOnly
                                            className="input input-bordered w-full bg-base-200 cursor-not-allowed"
                                            placeholder={t("profil.paysPlaceholder")}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bouton pour mettre à jour la photo */}
                            <button
                                onClick={handlePhotoSubmit}
                                className="btn btn-primary w-full gap-2"
                                disabled={!formData.photo}
                            >
                                <Camera size={18} />
                                {formData.photo ? "Mettre à jour la photo" : t("profil.change")}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Colonne droite - Informations et sécurité */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Informations personnelles */}
                    <div className="card bg-base-100 shadow-xl border border-gray-200 rounded-2xl overflow-hidden">
                        <div className="card-body p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-100 rounded-xl">
                                    <User size={24} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-base-content">
                                        {t("profil.edit") || "Informations personnelles"}
                                    </h3>
                                    <p className="text-base-content text-sm">
                                        {t("profil.contact")}
                                    </p>
                                </div>
                            </div>

                            <form className="space-y-6" onSubmit={handleInfoSubmit}>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Nom */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium text-base-content">
                                                {t("profil.name")}
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.nom}
                                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                            className="input input-bordered bg-base-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            placeholder={t("profil.namePlaceholder")}
                                        />
                                    </div>

                                    {/* Prénom */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium text-base-content">
                                                {t("profil.firstname")}
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.prenom}
                                            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                            className="input input-bordered bg-base-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            placeholder={t("profil.firstPlaceholder")}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium text-base-content">
                                                {t("profil.email")}
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                                <Mail size={18} className="text-base-content" />
                                            </div>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                readOnly
                                                className="input input-bordered bg-base-100 pl-10 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 cursor-not-allowed"
                                                placeholder="exemple@email.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Téléphone */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium text-base-content">
                                                {t("profil.phone")}
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                                <Phone size={18} className="text-base-content" />
                                            </div>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="input input-bordered bg-base-100 pl-10 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                                placeholder="+261 ..."
                                                pattern="^\d{10}$"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary gap-2 px-8"
                                    >
                                        <Save size={18} />
                                        {t("profil.Save") || "Enregistrer"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sécurité */}
                    <div className="card bg-base-100 shadow-xl border border-gray-200 rounded-2xl overflow-hidden">
                        <div className="card-body p-6">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                                    <Lock size={24} className="text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-base-content">{t("profil.security")}</h3>
                                    <p className="text-base-content text-sm">
                                        {t("profil.protege")}
                                    </p>
                                </div>
                            </div>

                            {/* Messages d'erreur/succès pour le mot de passe */}
                            {passwordError && (
                                <div className="alert alert-error bg-red-50 border-red-200 text-red-700 py-3 px-4 rounded-lg mb-4">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle size={20} className="flex-shrink-0" />
                                        <span className="text-sm font-medium">{passwordError}</span>
                                    </div>
                                    <button 
                                        onClick={() => setPasswordError(null)} 
                                        className="text-red-600 hover:text-red-800 ml-auto"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}

                            {passwordSuccess && (
                                <div className="alert alert-success bg-green-50 border-green-200 text-green-700 py-3 px-4 rounded-lg mb-4">
                                    <div className="flex items-center gap-2">
                                        <Check size={20} className="flex-shrink-0" />
                                        <span className="text-sm font-medium">{passwordSuccess}</span>
                                    </div>
                                    <button 
                                        onClick={() => setPasswordSuccess(null)} 
                                        className="text-green-600 hover:text-green-800 ml-auto"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}

                            <form className="space-y-6" onSubmit={handlePasswordChange}>
                                <div className="space-y-6">
                                    {/* Ancien mot de passe */}
                                    <div className="form-control">
                                        <label className="label p-0 mb-2">
                                            <span className="label-text font-medium text-base-content">
                                                {t("profil.pass") || "Mot de passe actuel"}
                                            </span>
                                        </label>
                                        <div className="relative group mt-2">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                                <Lock size={18} className="text-base-content group-focus-within:text-blue-600 transition-colors" />
                                            </div>
                                            <input
                                                type={showOld ? "text" : "password"}
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                                className="input input-bordered w-full pl-10 pr-12 
                                                    bg-base-50 focus:bg-base-100 
                                                    border-gray-300 focus:border-blue-500 
                                                    focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50
                                                    transition-all duration-200 relative z-0"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowOld(!showOld)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center z-20
                                                    text-gray-500 hover:text-blue-600 transition-colors duration-200
                                                    bg-transparent"
                                                aria-label={showOld ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                                            >
                                                {showOld ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Nouveau mot de passe */}
                                    <div className="form-control">
                                        <label className="label p-0 mb-2">
                                            <span className="label-text font-medium text-base-content">
                                                {t("profil.new") || "Nouveau mot de passe"}
                                            </span>
                                        </label>
                                        <div className="relative group mt-2">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                                <Key size={18} className="text-base-content group-focus-within:text-blue-600 transition-colors" />
                                            </div>
                                            <input
                                                type={showNew ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => handleNewPasswordChange(e.target.value)}
                                                className={`input input-bordered w-full pl-10 pr-12 
                                                    bg-base-100 focus:bg-base-100 
                                                    ${newPassword && !isPasswordValid ? 'border-red-300' : 'border-gray-300'}
                                                    ${newPassword && isPasswordValid ? 'border-green-300' : ''}
                                                    focus:border-blue-500 
                                                    focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50
                                                    transition-all duration-200 relative z-0`}
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNew(!showNew)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center z-20
                                                    text-gray-500 hover:text-blue-600 transition-colors duration-200
                                                    bg-transparent"
                                                aria-label={showNew ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                                            >
                                                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>

                                        {/* Indicateur de force du mot de passe amélioré */}
                                        {newPassword && (
                                            <div className="mt-3 space-y-2">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs text-gray-600">{t("profil.force")}</span>
                                                    <span className={`text-xs font-medium ${
                                                        passwordValidation.score <= 2 ? "text-red-600" :
                                                        passwordValidation.score <= 4 ? "text-yellow-600" :
                                                        "text-green-600"
                                                    }`}>
                                                        {passwordValidation.score <= 2 ? "Faible" :
                                                         passwordValidation.score <= 4 ? "Moyen" : "Fort"}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all duration-300 ${
                                                            passwordValidation.score <= 2 ? "bg-red-500" :
                                                            passwordValidation.score <= 4 ? "bg-yellow-500" : "bg-green-500"
                                                        }`}
                                                        style={{ width: `${(passwordValidation.score / 5) * 100}%` }}
                                                    ></div>
                                                </div>
                                                
                                                {/* Liste des critères */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-2">
                                                    <div className={`flex items-center gap-1 ${passwordValidation.length ? 'text-green-600' : 'text-gray-500'}`}>
                                                        <span className="text-xs">{passwordValidation.length ? '✓' : '○'}</span>
                                                        <span className="text-xs">{t("profil.passwordCriteria.min8chars")}</span>
                                                    </div>
                                                    <div className={`flex items-center gap-1 ${passwordValidation.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                                                        <span className="text-xs">{passwordValidation.uppercase ? '✓' : '○'}</span>
                                                        <span className="text-xs">{t("profil.passwordCriteria.minUppercase")}</span>
                                                    </div>
                                                    <div className={`flex items-center gap-1 ${passwordValidation.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                                                        <span className="text-xs">{passwordValidation.lowercase ? '✓' : '○'}</span>
                                                        <span className="text-xs">{t("profil.passwordCriteria.minLowercase")}</span>
                                                    </div>
                                                    <div className={`flex items-center gap-1 ${passwordValidation.number ? 'text-green-600' : 'text-gray-500'}`}>
                                                        <span className="text-xs">{passwordValidation.number ? '✓' : '○'}</span>
                                                        <span className="text-xs">{t("profil.passwordCriteria.minNumber")}</span>
                                                    </div>
                                                    <div className={`flex items-center gap-1 ${passwordValidation.special ? 'text-green-600' : 'text-gray-500'}`}>
                                                        <span className="text-xs">{passwordValidation.special ? '✓' : '○'}</span>
                                                        <span className="text-xs">{t("profil.passwordCriteria.minSpecial")}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Confirmation */}
                                    <div className="form-control">
                                        <label className="label p-0 mb-2">
                                            <span className="label-text font-medium text-base-content">
                                                {t("profil.confirm") || "Confirmer le mot de passe"}
                                            </span>
                                        </label>
                                        <div className="relative group mt-2">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                                <Key size={18} className="text-base-content group-focus-within:text-blue-600 transition-colors" />
                                            </div>
                                            <input
                                                type={showConfirm ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className={`input input-bordered w-full pl-10 pr-12 
                                                    bg-base-50 focus:bg-base-100 
                                                    ${confirmPassword && newPassword !== confirmPassword ? 'border-red-300' : 'border-gray-300'}
                                                    ${confirmPassword && newPassword === confirmPassword ? 'border-green-300' : ''}
                                                    focus:border-blue-500 
                                                    focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50
                                                    transition-all duration-200 relative z-0`}
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirm(!showConfirm)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center z-20
                                                    text-gray-500 hover:text-blue-600 transition-colors duration-200
                                                    bg-transparent"
                                                aria-label={showConfirm ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                                            >
                                                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6 border-t border-gray-100">
                                    <button
                                        type="submit"
                                        className="btn btn-primary gap-2 px-8 min-h-12
                                            bg-gradient-to-r from-violet-500 to-pink-600 border-0 
                                            hover:from-violet-700 hover:to-pink-800 
                                            text-white font-medium shadow-md hover:shadow-lg
                                            transition-all duration-200
                                            disabled:opacity-50 disabled:cursor-not-allowed
                                            disabled:from-gray-400 disabled:to-gray-500 cursor-pointer"
                                        disabled={!oldPassword || !newPassword || !confirmPassword || 
                                                 newPassword !== confirmPassword || !isPasswordValid}
                                    >
                                        <Lock size={18} />
                                        <span>
                                            {t("profil.changepass") || "Changer le mot de passe"}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Barre de progression ou indicateurs (optionnel) */}
            <div className="mt-8 p-6 bg-base-100 rounded-2xl shadow-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-base-content mb-4">{t("profil.complète")}</h4>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-base-content">{t("profil.information")}</span>
                        <span className="text-base-content font-medium">80%</span>
                    </div>
                    <progress
                        className="progress progress-primary w-full h-3"
                        value="80"
                        max="100"
                    ></progress>
                    <p className="text-sm text-base-content">
                        {t("profil.add")}
                    </p>
                </div>
            </div>

            {/* Modal pour afficher la photo en grand */}
            {showPhotoModal && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
                    onClick={closePhotoModal}
                >
                    <div 
                        className="relative bg-base-100 rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden"
                        onClick={handleModalClick}
                    >
                        <button
                            onClick={closePhotoModal}
                            className="absolute top-4 right-4 z-50 bg-base-100 rounded-full p-2 hover:bg-base-200 transition-colors shadow-lg"
                            aria-label="Fermer"
                        >
                            <X size={24} />
                        </button>
                        
                        <div className="p-8 flex flex-col items-center">
                            <div className="w-full max-w-lg">
                                {formData.photo ? (
                                    <img
                                        src={URL.createObjectURL(formData.photo)}
                                        alt="Aperçu profil"
                                        className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-xl"
                                    />
                                ) : userProfilUrl ? (
                                    <img
                                        src={userProfilUrl.replace(/s\d+-c$/, 's800-c')}
                                        alt="Photo profil"
                                        className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-xl"
                                        crossOrigin="anonymous"
                                        referrerPolicy="no-referrer"
                                        onError={(e) => {
                                            console.error("Erreur chargement image en modal:", userProfilUrl);
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-gray-400 rounded-lg">
                                        <User size={120} />
                                    </div>
                                )}
                            </div>
                            
                            <div className="mt-6 text-center">
                                <h3 className="text-xl font-bold text-base-content">
                                    {formData.prenom} {formData.nom}
                                </h3>
                                <p className="text-base-content mt-2">{formData.email}</p>
                                
                                <div className="mt-6 flex gap-4">
                                    <button
                                        onClick={() => {
                                            if (userProfilUrl) {
                                                // Créer un lien temporaire pour télécharger l'image
                                                const link = document.createElement('a');
                                                link.href = userProfilUrl.replace(/s\d+-c$/, 's800-c');
                                                link.download = `photo-profil-${formData.prenom}-${formData.nom}.jpg`;
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                            }
                                        }}
                                        className="btn btn-outline gap-2"
                                        disabled={!userProfilUrl}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                        Télécharger
                                    </button>
                                    
                                    <label className="btn btn-primary gap-2 cursor-pointer">
                                        <Camera size={18} />
                                        Changer la photo
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setFormData({ ...formData, photo: e.target.files[0] });
                                                }
                                            }}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
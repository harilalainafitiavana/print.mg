import { useState, useEffect } from "react";
import { authFetch } from "./Utils"; // 👈 adapte le chemin
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getAvatarUrl } from './avatarUtils';

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

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // 🔹 Charger les infos utilisateur au montage
    useEffect(() => {
        const fetchProfil = async () => {
            try {
                const res = await authFetch("http://localhost:8000/api/profil/", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (res.ok) {
                    const data = await res.json();
                    setUserData(data); // ⭐ SAUVEGARDER LES DONNÉES COMPLÈTES

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

                    // ⭐⭐ CORRECTION : Utiliser getAvatarUrl pour traiter les URLs Google
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


    // 🔹 Mise à jour de la PHOTO SEULEMENT
    const handlePhotoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("🔄 Début handlePhotoSubmit");
        console.log("📸 Photo sélectionnée:", formData.photo?.name);

        if (!formData.photo) {
            alert("Veuillez sélectionner une photo");
            return;
        }

        // ⭐ UTILISER LE NOUVEL ENDPOINT
        const data = new FormData();
        data.append("profils", formData.photo);  // ⭐ Nom important : "profils"

        console.log("📦 FormData envoyé:");
        for (let [key, value] of data.entries()) {
            console.log(`  ${key}:`, value instanceof File ? `File(${value.name})` : value);
        }

        try {
            const res = await authFetch("http://localhost:8000/api/profil/photo/", {  // ⭐ NOUVEL URL
                method: "PUT",
                body: data,
            });

            console.log("📨 Réponse reçue, statut:", res.status);

            // Dans handlePhotoSubmit - MODIFIEZ cette partie :
            if (res.ok) {
                const responseData = await res.json();
                console.log("✅ SUCCÈS:", responseData);
                alert("Photo modifiée avec succès!");
                
                // ⭐ Utiliser l'URL complète SANS timestamp
                const fullUrl = `http://localhost:8000${responseData.profils}`;
                console.log("🔄 Nouvelle URL complète:", fullUrl);
                setUserProfilUrl(fullUrl);
                
                setFormData({ ...formData, photo: null });
            }else {
                const errorText = await res.text();
                console.error("❌ ERREUR:", errorText);
                alert("Erreur: " + errorText);
            }
        } catch (error) {
            console.error("❌ Erreur:", error);
            alert(error);
        }
    };

    // 🔹 Mise à jour des INFOS SEULEMENT (sans photo)
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
            const res = await authFetch("http://localhost:8000/api/profil/", {
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

    // 🔹 Changement de mot de passe
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert(t("profil.errorPassword"));
            return;
        }

        try {
            const res = await authFetch("http://localhost:8000/api/profil/change-password/", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword,
                }),
            });

            if (res.ok) {
                alert(t("profil.succesPassword"));
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                alert(t("profil.nosuccessPassword"));
                console.error(await res.text());
            }
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div>
            {/* Photo de profil */}
            <div className="border p-6 rounded-xl shadow-sm bg-base-100">
                <h3 className="text-2xl font-semibold">{t("profil.title")} <span className="text-blue-500">{formData.prenom} {formData.nom} 😀😊</span></h3>
                <form className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6" onSubmit={handlePhotoSubmit}>
                    {/* Partie gauche : inputs et bouton */}
                    <div className="flex-1 space-y-4">
                        <div className="flex justify-between gap-4">
                            <div>
                                <label className="block text-sm font-medium text-base-content mb-1 mt-4">{t("profil.code")}</label>
                                <input
                                    type="text"
                                    value={formData.code_postal}
                                    onChange={(e) => setFormData({ ...formData, code_postal: e.target.value })}
                                    placeholder={t("profil.codePlaceholder")}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-base-content mb-1 mt-4">{t("profil.Ville")}</label>
                                <input
                                    type="text"
                                    value={formData.ville}
                                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                                    placeholder={t("profil.villePlaceholder")}
                                    readOnly
                                    className="block bg-gray-200 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-base-content mb-1">{t("profil.pays")}</label>
                            <input
                                type="text"
                                value={formData.pays}
                                onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                                readOnly
                                placeholder={t("profil.paysPlaceholder")}
                                className="block bg-gray-200 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-base-content mb-1">{t("profil.photo")}</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setFormData({ ...formData, photo: e.target.files ? e.target.files[0] : null })
                                }
                                className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer mb-4 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="px-4 mt-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            {t("profil.change")}!!
                        </button>
                    </div>

                    {/* Partie droite : aperçu de l'image */}
                    <div className="flex-1 flex items-center justify-center">
                        {formData.photo ? (
                            <img
                                src={URL.createObjectURL(formData.photo)}
                                alt="Aperçu profil"
                                className="w-60 h-60 object-cover rounded-full border border-gray-300"
                            />
                        ) : userProfilUrl ? (
                            <img
                                src={userProfilUrl}  // ⭐ Déjà l'URL correcte grâce au serializer
                                alt="Photo profil"
                                className="w-60 h-60 object-cover rounded-full border border-gray-300"
                                onError={(e) => {
                                    console.error("Erreur chargement image profil:", userProfilUrl);
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        ) : (
                            <div className="w-60 h-60 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                {t("profil.no")}
                            </div>
                        )}
                    </div>

                </form>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Profil utilisateur */}
                <div className="border p-6 rounded-xl shadow-sm bg-base-100">
                    <h3 className="text-lg font-semibold mb-4">{t("profil.edit")}!!</h3>
                    <form className="space-y-4" onSubmit={handleInfoSubmit}>
                        {/* Nom */}
                        <div>
                            <label className="block text-sm font-medium text-base-content mb-1">{t("profil.name")}</label>
                            <input
                                type="text"
                                value={formData.nom}
                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                placeholder={t("profil.namePlaceholder")}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Prenom */}
                        <div>
                            <label className="block text-sm font-medium text-base-content mb-1">{t("profil.firstname")}</label>
                            <input
                                type="text"
                                value={formData.prenom}
                                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                placeholder={t("profil.firstPlaceholder")}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-base-content mb-1">{t("profil.email")}</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="exemple@email.com"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Téléphone */}
                        <div>
                            <label className="block text-sm font-medium text-base-content mb-1">{t("profil.phone")}</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+261 ..."
                                pattern="^\d{10}$"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            {t("profil.Save")}
                        </button>
                    </form>
                </div>
                {/* Sécurité */}
                <div className="border p-6 rounded-xl shadow-sm bg-base-100">
                    <h3 className="text-lg font-semibold mb-4">Sécurité</h3>
                    <form className="space-y-4" onSubmit={handlePasswordChange}>
                        {/* Ancien mot de passe */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-base-content mb-1">{t("profil.pass")}</label>
                            <input
                                type={showOld ? "text" : "password"}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="********"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowOld(!showOld)}
                                className="absolute right-3 top-[2.3rem] text-gray-500"
                            >
                                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Nouveau mot de passe */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-base-content mb-1">{t("profil.new")}</label>
                            <input
                                type={showNew ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="********"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-[2.3rem] text-gray-500"
                            >
                                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Confirmation du mot de passe */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-base-content mb-1">{t("profil.confirm")}</label>
                            <input
                                type={showConfirm ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="********"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-[2.3rem] text-gray-500"
                            >
                                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            {t("profil.changepass")}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

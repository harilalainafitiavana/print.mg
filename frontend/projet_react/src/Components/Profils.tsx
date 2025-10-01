import { useState, useEffect } from "react";
import { authFetch } from "./Utils"; // 👈 adapte le chemin
import { Eye, EyeOff } from "lucide-react";

export default function Profils() {
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

                    if (data.profils) {// ton backend
                        setUserProfilUrl(data.profils);
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

    // 🔹 Mise à jour du profil
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append("nom", formData.nom);
        data.append("prenom", formData.prenom);
        data.append("num_tel", formData.phone);
        data.append("email", formData.email);
        data.append("code_postal", formData.code_postal);
        data.append("ville", formData.ville);
        data.append("pays", formData.pays);
        if (formData.photo) data.append("profils", formData.photo);

        try {
            const res = await authFetch("http://localhost:8000/api/profil/", {
                method: "PUT",
                body: data,
            });

            if (res.ok) {
                alert("Profil mis à jour !");
                // Mettre à jour l'aperçu si l'image a changé
                if (formData.photo) {
                    setUserProfilUrl(URL.createObjectURL(formData.photo));
                    setFormData({ ...formData, photo: null });
                }
            } else {
                alert("Erreur lors de la mise à jour");
                console.error(await res.text());
            }
        } catch (error) {
            alert(error);
        }
    };

    // 🔹 Changement de mot de passe
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert("⚠️ Les mots de passe ne correspondent pas !");
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
                alert("Mot de passe changé !");
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                alert("Erreur lors du changement de mot de passe");
                console.error(await res.text());
            }
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div>
            {/* Photo de profil */}
            <div className="border p-6 rounded-xl shadow-sm bg-white">
                <h3 className="text-2xl font-semibold">Bonjour <span className="text-blue-500">{formData.prenom} {formData.nom} 😀😊</span></h3>
                <form className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6" onSubmit={handleSubmit}>
                    {/* Partie gauche : inputs et bouton */}
                    <div className="flex-1 space-y-4">
                        <div className="flex justify-between gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Code Postal</label>
                                <input
                                    type="text"
                                    value={formData.code_postal}
                                    onChange={(e) => setFormData({ ...formData, code_postal: e.target.value })}
                                    placeholder="Votre code postal"
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Ville</label>
                                <input
                                    type="text"
                                    value={formData.ville}
                                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                                    placeholder="Votre ville"
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                            <input
                                type="text"
                                value={formData.pays}
                                onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                                placeholder="Votre pays"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Photo de profil</label>
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
                            Changer!!
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
                                src={userProfilUrl}
                                alt="Photo profil"
                                className="w-60 h-60 object-cover rounded-full border border-gray-300"
                            />
                        ) : (
                            <div className="w-60 h-60 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                Aucune
                            </div>
                        )}
                    </div>
                </form>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Profil utilisateur */}
                <div className="border p-6 rounded-xl shadow-sm bg-white">
                    <h3 className="text-lg font-semibold mb-4">Modifier votre information!!</h3>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Nom */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                            <input
                                type="text"
                                value={formData.nom}
                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                placeholder="Votre nom"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Prenom */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prenom</label>
                            <input
                                type="text"
                                value={formData.prenom}
                                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                placeholder="Votre prenom"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
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
                            Sauvegarder
                        </button>
                    </form>
                </div>
                {/* Sécurité */}
                <div className="border p-6 rounded-xl shadow-sm bg-white">
                    <h3 className="text-lg font-semibold mb-4">Sécurité</h3>
                    <form className="space-y-4" onSubmit={handlePasswordChange}>
                        {/* Ancien mot de passe */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ancien mot de passe</label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation du mot de passe</label>
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
                            Changer le mot de passe
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

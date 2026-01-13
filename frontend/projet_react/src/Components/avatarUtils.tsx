// utils/avatarUtils.ts - VERSION CORRIGÉE
interface User {
    profils?: string | null;  // ⭐ Ajouter null
    google_avatar_url?: string;
}
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const getAvatarUrl = (user: User | null): string | null => {  // ⭐ Retourne string | null
    if (!user) return null;  // ⭐ Retourner null au lieu d'une URL

    // ⭐⭐ Détecter et décoder les URLs Google encodées
    if (user.profils) {
        // Si c'est une URL Google encodée (commence par /media/https%3A)
        if (user.profils.includes('https%3A') || user.profils.includes('http%3A')) {
            console.log("🚨 URL Google encodée détectée:", user.profils);

            // Extraire et décoder l'URL
            const encodedUrl = user.profils.replace('/media/', '');
            const decodedUrl = decodeURIComponent(encodedUrl);

            // ⭐⭐ CORRECTION DU SLASH MANQUANT
            const correctedUrl = decodedUrl.replace('https:/', 'https://').replace('http:/', 'http://');
            console.log("✅ URL corrigée:", correctedUrl);

            return correctedUrl;
        }

        // Si c'est une URL Google normale (commence par http)
        if (user.profils.startsWith('http')) {
            return user.profils;
        }

        // Si c'est un chemin local normal
        let imagePath = user.profils;

        if (!imagePath) {
            return ""; // ou une image par défaut
        }

        if (imagePath.startsWith('/media/')) {
            imagePath = imagePath.replace('/media/', '');
        }
        return `${API_BASE_URL}/media/${imagePath}`;
    }

    // ⭐⭐ RETOURNER NULL si pas de photo (au lieu d'une URL par défaut)
    return null;
};
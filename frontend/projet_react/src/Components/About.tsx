import { motion } from "framer-motion";
import { Mail, Phone, Printer, Truck, Info } from "lucide-react";
import Logo from "../assets/logo.png"

export default function About() {
    return (
        <div className="min-h-screen bg-base-100 text-base-content py-10 px-4 flex flex-col items-center">
            {/* Logo animé */}
            <motion.div
                className="flex flex-col items-center mb-10"
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, type: "spring" }}
            >
                <motion.img
                    src={Logo}
                    alt="Print.mg Logo"
                    className="w-24 h-24 mb-4 rounded-full shadow-lg ring ring-primary ring-offset-2"
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
                />
                <h1 className="text-3xl font-bold text-primary">Print.mg</h1>
                <p className="text-sm opacity-70 text-center mt-2">
                    Votre plateforme d’impression en ligne à Madagascar 🇲🇬
                </p>
            </motion.div>
            {/* Section Historique / Objectif */}
            <motion.div
                className="max-w-4xl bg-base-200 rounded-2xl shadow-xl p-6 mb-10 border border-base-300 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-2xl font-bold text-primary mb-4">À propos de Print.mg 🖨️</h2>
                <p className="text-sm opacity-80 leading-relaxed mb-2">
                    Print.mg est votre plateforme d’impression en ligne à Madagascar, créée pour simplifier vos commandes et livrer vos projets rapidement et en toute sécurité.
                </p>
                <p className="text-sm opacity-80 leading-relaxed mb-2">
                    Notre objectif est de fournir un service professionnel et accessible à tous, en vous accompagnant depuis le téléversement de vos fichiers jusqu’à la livraison.
                </p>
                <p className="text-sm opacity-80 leading-relaxed">
                    Grâce à notre plateforme, vous pouvez suivre vos commandes en temps réel et bénéficier de conseils personnalisés pour tous vos projets d’impression.
                </p>
            </motion.div>


            {/* Grid pour Commande et Livraison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mb-10">
                {/* Section Commande */}
                <motion.div
                    className="bg-base-200 rounded-2xl shadow-xl p-6 border border-base-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Printer className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-semibold">Comment passer commande 🖨️</h2>
                    </div>
                    <ul className="space-y-3 text-sm leading-relaxed">
                        <li>1️⃣ <b>Connexion</b> : Accédez à votre espace client</li>
                        <li>2️⃣ <b>Téléversement</b> : Importez vos fichiers à imprimer</li>
                        <li>3️⃣ <b>Personnalisation</b> : Choisissez format, finition, quantité</li>
                        <li>4️⃣ <b>Devis</b> : Visualisez le prix instantanément</li>
                        <li>5️⃣ <b>Livraison</b> : Sélectionnez votre mode de réception</li>
                        <li>6️⃣ <b>Paiement</b> : Finalisez par Mvola ou à la livraison</li>
                    </ul>
                    <p className="mt-4 text-primary font-medium">
                        Prêt à donner vie à votre projet ? ✨
                    </p>
                </motion.div>

                {/* Section Livraison */}
                <motion.div
                    className="bg-base-200 rounded-2xl shadow-xl p-6 border border-base-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Truck className="w-6 h-6 text-success" />
                        <h2 className="text-xl font-semibold">Livraison 🚚</h2>
                    </div>
                    <ul className="space-y-3 text-sm leading-relaxed">
                        <li>• <b>Zone Antananarivo</b> : 5 000 Ar</li>
                        <li>• <b>Gratuite</b> dès 200 000 Ar d'achat ✅</li>
                        <li>• <b>Suivi</b> : Accompagnement de votre commande</li>
                        <li>• <b>Professionnalisme</b> : Livraison soignée et sécurisée</li>
                    </ul>
                </motion.div>
            </div>

            {/* Section Contact centré en dessous */}
            <motion.div
                className="max-w-3xl bg-base-200 rounded-2xl shadow-xl p-6 border border-base-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                <div className="flex items-center gap-3 mb-4 justify-center">
                    <Info className="w-6 h-6 text-info" />
                    <h2 className="text-xl font-semibold">Contactez-nous 📞</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* WhatsApp */}
                    <a
                        href="https://wa.me/261336691909?text=Bonjour%20Print.mg%20!%20J’aimerais%20avoir%20des%20informations%20sur%20vos%20services."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-success flex items-center gap-2 text-white w-full justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className="w-5 h-5"
                        >
                            <path d="M20.52 3.48A11.78 11.78 0 0 0 12 0C5.38 0 .06 5.32.06 11.88c0 2.1.55 4.15 1.6 5.97L0 24l6.33-1.65a11.86 11.86 0 0 0 5.67 1.43h.01c6.63 0 11.95-5.32 11.95-11.88 0-3.18-1.27-6.17-3.44-8.42zM12 21.5a9.54 9.54 0 0 1-4.86-1.3l-.35-.2-3.76.98 1-3.66-.24-.37A9.36 9.36 0 0 1 2.5 11.9C2.5 6.71 6.83 2.4 12 2.4c2.57 0 4.98 1 6.79 2.8a9.35 9.35 0 0 1 2.77 6.67c0 5.19-4.33 9.53-9.56 9.63z" />
                            <path d="M17.52 14.6c-.27-.13-1.6-.78-1.85-.87-.25-.1-.43-.13-.6.13-.18.26-.7.87-.85 1.05-.16.18-.3.2-.57.07-.27-.13-1.13-.42-2.15-1.35a7.94 7.94 0 0 1-1.47-1.83c-.16-.26-.02-.4.12-.53.12-.12.27-.3.4-.45.13-.15.17-.26.26-.43.08-.17.04-.32-.02-.45-.06-.13-.6-1.46-.82-2-.22-.53-.44-.45-.6-.45h-.52c-.17 0-.45.06-.68.32-.23.26-.89.87-.89 2.13s.91 2.47 1.03 2.64c.13.17 1.78 2.73 4.3 3.84.6.26 1.07.42 1.44.53.61.19 1.16.16 1.6.1.49-.07 1.6-.65 1.83-1.27.23-.62.23-1.16.16-1.27-.07-.1-.25-.17-.52-.3z" />
                        </svg>
                        WhatsApp
                    </a>

                    {/* Email */}
                    <a
                        href="mailto:printa4@gmail.com"
                        className="btn btn-primary flex items-center gap-2 text-white w-full justify-center"
                    >
                        <Mail className="w-5 h-5" /> Email
                    </a>

                    {/* Téléphone principal */}
                    <a
                        href="tel:+261347964792"
                        className="btn btn-secondary flex items-center gap-2 text-white w-full justify-center"
                    >
                        <Phone className="w-5 h-5" /> 034 79 647 92
                    </a>

                    {/* Téléphone secondaire */}
                    <a
                        href="tel:+261336691909"
                        className="btn btn-accent flex items-center gap-2 text-white w-full justify-center"
                    >
                        <Phone className="w-5 h-5" /> 033 66 919 09
                    </a>
                </div>
            </motion.div>

            {/* Pied de page */}
            <p className="mt-10 text-xs opacity-70">
                © {new Date().getFullYear()} Print.mg — Tous droits réservés
            </p>
        </div>

    );
}

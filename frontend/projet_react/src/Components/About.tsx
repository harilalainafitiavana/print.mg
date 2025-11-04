import { motion } from "framer-motion";
import { Mail, Phone, Printer, Truck, Info } from "lucide-react";
import Logo from "../assets/logo.png";
import { useTranslation } from "react-i18next";

export default function About() {
    const { t } = useTranslation();
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
                    alt={t("about.logoAlt")}
                    className="w-24 h-24 mb-4 rounded-full shadow-lg ring ring-primary ring-offset-2"
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
                />
                <h1 className="text-3xl font-bold text-primary">{t("about.title")}</h1>
                <p className="text-sm opacity-70 text-center mt-2">
                    {t("about.subtitle")}
                </p>
            </motion.div>

            {/* Section Historique / Objectif */}
            <motion.div
                className="max-w-4xl bg-base-200 rounded-2xl shadow-xl p-6 mb-10 border border-base-300 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-2xl font-bold text-primary mb-4">{t("about.header")}</h2>
                <p className="text-sm opacity-80 leading-relaxed mb-2">
                    {t("about.description1")}
                </p>
                <p className="text-sm opacity-80 leading-relaxed mb-2">
                    {t("about.description2")}
                </p>
                <p className="text-sm opacity-80 leading-relaxed">
                    {t("about.description3")}
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
                        <h2 className="text-xl font-semibold">{t("order.header")}</h2>
                    </div>
                    <ul className="space-y-3 text-sm leading-relaxed">
                        <li>1️⃣ <b>{t("order.step1.title")}</b> : {t("order.step1.desc")}</li>
                        <li>2️⃣ <b>{t("order.step2.title")}</b> : {t("order.step2.desc")}</li>
                        <li>3️⃣ <b>{t("order.step3.title")}</b> : {t("order.step3.desc")}</li>
                        <li>4️⃣ <b>{t("order.step4.title")}</b> : {t("order.step4.desc")}</li>
                        <li>5️⃣ <b>{t("order.step5.title")}</b> : {t("order.step5.desc")}</li>
                        <li>6️⃣ <b>{t("order.step6.title")}</b> : {t("order.step6.desc")}</li>
                    </ul>
                    <p className="mt-4 text-primary font-medium">
                        {t("order.cta")}
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
                        <h2 className="text-xl font-semibold">{t("delivery.header")}</h2>
                    </div>
                    <ul className="space-y-3 text-sm leading-relaxed">
                        <li>• <b>{t("delivery.zone")}</b> : {t("delivery.price")}</li>
                        <li>• <b>{t("delivery.free")}</b> ✅</li>
                        <li>• <b>{t("delivery.track")}</b> : {t("delivery.assist")}</li>
                        <li>• <b>{t("delivery.pro")}</b> : {t("delivery.secure")}</li>
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
                    <h2 className="text-xl font-semibold">{t("contact.header")}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a
                        href={t("contact.whatsappLink")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-success flex items-center gap-2 text-white w-full justify-center"
                    >
                        WhatsApp
                    </a>
                    <a
                        href="https://workspace.google.com/intl/fr/gmail/"
                        className="btn btn-primary flex items-center gap-2 text-white w-full justify-center"
                    >
                        <Mail className="w-5 h-5" /> Email
                    </a>
                    <a
                        href="tel:+261347964792"
                        className="btn btn-secondary flex items-center gap-2 text-white w-full justify-center"
                    >
                        <Phone className="w-5 h-5" /> 034 79 647 92
                    </a>
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
                © {new Date().getFullYear()} Print.mg — {t("foter.rights")}
            </p>
        </div>
    );
}

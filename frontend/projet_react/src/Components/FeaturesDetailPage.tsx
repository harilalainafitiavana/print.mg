import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Truck, Printer, ArrowLeft, CheckCircle, Clock, Award, Headphones, Sparkles, Zap } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import Chat from './Chat';
import RetourAcceuil from './RetourAccueil';
import Popup from './Popup';
import { useTranslation } from "react-i18next";

const FeaturesDetailPage: React.FC = () => {
    const { t } = useTranslation();
    const features = [
        {
            id: 'securite',
            icon: Shield,
            title: t("plusDetaille.securityQualityGuarantee"),
            color: "from-blue-500 to-cyan-500",
            description: t("plusDetaille.securityQualityDescription"),
            details: [
                t("plusDetaille.qualityControl"),
                t("plusDetaille.ecoInks"),
                t("plusDetaille.premiumPapers"),
                t("plusDetaille.absoluteConfidentiality"),
                t("plusDetaille.isoStandards")
            ],
            stats: [
                { label: t("plusDetaille.Satisfactionclients"), value: "99%", icon: CheckCircle },
                { label: t("plusDetaille.Documentssécurisés"), value: "50k+", icon: Shield }
            ]
        },
        {
            id: 'livraison',
            icon: Truck,
            title: t("plusDetaille.fastReliableDelivery"),
            color: "from-emerald-500 to-green-500",
            description: t("plusDetaille.deliveryDescription"),
            details: [
                t("plusDetaille.expressDelivery"),
                t("plusDetaille.realTimeTracking"),
                t("plusDetaille.protectivePackaging"),
                t("plusDetaille.islandwideDelivery"),
                t("plusDetaille.competitiveFees")
            ],
            stats: [
                { label: t("plusDetaille.Livraisontemps"), value: "98%", icon: Clock },
                { label: t("plusDetaille.Zonesdesservies"), value: "22", icon: Truck }
            ]
        },
        {
            id: 'technologie',
            icon: Printer,
            title: t("plusDetaille.advancedPrintingTech"),
            color: "from-orange-500 to-red-500",
            description: t("plusDetaille.techDescription"),
            details: [
                t("plusDetaille.hdPrinters"),
                t("plusDetaille.pantoneTech"),
                t("plusDetaille.largeFormat"),
                t("plusDetaille.professionalFinishing"),
                t("plusDetaille.digitalOffsetPrint")
            ],
            stats: [
                { label: t("plusDetaille.Résolutionmax"), value: "2400 DPI", icon: Award },
                { label: t("plusDetaille.Supporttechnique"), value: "7j/7", icon: Headphones }
            ]
        }
    ];

    const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const id = entry.target.id;
                    if (entry.isIntersecting) {
                        setVisibleSections((prev) => new Set(prev).add(id));
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '-50px 0px -50px 0px'
            }
        );

        sectionRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-x-hidden">
            {/* Navbar */}
            <Navbar />

            {/* Hero Header avec animation */}
            <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white py-20">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fuchsia-400/20 rounded-full blur-3xl animate-pulse-slow animation-delay-1000"></div>
                </div>

                <div className="container relative mx-auto px-4">
                    <Link
                        to="/detaille"
                        className="inline-flex bg-white p-2 rounded text-gray-900 items-center gap-2 mb-8 transition-all duration-300 hover:gap-3 animate-slide-in-left relative z-10"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        {t("plusDetaille.backToServices")}
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-in-up animation-delay-300 relative z-10">
                        {t("plusDetaille.ourCommitmentToExcellence")}
                    </h1>
                    <p className="text-xl max-w-3xl opacity-90 animate-slide-in-up animation-delay-500 relative z-10">
                        {t("plusDetaille.discoverOurExcellence")}
                    </p>

                    {/* Animation décorative - ARRIÈRE-PLAN */}
                    <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-20 animate-float pointer-events-none">
                        <Sparkles className="h-32 w-32" />
                    </div>
                </div>
            </section>

            {/* Features Detail avec animations */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="space-y-16">
                        {features.map((feature, index) => {
                            const isVisible = visibleSections.has(feature.id);

                            return (
                                <div
                                    key={feature.id}
                                    id={feature.id}
                                    ref={(el) => { sectionRefs.current[index] = el; }}
                                    className={`scroll-mt-24 transition-all duration-1000 ${isVisible
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-8'
                                        }`}
                                >
                                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                                        {/* Icon & Title */}
                                        <div className="lg:w-1/3">
                                            <div className="sticky top-24">
                                                <div
                                                    className={`bg-gradient-to-r ${feature.color} p-4 rounded-2xl shadow-xl inline-block mb-6 transform transition-all duration-700 hover:scale-105 hover:rotate-3 hover:shadow-2xl ${isVisible ? 'animate-float' : ''
                                                        }`}
                                                >
                                                    <feature.icon className="h-12 w-12 text-white" />
                                                </div>
                                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                                    {feature.title}
                                                </h2>
                                                <p className="text-gray-600 text-lg">
                                                    {feature.description}
                                                </p>

                                                {/* Stats avec animation stagger */}
                                                <div className="mt-8 grid grid-cols-2 gap-4">
                                                    {feature.stats.map((stat, statIndex) => (
                                                        <div
                                                            key={statIndex}
                                                            className={`bg-white p-4 rounded-xl shadow-sm border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-lg ${isVisible
                                                                ? `opacity-100 translate-y-0 animation-delay-${(statIndex + 1) * 200}`
                                                                : 'opacity-0 translate-y-4'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <stat.icon className="h-5 w-5 text-violet-500" />
                                                                <span className="text-sm text-gray-500">{stat.label}</span>
                                                            </div>
                                                            <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                                                                {stat.value}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div
                                            className={`lg:w-2/3 bg-white rounded-2xl shadow-lg border border-gray-200 p-8 transform transition-all duration-700 ${isVisible
                                                ? 'opacity-100 translate-x-0'
                                                : 'opacity-0 translate-x-8'
                                                }`}
                                        >
                                            <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                                                {t("plusDetaille.serviceDetails")}
                                            </h3>

                                            <div className="space-y-6">
                                                {feature.details.map((detail, detailIndex) => (
                                                    <div
                                                        key={detailIndex}
                                                        className={`flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-violet-50 hover:to-fuchsia-50 transition-all duration-300 group transform hover:scale-[1.02] hover:shadow-md ${isVisible
                                                            ? `opacity-100 translate-x-0 animation-delay-${(detailIndex + 1) * 100}`
                                                            : 'opacity-0 -translate-x-4'
                                                            }`}
                                                    >
                                                        <div className="flex-shrink-0 mt-1">
                                                            <div className={`bg-gradient-to-r ${feature.color} p-1.5 rounded-full group-hover:scale-110 transition-transform duration-300`}>
                                                                <CheckCircle className="h-4 w-4 text-white" />
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-700 group-hover:text-gray-900 transition-colors">
                                                            {detail}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Additional Info */}
                                            <div
                                                className={`mt-10 pt-8 border-t border-gray-200 transform transition-all duration-700 ${isVisible
                                                    ? 'opacity-100 translate-y-0 animation-delay-1000'
                                                    : 'opacity-0 translate-y-8'
                                                    }`}
                                            >
                                                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                                    {t("plusDetaille.whyChooseThisService")}
                                                </h4>
                                                <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-xl p-6 transform transition-all duration-500 hover:shadow-lg">
                                                    <p className="text-gray-700">
                                                        {t("plusDetaille.uniqueApproachDescription")}
                                                    </p>
                                                    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-violet-600">
                                                        <span className="inline-flex items-center gap-1 bg-white/50 px-3 py-1 rounded-full">
                                                            <Zap className="h-3 w-3" />
                                                            {t("plusDetaille.available7Days")}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 bg-white/50 px-3 py-1 rounded-full">
                                                            <Headphones className="h-3 w-3" />
                                                            {t("plusDetaille.techSupportIncluded")}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 bg-white/50 px-3 py-1 rounded-full">
                                                            <Award className="h-3 w-3" />
                                                            {t("plusDetaille.satisfactionGuarantee")}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider avec animation */}
                                    {index < features.length - 1 && (
                                        <div
                                            className={`mt-16 pt-8 border-t border-gray-300/50 transform transition-all duration-1000 ${isVisible
                                                ? 'opacity-100 scale-x-100'
                                                : 'opacity-0 scale-x-0'
                                                }`}
                                        ></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section avec animation */}
            <section className="py-20 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fuchsia-400/20 rounded-full blur-3xl animate-pulse-slow animation-delay-500"></div>
                </div>

                <div className="container relative mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6 animate-slide-in-up">
                        {t("plusDetaille.readyToStartProject")}
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto animate-slide-in-up animation-delay-200">
                        {t("plusDetaille.discoverOurServices")}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-up animation-delay-400">
                        <Link
                            to="/login"
                            className="group bg-white text-violet-600 font-bold py-3 px-8 rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
                        >
                            <span>{t("plusDetaille.orderNow")}</span>
                            <ArrowLeft className="h-4 w-4 rotate-180 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/"
                            className="group bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <span>{t("plusDetaille.viewAllServices")}</span>
                            <Sparkles className="h-4 w-4 transform group-hover:rotate-180 transition-transform duration-500" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Chat */}
            <Chat />

            {/* Retour vers le haut */}
            <RetourAcceuil />

            {/* Popup */}
            <Popup />

            {/* Footer */}
            <Footer />

            {/* Styles d'animation */}
            <style>{`
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                @keyframes pulseSlow {
                    0%, 100% {
                        opacity: 0.3;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }

                .animate-slide-in-up {
                    animation: slideInUp 0.6s ease-out forwards;
                }

                .animate-slide-in-left {
                    animation: slideInLeft 0.6s ease-out forwards;
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                .animate-pulse-slow {
                    animation: pulseSlow 4s ease-in-out infinite;
                }

                .animation-delay-200 {
                    animation-delay: 200ms;
                }

                .animation-delay-300 {
                    animation-delay: 300ms;
                }

                .animation-delay-400 {
                    animation-delay: 400ms;
                }

                .animation-delay-500 {
                    animation-delay: 500ms;
                }

                .animation-delay-1000 {
                    animation-delay: 1000ms;
                }

                .animation-delay-2000 {
                    animation-delay: 2000ms;
                }

                /* Pour les animations basées sur les index */
                .animation-delay-100 {
                    animation-delay: 100ms;
                }

                .animation-delay-200 {
                    animation-delay: 200ms;
                }

                .animation-delay-300 {
                    animation-delay: 300ms;
                }

                .animation-delay-400 {
                    animation-delay: 400ms;
                }

                .animation-delay-500 {
                    animation-delay: 500ms;
                }

                .animation-delay-600 {
                    animation-delay: 600ms;
                }

                .animation-delay-700 {
                    animation-delay: 700ms;
                }

                .animation-delay-800 {
                    animation-delay: 800ms;
                }

                .animation-delay-900 {
                    animation-delay: 900ms;
                }

                .animation-delay-1000 {
                    animation-delay: 1000ms;
                }

                /* Transition par défaut pour les sections observées */
                .section-transition {
                    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                }

                /* Effet de parallaxe léger */
                @media (min-width: 1024px) {
                    .parallax-effect {
                        transform-style: preserve-3d;
                        transform: perspective(1000px);
                    }
                }
            `}</style>
        </div>
    );
};

export default FeaturesDetailPage;
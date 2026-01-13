import React, { useEffect, useState } from 'react';
import { Printer, Shield, Truck, Filter, X, BookOpen, Layers, Package, Tag, Sparkles, Star, Zap, TrendingUp } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import Chat from './Chat';
import RetourAcceuil from './RetourAccueil';
import Popup from './Popup';
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import API_BASE_URL from '../services/api';

// Types TypeScript
interface Product {
    future: string;
    id: number;
    name: string;
    description: string;
    categorie: string;
    prix: string;
    image: string;
    featured: boolean;
    format_defaut: "A3" | "A4" | "A5" | "A6";
    is_grand_format: boolean;
}

const PublicationsPage: React.FC = () => {
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [params] = useSearchParams();
    const urlSearch = params.get("search") || "";
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/produits/`);
                const data = await res.json();
                setProducts(data);

                if (urlSearch) {
                    setSearchQuery(urlSearch);
                }
            } catch (error) {
                console.error("Erreur lors du fetch des produits :", error);
            }
        };
        fetchProducts();
    }, [urlSearch]);

    // Filtrer les produits
    const filteredProducts = products.filter(product => {
        const search = searchQuery.toLowerCase().trim();
        const matchesSearch =
            search === "" ||
            product.name.toLowerCase().includes(search) ||
            product.description.toLowerCase().includes(search) ||
            product.categorie.toLowerCase().includes(search);
        const matchesCategory = selectedCategory === 'Tous' || product.categorie === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Obtenir toutes les catégories uniques
    const categories = ['Tous', ...Array.from(new Set(products.map(product => product.categorie)))];

    // --- Pagination ---
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 700, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

            {/* Navbar */}
            <Navbar />

            {/* Hero Section - Améliorée */}
            <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white py-24">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fuchsia-400/20 rounded-full blur-3xl"></div>
                </div>

                <div className="container relative mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-sm font-medium">✨ {t("detaille.sectionHero.subtitle") || "Impression professionnelle"}</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                        {t("detaille.sectionHero.title")}
                        <span className="block text-xl md:text-2xl mt-3 font-normal opacity-90">
                            {t("detaille.sectionHero.description")}
                        </span>
                    </h1>

                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-10">
                        <Link
                            to="/login"
                            className="group bg-white text-violet-600 font-bold py-4 px-10 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/30 flex items-center gap-2"
                        >
                            <Zap className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                            {t("detaille.sectionHero.button")}
                        </Link>
                        <Link
                            to='/'
                            className="group bg-transparent border-2 border-white/50 hover:border-white text-white font-bold py-4 px-8 rounded-full transition-all duration-300 hover:scale-105 hover:bg-white/10 backdrop-blur-sm flex items-center gap-2"
                        >
                            <TrendingUp className="h-5 w-5" />
                            {t("detaille.sectionHero.link")}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section - Améliorée */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("detaille.whyChooseUs")}</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            {t("detaille.exceptionalExperience")}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Shield,
                                title: t("detaille.feature.0.title"),
                                text: t("detaille.feature.0.text"),
                                color: "from-blue-500 to-cyan-500",
                                link: "/features#securite" // Lien vers l'ancre
                            },
                            {
                                icon: Truck,
                                title: t("detaille.feature.1.title"),
                                text: t("detaille.feature.1.text"),
                                color: "from-emerald-500 to-green-500",
                                link: "/features#livraison"
                            },
                            {
                                icon: Printer,
                                title: t("detaille.feature.2.title"),
                                text: t("detaille.feature.2.text"),
                                color: "from-orange-500 to-red-500",
                                link: "/features#technologie"
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="group relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8 hover:border-transparent hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-2"
                            >
                                <div className="absolute -top-5 left-8">
                                    <div className={`bg-gradient-to-r ${feature.color} p-3 rounded-xl shadow-lg`}>
                                        <feature.icon className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mt-6 mb-3 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.text}</p>
                                <div className="mt-6 pt-4 border-t border-gray-100 group-hover:border-gray-200 transition-colors">
                                    <Link
                                        to={feature.link}
                                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-violet-600 transition-colors duration-300 group/btn"
                                    >
                                        <div className="w-2 h-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full group-hover/btn:scale-125 transition-transform duration-300"></div>
                                        <span className="font-medium">{t("detaille.learnMore")}</span>
                                        <svg
                                            className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Section - Améliorée */}
            <section className="py-16 bg-gradient-to-b from-white to-gray-50">
                <div className="container mx-auto px-4">
                    {/* Header avec titre et bouton tarifs */}
                    <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6">
                        <div className="text-center lg:text-left">
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                                {t("detaille.product.title")}
                            </h2>
                            <p className="text-gray-600 mt-2">{t("detaille.discoverServices")}</p>
                        </div>

                        <button
                            onClick={() => setShowPriceModal(true)}
                            className="group relative overflow-hidden bg-gradient-to-r from-violet-500 via-violet-600 to-pink-600 text-white font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            <div className="flex items-center gap-3 relative">
                                <Tag className="h-5 w-5 animate-pulse" />
                                <span className="tracking-wide">{t("detaille.product.price")}</span>
                                <Sparkles className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                            </div>
                        </button>
                    </div>

                    {/* Filtres */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-violet-100 rounded-lg">
                                <Filter className="h-5 w-5 text-violet-600" />
                            </div>
                            <span className="font-medium text-gray-700">{t("detaille.filterByCategory")}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${selectedCategory === category
                                        ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Products Grid */}
                    {currentProducts.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="inline-block p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl mb-6">
                                <Package className="h-16 w-16 text-gray-400 mx-auto" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-700 mb-3">{t("detaille.noProductsFound")}</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                {t("detaille.tryModifyingSearch")}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {currentProducts.map(product => (
                                <div
                                    key={product.id}
                                    onMouseEnter={() => setHoveredCard(product.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-200"
                                >
                                    {/* Badge populaire */}
                                    {product.featured && (
                                        <div className="absolute top-4 left-4 z-10">
                                            <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                                <Star className="h-3 w-3" />
                                                {t("detaille.popular")}
                                            </div>
                                        </div>
                                    )}

                                    {/* Image container */}
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={product.image.startsWith("http") ? product.image : `http://localhost:8000${product.image}`}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>

                                    {/* Contenu */}
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors">
                                                    {product.name}
                                                </h3>
                                                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                                                    {product.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className="inline-flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-medium px-3 py-1.5 rounded-full">
                                                <BookOpen className="h-3 w-3" />
                                                {product.format_defaut}
                                            </span>
                                            {product.is_grand_format && (
                                                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full">
                                                    📏 Grand format
                                                </span>
                                            )}
                                            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">
                                                {product.categorie}
                                            </span>
                                        </div>

                                        {/* Prix et CTA */}
                                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                            <div>
                                                <div className="text-sm text-gray-500">{t("detaille.startingFrom")}</div>
                                                <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                                                    {product.prix} Ar
                                                </div>
                                            </div>
                                            <Link to="/login" className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-5 py-2.5 rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300">
                                                {t("detaille.order")}
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Effet de bordure au hover */}
                                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-violet-500/30 rounded-2xl transition-all duration-500 pointer-events-none"></div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination améliorée */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-12">
                            <button
                                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                ←
                            </button>

                            <div className="flex items-center gap-2">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`w-12 h-12 rounded-full font-medium transition-all duration-300 ${currentPage === pageNum
                                                ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg'
                                                : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                →
                            </button>

                            <span className="text-gray-500 ml-4 text-sm">
                                Page {currentPage} sur {totalPages}
                            </span>
                        </div>
                    )}
                </div>
            </section>

            {/* Call to Action - Améliorée */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-800"></div>
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-fuchsia-400/10 rounded-full blur-3xl"></div>
                </div>

                <div className="container relative mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                        <Zap className="h-4 w-4" />
                        <span className="text-sm font-medium">{t("detaille.readyToStart")}</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        {t("detaille.action.title")}
                    </h2>
                    <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10">
                        {t("detaille.action.text")}
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/login"
                            className="group bg-white text-violet-600 font-bold py-4 px-10 rounded-full hover:scale-105 hover:shadow-2xl hover:shadow-white/30 transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            <Printer className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                            {t("detaille.action.button")}
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>

                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-white/80">
                        {['+50 Clients', '98% Satisfaction', 'Livraison 24h', 'Support 7j/7'].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl font-bold text-white mb-1">{stat.split(' ')[0]}</div>
                                <div className="text-sm">{stat.split(' ').slice(1).join(' ')}</div>
                            </div>
                        ))}
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

            {/* Modal des prix - NON MODIFIÉ */}
            {showPriceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-11/12 md:w-2/3 lg:w-1/2 p-8 relative animate-fadeIn">
                        <button
                            onClick={() => setShowPriceModal(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-violet-500 transition"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-3xl font-bold text-center text-violet-600 mb-8">
                            💰 {t("detaille.product.price")}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                            <div className="bg-violet-50 rounded-xl p-4 border border-violet-200 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center gap-2 mb-2">
                                    <BookOpen className="text-violet-500" />
                                    <h3 className="font-semibold text-lg">{t("detaille.product.modal.format")}</h3>
                                </div>
                                <ul className="space-y-1 text-sm">
                                    <li>A3 : <span className="font-bold">1000 Ar</span></li>
                                    <li>A4 : <span className="font-bold">500 Ar</span></li>
                                    <li>A5 : <span className="font-bold">300 Ar</span></li>
                                    <li>{t("detaille.product.modal.custom")} : <span className="font-bold">200 Ar</span></li>
                                    <li>{t("detaille.product.modal.largeformat")} : <span className="font-bold">5000 Ar</span></li>
                                </ul>
                            </div>

                            <div className="bg-violet-50 rounded-xl p-4 border border-violet-200 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center gap-2 mb-2">
                                    <Layers className="text-violet-500" />
                                    <h3 className="font-semibold text-lg">{t("detaille.product.modal.binding")}</h3>
                                </div>
                                <ul className="space-y-1 text-sm">
                                    <li>
                                        {t("detaille.product.modal.spiral")} : <span className="font-bold">2000 Ar</span>
                                    </li>
                                    <li>
                                        {t("detaille.product.modal.perfectBinding")} : <span className="font-bold">3000 Ar</span>
                                    </li>
                                    <li>
                                        {t("detaille.product.modal.stapled")} : <span className="font-bold">1000 Ar</span>
                                    </li>
                                    <li>
                                        Rigide : <span className='font-bold'>3000</span>
                                    </li>
                                    <li>
                                        Cousu : <span className='font-bold'>2500</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-violet-50 rounded-xl p-4 border border-violet-200 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center gap-2 mb-2">
                                    <Package className="text-violet-500" />
                                    <h3 className="font-semibold text-lg">{t("detaille.product.modal.cover")}</h3>
                                </div>
                                <ul className="space-y-1 text-sm">
                                    <li>
                                        {t("detaille.product.modal.photopaper")} : <span className="font-bold">3000 Ar</span>
                                    </li>
                                    <li>
                                        {t("detaille.product.modal.simple")} : <span className="font-bold">1000 Ar</span>
                                    </li>
                                    <li>
                                        Mat : <span className='font-bold'>2000</span>
                                    </li>
                                    <li>
                                        Brillant : <span className='font-bold'>2000</span>
                                    </li>
                                    <li>
                                        Texture : <span className='font-bold'>4000</span>
                                    </li>
                                    <li>
                                        {t("detaille.product.modal.doubleSided")} : <span className="italic text-blue-600">{t("detaille.product.modal.validPrice")}</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-violet-50 rounded-xl p-4 border border-violet-200 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center gap-2 mb-2">
                                    <Truck className="text-violet-500" />
                                    <h3 className="font-semibold text-lg">{t("detaille.product.modal.delivery")}</h3>
                                </div>
                                <p className="text-sm">
                                    {t("detaille.product.modal.deliveryFees")} : <span className="font-bold">5000 Ar</span>
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={() => setShowPriceModal(false)}
                                className="bg-violet-500 text-white px-8 py-2 rounded-full hover:bg-violet-600 transition shadow-md"
                            >
                                {t("detaille.product.modal.close")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublicationsPage;
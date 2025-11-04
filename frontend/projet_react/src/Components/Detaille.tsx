import React, { useEffect, useState } from 'react';
import { Printer, Shield, Truck, Filter, X, BookOpen, Layers, Package, Tag } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import Chat from './Chat';
import RetourAcceuil from './RetourAccueil'
import Popup from './Popup';
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";


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
    format_defaut: "A3" | "A4" | "A5" | "A6"; // nouveau champ
    is_grand_format: boolean;               // nouveau champ
}


const PublicationsPage: React.FC = () => {
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [showPriceModal, setShowPriceModal] = useState(false);

    const [params] = useSearchParams();
    const urlSearch = params.get("search") || "";

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/produits/");
                const data = await res.json();
                setProducts(data);

                // si on a une recherche dans l'URL, l’appliquer directement
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

        // Matches recherche sur nom, description ou catégorie
        const matchesSearch =
            search === "" ||
            product.name.toLowerCase().includes(search) ||
            product.description.toLowerCase().includes(search) ||
            product.categorie.toLowerCase().includes(search);

        // Si l'utilisateur a choisi une catégorie spécifique, on applique le filtre
        const matchesCategory = selectedCategory === 'Tous' || product.categorie === selectedCategory;

        return matchesSearch && matchesCategory;
    });


    // Obtenir toutes les catégories uniques
    const categories = ['Tous', ...Array.from(new Set(products.map(product => product.categorie)))];

    // --- Pagination ---
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6; // nombre d’éléments par page

    // Calcul des indices
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Nombre total de pages
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };


    return (

        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">{t("detaille.sectionHero.title")}</h1>
                    <p className="text-xl max-w-3xl mx-auto mb-8">
                        {t("detaille.sectionHero.description")}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
                        <Link to="/login" className="bg-white hover:bg-blue-700 text-blue-600 hover:text-white font-bold py-3 px-8 rounded-full transition duration-300 hover:scale-105">
                            {t("detaille.sectionHero.button")}
                        </Link>
                        <Link to='/' className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105"> {t("detaille.sectionHero.link")} </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6 rounded-lg bg-blue-50">
                            <div className="flex justify-center mb-4">
                                <Shield className="h-12 w-12 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{t("detaille.feature.0.title")}</h3>
                            <p className="text-gray-600">{t("detaille.feature.0.text")}</p>
                        </div>
                        <div className="text-center p-6 rounded-lg bg-blue-50">
                            <div className="flex justify-center mb-4">
                                <Truck className="h-12 w-12 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{t("detaille.feature.1.title")}</h3>
                            <p className="text-gray-600">{t("detaille.feature.1.text")}</p>
                        </div>
                        <div className="text-center p-6 rounded-lg bg-blue-50">
                            <div className="flex justify-center mb-4">
                                <Printer className="h-12 w-12 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{t("detaille.feature.2.title")}</h3>
                            <p className="text-gray-600">{t("detaille.feature.2.text")}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    {/* Titre de produit */}
                    <div className='flex flex-col md:flex-row md:justify-between'>
                        <h2 className="text-3xl mx-auto font-bold text-center mb-12">{t("detaille.product.title")}</h2>

                        <div className="flex justify-between mx-auto md:mx-0 items-center mb-6">
                            <button
                                onClick={() => setShowPriceModal(true)}
                                className="relative overflow-hidden bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-gradientMove"
                            >
                                {/* Animation lumineuse */}
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 ease-out" />

                                {/* Icône animée */}
                                <Tag className="w-5 h-5 animate-bounce-slow" />
                                <span className="tracking-wide">{t("detaille.product.price")}</span>
                            </button>
                        </div>

                        <style>
                            {`
                            @keyframes bounceSlow {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-4px); }
                            }
                            .animate-bounce-slow {
                            animation: bounceSlow 2s infinite ease-in-out;
                            }

                            @keyframes gradientMove {
                            0% { background-position: 0% 50%; }
                            50% { background-position: 100% 50%; }
                            100% { background-position: 0% 50%; }
                            }
                            .animate-gradientMove {
                            background-size: 200% 200%;
                            animation: gradientMove 5s ease infinite;
                            }
                            `}
                        </style>

                    </div>

                    {/* Filter */}
                    <div className="flex justify-end mb-10">
                        <Filter className="h-5 w-5 text-gray-600 mr-2" />
                        <select
                            className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    {/* Products Grid */}
                    {currentProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-xl">{t("detaille.product.noProduct")}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {currentProducts.map(product => (
                                <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
                                    <div className="relative">
                                        <img
                                            src={product.image.startsWith("http") ? product.image : `http://localhost:8000${product.image}`}
                                            alt={product.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        {product.featured && (
                                            <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                                Populaire
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className='flex flex-row justify-between mb-2'>
                                            <div>
                                                <h3 className="text-xl font-bold">{product.name}</h3>
                                                <p className="text-gray-600 mb-4">{product.description}</p>
                                            </div>
                                            <div>
                                                <p><strong>Format : </strong>{product.format_defaut}</p>
                                                <p><strong>Grand format : </strong>{product.is_grand_format ? "✅" : "❌"}</p>
                                            </div>
                                        </div>
                                        <span className="text-blue-600 font-bold">{product.prix} Ariary</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    <div className="flex justify-center mt-8 gap-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`px-4 py-2 rounded-lg border ${currentPage === i + 1
                                    ? "bg-blue-500 text-white"
                                    : "bg-white text-blue-500 border-blue-500"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </section>


            {/* Call to Action */}
            <section className="py-20 bg-blue-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">{t("detaille.action.title")}</h2>
                    <p className="text-xl max-w-3xl mx-auto mb-8">
                        {t("detaille.action.text")}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/login" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-blue-100 transition duration-300">
                            {t("detaille.action.button")}
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
            <Footer />*

            {/* Modal des prix */}
            {showPriceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-11/12 md:w-2/3 lg:w-1/2 p-8 relative animate-fadeIn">
                        {/* Bouton fermer */}
                        <button
                            onClick={() => setShowPriceModal(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-blue-500 transition"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Titre */}
                        <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
                            💰 {t("detaille.product.price")}
                        </h2>

                        {/* Contenu */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                            {/* Formats */}
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center gap-2 mb-2">
                                    <BookOpen className="text-blue-500" />
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

                            {/* Reliure */}
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center gap-2 mb-2">
                                    <Layers className="text-blue-500" />
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
                                </ul>
                            </div>

                            {/* Couverture */}
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center gap-2 mb-2">
                                    <Package className="text-blue-500" />
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
                                        {t("detaille.product.modal.doubleSided")} : <span className="italic text-blue-600">{t("detaille.product.modal.validPrice")}</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Livraison */}
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center gap-2 mb-2">
                                    <Truck className="text-blue-500" />
                                    <h3 className="font-semibold text-lg">{t("detaille.product.modal.delivery")}</h3>
                                </div>
                                <p className="text-sm">
                                    {t("detaille.product.modal.deliveryFees")} : <span className="font-bold">5000 Ar</span>
                                </p>
                            </div>
                        </div>

                        {/* Bouton fermer */}
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={() => setShowPriceModal(false)}
                                className="bg-blue-500 text-white px-8 py-2 rounded-full hover:bg-blue-600 transition shadow-md"
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
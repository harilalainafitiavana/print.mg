import React, { useEffect, useState } from 'react';
import { Printer, Shield, Truck, Search, Filter } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import Chat from './Chat';

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
}


const PublicationsPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);

    // --- Fetch des produits existants ---
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/produits/");
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Erreur lors du fetch des produits :", error);
            }
        };
        fetchProducts();
    }, []);

    // Filtrer les produits par catégorie et recherche
    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'Tous' || product.categorie === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
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
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Nos Services d'Impression</h1>
                    <p className="text-xl max-w-3xl mx-auto mb-8">
                        Découvrez notre gamme complète de produits d'impression de haute qualité.
                        Des cartes de visite aux affiches grand format, nous avons tout pour répondre à vos besoins.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
                        <Link to="/login" className="bg-white hover:bg-blue-700 text-blue-600 hover:text-white font-bold py-3 px-8 rounded-full transition duration-300 hover:scale-105">
                            Commander maintenant
                        </Link>
                        <Link to='/' className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105">Retour vers l'accueil </Link>
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
                            <h3 className="text-xl font-semibold mb-2">Qualité Garantie</h3>
                            <p className="text-gray-600">Des produits d'impression de haute qualité avec une finition impeccable.</p>
                        </div>
                        <div className="text-center p-6 rounded-lg bg-blue-50">
                            <div className="flex justify-center mb-4">
                                <Truck className="h-12 w-12 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Livraison Rapide</h3>
                            <p className="text-gray-600">Recevez vos produits en temps voulu, peu importe l'urgence.</p>
                        </div>
                        <div className="text-center p-6 rounded-lg bg-blue-50">
                            <div className="flex justify-center mb-4">
                                <Printer className="h-12 w-12 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Technologie Avancée</h3>
                            <p className="text-gray-600">Utilisation des dernières technologies d'impression pour des résultats parfaits.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Nos Produits</h2>

                    {/* Search and Filter */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                        <div className="relative w-full md:w-1/3">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Rechercher un produit..."
                                className="pl-10 pr-4 py-2 w-full border border-blue-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-gray-600" />
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
                    </div>

                    {/* Products Grid */}
                    {currentProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-xl">Aucun produit ne correspond à votre recherche.</p>
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
                                        <h3 className="text-xl font-bold">{product.name}</h3>
                                        <p className="text-gray-600 mb-4">{product.description}</p>
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
                    <h2 className="text-3xl font-bold mb-6">Prêt à imprimer vos projets?</h2>
                    <p className="text-xl max-w-3xl mx-auto mb-8">
                        Rejoignez des milliers de clients satisfaits qui nous ont fait confiance pour leurs besoins d'impression.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/login" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-blue-100 transition duration-300">
                            Commander maintenant
                        </Link>
                    </div>
                </div>
            </section>

            {/* Chat */}
            <Chat />

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default PublicationsPage;
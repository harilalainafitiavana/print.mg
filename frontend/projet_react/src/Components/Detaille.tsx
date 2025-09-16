import React, { useState } from 'react';
import { Printer, Shield, Truck, Star, Search, Filter } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Link } from 'react-router-dom';

// Types TypeScript
interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    price: string;
    rating: number;
    image: string;
    featured: boolean;
}

// Données des produits
const productsData: Product[] = [
    {
        id: 1,
        name: "Cartes de visite premium",
        description: "Cartes de visite en papier qualité premium avec finition mate ou brillante. Parfaites pour les professionnels.",
        category: "Papeterie",
        price: "À partir de 15.000 Ar",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        featured: true
    },
    {
        id: 2,
        name: "Flyers promotionnels",
        description: "Flyers vibrants qui captivent l'attention. Idéals pour promotions et événements.",
        category: "Marketing",
        price: "À partir de 25.000 Ar",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1521334884684-d80222895322?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        featured: true
    },
    {
        id: 3,
        name: "Brochures élégantes",
        description: "Brochures pliantes qui racontent l'histoire de votre marque avec élégance.",
        category: "Marketing",
        price: "À partir de 45.000 Ar",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        featured: false
    },
    {
        id: 4,
        name: "Affiches grand format",
        description: "Affiches grand format avec des couleurs vives et une résolution exceptionnelle.",
        category: "Décoration",
        price: "À partir de 30.000 Ar",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        featured: true
    },
    {
        id: 5,
        name: "Stickers personnalisés",
        description: "Stickers résistants de toutes formes et tailles pour personnaliser vos produits.",
        category: "Divers",
        price: "À partir de 10.000 Ar",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1584824486539-53bb4646bdbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        featured: false
    },
    {
        id: 6,
        name: "Emballages sur mesure",
        description: "Emballages personnalisés qui rendent vos produits irrésistibles.",
        category: "Emballage",
        price: "À partir de 60.000 Ar",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1586880244386-9682836f6eeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        featured: false
    },
    {
        id: 7,
        name: "Invitations événementielles",
        description: "Invitations élégantes pour mariages, anniversaires et événements corporatifs.",
        category: "Papeterie",
        price: "À partir de 20.000 Ar",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1535 1043215-4a78c7a6c6a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        featured: true
    },
    {
        id: 8,
        name: "Catalogues produits",
        description: "Catalogues professionnels pour présenter votre gamme de produits.",
        category: "Marketing",
        price: "À partir de 75.000 Ar",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        featured: false
    }
];

const PublicationsPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Filtrer les produits par catégorie et recherche
    const filteredProducts = productsData.filter(product => {
        const matchesCategory = selectedCategory === 'Tous' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Obtenir toutes les catégories uniques
    const categories = ['Tous', ...Array.from(new Set(productsData.map(product => product.category)))];

    return (

        <div className="min-h-screen bg-gray-50">

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
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-xl">Aucun produit ne correspond à votre recherche.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
                                    <div className="relative">
                                        <img
                                            src={product.image}
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
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold">{product.name}</h3>
                                            <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                                <Star className="h-4 w-4 mr-1 fill-current" />
                                                {product.rating}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 mb-4">{product.description}</p>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-blue-600 font-bold">{product.price}</span>
                                        </div>
                                        <Link to="/login" className="w-full px-6 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-300">
                                            Commander
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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

            <Footer />
        </div>
    );
};

export default PublicationsPage;
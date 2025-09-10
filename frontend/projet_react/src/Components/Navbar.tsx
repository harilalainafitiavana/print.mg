import { useEffect, useState, useRef } from "react";
import { ShoppingCart, Menu, Globe, UserPlus, UserCheck, ShoppingBasket, Search, Printer } from "lucide-react";
import axios from "axios";
import Image from "../assets/album photo.jpg"
import Photo from "../assets/album photo.jpg"

export default function Navbar() {
    const [cartCount, setCartCount] = useState(0);
    const [search, setSearch] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8000/api/cart/count/")
            .then(res => setCartCount(res.data.count))
            .catch(err => console.error(err));
    }, []);

    const [language, setLanguage] = useState("fr");

    const changeLanguage = (lang: string) => {
        setLanguage(lang);
        console.log("Langue sélectionnée :", lang);
    };

    const [hovered, setHovered] = useState<string | null>(null);
    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
    const [isPopupHovered, setIsPopupHovered] = useState(false);
    // const navbarRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<number | null>(null);

    const papiers = [
        {
            name: "Grand format",
            price: "1 350 Ar / impression",
            min: 4,
            description: "Format large, adapté aux affiches (minimum 4 impressions).",
            image: "https://img.freepik.com/photos-gratuite/belle-femme-souriante-s-appuyant-tableau-blanc-vide_329181-3924.jpg"
        },
        {
            name: "Petit format",
            price: "600 Ar / impression",
            min: 30,
            description: "Idéal pour documents standards (minimum 30 impressions).",
            image: "https://www.printoclock.com/media/image/e8/57/fd2d1edaf5cab744059dc3117f9d.jpeg"
        },
        {
            name: "Personnalisé",
            price: "450 Ar / impression",
            min: 50,
            description: "Petit format pratique (minimum 50 impressions).",
            image: "https://facimprimeur.fr/wp-content/uploads/2023/12/impression-A5-300x300.jpg"
        },
    ];

    // Données pour le sous-menu de produits avec images spécifiques
    const menuItems = [
        {
            name: "Tous les produits",
            images: [
                "https://img.freepik.com/photos-gratuite/belle-femme-souriante-s-appuyant-tableau-blanc-vide_329181-3924.jpg",
                "https://www.printoclock.com/media/image/e8/57/fd2d1edaf5cab744059dc3117f9d.jpeg",
                "https://facimprimeur.fr/wp-content/uploads/2023/12/impression-A5-300x300.jpg",
                Image,
                Photo
            ]
        },
        {
            name: "Livre",
            images: [
                "https://t4.ftcdn.net/jpg/00/39/74/11/360_F_39741195_6SiI6AoiHkuGun3PRzqUCg2HMqbILBAI.jpg",
                "https://cdn.futura-sciences.com/buildsv6/images/largeoriginal/a/6/9/a69e3de1a4_24338_9115-livre-ouvert-horia-varlan-flickr-20.jpg",
                "https://lefacteurlivre.com/wp-content/uploads/2023/03/image-produit-livre-jeunesse-300x300.jpg",
                "https://www.creermonlivre.com/media/catalog/product/cache/c03138b8e681f9eede2de15627a32793/l/i/livre-de-poemes4_1.png"
            ]
        },
        {
            name: "Carterie",
            images: [
                "https://www.tabac-presse-des-arcades.com/wp-content/uploads/2020/12/113901484.jpg",
                "https://m.media-amazon.com/images/I/41An6iX1zpL._UF1000,1000_QL80_.jpg",
                "https://www.chouflowers.fr/img/ybc_blog/post/100.jpg",
                "https://www.atelierduloisircreatif.fr/wp-content/uploads/2022/07/l-atelier-carterie.jpg"
            ]
        },
        {
            name: "Papeterie",
            images: [
                "https://impression-nancy.com/wp-content/uploads/2022/08/pochette.png",
                "https://papeterieplumeetpapier.ca/cdn/shop/files/3_agendas_par_Papeterie_Plume_et_Papier.jpg?v=1727300235&width=1500",
                "https://image.made-in-china.com/202f0j00woAcQtLmynbq/A3-A4-Color-Copy-Paper-Printing-Paper-Offset-Paper-Writing-Paper-in-Office-Supply-School-Supply-Office-Stationery-School-Stationery-Paper-Stationery.webp",
                "https://papieretlatte.com/cdn/shop/collections/20230717_113802-01.webp?v=1689691267&width=2400"
            ]
        },
        {
            name: "Signalétique",
            images: [
                "https://example.com/signaletique1.jpg",
                "https://example.com/signaletique2.jpg",
                "https://example.com/signaletique3.jpg",
                "https://example.com/signaletique4.jpg"
            ]
        },
        {
            name: "Sticker",
            images: [
                "https://example.com/sticker1.jpg",
                "https://example.com/sticker2.jpg",
                "https://example.com/sticker3.jpg",
                "https://example.com/sticker4.jpg"
            ]
        },
        {
            name: "Kakémono",
            images: [
                "https://example.com/kakemono1.jpg",
                "https://example.com/kakemono2.jpg",
                "https://example.com/kakemono3.jpg",
                "https://example.com/kakemono4.jpg"
            ]
        }
    ];

    // Fonction pour obtenir les images du produit survolé
    const getProductImages = (productName: string) => {
        const product = menuItems.find(item => item.name === productName);
        return product ? product.images : [];
    };

    const handleProductHover = (productName: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setHoveredProduct(productName);
        setIsPopupHovered(false);
    };

    const handleProductLeave = () => {
        timeoutRef.current = window.setTimeout(() => {
            if (!isPopupHovered) {
                setHoveredProduct(null);
            }
        }, 200);
    };

    const handlePopupEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsPopupHovered(true);
    };

    const handlePopupLeave = () => {
        setIsPopupHovered(false);
        setHoveredProduct(null);
    };

    const handleSeeMoreClick = () => {
        console.log("Voir plus d'images pour:", hoveredProduct);
        alert(`Redirection vers la page des ${hoveredProduct}`);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="w-full bg-base-100">
            {/* Conteneur fixe pour le premier navbar */}
            <div className="fixed top-0 left-0 w-full z-50">
                {/* Bandeau publicitaire */}
                <div className="bg-blue-500 text-white text-center py-1 animate-pulse text-sm md:text-base">
                    🎯 La bonne impression — Rapide, fiable et facile à utiliser !
                </div>

                {/* Premier navbar */}
                <div className="navbar mx-auto px-4 py-2 flex justify-between items-center bg-white shadow-md">
                    {/* Logo */}
                    <div className="flex items-center">
                        <nav className="flex items-center space-x-2">
                            <Printer size={28} className="text-blue-500" />
                            <span className="text-xl font-bold text-blue-600">Print.mg</span>
                        </nav>
                    </div>

                    {/* Trois menues du papier */}
                    <div className="container mx-auto hidden lg:block px-4 lg:flex items-center justify-center gap-6">
                        {papiers.map((papier) => (
                            <div
                                key={papier.name}
                                className="relative"
                                onMouseEnter={() => setHovered(papier.name)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                {/* Menu item */}
                                <span className="text-gray-700 font-semibold cursor-pointer hover:text-blue-500 text-lg">
                                    {papier.name}
                                </span>

                                {/* Info tooltip au survol */}
                                {hovered === papier.name && (
                                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-80 bg-white border rounded-lg shadow-lg p-5 text-md text-gray-600 z-50">
                                        <div className="flex items-center gap-6">
                                            {/* Texte */}
                                            <div className="w-2/3 leading-relaxed">
                                                <p className="font-bold text-gray-800 text-md">{papier.price}</p>
                                                <p className="text-md">Minimum : {papier.min} impressions</p>
                                                <p className="text-sm">{papier.description}</p>
                                            </div>

                                            {/* Image */}
                                            <div className="w-1/2 flex justify-center">
                                                <img
                                                    src={papier.image}
                                                    alt="Papier"
                                                    className="w-40 h-40 object-cover rounded-md shadow-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Barre de recherche + Actions */}
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block md:w-100 lg:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10" size={20} />
                            <input
                                type="text"
                                placeholder="Rechercher un produit..."
                                className="input input-bordered w-full bg-white text-black pl-10"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Dropdown Changer de langue  */}
                        <div className="dropdown dropdown-end hidden md:block">
                            <label tabIndex={0} className="btn btn-ghost btn-sm gap-1">
                                <Globe size={18} />
                                {language.toUpperCase()}
                            </label>
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32"
                            >
                                <li>
                                    <a href="#" onClick={() => changeLanguage('fr')}>
                                        Français
                                    </a>
                                </li>
                                <li>
                                    <a href="#" onClick={() => changeLanguage('en')}>
                                        English
                                    </a>
                                </li>
                                <li>
                                    <a href="#" onClick={() => changeLanguage('mg')}>
                                        Malagasy
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Dropdown Se connecter */}
                        <div className="dropdown dropdown-end hidden md:block">
                            <button
                                tabIndex={0}
                                className="btn bg-blue-500 text-white py-3 px-6 text-sm rounded-lg hover:bg-blue-600 transition-colors duration-200"
                            >
                                Se connecter
                            </button>
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-44"
                            >
                                <li>
                                    <a href="#">
                                        <UserPlus />
                                        Créer un compte
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <UserCheck />
                                        Connexion
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <ShoppingBasket />
                                        Commander
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center gap-2 px-3 py-2 rounded bg-gray-300 hover:bg-blue-400 transition"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            viewBox="0 0 533.5 544.3"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M533.5 278.4c0-17.7-1.6-34.7-4.6-51.2H272.1v96.9h147.1c-6.3 34-25.6 62.8-54.6 82v68h88.1c51.7-47.7 81.8-118 81.8-195.7z"
                                                fill="#4285F4"
                                            />
                                            <path
                                                d="M272.1 544.3c73.8 0 135.6-24.4 180.8-66.3l-88.1-68c-24.5 16.4-55.9 26-92.7 26-71.3 0-131.7-48.1-153.2-112.9H29.1v70.8C74.3 485 167 544.3 272.1 544.3z"
                                                fill="#34A853"
                                            />
                                            <path
                                                d="M118.9 323.9c-8-23.9-12.6-49.6-12.6-76 0-26.4 4.6-52.1 12.6-76v-70.8H29.1C10.4 144.7 0 207.3 0 272.1c0 64.8 10.4 127.4 29.1 187.9l89.8-70.8z"
                                                fill="#FBBC05"
                                            />
                                            <path
                                                d="M272.1 107.6c39.8 0 75.4 13.7 103.6 40.5l77.7-77.7C407.7 22.8 345.9 0 272.1 0 167 0 74.3 59.3 29.1 146.1l89.8 70.8c21.5-64.8 81.9-112.9 153.2-112.9z"
                                                fill="#EA4335"
                                            />
                                        </svg>
                                        Google
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Icône panier */}
                        <div className="flex items-center gap-1">
                            <ShoppingCart size={22} className="text-blue-500" />
                            <span className="font-bold">{cartCount}</span>
                        </div>

                        {/* Menu mobile */}
                        <div className="dropdown md:hidden">
                            <label tabIndex={0} className="btn btn-ghost btn-circle">
                                <Menu size={24} />
                            </label>
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu p-4 shadow bg-base-100 rounded-box w-52 right-0"
                            >
                                <li>
                                    <div className="relative w-full">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Rechercher..."
                                            className="input input-bordered w-full bg-white text-black pl-10"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                </li>
                                <li><a>Se connecter</a></li>
                                <li><a>Changer de langue</a></li>
                                <li><a>Tous les produits</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Espace pour compenser le navbar fixe */}
            <div className="h-24"></div>

            {/* Deuxième navbar - Sous-menu horizontal (NON FIXE) */}
            <div className="bg-blue-50 border-t mt-0/5 p-1 border-b border-blue-200 shadow-sm hidden lg:block">
                <div className="container mx-auto px-4 py-2">
                    <div className="flex items-center justify-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                            {menuItems.map((item) => (
                                <div
                                    key={item.name}
                                    className="relative"
                                    onMouseEnter={() => handleProductHover(item.name)}
                                    onMouseLeave={handleProductLeave}
                                >
                                    <div className="px-3 py-1 text-sm bg-white rounded-full border border-blue-200 shadow-sm cursor-pointer transition-all duration-200 hover:bg-blue-500 hover:text-white">
                                        {item.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay des images au centre en bas de l'écran */}
            {hoveredProduct && (
                <div
                    className="fixed left-1/2 transform -translate-x-1/2 z-50 bg-white p-4 rounded-lg shadow-xl border border-gray-200 max-w-4xl w-full mx-4"
                    onMouseEnter={handlePopupEnter}
                    onMouseLeave={handlePopupLeave}
                >
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-bold text-gray-800">
                            Produits : <span className="text-blue-500">{hoveredProduct}</span>
                        </h3>
                        <button
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => setHoveredProduct(null)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {getProductImages(hoveredProduct).slice(0, 4).map((image, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={image}
                                    alt={`${hoveredProduct} ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-md shadow-sm transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-md"></div>
                            </div>
                        ))}
                        <div
                            className="flex items-center justify-center bg-gray-100 rounded-md shadow-sm p-2 group hover:bg-blue-50 transition-colors cursor-pointer"
                            onClick={handleSeeMoreClick}
                        >
                            <div className="flex flex-col items-center justify-center w-full h-full text-blue-500 group-hover:text-blue-700">
                                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mb-1">+</span>
                                <span className="text-xs">Voir plus</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
import { useEffect, useState, useRef } from "react";
import { ShoppingCart, Menu, Globe, UserPlus, UserCheck, ShoppingBasket, Search, Printer, Grid } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { label } from "framer-motion/client";
import API_BASE_URL from "../services/api";

interface Produit {
    id: number;
    name: string;
    description: string;
    categorie: string;
    prix: string;
    image: string;
    featured: boolean;
}

export default function Navbar() {
    const [cartCount, setCartCount] = useState(0);
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState<Produit[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Fetch des suggestions produits avec debounce
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (search.trim().length > 1) {
                try {
                    const res = await fetch(
                        `${API_BASE_URL}/api/search-produits/?search=${encodeURIComponent(search)}`
                    );
                    const data: Produit[] = await res.json();
                    setSuggestions(data.slice(0, 5)); // max 5 suggestions
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Erreur de recherche :", error);
                }
            } else {
                setShowSuggestions(false);
            }
        };

        const timeout = setTimeout(fetchSuggestions, 300); // debounce 300ms
        return () => clearTimeout(timeout);
    }, [search]);

    // Fermer le dropdown si on clique ailleurs
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Quand on sélectionne une suggestion
    const handleSelect = (produit: Produit) => {
        // Passer le mot clé qui correspond à la recherche
        const keyword = search.trim();
        setSearch(keyword);
        setShowSuggestions(false);
        navigate(`/detaille?search=${encodeURIComponent(keyword)}`);
    };

    // Quand on soumet le formulaire de recherche
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim() !== "") {
            navigate(`/detaille?search=${encodeURIComponent(search)}`);
            setShowSuggestions(false);
        }
    };


    // Nombre de commande
    useEffect(() => {
        fetch(`${API_BASE_URL}/api/admin/commandes/count/`)
            .then(res => res.json())
            .then(data => setCartCount(data.count))
            .catch(err => console.error(err));
    }, []);

    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language);

    const changeLanguage = (lang: string) => {
        setLanguage(lang);
        i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang); // ✅ garde la langue même après rechargement
    };

    useEffect(() => {
        const savedLang = localStorage.getItem("lang");
        if (savedLang) {
            setLanguage(savedLang);
            i18n.changeLanguage(savedLang);
        }
    }, []);

    const [hovered, setHovered] = useState<string | null>(null);
    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
    const [isPopupHovered, setIsPopupHovered] = useState(false);
    // const navbarRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<number | null>(null);

    // Données pour le sous-menu de produits avec images spécifiques
    const menuItems = [
        {
            name: t("navbar.tousProduits"),
            images: [
                "https://www.billposters.fr/wp-content/uploads/2020/08/presentation-affiches-accueil-1.jpg",
                "https://images.ctfassets.net/btbidkudc1so/2fumZH0dYhveH08ft4qoFi/8321b971584d08b9f7e7facb1c10a4d2/flyer-A5-135g-couche-brillant.jpg",
                "https://facimprimeur.fr/wp-content/uploads/2023/12/impression-A5-300x300.jpg",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxi_viaqLyeZQU2wwVxMKkyULAr2A41vTiZw&s"
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
            name: "Posters",
            images: [
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRILK7nj8YMmwDpFchSOAzaWYPO3FUdMYZ6EA&s",
                "https://koawoodranch.com/cdn/shop/articles/Travel_Posters.jpg?v=1598575310",
                "https://img.elegantflyer.com/templates/preview/back-to-school-poster-170858.jpg",
                "https://www.planprinting24.co.uk/hs-fs/hubfs/Screenshot%202023-02-21%20at%2012.17.55.png?length=720&name=Screenshot%202023-02-21%20at%2012.17.55.png"
            ]
        },
        {
            name: "Stickers",
            images: [
                "https://d3ccuprjuqkp1j.cloudfront.net/ProductLandingPages/FeaturedImages/Sticker-Pages-03_720.jpg",
                "https://www.happydownloads.net/wp-content/uploads/2024/06/Cozy-cafe-main-768x614.png",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiv81GSuLj5Yvf6iXATSEF9NFxE7OKCFtVnQ&s",
                "https://web2printdata.blob.core.windows.net/w2p-cms-17/25-12-12-DCL-Laptop-Stickers-Mockup-3.png"
            ]
        },
        {
            name: "Kakémono",
            images: [
                "https://img.freepik.com/vecteurs-libre/presentoir-affaires-enroulable-fins-presentation_1017-31432.jpg?semt=ais_hybrid&w=740&q=80",
                "https://destcom.fr/wp-content/uploads/2020/11/Support-kakemono-roll-up.jpg",
                "https://shop.latelierduprint.fr/63-home_default/roll-up-kakemonos.jpg",
                "https://www.realisaprint.com/blog/wp-content/uploads/2018/02/impression-kakemono.jpg"
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


    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);


    // Papiers avec clé identique au JSON
    const papiers = [
        {
            key: "grand",
            image: "https://img.freepik.com/photos-gratuite/belle-femme-souriante-s-appuyant-tableau-blanc-vide_329181-3924.jpg"
        },
        {
            key: "petit",
            image: "https://www.printoclock.com/media/image/e8/57/fd2d1edaf5cab744059dc3117f9d.jpeg"
        },
        {
            key: "perso",
            image: "https://facimprimeur.fr/wp-content/uploads/2023/12/impression-A5-300x300.jpg"
        }
    ];

    return (
        <div className="w-full bg-base-100">
            {/* Conteneur fixe pour le premier navbar */}
            <div className="fixed top-0 left-0 w-full z-50">
                {/* Bandeau publicitaire */}
                <div className="bg-gradient-to-r from-violet-500 to-pink-600 text-white text-center py-1 animate-pulse text-sm md:text-base">
                    {t("navbar.slogan")}
                </div>

                {/* Premier navbar */}
                <div className="navbar mx-auto px-4 py-2 flex justify-between items-center bg-white shadow-md">
                    {/* Logo */}
                    <div className="flex items-center">
                        <nav className="flex items-center space-x-2">
                            <Printer size={28} className="text-violet-500" />
                            <span className="text-xl font-bold text-violet-600">Print.mg</span>
                        </nav>
                    </div>

                    {/* Trois menus papier */}
                    <div className="container mx-auto hidden lg:block px-4 lg:flex items-center justify-center gap-6">
                        {papiers.map((papier) => (
                            <div
                                key={papier.key}
                                className="relative"
                                onMouseEnter={() => setHovered(papier.key)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                <span className="text-gray-700 font-semibold cursor-pointer hover:text-violet-500 text-lg">
                                    {t(`navbar.papier.${papier.key}.titre`)}
                                </span>

                                {hovered === papier.key && (
                                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-80 bg-white border rounded-lg shadow-lg p-5 text-md text-gray-600 z-50">
                                        <div className="flex items-center gap-6">
                                            <div className="w-2/3 leading-relaxed">
                                                <p className="font-bold text-gray-800 text-md">
                                                    {t(`navbar.papier.${papier.key}.prix`)}
                                                </p>
                                                <p className="text-md">
                                                    {t(`navbar.papier.${papier.key}.min`)}
                                                </p>
                                                <p className="text-sm">
                                                    {t(`navbar.papier.${papier.key}.description`)}
                                                </p>
                                            </div>
                                            <div className="w-1/2 flex justify-center">
                                                <img
                                                    src={papier.image}
                                                    alt={t(`navbar.papier.${papier.key}.titre`)}
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
                        {/* Barre de recherche */}
                        <div className="relative hidden md:block md:w-100 lg:w-80" ref={dropdownRef}>
                            <form onSubmit={handleSearchSubmit}>
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10" size={20} />
                                <input
                                    type="text"
                                    placeholder={t(`navbar.searchPlaceholder`)}
                                    className="input input-bordered w-full bg-white text-black pl-10"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onFocus={() => search && setShowSuggestions(true)}
                                />
                            </form>

                            {/* Suggestions Dropdown */}
                            {showSuggestions && (
                                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto animate-fadeIn">

                                    {suggestions.length > 0 ? (
                                        suggestions.map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={() => handleSelect(item)}
                                                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                                            >
                                                <img
                                                    src={
                                                        item.image.startsWith("http")
                                                            ? item.image
                                                            : `http://localhost:8000${item.image}`
                                                    }
                                                    alt={item.name}
                                                    className="w-10 h-10 rounded object-cover"
                                                />
                                                <div>
                                                    {/* Affiche le nom et la catégorie */}
                                                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                                    <p className="text-xs text-gray-500">{item.categorie} • {item.prix} Ar</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        // Message si aucune suggestion
                                        <div className="p-2 text-gray-500 text-sm">
                                            Aucun produit ne correspond à votre recherche
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Dropdown Changer de langue  */}
                        <div className="dropdown dropdown-end hidden md:block">

                            <label
                                tabIndex={0}
                                className="btn btn-ghost btn-sm flex items-center gap-2 border rounded-lg px-3 py-1 hover:bg-base-200 transition"
                            >
                                {/* 🇫🇷 Drapeau animé à gauche */}
                                <motion.span
                                    className="text-xl"
                                    whileHover={{ scale: 1.3, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    {language === "fr" && "🇫🇷"}
                                    {language === "en" && "🇬🇧"}
                                    {language === "mlg" && "🇲🇬"}
                                </motion.span>

                                {/* Texte + globe animé à droite */}
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-700">
                                        {language.toUpperCase()}
                                    </span>

                                    <motion.div
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 1, ease: "easeInOut" }}
                                    >
                                        <Globe size={16} className="text-violet-500" />
                                    </motion.div>
                                </div>
                            </label>

                            <ul
                                tabIndex={0}
                                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-36"
                            >
                                <li>
                                    <button
                                        onClick={() => changeLanguage("fr")}
                                        className="flex items-center gap-2"
                                    >
                                        <span>🇫🇷</span> Français
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => changeLanguage("en")}
                                        className="flex items-center gap-2"
                                    >
                                        <span>🇬🇧</span> English
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => changeLanguage("mlg")}
                                        className="flex items-center gap-2"
                                    >
                                        <span>🇲🇬</span> Malagasy
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Dropdown Se connecter */}
                        <div className="dropdown dropdown-end hidden md:block">
                            <button
                                tabIndex={0}
                                className="btn bg-gradient-to-r from-violet-500 to-pink-600 text-white py-3 px-6 text-sm rounded-lg shadow-lg shadow-violet-500/50 hover:shadow-xl hover:shadow-violet-500/70 transition-all duration-200 hover:scale-105"
                            >
                                {t("navbar.connexion")}
                            </button>
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-44"
                            >
                                <li>
                                    <Link to="/register">
                                        <UserPlus />
                                        {t("navbar.creerCompte")}
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/login">
                                        <UserCheck />
                                        {t("navbar.connexion")}
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/login">
                                        <ShoppingBasket />
                                        {t("navbar.commander")}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Icône panier */}
                        <div className="flex items-center gap-1">
                            <ShoppingCart size={30} className="text-violet-500" />
                            <span className="font-bold border-2 bg-violet-200 text-lg border-violet-500 px-2 py-0 rounded-full">{cartCount}</span>
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
                                            placeholder={t("navbar.searchPlaceholder")}
                                            className="input input-bordered w-full bg-white text-black pl-10"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                </li>
                                <li>
                                    <Link to="/login">
                                        <UserCheck />
                                        {t("navbar.connexion")}
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#">
                                        <Globe />
                                        {t("navbar.changerLangue")}
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/detaille">
                                        <Grid />
                                        {t("navbar.tousProduits")}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Espace pour compenser le navbar fixe */}
            <div className="h-24"></div>

            {/* Deuxième navbar - Sous-menu horizontal (NON FIXE) */}
            <div className="bg-violet-50 border-t mt-0/5 p-1 border-b border-violet-200 shadow-sm hidden lg:block">
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
                                    <div className="px-3 py-1 text-sm bg-white rounded-full border border-violet-200 shadow-sm cursor-pointer transition-all duration-200 hover:bg-violet-500 hover:text-white hover:shadow-md hover:shadow-violet-300">
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
                            {t("navbar.produits")} : <span className="text-violet-500">{hoveredProduct}</span>
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

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {getProductImages(hoveredProduct).slice(0, 4).map((image, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={image}
                                    alt={`${hoveredProduct} ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-md shadow-sm transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
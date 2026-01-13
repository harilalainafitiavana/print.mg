import { useEffect, useState, type ChangeEvent, type FormEvent, type SetStateAction } from "react";
import {
    X, Check, PlusCircle, ImageIcon, Trash, Edit,
    Search, Filter, ChevronDown, Star, Euro, Package,
    TrendingUp, Grid, List, Upload
} from "lucide-react";
import { authFetch } from "../../Components/Utils"
import { useTranslation } from "react-i18next";
import API_BASE_URL from "../../services/api";

const isFeatured = (future: string | null | undefined): boolean => {
    if (!future) return false;
    return future.trim().toLowerCase() === "oui";
};

interface Product {
    future: string;
    id: number;
    name: string;
    description: string;
    categorie: string;
    prix: string;
    image: string;
    format_defaut: "A3" | "A4" | "A5" | "A6" | "";
    is_grand_format: boolean;
    searchQuery?: string;
}


export default function ProductList() {
    const { t } = useTranslation();
    const [products, setProducts] = useState<Product[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newProduct, setNewProduct] = useState<Partial<Product> & { imageFile?: File }>({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");


    // Fetch des produits
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/produits/`);
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Erreur lors du fetch des produits :", error);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        // Reset à la page 1 quand on change la recherche
        setCurrentPage(1);
    }, [searchTerm, selectedCategory]);

    // Et dans les gestionnaires d'événements :
    const handleSearchChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset page
    };

    const handleCategoryChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setSelectedCategory(e.target.value);
        setCurrentPage(1); // Reset page
    };

    // Filtrage des produits
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || product.categorie === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Catégories uniques pour le filtre
    const categories = ["all", ...Array.from(new Set(products.map(p => p.categorie).filter(Boolean)))];

    // Pagination
    // Définit la page actuelle (commence à 1)
    const [currentPage, setCurrentPage] = useState(1);
    // Nombre de produits à afficher par page
    const productsPerPage = viewMode === "grid" ? 8 : 6;
    // Calcul des indices pour le slicing
    const indexOfLastProduct = currentPage * productsPerPage;  // ex: page 2 * 8 = 16
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage; // ex: 16 - 8 = 8
    // Produits à afficher sur la page actuelle
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    // Calcul du nombre total de pages
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);




    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Gestion des inputs
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setNewProduct((prev) => ({
            ...prev,
            imageFile: file,
            image: URL.createObjectURL(file)
        }));
    };

    // Ajouter un produit
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!newProduct.name || !newProduct.prix) {
            alert("Veuillez remplir au moins le nom et le prix du produit.");
            return;
        }

        const formData = new FormData();
        formData.append("name", newProduct.name);
        formData.append("format_defaut", newProduct.format_defaut || "A4");
        formData.append("is_grand_format", newProduct.is_grand_format ? "true" : "false");
        formData.append("description", newProduct.description || "");
        formData.append("categorie", newProduct.categorie || "");
        formData.append("prix", newProduct.prix);
        formData.append("future", newProduct.future || "");

        if (newProduct.imageFile) formData.append("image", newProduct.imageFile);

        try {
            const res = await authFetch(`${API_BASE_URL}/api/produits/`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                if (res.status === 401) throw new Error("Token expiré ou manquant, veuillez vous reconnecter.");
                throw new Error("Erreur lors de l'ajout du produit.");
            }

            const data = await res.json();
            setProducts([...products, data]);
            setNewProduct({});
            setShowAddModal(false);
            alert("Produit ajouté avec succès !");
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Erreur serveur.");
        }
    };

    // Modifier un produit
    const handleUpdate = async () => {
        if (!selectedProduct) return;

        const formData = new FormData();
        formData.append("name", selectedProduct.name);
        formData.append("format_defaut", selectedProduct.format_defaut || "A4");
        formData.append("is_grand_format", selectedProduct.is_grand_format ? "true" : "false");
        formData.append("description", selectedProduct.description || "");
        formData.append("categorie", selectedProduct.categorie || "");
        formData.append("prix", selectedProduct.prix);
        formData.append("future", selectedProduct.future || "");

        if (selectedProduct.image.startsWith("blob:")) {
            const response = await fetch(selectedProduct.image);
            const blob = await response.blob();
            const file = new File([blob], "image.jpg", { type: blob.type });
            formData.append("image", file);
        }

        try {
            const res = await authFetch(`${API_BASE_URL}/api/produits/${selectedProduct.id}/`, {
                method: "PUT",
                body: formData,
            });

            if (!res.ok) {
                if (res.status === 401) throw new Error("Token expiré ou manquant, veuillez vous reconnecter.");
                throw new Error("Erreur lors de la modification du produit.");
            }

            const updated = await res.json();
            setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
            setShowEditModal(false);
            setSelectedProduct(null);
            alert("Produit modifié avec succès !");
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Erreur serveur.");
        }
    };

    // Supprimer un produit
    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;

        try {
            const res = await authFetch(`${API_BASE_URL}/api/produits/${productToDelete.id}/`, {
                method: "DELETE",
            });

            if (!res.ok) {
                if (res.status === 401) throw new Error("Token expiré ou manquant, veuillez vous reconnecter.");
                throw new Error("Erreur lors de la suppression du produit.");
            }

            setProducts(products.filter((p) => p.id !== productToDelete.id));
            setProductToDelete(null);
            setShowDeleteModal(false);
            alert("Produit supprimé avec succès !");
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Erreur serveur.");
        }
    };

    return (
        <div className="p-6 bg-base-200 min-h-screen">
            {/* Header avec statistiques */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-base-content mb-2">📦 {t("products.title")}</h1>
                        <p className="text-base-content/70">Gérez vos produits et offres d'impression</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-400 to-pink-500 text-white hover:from-violet-500 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        <PlusCircle size={20} />
                        <span className="font-semibold">{t("products.add")}</span>
                    </button>
                </div>

                {/* Cartes de statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-base-100 p-5 rounded-2xl shadow-sm border border-base-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-base-content/70">Total Produits</p>
                                <p className="text-2xl font-bold text-base-content">{products.length}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Package className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-base-100 p-5 rounded-2xl shadow-sm border border-base-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-base-content/70">Produits en vedette</p>
                                <p className="text-2xl font-bold text-base-content">
                                    {products.filter(p => isFeatured(p.future)).length}
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-xl">
                                <Star className="text-yellow-600" size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-base-100 p-5 rounded-2xl shadow-sm border border-base-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-base-content/70">Grands formats</p>
                                <p className="text-2xl font-bold text-base-content">
                                    {products.filter(p => p.is_grand_format).length}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <TrendingUp className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-base-100 p-5 rounded-2xl shadow-sm border border-base-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-base-content/70">Moyenne prix</p>
                                <p className="text-2xl font-bold text-base-content">
                                    {products.length > 0
                                        ? Math.round(products.reduce((acc, p) => acc + parseFloat(p.prix), 0) / products.length)
                                        : 0} Ar
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-xl">
                                <Euro className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Barre de recherche et filtres */}
                <div className="bg-base-100 p-5 rounded-2xl shadow-sm border border-base-300 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 w-full md:w-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50" size={20} />
                                <input
                                    type="text"
                                    placeholder="Rechercher un produit..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-full pl-12 pr-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base-content"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" size={20} />
                                <select
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                    className="pl-10 pr-8 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-base-content"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat === "all" ? "Toutes catégories" : cat}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50" size={20} />
                            </div>

                            <div className="flex bg-base-200 p-1 rounded-xl">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-white shadow text-blue-600" : "text-base-content/70"}`}
                                >
                                    <Grid size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-lg ${viewMode === "list" ? "bg-white shadow text-blue-600" : "text-base-content/70"}`}
                                >
                                    <List size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Liste des produits */}
            {currentProducts.length === 0 ? (
                <div className="text-center py-12 bg-base-100 rounded-2xl border border-base-300">
                    {/* Message quand aucun produit filtré */}
                    <Package size={48} className="mx-auto text-base-content/30 mb-4" />
                    <h3 className="text-xl font-semibold text-base-content mb-2">
                        {searchTerm || selectedCategory !== "all"
                            ? "Aucun produit correspondant aux filtres"
                            : "Aucun produit trouvé"}
                    </h3>
                    <p className="text-base-content/70 mb-6">
                        {searchTerm || selectedCategory !== "all"
                            ? "Essayez de modifier vos critères de recherche"
                            : "Commencez par ajouter votre premier produit"}
                    </p>
                    {(searchTerm || selectedCategory !== "all") ? (
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCategory("all");
                            }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                        >
                            Réinitialiser les filtres
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                        >
                            <PlusCircle size={20} />
                            Ajouter un produit
                        </button>
                    )}
                </div>
            ) : viewMode === "grid" ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                        {currentProducts.map((product) => (
                            <div key={product.id} className="group bg-base-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-base-300 transition-all duration-300">
                                <div className="relative">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                                    />
                                    {isFeatured(product.future) && (
                                        <div className="absolute top-3 left-3">
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
                                                <Star size={12} />
                                                Vedette
                                            </span>
                                        </div>
                                    )}
                                    {product.is_grand_format && (
                                        <div className="absolute top-3 right-3">
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
                                                <TrendingUp size={12} />
                                                Grand format
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                        <h3 className="text-lg font-bold text-white">{product.name}</h3>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.is_grand_format ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {product.is_grand_format ? "Grand format" : product.format_defaut}
                                        </span>
                                        <span className="text-xl font-bold text-base-content">
                                            {parseInt(product.prix).toLocaleString()} Ar
                                        </span>
                                    </div>

                                    <p className="text-sm text-base-content/70 mb-4 line-clamp-2">
                                        {product.description}
                                    </p>

                                    <div className="flex items-center justify-between text-sm text-base-content/60 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Package size={14} />
                                            <span>{product.categorie || "Non catégorisé"}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedProduct(product);
                                                setShowEditModal(true);
                                            }}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200"
                                        >
                                            <Edit size={16} />
                                            <span className="font-medium">Modifier</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(product)}
                                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {filteredProducts.length > 0 && totalPages > 1 && (
                        <div className="flex items-center justify-between bg-base-100 p-4 rounded-2xl border border-base-300 mt-8">
                            {/* Info utilisant filteredProducts */}
                            <div className="text-sm text-base-content/70">
                                Affichage de {indexOfFirstProduct + 1} à {Math.min(indexOfLastProduct, filteredProducts.length)} sur {filteredProducts.length} produits
                            </div>

                            {/* Boutons de pagination */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-xl border border-base-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-base-200 transition-colors"
                                >
                                    Précédent
                                </button>

                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
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
                                            className={`px-4 py-2 rounded-xl ${currentPage === pageNum
                                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                                : 'border border-base-300 hover:bg-base-200'
                                                } transition-colors`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-xl border border-base-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-base-200 transition-colors"
                                >
                                    Suivant
                                </button>
                            </div>

                            {/* Info page actuelle */}
                            <div className="text-sm text-base-content/70">
                                Page {currentPage} sur {totalPages}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                /* Vue liste */
                <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-base-200 border-b border-base-300">
                            <tr>
                                <th className="text-left p-4 text-base-content font-semibold">Produit</th>
                                <th className="text-left p-4 text-base-content font-semibold">Catégorie</th>
                                <th className="text-left p-4 text-base-content font-semibold">Format</th>
                                <th className="text-left p-4 text-base-content font-semibold">Prix</th>
                                <th className="text-left p-4 text-base-content font-semibold">Statut</th>
                                <th className="text-left p-4 text-base-content font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.map((product) => (
                                <tr key={product.id} className="border-b border-base-300 hover:bg-base-200/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-12 h-12 object-cover rounded-lg"
                                                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                                            />
                                            <div>
                                                <div className="font-medium text-base-content">{product.name}</div>
                                                <div className="text-sm text-base-content/70 line-clamp-1">{product.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-3 py-1 bg-base-300 rounded-full text-sm">
                                            {product.categorie || "Non catégorisé"}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-sm ${product.is_grand_format ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {product.is_grand_format ? "Grand format" : product.format_defaut}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-base-content">
                                        {parseInt(product.prix).toLocaleString()} Ar
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1">
                                            {isFeatured(product.future) && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full w-fit">
                                                    <Star size={10} />
                                                    Vedette
                                                </span>
                                            )}
                                            {product.is_grand_format && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full w-fit">
                                                    Grand format
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setShowEditModal(true);
                                                }}
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                title="Modifier"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(product)}
                                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                title="Supprimer"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL AJOUT - NOUVEAU DESIGN */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-base-100 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-base-100 border-b border-base-300 p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-base-content">➕ Ajouter un nouveau produit</h3>
                                <p className="text-base-content/70 text-sm mt-1">Remplissez les informations du produit</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-base-200 rounded-xl transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Image upload avec preview */}
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-base-300 rounded-2xl p-8 bg-base-200/50">
                                {newProduct.image ? (
                                    <div className="text-center">
                                        <img
                                            src={newProduct.image}
                                            alt="Preview"
                                            className="w-48 h-48 object-cover rounded-xl mx-auto mb-4 shadow-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setNewProduct(prev => ({ ...prev, image: undefined, imageFile: undefined }))}
                                            className="text-sm text-red-600 hover:text-red-700"
                                        >
                                            Changer l'image
                                        </button>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer text-center">
                                        <div className="p-4 bg-white rounded-full inline-block mb-4">
                                            <ImageIcon size={32} className="text-blue-500" />
                                        </div>
                                        <div className="text-base-content font-medium mb-2">Cliquez pour télécharger une image</div>
                                        <div className="text-base-content/60 text-sm">PNG, JPG, WEBP jusqu'à 5MB</div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-2">Nom du produit *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Ex: Impression A4 couleur"
                                        value={newProduct.name || ""}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base-content"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-2">Prix *</label>
                                    <input
                                        type="text"
                                        name="prix"
                                        placeholder="Ex: 5000"
                                        value={newProduct.prix || ""}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base-content"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-2">Catégorie</label>
                                    <input
                                        type="text"
                                        name="categorie"
                                        placeholder="Ex: Impression, Copie, etc."
                                        value={newProduct.categorie || ""}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base-content"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-2">Format par défaut</label>
                                    <select
                                        value={newProduct.format_defaut || ""}
                                        onChange={(e) =>
                                            setNewProduct(prev => ({
                                                ...prev,
                                                format_defaut: e.target.value as "A3" | "A4" | "A5" | "A6"
                                            }))
                                        }
                                        className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base-content"
                                        disabled={newProduct.is_grand_format}
                                    >
                                        <option value="">Sélectionnez un format</option>
                                        <option value="A3">A3</option>
                                        <option value="A4">A4</option>
                                        <option value="A5">A5</option>
                                        <option value="A6">A6</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-base-content mb-2">Description</label>
                                <textarea
                                    name="description"
                                    placeholder="Décrivez votre produit..."
                                    value={newProduct.description || ""}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base-content"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center gap-3 p-4 bg-base-200 rounded-xl cursor-pointer hover:bg-base-300 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={newProduct.is_grand_format || false}
                                        onChange={(e) => {
                                            const isGrandFormat = e.target.checked;
                                            setNewProduct(prev => {
                                                const updated = { ...prev, is_grand_format: isGrandFormat };
                                                if (isGrandFormat) {
                                                    updated.format_defaut = "" as any;
                                                }
                                                return updated;
                                            });
                                        }}
                                        className="w-5 h-5 rounded"
                                    />
                                    <div>
                                        <div className="font-medium text-base-content">Grand format</div>
                                        <div className="text-sm text-base-content/70">Les dimensions seront personnalisées par le client</div>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-4 bg-base-200 rounded-xl cursor-pointer hover:bg-base-300 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={isFeatured(newProduct.future || "")}
                                        onChange={(e) => setNewProduct((prev) => ({
                                            ...prev,
                                            future: e.target.checked ? "Oui" : ""
                                        }))}
                                        className="w-5 h-5 rounded"
                                    />
                                    <div>
                                        <div className="font-medium text-base-content">Produit vedette</div>
                                        <div className="text-sm text-base-content/70">Mettez en avant ce produit sur la page d'accueil</div>
                                    </div>
                                </label>
                            </div>

                            <div className="flex gap-4 pt-6 border-t border-base-300">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-6 py-3 border-2 border-base-300 text-base-content rounded-xl hover:bg-base-200 transition-colors font-medium"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <PlusCircle size={20} />
                                        Ajouter le produit
                                    </div>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL SUPPRESSION - NOUVEAU DESIGN */}
            {showDeleteModal && productToDelete && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-base-100 rounded-2xl max-w-md w-full p-8">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trash className="text-red-600" size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-base-content mb-2">Confirmer la suppression</h3>
                            <p className="text-base-content/70 mb-6">
                                Êtes-vous sûr de vouloir supprimer le produit <strong className="text-base-content">{productToDelete.name}</strong> ? Cette action est irréversible.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-6 py-3 border-2 border-base-300 text-base-content rounded-xl hover:bg-base-200 transition-colors font-medium"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium"
                                >
                                    Supprimer définitivement
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL MODIFICATION - NOUVEAU DESIGN */}
            {showEditModal && selectedProduct && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-base-100 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-base-100 border-b border-base-300 p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-base-content">✏️ Modifier le produit</h3>
                                <p className="text-base-content/70 text-sm mt-1">Modifiez les informations du produit</p>
                            </div>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="p-2 hover:bg-base-200 rounded-xl transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-base-300 rounded-2xl p-8 bg-base-200/50">
                                {selectedProduct.image ? (
                                    <div className="text-center">
                                        <img
                                            src={selectedProduct.image}
                                            alt="Preview"
                                            className="w-48 h-48 object-cover rounded-xl mx-auto mb-4 shadow-lg"
                                        />
                                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-base-300 text-base-content rounded-xl cursor-pointer hover:bg-base-400 transition-colors">
                                            <Upload size={16} />
                                            Changer l'image
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    setSelectedProduct({
                                                        ...selectedProduct,
                                                        image: URL.createObjectURL(file),
                                                    });
                                                }}
                                            />
                                        </label>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer text-center">
                                        <div className="p-4 bg-white rounded-full inline-block mb-4">
                                            <ImageIcon size={32} className="text-blue-500" />
                                        </div>
                                        <div className="text-base-content font-medium mb-2">Cliquez pour télécharger une image</div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                setSelectedProduct({
                                                    ...selectedProduct,
                                                    image: URL.createObjectURL(file),
                                                });
                                            }}
                                        />
                                    </label>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-2">Nom du produit</label>
                                    <input
                                        type="text"
                                        value={selectedProduct.name}
                                        onChange={(e) =>
                                            setSelectedProduct({ ...selectedProduct, name: e.target.value })
                                        }
                                        className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base-content"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-2">Prix</label>
                                    <input
                                        type="text"
                                        value={selectedProduct.prix}
                                        onChange={(e) =>
                                            setSelectedProduct({ ...selectedProduct, prix: e.target.value })
                                        }
                                        className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base-content"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-2">Catégorie</label>
                                    <input
                                        type="text"
                                        value={selectedProduct.categorie}
                                        onChange={(e) =>
                                            setSelectedProduct({ ...selectedProduct, categorie: e.target.value })
                                        }
                                        className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base-content"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-2">Format</label>
                                    <select
                                        value={selectedProduct.format_defaut || "A4"}
                                        onChange={(e) =>
                                            setSelectedProduct({
                                                ...selectedProduct,
                                                format_defaut: e.target.value as "A3" | "A4" | "A5" | "A6"
                                            })
                                        }
                                        className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base-content"
                                        disabled={selectedProduct.is_grand_format}
                                    >
                                        <option value="A3">A3</option>
                                        <option value="A4">A4</option>
                                        <option value="A5">A5</option>
                                        <option value="A6">A6</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-base-content mb-2">Description</label>
                                <textarea
                                    value={selectedProduct.description}
                                    onChange={(e) =>
                                        setSelectedProduct({ ...selectedProduct, description: e.target.value })
                                    }
                                    rows={3}
                                    className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base-content"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center gap-3 p-4 bg-base-200 rounded-xl cursor-pointer hover:bg-base-300 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={selectedProduct.is_grand_format || false}
                                        onChange={(e) =>
                                            setSelectedProduct({
                                                ...selectedProduct,
                                                is_grand_format: e.target.checked
                                            })
                                        }
                                        className="w-5 h-5 rounded"
                                    />
                                    <div>
                                        <div className="font-medium text-base-content">Grand format</div>
                                        <div className="text-sm text-base-content/70">Les dimensions seront personnalisées par le client</div>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-4 bg-base-200 rounded-xl cursor-pointer hover:bg-base-300 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={isFeatured(selectedProduct.future)}
                                        onChange={(e) =>
                                            setSelectedProduct({
                                                ...selectedProduct,
                                                future: e.target.checked ? "Oui" : ""
                                            })
                                        }
                                        className="w-5 h-5 rounded"
                                    />
                                    <div>
                                        <div className="font-medium text-base-content">Produit vedette</div>
                                        <div className="text-sm text-base-content/70">Mettez en avant ce produit</div>
                                    </div>
                                </label>
                            </div>

                            <div className="flex gap-4 pt-6 border-t border-base-300">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 px-6 py-3 border-2 border-base-300 text-base-content rounded-xl hover:bg-base-200 transition-colors font-medium"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Check size={20} />
                                        Enregistrer les modifications
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
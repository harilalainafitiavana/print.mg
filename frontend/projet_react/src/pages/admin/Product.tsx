import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { X, Check, PlusCircle, ImageIcon, Trash, Edit } from "lucide-react";
import { authFetch } from "../../Components/Utils"
import { useTranslation } from "react-i18next";

interface Product {
    future: string;
    id: number;
    name: string;
    description: string;
    categorie: string;
    prix: string;
    image: string;
    featured: boolean;
    format_defaut: "A3" | "A4" | "A5" | "A6" | ""; // ⭐ AJOUTEZ "" ICI
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



    // --- Pagination ---
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6; // nombre d’éléments par page

    // Calcul des indices
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    // Nombre total de pages
    const totalPages = Math.ceil(products.length / productsPerPage);
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };


    // --- Gestion des inputs ---
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setNewProduct((prev) => ({ ...prev, imageFile: file, image: URL.createObjectURL(file) }));
    };

    // --- Ajouter un produit ---
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
        formData.append("future", newProduct.featured ? "Oui" : "");

        if (newProduct.imageFile) formData.append("image", newProduct.imageFile);

        try {
            const res = await authFetch("http://localhost:8000/api/produits/", {
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
        formData.append("future", selectedProduct.featured ? "Oui" : "");

        // si une nouvelle image est choisie
        if (selectedProduct.image.startsWith("blob:")) {
            const response = await fetch(selectedProduct.image);
            const blob = await response.blob();
            const file = new File([blob], "image.jpg", { type: blob.type });
            formData.append("image", file);
        }

        try {
            const res = await authFetch(`http://localhost:8000/api/produits/${selectedProduct.id}/`, {
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


    // --- Supprimer un produit ---
    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;

        try {
            const res = await authFetch(`http://localhost:8000/api/produits/${productToDelete.id}/`, {
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
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">📦 {t("products.title")}</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                    <PlusCircle size={18} /> {t("products.add")}
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProducts.map((product) => (
                    <div key={product.id} className="bg-base-100 shadow rounded-xl p-4 flex flex-col">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-40 object-cover rounded-lg mb-4"
                            onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                        />

                        <h2 className="text-lg font-bold text-blue-500">{product.name}</h2>

                        {/* ⭐ CORRECTION : AFFICHAGE CONDITIONNEL DU FORMAT */}
                        {product.is_grand_format ? (
                            <p><strong>Format : </strong>Grand format</p>
                        ) : (
                            <p><strong>Format : </strong>{product.format_defaut}</p>
                        )}

                        <p><strong>Grand format : </strong>{product.is_grand_format ? "✅" : "❌"}</p>
                        <p className="text-sm text-base-content">{product.description}</p>
                        <p className="text-sm text-base-content"><strong>{t("products.modal.category")} : </strong>{product.categorie}</p>
                        <p className="text-sm font-medium"><strong>{t("products.modal.price")} : </strong>{product.prix} Ariary</p>
                        <p className="text-sm text-base-content">
                            <strong>{t("products.modal.product")} : </strong>{product.future === "Oui" ? "✅" : "❌"}
                        </p>

                        <div className="flex gap-2 mt-3">
                            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-1 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600"
                                onClick={() => {
                                    setSelectedProduct(product);
                                    setShowEditModal(true);
                                }}
                            >
                                <Edit size={16} /> {t("products.edit")}
                            </button>
                            <button
                                onClick={() => handleDeleteClick(product)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
                            >
                                <Trash size={16} /> {t("products.delete")}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

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

            {/* MODAL AJOUT */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-base-100 p-6 rounded-xl max-w-lg w-full">
                        <h3 className="text-xl font-bold mb-4">➕ {t("products.modal.title")}</h3>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="flex flex-col md:flex-row gap-2">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Nom du produit"
                                    value={newProduct.name || ""}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                />

                                {/* Choix du format - CONDITIONNEL */}
                                {!newProduct.is_grand_format ? (
                                    <select
                                        value={newProduct.format_defaut || ""}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                            setNewProduct(prev => ({
                                                ...prev,
                                                format_defaut: e.target.value as "A3" | "A4" | "A5" | "A6"
                                            }))
                                        }
                                        className="select select-bordered w-full"
                                    >
                                        <option value="">-- Choisir le format --</option>
                                        <option value="A3">A3</option>
                                        <option value="A4">A4</option>
                                        <option value="A5">A5</option>
                                        <option value="A6">A6</option>
                                    </select>
                                ) : (
                                    <div className="w-full p-3 bg-gray-100 rounded border text-center">
                                        <span className="text-gray-600">Format : Grand format</span>
                                    </div>
                                )}
                            </div>

                            {/* Checkbox grand format */}
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={newProduct.is_grand_format || false}
                                    onChange={(e) => {
                                        const isGrandFormat = e.target.checked;
                                        setNewProduct(prev => {
                                            const updated = { ...prev, is_grand_format: isGrandFormat };
                                            if (isGrandFormat) {
                                                updated.format_defaut = "" as any; // Force le type
                                            }
                                            return updated;
                                        })
                                    }}
                                />
                                Grand format
                            </label>

                            {/* Message informatif */}
                            {newProduct.is_grand_format && (
                                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                                    <p className="text-sm text-blue-800">
                                        ⓘ Pour les grands formats, les dimensions sont personnalisées par le client
                                    </p>
                                </div>
                            )}

                            <textarea
                                name="description"
                                placeholder="Description"
                                value={newProduct.description || ""}
                                onChange={handleInputChange}
                                className="textarea textarea-bordered w-full"
                            />
                            <input
                                type="text"
                                name="categorie"
                                placeholder="Catégorie"
                                value={newProduct.categorie || ""}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                            />
                            <input
                                type="text"
                                name="prix"
                                placeholder="Prix"
                                value={newProduct.prix || ""}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                            />

                            <label className="flex items-center gap-2 cursor-pointer hover:text-primary">
                                <ImageIcon size={20} /> {t("products.modal.choise")}
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                            {newProduct.image && <img src={newProduct.image} alt="preview" className="w-32 h-32 object-cover rounded-lg mt-2" />}
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={newProduct.featured || false}
                                    onChange={(e) => setNewProduct((prev) => ({ ...prev, featured: e.target.checked }))}
                                />
                                {t("products.modal.product")}
                            </label>

                            <div className="flex justify-end gap-4 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="btn btn-outline flex items-center gap-2"
                                >
                                    <X size={16} /> {t("products.modal.cancel")}
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary flex items-center gap-2"
                                >
                                    <Check size={16} /> {t("products.add")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL SUPPRESSION */}
            {showDeleteModal && productToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-base-100 p-6 rounded-xl max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">⚠️ {t("products.modal.confirmDelete")}</h3>
                        <p className="mb-4">
                            {t("products.modal.deleteConfirm")} <strong>{productToDelete.name}</strong> ?
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="btn btn-outline flex items-center gap-2"
                            >
                                <X size={16} /> {t("products.modal.cancel")}
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="btn btn-primary flex items-center gap-2"
                            >
                                <Check size={16} /> {t("products.modal.confirm")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL MODIFIER */}
            {showEditModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-base-100 p-6 rounded-xl max-w-lg w-full">
                        <h3 className="text-xl font-bold mb-4">✏️ {t("products.modal.editproduct")}</h3>
                        <div className="space-y-3">
                            <div className="flex flex-col md:flex-row gap-2">
                                <input
                                    type="text"
                                    placeholder="Nom du produit"
                                    value={selectedProduct.name}
                                    onChange={(e) =>
                                        setSelectedProduct({ ...selectedProduct, name: e.target.value })
                                    }
                                    className="input input-bordered w-full"
                                />
                                {/* Choix du format */}
                                <select
                                    value={selectedProduct.format_defaut || "A4"}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            format_defaut: e.target.value as "A3" | "A4" | "A5" | "A6"
                                        })
                                    }
                                    className="select select-bordered w-full"
                                >
                                    <option value="A3">A3</option>
                                    <option value="A4">A4</option>
                                    <option value="A5">A5</option>
                                    <option value="A6">A6</option>
                                </select>
                            </div>
                            {/* Checkbox Grand Format */}
                            <label className="flex items-center gap-2 mt-2">
                                <input
                                    type="checkbox"
                                    checked={selectedProduct.is_grand_format || false}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            is_grand_format: e.target.checked
                                        })
                                    }
                                />
                                {t("products.modal.grandformat")} {/* tu peux ajouter la traduction correspondante */}
                            </label>

                            <textarea
                                placeholder="Description"
                                value={selectedProduct.description}
                                onChange={(e) =>
                                    setSelectedProduct({ ...selectedProduct, description: e.target.value })
                                }
                                className="textarea textarea-bordered w-full"
                            />
                            <input
                                type="text"
                                placeholder="Catégorie"
                                value={selectedProduct.categorie}
                                onChange={(e) =>
                                    setSelectedProduct({ ...selectedProduct, categorie: e.target.value })
                                }
                                className="input input-bordered w-full"
                            />
                            <input
                                type="text"
                                placeholder="Prix"
                                value={selectedProduct.prix}
                                onChange={(e) =>
                                    setSelectedProduct({ ...selectedProduct, prix: e.target.value })
                                }
                                className="input input-bordered w-full"
                            />
                            <label className="flex items-center gap-2 cursor-pointer hover:text-primary">
                                <ImageIcon size={20} /> {t("products.modal.change")}
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
                            {selectedProduct.image && (
                                <img
                                    src={selectedProduct.image}
                                    alt="preview"
                                    className="w-32 h-32 object-cover rounded-lg mt-2"
                                />
                            )}
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selectedProduct.featured}
                                    onChange={(e) =>
                                        setSelectedProduct({ ...selectedProduct, featured: e.target.checked })
                                    }
                                />
                                {t("products.modal.product")}
                            </label>
                        </div>
                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="btn btn-outline flex items-center gap-2"
                            >
                                <X size={16} /> {t("products.modal.cancel")}
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="btn btn-primary flex items-center gap-2"
                            >
                                <Check size={16} /> {t("products.edit")}
                            </button>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

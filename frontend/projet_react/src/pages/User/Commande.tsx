import { useState, useEffect, type ChangeEvent } from "react";
import { ArrowRight, ArrowLeft, Check, X } from "lucide-react";
// import axios from "axios";
import { authFetch } from "../../Components/Utils";
import { useTranslation } from "react-i18next";
import API_BASE_URL from "../../services/api";


type Step = 1 | 2 | 3 | 4;

// ✅ Type complet pour les produits
type Produit = {
  id: number;
  name: string;
  prix: number;
  format_defaut: string;
  description?: string;
  categorie?: string;
  is_grand_format: boolean;
}


export default function PrintingOrderForm() {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>(1);
  const [isBook, setIsBook] = useState(false);
  const [bookPages, setBookPages] = useState<number | "">("");


  // Étape 1 - Fichier
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [dpi, setDpi] = useState(150);
  const [colorProfile, setColorProfile] = useState("CMIN");
  const [dateUpload] = useState(new Date().toISOString().split("T")[0]);
  const [fileError, setFileError] = useState("");

  // Étape 2 - Configuration
  const [formatType, setFormatType] = useState("petit");
  const [smallFormat, setSmallFormat] = useState("A4");
  const [customSize, setCustomSize] = useState({ width: "", height: "" });
  const [paperType, setPaperType] = useState("");
  const [finish, setFinish] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [duplex, setDuplex] = useState(""); // recto/verso option facultative
  const [binding, setBinding] = useState(""); // reliure option facultative
  const [coverPaper, setCoverPaper] = useState(""); // couverture option facultative
  const [formatError, setFormatError] = useState("");
  const [selectedProduit, setSelectedProduit] = useState("");
  const [produits, setProduits] = useState<Produit[]>([]);

  // Étape 3 - Paiement
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [options, setOptions] = useState("");
  const [step3Error, setStep3Error] = useState("");

  // Étape 4 - Confirmation
  const [showModal, setShowModal] = useState(false);

  // Récupérer les produits avec tous les champs
  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const res = await authFetch(`${API_BASE_URL}/api/produits/`);
        const data = await res.json();
        setProduits(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduits();
  }, []);

  // 🔹 Format automatique selon le produit - VERSION CORRIGÉE
  useEffect(() => {
    if (selectedProduit) {
      // Trouver le produit sélectionné
      const produit = produits.find(p => p.id === parseInt(selectedProduit));
      if (produit) {
        console.log(`🔍 Produit sélectionné: ${produit.name}, Format: ${produit.format_defaut}, Grand format: ${produit.is_grand_format}`);

        // ⭐ CORRECTION : SI C'EST UN GRAND FORMAT
        if (produit.is_grand_format) {
          setFormatType("grand"); // ⬅️ FORCE le format "grand"
          setSmallFormat("");     // ⬅️ RESET le petit format
          console.log("✅ Produit grand format détecté - format_type forcé à 'grand'");
        }
        // SI C'EST UN PETIT FORMAT
        else {
          const formatDefaut = produit.format_defaut;

          // Si le format par défaut est A6, on le considère comme "custom"
          if (formatDefaut === "A6") {
            setSmallFormat("custom");
          } else {
            setSmallFormat(formatDefaut);
          }
          console.log(`✅ Format automatique défini: ${formatDefaut}`);
        }
      }
    } else {
      // Reset si aucun produit sélectionné
      setFormatType("petit");
      setSmallFormat("A4");
    }
  }, [selectedProduit, produits]);


  // ✅ Estimation simplifiée du prix - VERSION CORRIGÉE
  useEffect(() => {
    console.log("🔍 Déclenchement calcul:", {
      selectedProduit,
      quantity,
      isBook,
      bookPages,
      smallFormat
    });

    if (!quantity) {
      setAmount("");
      return;
    }

    let estimation = 0;

    // ⭐ MODIFICATION : Calcul pour livres SANS produit
    if (isBook) {
      // Si c'est un livre MAIS bookPages n'est pas encore rempli
      if (!bookPages) {
        setAmount(""); // Montant vide en attendant les pages
        return;
      }

      console.log("📖 Calcul LIVRE activé (sans produit)");

      // PRIX FIXES POUR LIVRES
      let prixPage = 200;
      switch (smallFormat) {
        case "A3": prixPage = 1000; break;
        case "A4": prixPage = 500; break;
        case "A5": prixPage = 300; break;
        case "A6": prixPage = 200; break;
        case "custom": prixPage = 200; break;
      }

      const prixPages = prixPage * bookPages * quantity;

      // PRIX RÉELS DES OPTIONS
      let prixCouverture = 0;
      if (coverPaper === "simple") prixCouverture = 1000;
      if (coverPaper === "photo") prixCouverture = 3000;

      let prixReliure = 0;
      if (binding === "spirale") prixReliure = 2000;
      if (binding === "dos_colle") prixReliure = 3000;
      if (binding === "agrafé") prixReliure = 1000;

      // Multiplicateur recto-verso
      const multiplicateurDuplex = duplex === "recto_verso" ? 1.2 : 1.0;

      const prixCouvertureTotal = (prixCouverture * multiplicateurDuplex) * quantity;
      const prixReliureTotal = prixReliure * quantity;

      estimation = prixPages + prixCouvertureTotal + prixReliureTotal + 5000;

      console.log("💰 Calcul livre détaillé:", {
        prixPages,
        prixCouvertureTotal,
        prixReliureTotal,
        estimation
      });
    }
    // ⭐ PRODUITS NORMAUX (nécessitent un produit)
    else if (selectedProduit) {
      const produit = produits.find(p => p.id === parseInt(selectedProduit));
      if (produit) {
        console.log("📄 Calcul PRODUIT normal");
        estimation = (produit.prix * quantity) + 5000;
      } else {
        setAmount("");
        return;
      }
    } else {
      // Produit normal mais pas de produit sélectionné
      setAmount("");
      return;
    }

    setAmount(Math.round(estimation));
    console.log("🎯 Montant final:", Math.round(estimation));

  }, [selectedProduit, quantity, isBook, bookPages, smallFormat, produits, duplex, binding, coverPaper]);


  // Erreurs et validations du numéro téléphone sur le payement
  const validatePhone = (number: string): string => {
    let cleanNumber = number.replace(/\D/g, '');

    // Conversion format international
    if (cleanNumber.startsWith('261') && cleanNumber.length === 12) {
      cleanNumber = '0' + cleanNumber.substring(3);
    }

    // Longueur exacte
    if (cleanNumber.length !== 10) {
      return "Le numéro doit avoir exactement 10 chiffres";
    }

    // Opérateurs Mobile Money
    const validPrefixes = ["034", "038", "032", "037", "033"];
    const prefix = cleanNumber.substring(0, 3);

    if (!validPrefixes.includes(prefix)) {
      return "Numéro invalide pour Mobile Money. Utilisez Telma (034/038), Orange (032/037) ou Airtel Money (033)";
    }

    return ""; // Valide
  };

  // Le numéro doit contenir 10 chiffres, commencer par 034 ou 038
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;

    // Formatage automatique
    let formattedValue = value.replace(/\D/g, ''); // Supprimer non-numériques

    // Limiter à 10 chiffres
    if (formattedValue.length > 10) {
      formattedValue = formattedValue.substring(0, 10);
    }

    // Validation
    const error = validatePhone(formattedValue);
    setPhoneError(error);
    setPhone(formattedValue);
  };

  // Gestion du fichier
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "jpg", "jpeg"].includes(ext || "")) {
      setFileError(t("printingOrder.errors.invalidFile"));
      setFile(null);
      return;
    }
    setFileError("");
    setFile(selectedFile);
  };

  // Validation Étape 1
  const validateStep1 = () => {
    if (!file || !fileName) {
      setFileError(t("printingOrder.errors.fillStep1"));
      return false;
    }
    setFileError("");
    return true;
  };

  // Validation Étape 2
  const validateStep2 = () => {
    // ⭐ MODIFICATION : Produit obligatoire SEULEMENT pour produits normaux
    if (!isBook && !selectedProduit) {
      setFormatError("Veuillez sélectionner un produit");
      return false;
    }

    if (!paperType || !finish || !quantity) {
      setFormatError(t("printingOrder.errors.fillStep2"));
      return false;
    }

    // 🔹 RÈGLES POUR LES LIVRES (quantité minimale = 5 pour tous formats)
    if (isBook) {
      if (!bookPages || bookPages <= 0) {
        setFormatError("Veuillez saisir le nombre de pages du livre");
        return false;
      }

      const minBookQty = 5;
      if (quantity < minBookQty) {
        setFormatError(`Quantité minimale pour un livre : ${minBookQty} exemplaires`);
        return false;
      }
    }
    // 🔹 RÈGLES POUR LES PRODUITS NORMAUX
    else {
      if (formatType === "petit") {
        const minQty =
          smallFormat === "A5" ? 30 :
            smallFormat === "A4" ? 20 :
              smallFormat === "A3" ? 10 : 50;

        if (quantity < minQty) {
          setFormatError(t("printingOrder.errors.minQty", { format: smallFormat, min: minQty }));
          return false;
        }
      }

      if (formatType === "grand") {
        const w = parseFloat(customSize.width || "0");
        const h = parseFloat(customSize.height || "0");
        if (!w || !h) {
          setFormatError(t("printingOrder.errors.grandSize"));
          return false;
        }
        if (w > 160 || h > 100) {
          setFormatError(t("printingOrder.errors.grandMaxSize"));
          return false;
        }
      }
    }

    setFormatError("");
    return true;
  };


  // Validation Étape 3
  const validateStep3 = () => {
    if (!phone.match(/^\d{10}$/)) {
      setStep3Error(t("printingOrder.errors.invalidPhone"));
      return false;
    }
    if (!amount || amount <= 0) {
      setStep3Error(t("printingOrder.errors.invalidAmount"));
      return false;
    }
    setStep3Error("");
    return true;
  };

  // Modifiez la fonction nextStep
  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2) {
      // ⭐ MODIFICATION : Vérifier le produit UNIQUEMENT pour les produits normaux
      if (!isBook && !selectedProduit) {
        setFormatError("Veuillez sélectionner un produit pour les impressions normales");
        return;
      }
      if (validateStep2()) setStep(3);
    }
    if (step === 3 && validateStep3()) setShowModal(true);
  };

  const prevStep = () => {
    if (step > 1) setStep((prev) => (prev - 1) as Step);
  };


  // Fonction pour envoyer la commande au backend
  const handleSubmit = async () => {
    if (!file) {
      alert(t("printingOrder.errors.selectFile"));
      return;
    }

    try {
      const formData = new FormData();

      // 🔹 Fichier
      formData.append("file", file);
      formData.append("fileName", fileName);
      formData.append("dpi", dpi.toString());
      formData.append("file_format", file.name.split('.').pop() || "");
      formData.append("colorProfile", colorProfile);

      // 🔹 Configuration - CORRIGÉ
      formData.append("format_type", formatType);
      if (smallFormat) formData.append("small_format", smallFormat);
      if (selectedProduit) formData.append("produit_id", selectedProduit); // ✅ IMPORTANT
      if (customSize.width) formData.append("largeur", customSize.width);
      if (customSize.height) formData.append("hauteur", customSize.height);
      if (paperType) formData.append("paper_type", paperType);
      if (finish) formData.append("finish", finish);
      formData.append("quantity", quantity.toString());
      if (duplex) formData.append("duplex", duplex);
      if (binding) formData.append("binding", binding);
      if (coverPaper) formData.append("cover_paper", coverPaper);
      formData.append("is_book", isBook ? "true" : "false");
      if (isBook && bookPages) formData.append("book_pages", bookPages.toString());

      // 🔹 Paiement - RETIREZ amount
      formData.append("phone", phone);
      // ⛔ SUPPRIMEZ cette ligne: formData.append("amount", amount.toString());
      if (options) formData.append("options", options);

      console.log("Données envoyées :", {
        file,
        fileName,
        dpi,
        colorProfile,
        formatType,
        smallFormat,
        customSize,
        paperType,
        finish,
        quantity,
        duplex,
        binding,
        coverPaper,
        phone,
        options,
      });

      const res = await authFetch(`${API_BASE_URL}/api/commande/`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert(t("printingOrder.success.created", { status: data.paiement_status }));

        // Reset formulaire
        setStep(1);
        setFile(null);
        setFileName("");
        setSelectedProduit(""); // ⭐ Reset le produit aussi
        setSmallFormat("A4"); // ⭐ Reset le format
        setQuantity("");
        setAmount("");
        setPhone("");
        setDuplex("");
        setBinding("");
        setCoverPaper("");
        setOptions("");
        setCustomSize({ width: "", height: "" });
        setIsBook(false); // ⭐ Reset livre
        setBookPages("");
        setShowModal(false);
      } else {
        alert(t("printingOrder.errors.creationFailed", { message: data.error }));
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || t("printingOrder.errors.creationError"));
    }
  };


  const handleCancel = () => {
    setShowModal(false);
  };

  // Options de papier selon format
  const paperOptions =
    smallFormat === "A4"
      ? [
        { key: "glace", label: t("printingOrder.paper.glossy") },
        { key: "mat", label: t("printingOrder.paper.matte") },
      ]
      : smallFormat === "A3"
        ? [
          { key: "standard", label: t("printingOrder.paper.standard") },
          { key: "brillant", label: t("printingOrder.paper.shiny") },
        ]
        : [{ key: "standard", label: t("printingOrder.paper.standard") }];


  return (
    <div className="max-w-4xl mx-auto p-6 bg-base-100 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-base-content">📄 {t("printingOrder.title")}</h2>

      {/* Étape 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <input type="text" placeholder={t("printingOrder.placeholders.fileName")} value={fileName} onChange={(e) => setFileName(e.target.value)} className="input input-bordered w-full" />
          <input type="file" accept=".pdf,.jpg,.jpeg" onChange={handleFileChange} className="input input-bordered w-full" />
          {fileError && <p className="text-red-500">{fileError}</p>}

          <div className="flex gap-4">
            <select value={dpi} onChange={(e) => setDpi(parseInt(e.target.value))} className="select select-bordered">
              <option value={150}>150 DPI</option>
              <option value={300}>300 DPI</option>
            </select>
            <select value={colorProfile} onChange={(e) => setColorProfile(e.target.value)} className="select select-bordered">
              <option value="CMIN">CMJN</option>
              <option value="CYMK">CYMK</option>
            </select>
            <input type="text" readOnly value={dateUpload} className="input input-bordered" />
          </div>

          <button onClick={nextStep} className="btn btn-primary flex items-center gap-2">
            {t("printingOrder.buttons.next")} <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Étape 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <select value={formatType} onChange={(e) => setFormatType(e.target.value)} className="select select-bordered">
            <option value="petit">{t("printingOrder.format.small") || "Petit format"}</option>
            <option value="grand">{t("printingOrder.format.large") || "Grand format"}</option>
          </select>

          {formatType === "petit" && (
            <select value={smallFormat} onChange={(e) => setSmallFormat(e.target.value)} className="select select-bordered">
              <option value="A5">A5</option>
              <option value="A4">A4</option>
              <option value="A3">A3</option>
              <option value="custom">{t("printingOrder.format.custom") || "Personnalisé"}</option>
            </select>
          )}

          {/* Sélection du produit */}
          <select
            value={selectedProduit}
            onChange={(e) => setSelectedProduit(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">-- Choisir un produit --</option>
            {produits.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} - {p.prix} Ar (Format: {p.is_grand_format ? "Grand format" : p.format_defaut})
              </option>
            ))}
          </select>

          {/* Dans l'étape 2 - Après la sélection du produit */}
          {selectedProduit && (
            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <p className="text-sm text-blue-800">
                ✅ Produit sélectionné: <strong>{produits.find(p => p.id === parseInt(selectedProduit))?.name}</strong>
                <br />
                {produits.find(p => p.id === parseInt(selectedProduit))?.is_grand_format ? (
                  <>Format : <strong>Grand format</strong></>
                ) : (
                  <>Format par défaut: <strong>{produits.find(p => p.id === parseInt(selectedProduit))?.format_defaut}</strong>
                    {smallFormat === "custom" && " - Format personnalisé activé"}
                  </>
                )}
              </p>
            </div>
          )}

          {/* AJOUTEZ CETTE SECTION - Règles de quantité */}
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-800 font-medium">
              {isBook ? (
                <>📖 <strong>Livre</strong> - Quantité minimale : <strong>5 exemplaires</strong> (tous formats)</>
              ) : (
                <>📄 <strong>Produit normal</strong> - Quantité minimale :{" "}
                  {formatType === "petit" ? (
                    smallFormat === "A5" ? "30 exemplaires (A5)" :
                      smallFormat === "A4" ? "20 exemplaires (A4)" :
                        smallFormat === "A3" ? "10 exemplaires (A3)" :
                          "50 exemplaires (personnalisé)"
                  ) : (
                    "selon les dimensions"
                  )}
                </>
              )}
            </p>
          </div>

          {/* ✅ CORRECTION - Utilisez Boolean(amount) ou amount !== "" */}
          {amount && amount > 0 && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-bold text-green-800 mb-2">💰 Estimation du prix</h4>
              <div className="text-sm text-green-700">
                <p>Montant estimé: <strong>{amount} Ar</strong></p>
                <p className="text-xs mt-1 text-green-600">
                  {isBook ? "📖 Calcul basé sur nombre de pages + options livre" : "📄 Calcul basé sur prix produit × quantité + livraison"}
                </p>
                <p className="text-xs text-green-500">Le prix final sera calculé par le serveur</p>
              </div>
            </div>
          )}


          {/* Champs largeur/hauteur */}
          {(formatType === "grand" || (formatType === "petit" && smallFormat === "custom")) && (
            <div className="flex flex-col gap-2">
              {formatType === "grand" && <p className="text-yellow-600">{t("printingOrder.warning.maxSize") || "⚠️ Limite imprimante : 160x100 cm"}</p>}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t("printingOrder.placeholders.width")}
                  value={customSize.width}
                  onChange={(e) => setCustomSize({ ...customSize, width: e.target.value })}
                  className="input input-bordered"
                />
                <input
                  type="text"
                  placeholder={t("printingOrder.placeholders.height")}
                  value={customSize.height}
                  onChange={(e) => setCustomSize({ ...customSize, height: e.target.value })}
                  className="input input-bordered"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={isBook}
              onChange={(e) => setIsBook(e.target.checked)}
              id="isBook"
              className="checkbox"
            />
            <label htmlFor="isBook">{t("printingOrder.bookOption") || "Je veux imprimer un livre"}</label>
          </div>

          {isBook && (
            <input
              type="number"
              placeholder={t("printingOrder.placeholders.pages")}
              value={bookPages}
              onChange={(e) => setBookPages(parseInt(e.target.value))}
              className="input input-bordered w-full mb-2"
            />
          )}

          <select
            value={paperType}
            onChange={(e) => setPaperType(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">{t("printingOrder.placeholders.paperType")}</option>
            {paperOptions.map((p) => (
              <option key={p.key} value={p.key}>{p.label}</option>
            ))}
          </select>


          <select value={finish} onChange={(e) => setFinish(e.target.value)} className="select select-bordered w-full">
            <option value="">{t("printingOrder.placeholders.finish") || "Finition"}</option>
            <option value="brillant">{t("printingOrder.finish.glossy") || "Brillant"}</option>
            <option value="mate">{t("printingOrder.finish.matte") || "Mate"}</option>
            <option value="standard">{t("printingOrder.finish.standard") || "Standard"}</option>
            <option value="vernis">Vernis Sélectif</option>
            <option value="dorure">Dorure à chaud</option>
          </select>

          <input type="number" placeholder={t("printingOrder.placeholders.quantity")} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className="input input-bordered w-full" />

          {/* Options facultatives */}
          <select value={duplex} onChange={(e) => setDuplex(e.target.value)} className="select select-bordered w-full">
            <option value="">{t("printingOrder.placeholders.duplex") || "Version Recto seul ou Recto/verso ?"}</option>
            <option value="recto">{t("printingOrder.duplex.single") || "Recto seul"}</option>
            <option value="recto_verso">{t("printingOrder.duplex.double") || "Recto/verso"}</option>
          </select>

          <select value={binding} onChange={(e) => setBinding(e.target.value)} className="select select-bordered w-full">
            <option value="">{t("printingOrder.binding.none") || "Pas de reliure"}</option>
            <option value="spirale">{t("printingOrder.binding.spiral") || "Spirale"}</option>
            <option value="dos_colle">{t("printingOrder.binding.glue") || "Dos collé"}</option>
            <option value="agrafé">{t("printingOrder.binding.stapled") || "Agrafé"}</option>
            <option value="rigide">Couverture rigide</option>
            <option value="coucu">Dos Caré Coucu</option>
          </select>

          <select value={coverPaper} onChange={(e) => setCoverPaper(e.target.value)} className="select select-bordered w-full">
            <option value="">{t("printingOrder.cover.none") || "Pas de couverture spéciale"}</option>
            <option value="simple">{t("printingOrder.cover.simple") || "Papier simple"}</option>
            <option value="photo">{t("printingOrder.cover.photo") || "Papier photo"}</option>
            <option value="mat">Papier couché Mat</option>
            <option value="brillant">Papier couché Brillant</option>
            <option value="texture">Papier Création Texturé</option>
          </select>

          {formatError && <p className="text-red-500">{formatError}</p>}

          <div className="flex justify-between">
            <button onClick={prevStep} className="btn btn-outline flex items-center gap-2">
              <ArrowLeft size={16} /> {t("printingOrder.buttons.back")}
            </button>
            <button onClick={nextStep} className="btn btn-primary flex items-center gap-2">
              {t("printingOrder.buttons.next")} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Étape 3 */}
      {step === 3 && (
        <div className="space-y-4">
          {/* Ajoute juste cette ligne d'avertissement */}
          <div className="alert alert-warning">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>Mode développement : le paiement est simulé (Sandbox)</span>
          </div>
          <input type="tel" placeholder={t("printingOrder.placeholders.phone")} value={phone} onChange={handlePhoneChange} className={`input input-bordered w-full ${phoneError ? 'input-error' : ''}`} maxLength={10} />
          {phoneError && (
            <label className="label">
              <span className="label-text-alt text-error">{phoneError}</span>
            </label>
          )}
          <input type="number" placeholder={t("printingOrder.placeholders.amount")} value={amount} readOnly className="input input-bordered w-full" />
          <textarea placeholder={t("printingOrder.placeholders.options")} value={options} onChange={(e) => setOptions(e.target.value)} className="textarea textarea-bordered w-full" />
          {step3Error && <p className="text-red-500">{step3Error}</p>}

          <div className="flex justify-between">
            <button onClick={prevStep} className="btn btn-outline flex items-center gap-2">
              <ArrowLeft size={16} /> {t("printingOrder.buttons.back")}
            </button>
            <button onClick={nextStep} className="btn btn-primary">{t("printingOrder.buttons.checkOrder")}</button>
          </div>
        </div>
      )}

      {/* Modal confirmation */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">📄 {t("printingOrder.summary.title")}</h3>
            <div className="space-y-2 text-sm">
              <p><strong>{t("printingOrder.summary.file")} :</strong> {fileName}</p>
              <p><strong>{t("printingOrder.summary.dpi")} :</strong> {dpi}</p>
              <p><strong>{t("printingOrder.summary.colorProfile")} :</strong> {colorProfile}</p>
              <p>
                <strong>{t("printingOrder.summary.format")} :</strong> {formatType}{" "}
                {formatType === "petit" ? `- ${smallFormat}` : `- ${customSize.width}x${customSize.height} cm`}
              </p>
              <p><strong>{t("printingOrder.summary.paper")} :</strong> {paperType}</p>
              <p><strong>{t("printingOrder.summary.finish")} :</strong> {finish}</p>
              <p><strong>{t("printingOrder.summary.quantity")} :</strong> {quantity}</p>
              {isBook && bookPages && <p><strong>{t("printingOrder.summary.bookPages")} :</strong> {bookPages}</p>}
              {duplex && <p><strong>{t("printingOrder.summary.duplex")} :</strong> {duplex}</p>}
              {binding && <p><strong>{t("printingOrder.summary.binding")} :</strong> {binding}</p>}
              {coverPaper && <p><strong>{t("printingOrder.summary.cover")} :</strong> {coverPaper}</p>}
              <p><strong>{t("printingOrder.summary.phone")} :</strong> {phone}</p>
              <p><strong>{t("printingOrder.summary.amount")} :</strong> {amount} Ariary</p>
              <p><strong>{t("printingOrder.summary.options")} :</strong> {options || "-"}</p>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={handleCancel} className="btn btn-outline flex items-center gap-2">
                <X size={16} /> {t("printingOrder.buttons.cancel")}
              </button>
              <button onClick={handleSubmit} className="btn btn-primary flex items-center gap-2">
                <Check size={16} /> {t("printingOrder.buttons.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

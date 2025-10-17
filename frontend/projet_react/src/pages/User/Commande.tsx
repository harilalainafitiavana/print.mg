import { useState, useEffect, type ChangeEvent } from "react";
import { ArrowRight, ArrowLeft, Check, X } from "lucide-react";
// import axios from "axios";
import { authFetch } from "../../Components/Utils";
import { useTranslation } from "react-i18next";


type Step = 1 | 2 | 3 | 4;

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

  // Étape 3 - Paiement
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [options, setOptions] = useState("");
  const [step3Error, setStep3Error] = useState("");

  // Étape 4 - Confirmation
  const [showModal, setShowModal] = useState(false);

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
    if (!paperType || !finish || !quantity) {
      setFormatError(t("printingOrder.errors.fillStep2"));
      return false;
    }

    // 🔹 Si c'est un livre, quantité minimale spéciale
    if (isBook) {
      const minBookQty = 4;
      if (quantity < minBookQty) {
        setFormatError(t("printingOrder.errors.minBookQty", { min: minBookQty }));
        return false;
      }
    } else {
      // 🔹 Quantité minimale selon format
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

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
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

      // 🔹 Configuration
      formData.append("format_type", formatType);
      if (smallFormat) formData.append("small_format", smallFormat);
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

      // 🔹 Paiement
      formData.append("phone", phone);
      formData.append("amount", amount.toString());
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
        amount,
        options,
      });

      const res = await authFetch("http://localhost:8000/api/commande/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert(t("printingOrder.success.created", { status: data.paiement_status }));

        // 🔹 Reset formulaire
        setStep(1);
        setFile(null);
        setFileName("");
        setQuantity("");
        setAmount("");
        setPhone("");
        setDuplex("");
        setBinding("");
        setCoverPaper("");
        setOptions("");
        setCustomSize({ width: "", height: "" });
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


  // Calcul automatique du montant
  useEffect(() => {
    if (!quantity) return;

    let basePrice = 0;

    // ---- Format ----
    if (formatType === "petit") {
      switch (smallFormat) {
        case "A6": basePrice = 200; break;
        case "A5": basePrice = 300; break;
        case "A4": basePrice = 500; break;
        case "A3": basePrice = 1000; break;
        case "custom": {
          const w = parseFloat(customSize.width || "0");
          const h = parseFloat(customSize.height || "0");
          const surface = (w * h) / 10000;
          basePrice = Math.max(surface * 5000, 200);
          break;
        }
      }
    } else if (formatType === "grand") {
      const w = parseFloat(customSize.width || "0");
      const h = parseFloat(customSize.height || "0");
      const surface = (w * h) / 10000;
      basePrice = Math.max(surface * 5000, 5000);
    }

    // ---- Calcul pour livre ----
    let pagesTotal = basePrice;
    let optionsTotal = 0;
    const duplexMultiplier = duplex === "recto_verso" ? 1.2 : 1;

    let bindingPrice = 0;
    if (binding === "spirale") bindingPrice = 2000;
    if (binding === "dos_colle") bindingPrice = 3000;
    if (binding === "agrafé") bindingPrice = 1000;

    let coverPrice = 0;
    if (coverPaper === "photo") coverPrice = 3000;
    if (coverPaper === "simple") coverPrice = 1000;

    const deliveryFee = 5000;

    if (isBook && bookPages) {
      pagesTotal = basePrice * bookPages; // prix pour 1 livre
      optionsTotal = (bindingPrice + coverPrice) * quantity; // options multiplié par le nombre de livres
      setAmount(Math.round((pagesTotal * quantity + optionsTotal) * duplexMultiplier + deliveryFee));
    } else {
      setAmount(Math.round((basePrice * quantity * duplexMultiplier) + bindingPrice + coverPrice + deliveryFee));
    }

  }, [formatType, smallFormat, customSize, duplex, quantity, binding, coverPaper, isBook, bookPages]);


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
          </select>

          <select value={coverPaper} onChange={(e) => setCoverPaper(e.target.value)} className="select select-bordered w-full">
            <option value="">{t("printingOrder.cover.none") || "Pas de couverture spéciale"}</option>
            <option value="simple">{t("printingOrder.cover.simple") || "Papier simple"}</option>
            <option value="photo">{t("printingOrder.cover.photo") || "Papier photo"}</option>
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
          <input type="tel" placeholder={t("printingOrder.placeholders.phone")} value={phone} onChange={(e) => setPhone(e.target.value)} className="input input-bordered w-full" />
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

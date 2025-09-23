import { useState, type ChangeEvent } from "react";
import { ArrowRight, ArrowLeft, Check, X } from "lucide-react";

type Step = 1 | 2 | 3 | 4;

export default function PrintingOrderForm() {
  const [step, setStep] = useState<Step>(1);

  // Étape 1
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [dpi, setDpi] = useState(150);
  const [colorProfile, setColorProfile] = useState("CMIN");
  const [dateUpload] = useState(new Date().toISOString().split("T")[0]);
  const [fileError, setFileError] = useState("");

  // Étape 2
  const [formatType, setFormatType] = useState("petit");
  const [smallFormat, setSmallFormat] = useState("A4");
  const [customSize, setCustomSize] = useState({ width: "", height: "" });
  const [paperType, setPaperType] = useState("");
  const [finish, setFinish] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [formatError, setFormatError] = useState("");

  // Étape 3
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [options, setOptions] = useState("");
  const [step3Error, setStep3Error] = useState("");

  // Étape 4 (Confirmation)
  const [showModal, setShowModal] = useState(false);

  // Gestion du fichier
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    if (ext !== "pdf" && ext !== "jpg") {
      setFileError("Seuls les fichiers PDF et JPG sont acceptés");
      setFile(null);
      return;
    }
    setFileError("");
    setFile(selectedFile);
  };

  const validateStep1 = () => {
    if (!file || !fileName) {
      setFileError("Veuillez remplir tous les champs de l'étape 1");
      return false;
    }
    setFileError("");
    return true;
  };

  const validateStep2 = () => {
    if (!paperType || !finish || !quantity) {
      setFormatError("Veuillez remplir tous les champs de l'étape 2");
      return false;
    }
    const minQty = smallFormat === "A5" ? 30 : smallFormat === "A4" ? 20 : 50;
    if (quantity < minQty) {
      setFormatError(`Quantité minimale pour ${smallFormat} est ${minQty}`);
      return false;
    }
    if (formatType === "grand") {
      const w = parseFloat(customSize.width);
      const h = parseFloat(customSize.height);
      if (w > 160 || h > 100) {
        setFormatError("Votre impression sera divisée en plusieurs parties");
        return false;
      }
    }
    setFormatError("");
    return true;
  };

  const validateStep3 = () => {
    if (!phone.match(/^\d{10}$/)) {
      setStep3Error("Veuillez entrer un numéro de téléphone valide à 10 chiffres");
      return false;
    }
    if (!amount || amount <= 0) {
      setStep3Error("Veuillez entrer un montant valide");
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

  const handleConfirm = () => {
    setShowModal(false);
    alert("✅ Commande envoyée !");
    // Ici envoyer les données à Django
  };

  const handleCancel = () => {
    setShowModal(false);
    alert("❌ Commande annulée");
  };

  // Options de papier dynamiques
  const paperOptions =
    smallFormat === "A4" ? ["Papier glacé", "Papier mat"] :
      smallFormat === "A3" ? ["Papier standard", "Papier brillant"] :
        ["Papier standard"];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">📄 Commande d'impression</h2>

      {/* Étape 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <label>Nom du fichier</label>
          <input
            type="text"
            placeholder="Nom du fichier"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="input input-bordered w-full mt-0"
          />
          <input
            type="file"
            accept=".pdf,.jpg"
            onChange={handleFileChange}
            className="input input-bordered w-full"
          />
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
            Suivant <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Étape 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <select value={formatType} onChange={(e) => setFormatType(e.target.value)} className="select select-bordered">
            <option value="petit">Petit format</option>
            <option value="grand">Grand format</option>
          </select>

          {formatType === "petit" && (
            <select value={smallFormat} onChange={(e) => setSmallFormat(e.target.value)} className="select select-bordered">
              <option value="A5">A5</option>
              <option value="A4">A4</option>
              <option value="A3">A3</option>
              <option value="custom">Personnalisé</option>
            </select>
          )}

          {formatType === "grand" && (
            <div>
              <p className="text-yellow-600">⚠️ Limite imprimante : 160x100cm</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Largeur (cm)"
                  value={customSize.width}
                  onChange={(e) => setCustomSize({ ...customSize, width: e.target.value })}
                  className="input input-bordered"
                />
                <input
                  type="text"
                  placeholder="Hauteur (cm)"
                  value={customSize.height}
                  onChange={(e) => setCustomSize({ ...customSize, height: e.target.value })}
                  className="input input-bordered"
                />
              </div>
            </div>
          )}

          <select value={paperType} onChange={(e) => setPaperType(e.target.value)} className="select select-bordered w-full">
            <option value="">Sélectionnez le type de papier</option>
            {paperOptions.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>

          <select value={finish} onChange={(e) => setFinish(e.target.value)} className="select select-bordered w-full">
            <option value="">Finition</option>
            <option value="brillant">Brillant</option>
            <option value="mate">Mate</option>
            <option value="standard">Standard</option>
          </select>

          <input type="number" placeholder="Quantité" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className="input input-bordered w-full" />
          {formatError && <p className="text-red-500">{formatError}</p>}

          <div className="flex justify-between">
            <button onClick={prevStep} className="btn btn-outline flex items-center gap-2">
              <ArrowLeft size={16} /> Retour
            </button>
            <button onClick={nextStep} className="btn btn-primary flex items-center gap-2">
              Suivant <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Étape 3 */}
      {step === 3 && (
        <div className="space-y-4">
          <input type="tel" placeholder="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} className="input input-bordered w-full" />
          <input type="number" placeholder="Montant (ARIARY)" value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} className="input input-bordered w-full" />
          <textarea placeholder="Options supplémentaires" value={options} onChange={(e) => setOptions(e.target.value)} className="textarea textarea-bordered w-full" />
          {step3Error && <p className="text-red-500">{step3Error}</p>}

          <div className="flex justify-between">
            <button onClick={prevStep} className="btn btn-outline flex items-center gap-2">
              <ArrowLeft size={16} /> Retour
            </button>
            <button onClick={nextStep} className="btn btn-primary">Vérifier commande</button>
          </div>
        </div>
      )}

      {/* Modal confirmation */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">📄 Résumé de la commande</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Fichier :</strong> {fileName}</p>
              <p><strong>DPI :</strong> {dpi}</p>
              <p><strong>Profil :</strong> {colorProfile}</p>
              <p><strong>Format :</strong> {formatType} {formatType === "petit" ? `- ${smallFormat}` : `- ${customSize.width}x${customSize.height} cm`}</p>
              <p><strong>Papier :</strong> {paperType}</p>
              <p><strong>Finition :</strong> {finish}</p>
              <p><strong>Quantité :</strong> {quantity}</p>
              <p><strong>Téléphone :</strong> {phone}</p>
              <p><strong>Montant :</strong> {amount} Ariary</p>
              <p><strong>Options :</strong> {options || "-"}</p>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={handleCancel} className="btn btn-outline flex items-center gap-2">
                <X size={16} /> Annuler
              </button>
              <button onClick={handleConfirm} className="btn btn-primary flex items-center gap-2">
                <Check size={16} /> Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

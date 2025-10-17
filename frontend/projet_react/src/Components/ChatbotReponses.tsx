export const chatbotResponses: { [key: string]: string } = {
    accueil: `
  Bonjour et bienvenue sur Print.mg 🖨️ ! 
  Nous sommes votre plateforme d'impression en ligne : imprimez vos flyers, livres, posters et brochures rapidement.
  Profitez de 10% sur votre première commande ! 😄
  Vous pouvez me poser des questions sur :
  - Comment passer une commande
  - Les prix et produits
  - Suivi de votre commande
    `,
  
    commande: `
  Voici comment faire une commande étape par étape :
  1️⃣ Téléversez votre fichier (PDF, JPG, JPEG) et donnez-lui un nom.
  2️⃣ Choisissez le format, le type de papier, la finition, la quantité et les options (reliure, couverture, recto/verso).
  3️⃣ Entrez votre téléphone et le montant sera calculé automatiquement.
  4️⃣ Vérifiez votre commande dans la fenêtre de confirmation et cliquez sur "Confirmer".
  Vous recevrez des emails à chaque étape : création, impression, livraison.
    `,
  
    prix: `
  Nos prix :
  - Formats : A3=1000 Ar, A4=500 Ar, A5=300 Ar, Personnalisé=200 Ar, Grand format=5000 Ar
  - Reliure : Spirale=2000 Ar, Dos collé=3000 Ar, Agrafé=1000 Ar
  - Couverture : Photo=3000 Ar, Simple=1000 Ar
  - Livraison : 5000 Ar
    `,
  
    produits: `
  Nous imprimons : Flyers, Livres, Posters, Brochures.  
  Chaque produit a des options personnalisables.
    `,
  
    suivi: `
  Pour suivre votre commande :
  1️⃣ Email dès réception de la commande.
  2️⃣ Email quand la commande est en cours d'impression.
  3️⃣ Email quand la commande est prête pour livraison.
  4️⃣ Email lors de la livraison.
  Vous pouvez aussi consulter vos commandes depuis votre profil.
    `,
  
    default: `
  Désolé, je n'ai pas compris votre question 😅.
  Vous pouvez demander sur :
  - Comment passer une commande
  - Les prix et produits
  - Suivi de votre commande
    `
  };
  
  export const chatbotKeywords: { [key: string]: string[] } = {
    accueil: ["bonjour", "salut", "coucou", "hello", "hi"],
    commande: ["commande", "comment", "faire une commande", "créer", "passer une commande", "suivi"],
    prix: ["prix", "tarif", "combien", "coût"],
    produits: ["produit", "produits", "liste", "offre"],
    suivi: ["suivi", "état", "livraison", "impression"]
  };
  
import { useState, useEffect } from "react";
import { BookOpen, Ticket, Book, ImageIcon, Bookmark, MessageCircle, Camera, Sparkles, Rocket, Printer, Smile } from "lucide-react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Slide from "./Slide";

export default function HomePage() {
  // Service
  const items = [
    {
      img: "https://contentful.helloprint.com/wm1n7oady8a5/1SaMDO6g98OD0P1B3sHPlr/cbf94f08bf10c64a15652e5168325ed7/new_cookbook.png?q=75&h=290&w=290&fm=avif",
      icon: BookOpen,
      title: "Livres de Cuisine",
      text: "Partagez vos recettes préférées dans un livre imprimé de qualité.",
    },
    {
      img: "https://www.printnation.fr/static/these-/-livre-/-memoire-dos-carre-colle-a4_1-291-4_0_0.jpg",
      icon: Camera,
      title: "Mémoires & Thèses",
      text: "Imprimez vos travaux universitaires avec une finition professionnelle.",
    },
    {
      img: "https://tinyfox.uk/wp-content/uploads/2025/04/retro-wedding-ticket-invitation-4468-v4.jpg",
      icon: Ticket,
      title: "Tickets & Invitations",
      text: "Créez des tickets et invitations personnalisés pour vos événements.",
    },
    {
      img: "https://www.gallimard-jeunesse.fr/var/gallimard-multisite/storage/images/5/4/6/0/645-17-fre-FR/Achetee%20copie%202.jpeg",
      icon: Book,
      title: "Romans & Poche",
      text: "Donnez vie à vos histoires avec des impressions nettes et durables.",
    },
    {
      img: "https://pixum-cms.imgix.net/JgFcIMwCqB6WnVXmvH5lC/69ecde3cd0c60a57c97335abfa72bc89/20230804_Jeanette_Hacet_Scrapbook_085.jpg?auto=compress,format&rect=129,322,1456,819&trim=false",
      icon: ImageIcon,
      title: "Albums & Souvenirs",
      text: "Conservez vos souvenirs dans des albums de qualité et colorés.",
    },
    {
      img: "https://contentful.helloprint.com/wm1n7oady8a5/6NS22HSt1Q7K2PamRSQ1z8/40d64738761898a0e960d7df12cce07b/new_comic.png?q=75&h=290&w=290&fm=avif",
      icon: Bookmark,
      title: "Bande Dessinée & Lookbook",
      text: "Imprimez vos BD et lookbooks avec une qualité professionnelle.",
    },
  ];

  // Background image
  const [currentIndex, setCurrentIndex] = useState(0);
  const imagess = [
    "https://contentful.helloprint.com/wm1n7oady8a5/6GF6VHqwxjUdUhEbYdahs8/5ae7618505438c941a540eb637d3a274/Corporate_Information_and_Marketing.png?q=75&h=600&w=600&fm=avif&fit=pad",

    "https://contentful.helloprint.com/wm1n7oady8a5/6WJ6WGava4AB3XdKctQg4w/4656354bd4f938b514212ee14a5f8489/Educational_Manuals_and_Employee_Handbook.png?q=75&h=600&w=600&fm=avif&fit=pad",

    "https://contentful.helloprint.com/wm1n7oady8a5/2R3oOrcpI9OGWTb0EOGtfH/6928e67a0db245d6e7acae7646462d4d/Branding_and_Portfolio_Showcases.png?q=75&h=600&w=600&fm=avif&fit=pad"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000); // change d’image toutes les 5 secondes
    return () => clearInterval(interval);
  }, []);


  // </Pub>
  const images = [
    "https://pixum-cms.imgix.net/JgFcIMwCqB6WnVXmvH5lC/69ecde3cd0c60a57c97335abfa72bc89/20230804_Jeanette_Hacet_Scrapbook_085.jpg?auto=compress,format&rect=129,322,1456,819&trim=false",

    "https://static-cse.canva.com/blob/1708424/poster.jpg",

    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlgmti91vA7VlciW8p74u9QIomhiADGM_8jg&s"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // change toutes les 3s
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="w-full h-full">

      {/* <Navbar /> */}
      <Navbar />
      {/* <Navbar /> */}

      {/* Hero Section avec carosel en background */}
      <section className="relative w-full h-screen overflow-hidden">
        <img
          src={imagess[currentIndex]}
          alt="Impression"
          className="absolute w-full h-full object-cover transition-opacity duration-1000"
        />

        {/* Overlay pour rendre le texte lisible */}
        <div className="absolute w-full h-full bg-black/40 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-white text-3xl md:text-5xl font-bold uppercase mb-4 animate-pulse">
            Impression rapide et fiable
          </h1>
          <p className="text-gray-200 text-sm md:text-lg mb-6">
            Commandez vos impressions en ligne et recevez-les chez vous rapidement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="btn bg-blue-500 text-white btn-lg">
              Commander maintenant
            </button>
            <button className="btn btn-ghost text-white hover:text-black btn-lg">
              En savoir plus
            </button>
          </div>
        </div>
      </section>
      {/* Hero Section avec carosel en background */}


      {/* Section Features / Services */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto space-y-8 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                src: "https://contentful.helloprint.com/wm1n7oady8a5/1R6wzLjQLR5hZ3hp10IHNz/a8287f5e901b46f0cd883f200ba2cb9b/9.png?q=75&h=400&w=600&fm=avif&fit=pad",
                legend: "Flayers"
              },
              {
                src: "https://contentful.helloprint.com/wm1n7oady8a5/7DKekXaY1h5D33SEHj0k69/d88281e071e8e17f0561b459098d855a/7.png?q=75&h=400&w=600&fm=avif&fit=pad",
                legend: "Dépliants"
              },
              {
                src: "https://contentful.helloprint.com/wm1n7oady8a5/4fAEb6QSfpjgr18UrvKEvJ/4ccc60f64b24ee3e91b09d60bd9e0392/145.png?q=75&h=400&w=600&fm=avif&fit=pad",
                legend: "Affiche et posters"
              },
              {
                src: "https://contentful.helloprint.com/wm1n7oady8a5/3pYvI48ae9lXcF0QRqXfEn/d254c5e0984f983485d7bd0f537f688c/Product_Blocks__4_.png?q=75&h=400&w=600&fm=avif&fit=pad",
                legend: "Kakémonos roll-up"
              },
              {
                src: "https://contentful.helloprint.com/wm1n7oady8a5/6JyAKqCCTq851vrBTJNnkS/fe6871e449ea53f61291a0615059115a/6.png?q=75&h=400&w=600&fm=avif&fit=pad",
                legend: "Cartes de visite"
              },
              {
                src: "https://contentful.helloprint.com/wm1n7oady8a5/4Qvz82BR3Mec0reo8vqVlJ/0047e496dcb6582acac472f48b7f286a/67.png?q=75&h=400&w=600&fm=avif&fit=pad",
                legend: "Banderoles"
              }
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col rounded-xl overflow-hidden shadow-md group"
              >
                <div className="relative">
                  <img
                    src={item.src}
                    alt={item.legend}
                    className="w-full h-64 object-cover"
                  />
                </div>
                {/* Légende sous l'image */}
                <p className="mt-2 text-center md:text-left md:ml-4 text-md font-bold mb-2 text-blue-500">
                  {item.legend}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Section Features / Services */}


      {/* Call to Action */}
      <section className="py-16 bg-blue-500 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Prêt à imprimer ?
        </h2>
        <p className="text-sm md:text-lg mb-6">
          Commencez votre commande dès maintenant et profitez d’une livraison rapide.
        </p>
        <button className="btn btn-lg btn-white text-blue-500 font-bold">
          Commander Maintenant
        </button>
      </section>
      {/* Call to Action */}


      {/* Description */}
      <section className="bg-base-100 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 md:px-8 mx-6">
          {/* Texte */}
          <div className="text-center md:text-left max-w-xl">
            <h1 className="text-blue-500 text-3xl md:text-3xl font-bold mb-4">
              Marque-pages : Le complément parfait
            </h1>
            <p className="text-base leading-relaxed mb-4">
              Imprimez vos documents, photos et créations en toute simplicité !
              Notre plateforme vous permet de commander vos impressions en ligne, sans vous déplacer.
              Choisissez le format, le papier et la finition, puis recevez vos impressions directement chez vous.
            </p>
            <p className="text-base leading-relaxed">
              Nous mettons à votre disposition une impression rapide, fiable et de haute qualité.
              Que ce soit pour vos projets professionnels, vos travaux scolaires ou vos souvenirs personnels, nous garantissons un service adapté à vos besoins.
              Avec notre équipe dédiée et des machines performantes, vos impressions sont entre de bonnes mains!😘
            </p>
          </div>

          {/* Image */}
          <div className="p-4 flex-shrink-0 w-full md:w-auto">
            <img
              className="w-full h-auto md:w-[600px] md:h-[450px] object-cover rounded-xl"
              src="https://contentful.helloprint.com/wm1n7oady8a5/6tZosaxqcUen7ZN4JHH8ni/7db38969cd5f20ccedaf788664244333/z-cards__1_.png?q=75&h=600&w=1200&fm=avif"
              alt="Fiable"
            />
          </div>

        </div>
      </section>
      {/* Description */}


      {/* Fromat */}
      <section className="py-12 bg-base-100">
        {/* <h1 className="text-center text-4xl mt-0 mb-6 font-bold">Autres format pour imprimer son livre</h1> */}
        <div className="container mx-auto space-y-8 px-4">

          {/* Grand image avec publication */}
          <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1551029506-0807df4e2031?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA3fHxsaXZyZXxlbnwwfHwwfHx8MA%3D%3D"
              alt="Grande présentation"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay sombre */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Publication */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
              <Camera className="w-12 h-12 text-blue-500 mb-4" />
              <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
                Votre créativité, notre impression
              </h1>
              <p className="mt-4 text-lg text-gray-200 max-w-2xl">
                Donnez vie à vos projets avec des impressions de haute qualité,
                rapides et fiables.
              </p>
              <button className="btn bg-blue-500 text-white mt-6 px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition">
                Commencer maintenant
              </button>
            </div>
          </div>

        </div>
      </section>
      {/* Fromat */}


      {/* Service */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Quelque Services d'Impression
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {items.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center gap-6">
                {/* Image */}
                <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* Texte */}
                <div className="w-full md:w-1/2 text-center md:text-left">
                  <item.icon className="w-10 h-10 text-blue-500 mb-3 mx-auto md:mx-0" />
                  <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Service */}


      {/* Commentaire */}
      <section className="py-12 bg-gray-50 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">
          Imprimez facilement avec Print.mg 🚀
        </h2>
        <p className="max-w-2xl mx-auto text-gray-600 mb-10">
          Chez <span className="font-semibold text-blue-800">Print.mg</span>, nous rendons l’impression
          en ligne simple, rapide et de haute qualité. Téléchargez vos fichiers, choisissez vos options,
          et recevez vos impressions directement chez vous.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Rapidité */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition">
            <Rocket className="text-blue-600 mb-4" size={40} />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Livraison rapide</h3>
            <p className="text-gray-600 text-sm">
              Commandez en quelques clics et recevez vos impressions en un temps record.
            </p>
          </div>

          {/* Qualité */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition">
            <Printer className="text-green-600 mb-4" size={40} />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Qualité garantie</h3>
            <p className="text-gray-600 text-sm">
              Profitez d’une impression professionnelle sur du papier premium et des couleurs éclatantes.
            </p>
          </div>

          {/* Simplicité */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition">
            <Smile className="text-yellow-500 mb-4" size={40} />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Simplicité</h3>
            <p className="text-gray-600 text-sm">
              Une plateforme intuitive, pensée pour vous faire gagner du temps et de l’énergie.
            </p>
          </div>
        </div>
      </section>
      {/* Commentaire */}


      {/* Pub */}
      <section className="py-16 bg-base-100">
        <h1 className="mb-6 text-center text-3xl md:text-4xl font-bold">Etes vous prêt😀?? Clické sur commander maintenant et faite vos choix</h1>
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-8 p-6 shadow-xl rounded-2xl bg-white">

          {/* Carrousel */}
          <div className="relative w-full md:w-1/2 h-64 rounded-xl overflow-hidden shadow-lg">
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Slide ${index}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"
                  }`}
              />
            ))}
          </div>

          {/* Texte marketing */}
          <div className="flex flex-col md:w-1/2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <Sparkles className="w-8 h-8 text-blue-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-800">Impression en ligne</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Gagnez du temps et bénéficiez d’une qualité irréprochable.
              Notre service d’impression en ligne vous permet de commander en quelques clics
              et de recevoir vos impressions sans vous déplacer.
            </p>
            <button className="btn bg-blue-500 text-white px-6 py-3 rounded-xl shadow-md hover:scale-105 transition">
              Commander maintenant
            </button>
          </div>
        </div>
      </section>
      {/* Pub */}

      <Slide />


      {/* Chat */}
      <button
        className="
          fixed bottom-6 right-6 
          bg-blue-500 text-white 
          w-14 h-14 rounded-full 
          shadow-xl flex items-center justify-center 
          hover:bg-blue-300 transition-transform transform hover:scale-110
          z-50
        "
        onClick={() => alert("Boîte de discussion à créer bientôt !")}
      >
        <MessageCircle className="w-10 10-8" />
      </button>
      {/* Chat */}

      <Footer />
    </div>
  );
}

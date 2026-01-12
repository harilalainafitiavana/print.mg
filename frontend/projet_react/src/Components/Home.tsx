import { useState, useEffect } from "react";
import { BookOpen, Ticket, Book, ImageIcon, Bookmark, Camera, Sparkles, Rocket, Printer, Smile } from "lucide-react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Slide from "./Slide_home";
import { Link } from "react-router-dom";
import Chat from "./Chat";
import RetourAccueil from "./RetourAccueil";
import Popup from "./Popup";
import { useTranslation } from "react-i18next";
import { motion } from 'framer-motion';

// ⭐ Définir le type pour vos items
interface ServiceItem {
  src: string;
  legend: string;
}

export default function HomePage() {
  const { t } = useTranslation();
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
    "https://aac.com.au/wp-content/uploads/2024/10/custom-flyers-blog.webp",
    "https://www.ooprint.fr/media/wysiwyg/wysiwyg/Flyers/flyers3.jpg",
    "https://graphics.tradeprintinguk.com/Blogs/Flyers/Blog-Flyers-Full-Width-1.webp"
  ];

  // Changement automatique toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [imagess.length]);

  // background image


  // </Pub>
  const images = [
    "https://pixum-cms.imgix.net/JgFcIMwCqB6WnVXmvH5lC/69ecde3cd0c60a57c97335abfa72bc89/20230804_Jeanette_Hacet_Scrapbook_085.jpg?auto=compress,format&rect=129,322,1456,819&trim=false",

    "https://static-cse.canva.com/blob/1708424/poster.jpg",

    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlgmti91vA7VlciW8p74u9QIomhiADGM_8jg&s"
  ];

  // Service
  const services: ServiceItem[] = [
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

      {/* Hero Section avec carosel en background */}
      <section className="relative w-full h-screen overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center transition-all duration-1000 ease-in-out"
          style={{ backgroundImage: `url(${imagess[currentIndex]})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-white text-2xl md:text-5xl font-bold uppercase mb-6">
              {t(`slider.texts.${currentIndex}`)}
            </h1>
            <p className="text-gray-200 text-lg md:text-xl mb-8 max-w-2xl">
              {t("slider.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* BOUTON COMMANDER - Version ultra-violet avec effet lumineux */}
              <Link
                to="/login"
                className="relative bg-gradient-to-r from-violet-500 to-pink-600 text-white font-bold py-4 px-6 rounded-full shadow-lg shadow-violet-500/40 hover:shadow-violet-500/60 transition-all duration-300 hover:scale-105 overflow-hidden group"
              >
                <span className="relative z-10">{t("slider.commander")}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </Link>

              {/* BOUTON TOUS LES PRODUITS - Garde le style original */}
              <Link
                to='/detaille'
                className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-bold py-4 px-6 rounded-full transition-all duration-300 hover:scale-105"
              >
                {t("slider.tousProduits")}
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Hero Section avec carosel en background */}


      {/* Section Features / Services */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white" id="services">
        <div className="container mx-auto space-y-12 px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center text-gray-900"
          >
            Nos Services
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {services.map((item: ServiceItem, index: number) => (  // ⭐ Typage des paramètres
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 70,
                  rotateY: 45,
                  scale: 0.85,
                  filter: "blur(10px)"
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  rotateY: 0,
                  scale: 1,
                  filter: "blur(0px)",
                  transition: {
                    duration: 1.1,
                    delay: index * 0.13,
                    ease: [0.23, 1, 0.32, 1]
                  }
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -12,
                  rotateY: 8,
                  scale: 1.04,
                  transition: { duration: 0.4 }
                }}
                className="flex flex-col rounded-2xl overflow-hidden shadow-2xl group bg-white transform-gpu"
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                <div className="relative overflow-hidden">
                  <motion.img
                    src={item.src}  // ✅ Plus d'erreur
                    alt={item.legend}  // ✅ Plus d'erreur
                    className="w-full h-64 object-cover"
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.6 }}
                  />
                  {/* <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" /> */}
                </div>
                <div className="p-6">
                  <motion.p
                    className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    {item.legend}{/* ✅ Plus d'erreur */}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Section Features / Services */}


      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-violet-500 to-pink-600 text-white text-center relative overflow-hidden">

        {/* Effet de particules ou d'éclats lumineux (optionnel) */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-4 h-4 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-1/4 right-20 w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("sectionCallToAction.titre")}
          </h2>
          <p className="text-sm md:text-lg mb-6 max-w-2xl mx-auto">
            {t("sectionCallToAction.texte")}
          </p>
          <Link
            to="/login"
            className="btn btn-lg bg-white py-2 text-violet-600 font-bold shadow-lg hover:shadow-2xl hover:shadow-violet-500/30 hover:scale-105 transition-all duration-300 transform hover:-translate-y-1 inline-block"
          >
            {t("sectionCallToAction.bouton")}
          </Link>
        </div>
      </section>
      {/* Call to Action */}


      {/* Description */}
      <section className="bg-base-100 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 md:px-8 mx-6">
          {/* Texte */}
          <div className="text-center md:text-left max-w-xl">
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 text-3xl md:text-3xl font-bold mb-4">
              {t("sectionMarquepages.titre")}
            </h1>
            <p className="text-base leading-relaxed mb-4">
              {t("sectionMarquepages.paragraphe1")}
            </p>
            <p className="text-base leading-relaxed">
              {t("sectionMarquepages.paragraphe2")}
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
              <Camera className="w-12 h-12 text-violet-400 mb-4" />
              <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
                {t("sectionCreativite.titre")}
              </h1>
              <p className="mt-4 text-lg text-gray-200 max-w-2xl">
                {t("sectionCreativite.texte")}
              </p>
              <Link
                to="/login"
                className="relative bg-gradient-to-r from-violet-500 via-purple-500 to-pink-600 text-white mt-6 px-8 py-4 rounded-xl font-bold shadow-xl shadow-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/60 transition-all duration-300 hover:scale-105 group overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {/* Optionnel: ajouter une icône */}
                  <Sparkles className="w-5 h-5" />
                  {t("sectionCreativite.bouton")}
                </span>

                {/* Effet de brillance qui traverse le bouton */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </Link>
            </div>
          </div>

        </div>
      </section>
      {/* Fromat */}


      {/* Service */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t("sectionServices.titre")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {items.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center gap-6">
                {/* Image */}
                <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={item.img}
                    alt={t(`sectionServices.items.${index}.title`)}
                    className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* Texte */}
                <div className="w-full md:w-1/2 text-center md:text-left">
                  <item.icon className="w-10 h-10 text-violet-500 mb-3 mx-auto md:mx-0" />
                  <h3 className="text-2xl font-semibold mb-3">
                    {t(`sectionServices.items.${index}.title`)}
                  </h3>
                  <p className="text-gray-600">
                    {t(`sectionServices.items.${index}.text`)}
                  </p>
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
          {t("sectionImpression.titre")}
        </h2>
        <p className="max-w-2xl mx-auto text-gray-600 mb-10">
          {t("sectionImpression.description", { platform: "Print.mg" })}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Rapidité */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition">
            <Rocket className="text-blue-600 mb-4" size={40} />
            <h3 className="text-lg font-semibold text-violet-900 mb-2">
              {t("sectionImpression.cards.0.title")}
            </h3>
            <p className="text-gray-600 text-sm">
              {t("sectionImpression.cards.0.text")}
            </p>
          </div>

          {/* Qualité */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition">
            <Printer className="text-green-600 mb-4" size={40} />
            <h3 className="text-lg font-semibold text-violet-900 mb-2">
              {t("sectionImpression.cards.1.title")}
            </h3>
            <p className="text-gray-600 text-sm">
              {t("sectionImpression.cards.1.text")}
            </p>
          </div>

          {/* Simplicité */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition">
            <Smile className="text-yellow-500 mb-4" size={40} />
            <h3 className="text-lg font-semibold text-violet-900 mb-2">
              {t("sectionImpression.cards.2.title")}
            </h3>
            <p className="text-gray-600 text-sm">
              {t("sectionImpression.cards.2.text")}
            </p>
          </div>
        </div>
      </section>
      {/* Commentaire */}


      {/* Pub */}
      <section className="py-16 bg-base-100">
        <h1 className="mb-6 text-center text-3xl md:text-4xl font-bold">
          {t("sectionPrêt.titre")}
        </h1>
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-8 p-6 shadow-xl rounded-2xl bg-white">

          {/* Carrousel */}
          <div className="relative w-full md:w-1/2 h-64 rounded-xl overflow-hidden shadow-lg">
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Slide ${index}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </div>

          {/* Texte marketing */}
          <div className="flex flex-col md:w-1/2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <Sparkles className="w-8 h-8 text-violet-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t("sectionPrêt.subtitle")}
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              {t("sectionPrêt.description")}
            </p>
            <Link
              to="/login"
              className="btn bg-gradient-to-r from-violet-500 to-pink-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-300"
            >
              {t("sectionPrêt.btn")}
            </Link>
          </div>
        </div>
      </section>
      {/* Pub */}

      {/* Slide */}
      <Slide />

      {/* Chat */}
      <Chat />

      {/* Retour vers le haut */}
      <RetourAccueil />

      {/* Popup de publication */}
      <Popup />

      {/* Footer */}
      <Footer />
    </div>
  );
}

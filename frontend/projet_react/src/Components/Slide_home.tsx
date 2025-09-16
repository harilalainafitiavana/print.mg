import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  
  // Données des images avec titres et descriptions
  const slides = [
    {
      url: "https://www.atelierduloisircreatif.fr/wp-content/uploads/2022/07/l-atelier-carterie.jpg",
      title: "Cartes de Visite Élégantes",
      description: "Impression haute qualité sur papier premium",
      size: "w-80 h-72"
    },
    {
      url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      title: "Flyers Publicitaires",
      description: "Attirez l'attention avec nos designs percutants",
      size: "w-64 h-72"
    },
    {
      url: "https://t4.ftcdn.net/jpg/00/39/74/11/360_F_39741195_6SiI6AoiHkuGun3PRzqUCg2HMqbILBAI.jpg",
      title: "Affiches Grand Format",
      description: "Des impressions vibrantes pour tout événement",
      size: "w-72 h-72"
    },
    {
      url: "https://facimprimeur.fr/wp-content/uploads/2023/12/impression-A5-300x300.jpg",
      title: "Stickers Personnalisés",
      description: "Personnalisez vos produits avec nos stickers",
      size: "w-64 h-72"
    },
    {
      url: "https://www.tabac-presse-des-arcades.com/wp-content/uploads/2020/12/113901484.jpg",
      title: "Brochures Professionnelles",
      description: "Présentez votre entreprise avec élégance",
      size: "w-80 h-72"
    },
    {
      url: "https://impression-nancy.com/wp-content/uploads/2022/08/pochette.png",
      title: "Emballages Sur Mesure",
      description: "Des emballages qui font la différence",
      size: "w-72 h-72"
    },
    {
      url: "https://papieretlatte.com/cdn/shop/collections/20230717_113802-01.webp?v=1689691267&width=2400",
      title: "Photos Haute Définition",
      description: "Imprimez vos souvenirs en qualité premium",
      size: "w-64 h-72"
    }
  ];

  // Nombre d'images visibles à la fois
  const visibleSlides = 3;
  const maxIndex = slides.length - visibleSlides;

  // Navigation entre les slides
  const nextSlide = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Vérifier si on peut naviguer vers la gauche ou la droite
  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < maxIndex;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">
        Nos Réalisations d'Impression
      </h2>
      
      <div className="relative overflow-hidden">
        {/* Conteneur principal avec défilement horizontal */}
        <div 
          ref={sliderRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / visibleSlides)}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`flex-shrink-0 px-3 transition-all duration-300 ${slide.size}`}
            >
              <div
                className="relative rounded-2xl overflow-hidden shadow-lg h-full"
                style={{ 
                  backgroundImage: `url(${slide.url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Overlay avec texte */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{slide.title}</h3>
                  <p className="text-sm">{slide.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bouton précédent - visible seulement si on peut aller à gauche */}
        {canGoLeft && (
          <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 rounded-full shadow-md hover:bg-white transition-all"
          >
            <ChevronLeft size={28} className="text-blue-800" />
          </button>
        )}
        
        {/* Bouton suivant - visible seulement si on peut aller à droite */}
        {canGoRight && (
          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 rounded-full shadow-md hover:bg-white transition-all"
          >
            <ChevronRight size={28} className="text-blue-800" />
          </button>
        )}
        
        {/* Indicateurs de slide (points en bas) */}
        <div className="flex justify-center mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`mx-1.5 h-3 w-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-blue-800' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // 🔹 Détecter si l'utilisateur a scrollé
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // 🔹 Fonction pour remonter tout en haut (vers ta section principale)
  const scrollToTop = () => {
    const topSection = document.querySelector("section"); // prend le <section> principal
    if (topSection) {
      topSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" }); // fallback
    }
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="
            fixed bottom-6 left-6 
            bg-violet-700 text-white 
            w-12 h-12 rounded-full 
            shadow-lg flex items-center justify-center 
            hover:bg-violet-400 transition-transform transform hover:scale-110
            z-50
          "
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </>
  );
}

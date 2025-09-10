import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 py-10 mt-12 border-t">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Logo + description */}
        <div>
          <h2 className="text-2xl font-bold text-blue-800 mb-3">Print.mg</h2>
          <p className="text-sm text-gray-600">
            Votre solution d’impression en ligne simple, rapide et de qualité à Madagascar.
            Commandez vos impressions en quelques clics et recevez-les chez vous !
          </p>
        </div>

        {/* Liens rapides */}
        <div>
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Liens rapides</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-blue-600 transition">Accueil</a></li>
            <li><a href="/services" className="hover:text-blue-600 transition">Services</a></li>
            <li><a href="/about" className="hover:text-blue-600 transition">À propos</a></li>
            <li><a href="/contact" className="hover:text-blue-600 transition">Contact</a></li>
          </ul>
        </div>

        {/* Réseaux sociaux */}
        <div>
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Suivez-nous</h3>
          <div className="flex space-x-4">
            <a href="#" className="p-2 bg-blue-600 text-white rounded-full hover:scale-110 transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="p-2 bg-pink-500 text-white rounded-full hover:scale-110 transition">
              <Instagram size={20} />
            </a>
            <a href="#" className="p-2 bg-sky-400 text-white rounded-full hover:scale-110 transition">
              <Twitter size={20} />
            </a>
            <a href="mailto:contact@print.mg" className="p-2 bg-gray-700 text-white rounded-full hover:scale-110 transition">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-sm mt-10 border-t pt-4">
        © {new Date().getFullYear()} Print.mg — Tous droits réservés.
      </div>
    </footer>
  );
}

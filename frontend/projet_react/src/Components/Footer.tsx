import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 py-10 mt-12 border-t">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Logo + description */}
        <div>
          <h2 className="text-2xl font-bold text-blue-800 mb-3">Print.mg</h2>
          <p className="text-md text-gray-600">
            Votre solution d'impression en ligne simple, rapide et de qualité à Madagascar.
            Commandez vos impressions en quelques clics et recevez-les chez vous !
          </p>
          <div className="flex space-x-4 mt-5">
            <a href="#" className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition">
              <Instagram size={20} />
            </a>
            <a href="#" className="p-2 bg-sky-400 text-white rounded-full hover:bg-sky-500 transition">
              <Twitter size={20} />
            </a>
            <a href="mailto:contact@print.mg" className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition">
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* Liens rapides */}
        <div className="md:ml-10">
          <h3 className="text-xl font-bold text-blue-800 mb-3">Liens rapides</h3>
          <ul className="space-y-1 text-md">
            <li><a href="/" className="hover:text-blue-800 transition flex items-center">Accueil</a></li>
            <li><a href="/services" className="hover:text-blue-800 transition flex items-center">Services</a></li>
            <li><a href="/about" className="hover:text-blue-800 transition flex items-center">À propos</a></li>
            <li><a href="/contact" className="hover:text-blue-800 transition flex items-center">Contact</a></li>
          </ul>
        </div>

        {/* Services populaires */}
        <div>
          <h3 className="text-xl font-bold text-blue-800 mb-3">Services populaires</h3>
          <ul className="space-y-2 text-md">
            <li><a href="#" className="hover:text-blue-800 transition flex items-center">Cartes de visite</a></li>
            <li><a href="#" className="hover:text-blue-800 transition flex items-center">Flyers & Brochures</a></li>
            <li><a href="#" className="hover:text-blue-800 transition flex items-center">Affiches</a></li>
            <li><a href="#" className="hover:text-blue-800 transition flex items-center">Stickers</a></li>
            <li><a href="#" className="hover:text-blue-800 transition flex items-center">Impression photo</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-bold text-blue-800 mb-4">Contactez-nous</h3>
          <ul className="space-y-3 text-gray-700">
            <li>
              <a
                href="tel:+33336691909"
                className="hover:text-blue-800 transition flex items-center gap-2"
              >
                <Phone size={18} className="text-blue-600" />
                <span>033 66 919 09 / 034 79 647 92</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-blue-800 transition flex items-center gap-2"
              >
                <Mail size={18} className="text-blue-600" />
                <span>contact@print.mg</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-blue-800 transition flex items-center gap-2"
              >
                <Facebook size={18} className="text-blue-600" />
                <span>Facebook Print.mg</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-blue-800 transition flex items-center gap-2"
              >
                <MapPin size={18} className="text-blue-600" />
                <span>BII A5 Mahazo Ambatomaro</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-sm mt-10 border-t pt-4 max-w-6xl mx-auto px-6">
        © {new Date().getFullYear()} Print.mg — Tous droits réservés.
      </div>
    </footer>
  );
}
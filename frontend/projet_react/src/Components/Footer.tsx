import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"



export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-white text-gray-700 py-10 mt-12 border-t">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Logo + description */}
        <div>
          <h2 className="text-2xl font-bold text-violet-800 mb-3">{t("footer.logoTitle")}</h2>
          <p className="text-md text-gray-600">{t("footer.description")}</p>
          <div className="flex space-x-4 mt-5">
            <a href="#" className="p-2 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition">
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
          <h3 className="text-xl font-bold text-violet-800 mb-3">{t("footer.quickLinksTitle")}</h3>
          <ul className="space-y-1 text-md">
            <li>
              <Link to="/" className="hover:text-violet-800 transition flex items-center">{t("footer.quickLinks.home")}</Link>
            </li>
            <li>
              <Link to="/#services" className="hover:text-violet-800 transition flex items-center">{t("footer.quickLinks.services")}</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-violet-800 transition flex items-center">{t("footer.quickLinks.about")}</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-violet-800 transition flex items-center">{t("footer.quickLinks.contact")}</Link>
            </li>
          </ul>
        </div>

        {/* Services populaires */}
        <div>
          <h3 className="text-xl font-bold text-violet-800 mb-3">{t("footer.popularServicesTitle")}</h3>
          <ul className="space-y-2 text-md">
            <li><a href="#" className="hover:text-violet-800 transition flex items-center">{t("footer.popularServices.businessCards")}</a></li>
            <li><a href="#" className="hover:text-violet-800 transition flex items-center">{t("footer.popularServices.flyersBrochures")}</a></li>
            <li><a href="#" className="hover:text-violet-800 transition flex items-center">{t("footer.popularServices.posters")}</a></li>
            <li><a href="#" className="hover:text-violet-800 transition flex items-center">{t("footer.popularServices.stickers")}</a></li>
            <li><a href="#" className="hover:text-violet-800 transition flex items-center">{t("footer.popularServices.photoPrinting")}</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-bold text-violet-800 mb-4">{t("footer.contactTitle")}</h3>
          <ul className="space-y-3 text-gray-700">
            <li>
              <a href="tel:+33336691909" className="hover:text-violet-800 transition flex items-center gap-2">
                <Phone size={18} className="text-violet-600" />
                <span>{t("footer.contactInfo.phone")}</span>
              </a>
            </li>
            <li>
              <a href="mailto:contact@print.mg" className="hover:text-violet-800 transition flex items-center gap-2">
                <Mail size={18} className="text-violet-600" />
                <span>{t("footer.contactInfo.email")}</span>
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-violet-800 transition flex items-center gap-2">
                <Facebook size={18} className="text-violet-600" />
                <span>{t("footer.contactInfo.facebook")}</span>
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-violet-800 transition flex items-center gap-2">
                <MapPin size={18} className="text-violet-600" />
                <span>{t("footer.contactInfo.address")}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-sm mt-10 border-t pt-4 max-w-6xl mx-auto px-6">
        {t("footer.copyright", { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}


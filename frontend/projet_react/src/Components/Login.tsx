import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Printer, Truck, Shield, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Slide_show from './Slide_show';
import { useGoogleLogin } from '@react-oauth/google';


const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  // État qui sert à indiquer si le formulaire est en cours de traitement (utile pour un bouton "Loading…").
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1️⃣ Récupérer le token
      const res = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.detail) setError(data.detail);
        else if (data.email) setError(data.email);
        else if (data.password) setError(data.password);
        else setError("Email ou mot de passe incorrect 😓");
        return;
      }

      // 2️⃣ Récupérer les infos utilisateur
      const userRes = await fetch('http://localhost:8000/api/me/', {
        headers: { Authorization: `Bearer ${data.access}` },
      });
      const userData = await userRes.json();

      // 3️⃣ Stocker token + rôle
      const rememberMe = (document.getElementById('remember-me') as HTMLInputElement)?.checked;
      if (rememberMe) {
        localStorage.setItem('token', data.access);
        localStorage.setItem('role', userData.role);
      } else {
        sessionStorage.setItem('token', data.access);
        sessionStorage.setItem('role', userData.role);
      }

      // 4️⃣ Rediriger selon rôle
      if (userData.role === 'ADMIN') navigate('/dashboard-admin');
      else navigate('/dashboard-user');

    } catch (err) {
      console.error(err);
      setError("Erreur serveur, veuillez réessayer 🙏😪");
    } finally {
      setLoading(false);
    }
  };


  // Google Login
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log("handleGoogleLogin triggered", tokenResponse);

        const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const profile = await profileRes.json();
        console.log("Google profile", profile);

        // Envoi au backend
        const backendRes = await fetch('http://localhost:8000/api/google-login/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: profile.email,
            nom: profile.given_name || 'Utilisateur',
            prenom: profile.family_name || '',
            profil: profile.picture || null,
          }),
        });
        const data = await backendRes.json();

        // Stockage token et rôle USER
        localStorage.setItem('token', data.access);
        localStorage.setItem('role', 'USER');        

        // ⚡ Redirection directe
        window.location.href = '/dashboard-user';
      } catch (err) {
        console.error('Google login failed:', err);
        setError('Connexion Google échouée 😓');
      }
    },
    onError: () => setError('Connexion Google échouée 😓'),
    flow: 'implicit',
  });



  return (
    <div className="min-h-screen flex">
      {/* Partie droite - Carrousel d'images */}

      <Slide_show />

      {/* Partie gauche - Formulaire de connexion */}
      <div className="w-full md:w-1/2 bg-base-200 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-blue-500 mb-2">Print.mg</h1>
            <p className="text-base-content">Connectez-vous à votre compte</p>
          </div>

          {error && (
            <div className='mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded'>
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-base-content mb-1">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  // autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-base-content mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  // autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-base-content">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-blue-500 hover:text-blue-600 transition">
                  Mot de passe oublié?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                <span className="font-semibold">{loading ? "Connexion..." : "Se connecter"}</span>
              </button>
            </div>
          </form>


          <div className="w-full flex justify-center mt-5">
            <button
              type="button"
              onClick={() => googleLogin()} // appel direct pour éviter popup bloqué
              className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Globe className="w-5 h-5 text-blue-500" />
              <span className="font-semibold">Se connecter avec Google</span>
            </button>
          </div>


          <div className="mt-8 text-center">
            <p className="text-sm text-base-content">
              Vous n'avez pas de compte?{' '}
              <Link to="/register" className="font-medium text-blue-500 hover:text-blue-600 transition">
                Créer un compte
              </Link>
            </p>
          </div>

          <div className="mt-10 border-t border-gray-200 pt-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <Printer className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Impression haute qualité</p>
              </div>
              <div className="text-center">
                <Truck className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Livraison rapide</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Paiement sécurisé</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
import { useState } from 'react';
import { saveToken } from '../auth';
import { api } from '../api';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await api('/auth/login', 'POST', { email, password });

    if (!res.ok) {
      setError(res.error || 'Erreur de connexion');
      setLoading(false);
      return;
    }

    saveToken(res.token);
    nav('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 p-6">
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-xl w-full max-w-sm text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">RevIT</h1>
        <p className="text-center mb-6 opacity-80">Connexion</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-xl bg-white/20 focus:bg-white/30 outline-none"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full p-3 rounded-xl bg-white/20 focus:bg-white/30 outline-none"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {error && (
            <div className="text-red-300 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition font-semibold"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm opacity-80">
          Pas de compte ?{' '}
          <Link to="/register" className="text-yellow-300 font-semibold">
            S’inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}

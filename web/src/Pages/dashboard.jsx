import { useEffect, useState } from 'react';
import { api } from '../api';
import { getToken } from '../auth';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    const token = getToken();
    if (!token) {
      nav('/');
      return;
    }

    const res = await api('/user/me', 'GET');
    if (!res.ok) {
      nav('/');
      return;
    }

    setUser(res.user);

    const s = await api('/user/stats', 'GET');
    if (s.ok) setStats(s.stats);

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Chargement...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Bonjour, {user.name} 👋</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-xl">
          <p className="text-sm opacity-80">Streak</p>
          <p className="text-2xl font-bold">{stats?.streak || 0} 🔥</p>
        </div>

        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-xl">
          <p className="text-sm opacity-80">Score global</p>
          <p className="text-2xl font-bold">{stats?.score || 0} ⭐</p>
        </div>
      </div>

      <div className="space-y-4">
        <Link
          to="/revision"
          className="block p-4 bg-indigo-500 rounded-xl text-center font-semibold hover:bg-indigo-600 transition"
        >
          Révision IA
        </Link>

        <Link
          to="/leaderboard"
          className="block p-4 bg-yellow-500 rounded-xl text-center font-semibold hover:bg-yellow-600 transition"
        >
          Classement mondial
        </Link>

        <Link
          to="/groups"
          className="block p-4 bg-pink-500 rounded-xl text-center font-semibold hover:bg-pink-600 transition"
        >
          Groupes d’étude
        </Link>
      </div>
    </div>
  );
}

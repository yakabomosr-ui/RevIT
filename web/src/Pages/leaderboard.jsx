import { useEffect, useState } from 'react';
import { api } from '../api';
import { Link } from 'react-router-dom';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadLeaderboard() {
    const res = await api('/leaderboard', 'GET');
    if (res.ok) {
      setLeaders(res.leaders || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Chargement du classement...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Classement mondial 🌍</h1>

      <div className="space-y-4">
        {leaders.map((u, i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur-xl p-4 rounded-xl flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold">#{i + 1}</span>
              <span className="font-semibold">{u.name}</span>
            </div>

            <div className="text-yellow-300 font-bold">{u.score} ⭐</div>
          </div>
        ))}
      </div>

      <Link
        to="/dashboard"
        className="block mt-6 p-3 bg-indigo-500 rounded-xl text-center font-semibold hover:bg-indigo-600 transition"
      >
        Retour
      </Link>
    </div>
  );
}

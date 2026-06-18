import { useEffect, useState } from 'react';
import { api } from '../api';
import { Link } from 'react-router-dom';

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  async function loadGroups() {
    const res = await api('/groups', 'GET');
    if (res.ok) {
      setGroups(res.groups || []);
    }
    setLoading(false);
  }

  async function createGroup() {
    if (!groupName.trim()) return;

    const res = await api('/groups/create', 'POST', { name: groupName });
    if (res.ok) {
      setMessage('Groupe créé avec succès 🎉');
      setGroupName('');
      loadGroups();
    } else {
      setMessage(res.error || 'Erreur lors de la création');
    }
  }

  async function joinGroup() {
    if (!joinCode.trim()) return;

    const res = await api('/groups/join', 'POST', { code: joinCode });
    if (res.ok) {
      setMessage('Groupe rejoint 🎉');
      setJoinCode('');
      loadGroups();
    } else {
      setMessage(res.error || 'Code invalide');
    }
  }

  useEffect(() => {
    loadGroups();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Chargement des groupes...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Groupes d’étude 👥</h1>

      {message && (
        <div className="bg-white/20 p-3 rounded-xl text-center mb-4">
          {message}
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-xl p-4 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-3">Créer un groupe</h2>
        <input
          type="text"
          placeholder="Nom du groupe"
          className="w-full p-3 rounded-xl bg-white/20 focus:bg-white/30 outline-none mb-3"
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
        />
        <button
          onClick={createGroup}
          className="w-full p-3 bg-indigo-500 rounded-xl font-semibold hover:bg-indigo-600 transition"
        >
          Créer
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-xl p-4 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-3">Rejoindre un groupe</h2>
        <input
          type="text"
          placeholder="Code du groupe"
          className="w-full p-3 rounded-xl bg-white/20 focus:bg-white/30 outline-none mb-3"
          value={joinCode}
          onChange={e => setJoinCode(e.target.value)}
        />
        <button
          onClick={joinGroup}
          className="w-full p-3 bg-yellow-500 rounded-xl font-semibold hover:bg-yellow-600 transition"
        >
          Rejoindre
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-3">Mes groupes</h2>

      <div className="space-y-4">
        {groups.length === 0 && (
          <p className="opacity-80">Tu n’as encore rejoint aucun groupe.</p>
        )}

        {groups.map((g, i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur-xl p-4 rounded-xl flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{g.name}</p>
              <p className="text-sm opacity-70">Code : {g.code}</p>
            </div>
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

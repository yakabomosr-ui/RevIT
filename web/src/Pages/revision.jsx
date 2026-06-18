import { useState } from 'react';
import { api } from '../api';
import { Link } from 'react-router-dom';

export default function Revision() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function sendToAI() {
    if (!file && !prompt.trim()) {
      setMessage('Ajoute un PDF ou écris une question.');
      return;
    }

    setLoading(true);
    setMessage('');
    setResult('');

    const form = new FormData();
    if (file) form.append('pdf', file);
    form.append('prompt', prompt);

    const res = await api('/ai/revision', 'POST', form, true);

    if (!res.ok) {
      setMessage(res.error || 'Erreur lors de la génération');
      setLoading(false);
      return;
    }

    setResult(res.output);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Révision IA 🤖</h1>

      {message && (
        <div className="bg-white/20 p-3 rounded-xl text-center mb-4">
          {message}
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-xl p-4 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-3">Importer un PDF</h2>

        <input
          type="file"
          accept="application/pdf"
          className="w-full p-3 rounded-xl bg-white/20 focus:bg-white/30 outline-none mb-3"
          onChange={e => setFile(e.target.files[0])}
        />

        {file && (
          <p className="text-sm opacity-80 mb-3">
            Fichier sélectionné : {file.name}
          </p>
        )}

        <textarea
          placeholder="Écris ta question, ton exercice, ou ta demande…"
          className="w-full p-3 rounded-xl bg-white/20 focus:bg-white/30 outline-none h-32 mb-3"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />

        <button
          onClick={sendToAI}
          disabled={loading}
          className="w-full p-3 bg-yellow-500 rounded-xl font-semibold hover:bg-yellow-600 transition"
        >
          {loading ? 'Analyse en cours...' : 'Envoyer à l’IA'}
        </button>
      </div>

      {result && (
        <div className="bg-white/10 backdrop-blur-xl p-4 rounded-xl whitespace-pre-wrap">
          <h2 className="text-xl font-semibold mb-3">Résultat</h2>
          <p>{result}</p>
        </div>
      )}

      <Link
        to="/dashboard"
        className="block mt-6 p-3 bg-indigo-500 rounded-xl text-center font-semibold hover:bg-indigo-600 transition"
      >
        Retour
      </Link>
    </div>
  );
}

import React, { useEffect, useState } from "react";

export default function Aides() {
  const [fonds, setFonds] = useState([]);
  const [banques, setBanques] = useState([]);
  const [search, setSearch] = useState("");
  const [categorie, setCategorie] = useState("all");
  const [page, setPage] = useState(1);
  const [favoris, setFavoris] = useState([]);

  const ITEMS_PER_PAGE = 4;

  // Charger les données depuis ton backend
  useEffect(() => {
  fetch("https://revit-sd4e.onrender.com/api/fonds-aide")
    .then((res) => res.json())
    .then((data) => setFonds(data.data))
    .catch((err) => console.error("Erreur fonds :", err));

  fetch("https://revit-sd4e.onrender.com/api/banques-aide")
    .then((res) => res.json())
    .then((data) => setBanques(data.data))
    .catch((err) => console.error("Erreur banques :", err));
}, []);


  // Ajouter / retirer des favoris
  const toggleFavori = (item) => {
    if (favoris.some((f) => f.id === item.id)) {
      setFavoris(favoris.filter((f) => f.id !== item.id));
    } else {
      setFavoris([...favoris, item]);
    }
  };

  // Filtrage + recherche
  const filtrer = (liste) => {
    return liste
      .filter((item) =>
        item.nom.toLowerCase().includes(search.toLowerCase())
      )
      .filter((item) =>
        categorie === "all" ? true : item.categorie === categorie
      );
  };

  const fondsFiltres = filtrer(fonds);
  const banquesFiltres = filtrer(banques);

  // Pagination
  const paginer = (liste) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return liste.slice(start, start + ITEMS_PER_PAGE);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Aides disponibles</h1>

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher une aide..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      {/* Catégories */}
      <select
        value={categorie}
        onChange={(e) => setCategorie(e.target.value)}
        style={{
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      >
        <option value="all">Toutes les catégories</option>
        <option value="education">Éducation</option>
        <option value="logement">Logement</option>
        <option value="santé">Santé</option>
        <option value="financement">Financement</option>
      </select>

      {/* SECTION FONDS D’AIDE */}
      <h2>Fonds d’aide</h2>
      {paginer(fondsFiltres).map((item) => (
        <div
          key={item.id}
          style={{
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "10px",
            background: "#f5f5f5",
          }}
        >
          <h3>{item.nom}</h3>
          <p>{item.description}</p>

          {/* Bouton détails */}
          <button
            onClick={() => alert(JSON.stringify(item, null, 2))}
            style={{
              padding: "8px 12px",
              marginRight: "10px",
              borderRadius: "6px",
              background: "#007bff",
              color: "white",
              border: "none",
            }}
          >
            Voir détails
          </button>

          {/* Bouton favoris */}
          <button
            onClick={() => toggleFavori(item)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              background: favoris.some((f) => f.id === item.id)
                ? "gold"
                : "#ccc",
              border: "none",
            }}
          >
            ⭐ Favori
          </button>
        </div>
      ))}

      {/* SECTION BANQUES D’AIDE */}
      <h2>Banques d’aide</h2>
      {paginer(banquesFiltres).map((item) => (
        <div
          key={item.id}
          style={{
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "10px",
            background: "#f5f5f5",
          }}
        >
          <h3>{item.nom}</h3>
          <p>{item.description}</p>

          <button
            onClick={() => alert(JSON.stringify(item, null, 2))}
            style={{
              padding: "8px 12px",
              marginRight: "10px",
              borderRadius: "6px",
              background: "#007bff",
              color: "white",
              border: "none",
            }}
          >
            Voir détails
          </button>

          <button
            onClick={() => toggleFavori(item)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              background: favoris.some((f) => f.id === item.id)
                ? "gold"
                : "#ccc",
              border: "none",
            }}
          >
            ⭐ Favori
          </button>
        </div>
      ))}

      {/* PAGINATION */}
      <div style={{ marginTop: "20px" }}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          style={{
            padding: "10px",
            marginRight: "10px",
            borderRadius: "6px",
          }}
        >
          ◀️ Précédent
        </button>

        <button
          onClick={() => setPage(page + 1)}
          style={{
            padding: "10px",
            borderRadius: "6px",
          }}
        >
          Suivant ▶️
        </button>
      </div>
    </div>
  );
}

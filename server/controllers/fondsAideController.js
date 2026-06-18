exports.getFondsAide = async (req, res) => {
  try {
    const data = [
      { id: 1, nom: "Fonds d’aide A", description: "Description du fonds A" },
      { id: 2, nom: "Fonds d’aide B", description: "Description du fonds B" }
    ];

    res.json({ ok: true, data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

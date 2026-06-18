exports.getBanquesAide = (req, res) => {
  res.json({
    ok: true,
    data: [
      { id: 1, nom: "Banque d’aide A", description: "Description de la banque A" },
      { id: 2, nom: "Banque d’aide B", description: "Description de la banque B" }
    ]
  });
};

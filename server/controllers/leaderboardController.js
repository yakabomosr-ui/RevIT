const User = require('../models/User');

exports.globalLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ globalScore: -1 })
      .limit(100);

    return res.json({ ok: true, users });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

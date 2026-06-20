const Group = require('../models/Group');
const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');

exports.createGroup = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nom du groupe requis' });
    }

    const inviteCode = uuidv4().slice(0, 6);

    const group = await Group.create({
      name,
      inviteCode,
      members: [req.user]
    });

    await User.findByIdAndUpdate(req.user, {
      $push: { groups: group._id }
    });

    return res.json({ ok: true, group });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code d’invitation requis' });
    }

    const group = await Group.findOne({ inviteCode: code });

    if (!group) {
      return res.status(404).json({ error: 'Groupe introuvable' });
    }

    if (!group.members.includes(req.user)) {
      group.members.push(req.user);
      await group.save();

      await User.findByIdAndUpdate(req.user, {
        $push: { groups: group._id }
      });
    }

    return res.json({ ok: true, group });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  inviteCode: { type: String, required: true, unique: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sessions: { type: Array, default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);

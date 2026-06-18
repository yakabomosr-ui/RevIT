const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String },
  country: { type: String },
  streak: { type: Number, default: 0 },
  globalScore: { type: Number, default: 0 },
  stats: { type: Object, default: {} },
  errors: { type: Array, default: [] },
  sessions: { type: Array, default: [] },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
  name: { type: Object, required: true },
  slug: { type: String, unique: true, index: true },
  description: { type: Object },
  icon: { type: String },
  url: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  published: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('App', appSchema);

const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bannerTitle: { type: Object },
  bannerSubtitle: { type: Object },
  role: { type: Object, required: true },
  heroPrefix: { type: Object },
  heroSuffix: { type: Object },
  summary: { type: Object, required: true },
  about: { type: Object, required: true },
  avatarUrl: { type: String },
  titles: [{ type: Object }],
  location: { type: Object },
  email: { type: String },
  phone: { type: String },
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    website: String,
  },
  resumeUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);

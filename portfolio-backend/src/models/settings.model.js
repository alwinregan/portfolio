const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Portfolio 2026' },
  metaTitle: { type: String },
  metaDescription: { type: String },
  gaId: { type: String },
  featureToggles: { type: Object, default: {
    showProjects: true,
    showSkills: true,
    showContactForm: true,
    showExperience: true,
    showCertifications: true,
    showApps: true,
    enableBlog: true,
  }},
  metadata: { type: Object, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);

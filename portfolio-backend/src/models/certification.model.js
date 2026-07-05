const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  issueDate: { type: String },
  expiryDate: { type: String },
  credentialId: { type: String },
  credentialUrl: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Certification', certificationSchema);

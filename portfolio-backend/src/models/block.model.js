const mongoose = require('mongoose');

const BLOCK_TYPES = ['text', 'markdown', 'image', 'video', 'gallery', 'code', 'embed', 'divider', 'callout'];

const blockSchema = new mongoose.Schema({
  type: { type: String, enum: BLOCK_TYPES, required: true },
  content: { type: Object, required: true },
  imageUrl: { type: String },
  videoUrl: { type: String },
  imageUrls: [{ type: String }],
  code: { type: String },
  language: { type: String },
  tags: [{ type: String }],
  parentId: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Block', blockSchema);

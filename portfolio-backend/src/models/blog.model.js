const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  excerpt: { type: String },
  content: { type: String },
  coverImage: { type: String },
  tags: [{ type: String }],
  category: { type: String },
  author: { type: String },
  readTime: { type: Number, default: 5 },
  views: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: false },
  publishedAt: { type: Date },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);

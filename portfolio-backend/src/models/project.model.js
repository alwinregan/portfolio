const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: Object, required: true },
  slug: { type: String, unique: true },
  description: { type: Object, required: true },
  longDescription: { type: Object },
  summary: { type: String },
  client: { type: String },
  role: { type: String },
  year: { type: Number },
  techStack: [{ type: String }],
  tags: [{ type: String }],
  body: { type: String },
  imageUrl: { type: String },
  images: [String],
  liveUrl: { type: String },
  githubUrl: { type: String },
  pdfUrl: { type: String },
  caseStudy: { type: Object },
  projectType: { type: String, enum: ['work', 'personal'], default: 'work' },
  featured: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

projectSchema.index({ slug: 1 }, { unique: true });
projectSchema.index({ published: 1, order: 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ featured: 1 });

module.exports = mongoose.model('Project', projectSchema);

const router = require('express').Router();
const auth = require('../middleware/auth');
const Project = require('../models/project.model');
const { generateSlug, ensureUniqueSlug } = require('../utils/slug');

// Public
router.get('/projects', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const projects = await Project.find({ isActive: true, published: true })
      .sort({ order: 1 })
      .limit(limit)
      .skip(offset);
    res.json({ success: true, message: 'Projects retrieved', data: projects });
  } catch (err) { next(err); }
});

router.get('/projects/:slug', async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, published: true, isActive: true });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) { next(err); }
});

// Admin
router.get('/admin/projects', auth, async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1 });
    res.json({ success: true, data: projects });
  } catch (err) { next(err); }
});

router.get('/admin/projects/:id', auth, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) { next(err); }
});

router.post('/admin/projects', auth, async (req, res, next) => {
  try {
    const body = req.body;
    if (!body.slug) {
      const base = generateSlug(body.title?.en || body.title || 'project');
      body.slug = await ensureUniqueSlug(Project, base);
    } else {
      const existing = await Project.findOne({ slug: body.slug });
      if (existing) return res.status(400).json({ success: false, message: `Slug "${body.slug}" already in use` });
    }
    const project = await Project.create(body);
    res.status(201).json({ success: true, data: project });
  } catch (err) { next(err); }
});

router.put('/admin/projects/:id', auth, async (req, res, next) => {
  try {
    const body = req.body;
    if (body.slug) {
      const existing = await Project.findOne({ slug: body.slug, _id: { $ne: req.params.id } });
      if (existing) return res.status(400).json({ success: false, message: `Slug "${body.slug}" already in use` });
    }
    if (body.title && !body.slug) {
      const base = generateSlug(body.title?.en || body.title);
      body.slug = await ensureUniqueSlug(Project, base, req.params.id);
    }
    const project = await Project.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) { next(err); }
});

router.patch('/admin/projects/:id/toggle-featured', auth, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    project.featured = !project.featured;
    await project.save();
    res.json({ success: true, data: project });
  } catch (err) { next(err); }
});

router.patch('/admin/projects/:id/toggle-published', auth, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    project.published = !project.published;
    await project.save();
    res.json({ success: true, data: project });
  } catch (err) { next(err); }
});

router.delete('/admin/projects/:id', auth, async (req, res, next) => {
  try {
    const result = await Project.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: { id: req.params.id } });
  } catch (err) { next(err); }
});

// Bulk import — upsert by slug, skip imageUrl/images (user uploads manually)
router.post('/admin/projects/import', auth, async (req, res, next) => {
  try {
    const items = Array.isArray(req.body) ? req.body : req.body.projects;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Expected an array of projects' });
    }

    const results = { created: 0, updated: 0, failed: 0, errors: [] };

    for (const item of items) {
      try {
        // Strip Mongo internals and image fields (images are added manually via edit)
        const { _id, __v, createdAt, updatedAt, imageUrl, images, ...data } = item;

        if (!data.slug) {
          const base = generateSlug(data.title?.en || data.title || 'project');
          data.slug = await ensureUniqueSlug(Project, base);
        }

        const existing = await Project.findOne({ slug: data.slug });
        if (existing) {
          await Project.findByIdAndUpdate(existing._id, { $set: data });
          results.updated++;
        } else {
          await Project.create(data);
          results.created++;
        }
      } catch (err) {
        results.failed++;
        results.errors.push(`${item.slug || item.title?.en || 'unknown'}: ${err.message}`);
      }
    }

    res.json({ success: true, data: results });
  } catch (err) { next(err); }
});

module.exports = router;

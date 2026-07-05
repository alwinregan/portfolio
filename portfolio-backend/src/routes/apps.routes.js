const router = require('express').Router();
const auth = require('../middleware/auth');
const App = require('../models/app.model');
const { generateSlug, ensureUniqueSlug } = require('../utils/slug');

// Public
router.get('/apps', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const apps = await App.find({ isActive: true, published: true })
      .sort({ order: 1 }).limit(limit).skip(offset);
    res.json({ success: true, data: apps });
  } catch (err) { next(err); }
});

// Admin
router.get('/admin/apps', auth, async (req, res, next) => {
  try {
    const apps = await App.find().sort({ order: 1 });
    res.json({ success: true, data: apps });
  } catch (err) { next(err); }
});

router.post('/admin/apps', auth, async (req, res, next) => {
  try {
    const body = req.body;
    if (!body.slug) {
      const nameStr = typeof body.name === 'object' ? body.name.en : body.name;
      body.slug = await ensureUniqueSlug(App, generateSlug(nameStr));
    } else {
      const existing = await App.findOne({ slug: body.slug });
      if (existing) return res.status(400).json({ success: false, message: `Slug "${body.slug}" already in use` });
    }
    const app = await App.create(body);
    res.status(201).json({ success: true, data: app });
  } catch (err) { next(err); }
});

router.put('/admin/apps/:id', auth, async (req, res, next) => {
  try {
    const body = req.body;
    if (body.slug) {
      const existing = await App.findOne({ slug: body.slug, _id: { $ne: req.params.id } });
      if (existing) return res.status(400).json({ success: false, message: `Slug "${body.slug}" already in use` });
    }
    if (body.name && !body.slug) {
      const nameStr = typeof body.name === 'object' ? body.name.en : body.name;
      body.slug = await ensureUniqueSlug(App, generateSlug(nameStr), req.params.id);
    }
    const app = await App.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!app) return res.status(404).json({ success: false, message: 'App not found' });
    res.json({ success: true, data: app });
  } catch (err) { next(err); }
});

router.delete('/admin/apps/:id', auth, async (req, res, next) => {
  try {
    const result = await App.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'App not found' });
    res.json({ success: true, data: { id: req.params.id } });
  } catch (err) { next(err); }
});

module.exports = router;

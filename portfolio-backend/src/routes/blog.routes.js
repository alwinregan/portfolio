const router = require('express').Router();
const auth = require('../middleware/auth');
const Blog = require('../models/blog.model');

function createSlug(title) {
  return title.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Public
router.get('/blog', async (req, res, next) => {
  try {
    const isAdmin = req.query.role === 'admin';
    const filter = isAdmin ? {} : { published: true };
    const blogs = await Blog.find(filter).sort({ order: 1, publishedAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (err) { next(err); }
});

router.get('/blog/:slug', async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    blog.views += 1;
    await blog.save();
    res.json({ success: true, data: blog });
  } catch (err) { next(err); }
});

// Admin (blog CRUD uses same /blog prefix protected by auth)
router.post('/blog', auth, async (req, res, next) => {
  try {
    const body = req.body;
    if (!body.slug) body.slug = createSlug(body.title);
    if (!body.publishedAt && body.published) body.publishedAt = new Date();
    const blog = await Blog.create(body);
    res.status(201).json({ success: true, data: blog });
  } catch (err) { next(err); }
});

router.patch('/blog/:id', auth, async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, data: blog });
  } catch (err) { next(err); }
});

router.delete('/blog/:id', auth, async (req, res, next) => {
  try {
    const result = await Blog.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, data: { id: req.params.id } });
  } catch (err) { next(err); }
});

module.exports = router;

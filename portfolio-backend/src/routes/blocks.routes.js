const router = require('express').Router();
const auth = require('../middleware/auth');
const Block = require('../models/block.model');

const BLOCK_TYPES = ['text', 'markdown', 'image', 'video', 'gallery', 'code', 'embed', 'divider', 'callout'];

// Public
router.get('/blocks', async (req, res, next) => {
  try {
    const filter = { isActive: true };
    if (req.query.type) filter.type = req.query.type;
    if (req.query.parentId) filter.parentId = req.query.parentId;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const blocks = await Block.find(filter).sort({ order: 1 }).limit(limit).skip(offset);
    res.json({ success: true, data: blocks });
  } catch (err) { next(err); }
});

router.get('/blocks/:id', async (req, res, next) => {
  try {
    const block = await Block.findById(req.params.id);
    if (!block) return res.status(404).json({ success: false, message: 'Block not found' });
    res.json({ success: true, data: block });
  } catch (err) { next(err); }
});

// Admin
router.get('/admin/blocks', auth, async (req, res, next) => {
  try {
    const blocks = await Block.find().sort({ order: 1 });
    res.json({ success: true, data: blocks });
  } catch (err) { next(err); }
});

router.post('/admin/blocks', auth, async (req, res, next) => {
  try {
    const body = req.body;
    if (!BLOCK_TYPES.includes(body.type)) {
      return res.status(400).json({ success: false, message: `Invalid block type: ${body.type}` });
    }
    if (!body.content || Object.keys(body.content).length === 0) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }
    const block = await Block.create(body);
    res.status(201).json({ success: true, data: block });
  } catch (err) { next(err); }
});

router.put('/admin/blocks/:id', auth, async (req, res, next) => {
  try {
    if (req.body.type && !BLOCK_TYPES.includes(req.body.type)) {
      return res.status(400).json({ success: false, message: `Invalid block type: ${req.body.type}` });
    }
    const block = await Block.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!block) return res.status(404).json({ success: false, message: 'Block not found' });
    res.json({ success: true, data: block });
  } catch (err) { next(err); }
});

router.delete('/admin/blocks/:id', auth, async (req, res, next) => {
  try {
    const result = await Block.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Block not found' });
    res.json({ success: true, data: { id: req.params.id } });
  } catch (err) { next(err); }
});

router.patch('/admin/blocks/reorder', auth, async (req, res, next) => {
  try {
    const updates = req.body.map(({ id, order }) =>
      Block.findByIdAndUpdate(id, { order }, { new: true })
    );
    const results = await Promise.all(updates);
    res.json({ success: true, data: results });
  } catch (err) { next(err); }
});

module.exports = router;

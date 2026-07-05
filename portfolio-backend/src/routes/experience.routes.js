const router = require('express').Router();
const auth = require('../middleware/auth');
const Experience = require('../models/experience.model');

// Public
router.get('/experience', async (req, res, next) => {
  try {
    const experiences = await Experience.find({ isActive: true }).sort({ order: 1, startDate: -1 });
    res.json({ success: true, message: 'Experiences retrieved successfully', data: experiences });
  } catch (err) { next(err); }
});

// Admin
router.get('/admin/experience', auth, async (req, res, next) => {
  try {
    const experiences = await Experience.find().sort({ order: 1, startDate: -1 });
    res.json({ success: true, data: experiences });
  } catch (err) { next(err); }
});

router.post('/admin/experience', auth, async (req, res, next) => {
  try {
    const experience = await Experience.create(req.body);
    res.status(201).json({ success: true, message: 'Experience created successfully', data: experience });
  } catch (err) { next(err); }
});

router.put('/admin/experience/:id', auth, async (req, res, next) => {
  try {
    const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!experience) return res.status(404).json({ success: false, message: 'Experience not found' });
    res.json({ success: true, message: 'Experience updated successfully', data: experience });
  } catch (err) { next(err); }
});

router.delete('/admin/experience/:id', auth, async (req, res, next) => {
  try {
    const result = await Experience.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Experience not found' });
    res.json({ success: true, message: 'Experience deleted successfully', data: { id: req.params.id } });
  } catch (err) { next(err); }
});

module.exports = router;

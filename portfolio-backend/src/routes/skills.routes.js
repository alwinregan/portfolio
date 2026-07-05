const router = require('express').Router();
const auth = require('../middleware/auth');
const Skill = require('../models/skill.model');

// Public
router.get('/skills', async (req, res, next) => {
  try {
    const filter = req.query.category
      ? { category: req.query.category, isActive: true }
      : { isActive: true };
    const skills = await Skill.find(filter).sort({ order: 1 });
    res.json({ success: true, message: 'Skills retrieved successfully', data: skills });
  } catch (err) { next(err); }
});

// Admin
router.get('/admin/skills', auth, async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ order: 1 });
    res.json({ success: true, data: skills });
  } catch (err) { next(err); }
});

router.post('/admin/skills', auth, async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({ success: true, message: 'Skill created successfully', data: skill });
  } catch (err) { next(err); }
});

router.put('/admin/skills/:id', auth, async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
    res.json({ success: true, message: 'Skill updated successfully', data: skill });
  } catch (err) { next(err); }
});

router.patch('/admin/skills/:id/toggle', auth, async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
    skill.isActive = !skill.isActive;
    await skill.save();
    res.json({ success: true, data: skill });
  } catch (err) { next(err); }
});

router.delete('/admin/skills/:id', auth, async (req, res, next) => {
  try {
    const result = await Skill.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Skill not found' });
    res.json({ success: true, message: 'Skill deleted successfully', data: { id: req.params.id } });
  } catch (err) { next(err); }
});

module.exports = router;

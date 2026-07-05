const router = require('express').Router();
const auth = require('../middleware/auth');
const Certification = require('../models/certification.model');

// Public
router.get('/certifications', async (req, res, next) => {
  try {
    const certs = await Certification.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, message: 'Certifications retrieved successfully', data: certs });
  } catch (err) { next(err); }
});

// Admin
router.get('/admin/certifications', auth, async (req, res, next) => {
  try {
    const certs = await Certification.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: certs });
  } catch (err) { next(err); }
});

router.post('/admin/certifications', auth, async (req, res, next) => {
  try {
    const cert = await Certification.create(req.body);
    res.status(201).json({ success: true, message: 'Certification created successfully', data: cert });
  } catch (err) { next(err); }
});

router.put('/admin/certifications/:id', auth, async (req, res, next) => {
  try {
    const cert = await Certification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cert) return res.status(404).json({ success: false, message: 'Certification not found' });
    res.json({ success: true, message: 'Certification updated successfully', data: cert });
  } catch (err) { next(err); }
});

router.delete('/admin/certifications/:id', auth, async (req, res, next) => {
  try {
    const result = await Certification.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Certification not found' });
    res.json({ success: true, message: 'Certification deleted successfully', data: { id: req.params.id } });
  } catch (err) { next(err); }
});

module.exports = router;

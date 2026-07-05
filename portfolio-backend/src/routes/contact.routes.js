const router = require('express').Router();
const auth = require('../middleware/auth');
const Contact = require('../models/contact.model');

// Public
router.post('/contact', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const contact = await Contact.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: 'Message sent successfully', data: contact });
  } catch (err) { next(err); }
});

// Admin
router.get('/admin/contact', auth, async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (err) { next(err); }
});

router.patch('/admin/contact/:id', auth, async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, data: contact });
  } catch (err) { next(err); }
});

router.delete('/admin/contact/:id', auth, async (req, res, next) => {
  try {
    const result = await Contact.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, data: { id: req.params.id } });
  } catch (err) { next(err); }
});

module.exports = router;

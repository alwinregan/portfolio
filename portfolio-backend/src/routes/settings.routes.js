const router = require('express').Router();
const auth = require('../middleware/auth');
const Settings = require('../models/settings.model');

const defaultToggles = {
  showProjects: true,
  showSkills: true,
  showContactForm: true,
  showExperience: true,
  showCertifications: true,
  showApps: true,
  enableBlog: true,
};

// Public
router.get('/settings', async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({ siteName: 'Portfolio 2026', featureToggles: defaultToggles });
    res.json({ success: true, message: 'Settings retrieved successfully', data: settings });
  } catch (err) { next(err); }
});

// Admin
router.put('/admin/settings', auth, async (req, res, next) => {
  try {
    // Strip read-only Mongoose fields; handle metadata with dot notation
    // so each subkey is written atomically without overwriting siblings
    const { _id, __v, createdAt, updatedAt, metadata, ...rest } = req.body;
    const setDoc = { ...rest };

    if (metadata && typeof metadata === 'object') {
      Object.entries(metadata).forEach(([k, v]) => {
        setDoc[`metadata.${k}`] = v;
      });
    }

    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: setDoc },
      { new: true, upsert: true }
    );
    res.json({ success: true, message: 'Settings updated successfully', data: settings });
  } catch (err) { next(err); }
});

router.put('/admin/settings/toggles', auth, async (req, res, next) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: { featureToggles: req.body } },
      { new: true, upsert: true }
    );
    res.json({ success: true, message: 'Feature toggles updated successfully', data: settings });
  } catch (err) { next(err); }
});

module.exports = router;

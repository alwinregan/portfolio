const router = require('express').Router();
const auth = require('../middleware/auth');
const Profile = require('../models/profile.model');

const defaultProfile = {
  name: 'Alwin Regan P',
  bannerTitle: { en: 'Quality Driven' },
  bannerSubtitle: { en: 'Design → Build → Deploy' },
  role: { en: 'Full-Stack Developer' },
  heroPrefix: { en: "Hi, I'm" },
  heroSuffix: { en: 'Building scalable systems.' },
  summary: { en: 'Results-driven Full-Stack Developer with 5+ years of experience architecting and building scalable fintech and enterprise platforms.' },
  about: { en: 'Hands-on expertise in Laravel, .NET, Node.js and Angular/React.js, with a strong track record across microservices architecture, third-party vendor integrations, and high-scale database design spanning UPI, BBPS, and merchant acquisition platforms.' },
  titles: [{ en: 'Full-Stack Developer' }, { en: 'Associate Project Manager' }, { en: 'Fintech Engineer' }],
  location: { en: 'Chennai, Tamil Nadu, India' },
  email: 'alwinregancse98@gmail.com',
  phone: '+91 7010383237',
  linkedin: 'https://linkedin.com/in/alwinregan',
};

// Public
router.get('/profile', async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) profile = await Profile.create(defaultProfile);
    res.json({ success: true, message: 'Profile retrieved successfully', data: profile });
  } catch (err) { next(err); }
});

// Admin
router.put('/admin/profile', auth, async (req, res, next) => {
  try {
    const profile = await Profile.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json({ success: true, message: 'Profile updated successfully', data: profile });
  } catch (err) { next(err); }
});

module.exports = router;

const router = require('express').Router();
const auth = require('../middleware/auth');
const Profile = require('../models/profile.model');
const Skill = require('../models/skill.model');
const Experience = require('../models/experience.model');
const Project = require('../models/project.model');
const Certification = require('../models/certification.model');
const Settings = require('../models/settings.model');

// Export everything as one JSON snapshot
router.get('/admin/export', auth, async (req, res, next) => {
  try {
    const [profile, skills, experience, projects, certifications, settings] = await Promise.all([
      Profile.findOne().lean(),
      Skill.find().lean(),
      Experience.find().sort({ order: 1 }).lean(),
      Project.find().sort({ order: 1 }).lean(),
      Certification.find().lean(),
      Settings.findOne().lean(),
    ]);
    res.json({
      success: true,
      data: {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        profile,
        skills,
        experience,
        projects,
        certifications,
        settings,
      },
    });
  } catch (err) { next(err); }
});

// Import everything from a JSON snapshot
router.post('/admin/import', auth, async (req, res, next) => {
  try {
    const { profile, skills, experience, projects, certifications, settings } = req.body;
    const results = {};

    if (profile) {
      // Strip internal fields and image (uploaded separately)
      const { _id, __v, createdAt, updatedAt, avatarUrl, resumeUrl, ...data } = profile;
      await Profile.findOneAndUpdate({}, data, { upsert: true, new: true });
      results.profile = 'imported';
    }

    if (Array.isArray(skills) && skills.length) {
      for (const skill of skills) {
        const { _id, __v, createdAt, updatedAt, ...data } = skill;
        await Skill.findOneAndUpdate({ name: data.name }, data, { upsert: true });
      }
      results.skills = `${skills.length} upserted`;
    }

    if (Array.isArray(experience) && experience.length) {
      for (const exp of experience) {
        const { _id, __v, createdAt, updatedAt, ...data } = exp;
        await Experience.findOneAndUpdate(
          { company: data.company, role: data.role },
          data,
          { upsert: true }
        );
      }
      results.experience = `${experience.length} upserted`;
    }

    if (Array.isArray(projects) && projects.length) {
      for (const project of projects) {
        const { _id, __v, createdAt, updatedAt, imageUrl, images, ...data } = project;
        if (!data.slug) continue;
        await Project.findOneAndUpdate({ slug: data.slug }, { $set: data }, { upsert: true });
      }
      results.projects = `${projects.length} upserted`;
    }

    if (Array.isArray(certifications) && certifications.length) {
      for (const cert of certifications) {
        const { _id, __v, createdAt, updatedAt, imageUrl, ...data } = cert;
        await Certification.findOneAndUpdate(
          { title: data.title },
          data,
          { upsert: true }
        );
      }
      results.certifications = `${certifications.length} upserted`;
    }

    if (settings) {
      const { _id, __v, createdAt, updatedAt, ...data } = settings;
      await Settings.findOneAndUpdate({}, data, { upsert: true });
      results.settings = 'imported';
    }

    res.json({ success: true, data: results });
  } catch (err) { next(err); }
});

module.exports = router;

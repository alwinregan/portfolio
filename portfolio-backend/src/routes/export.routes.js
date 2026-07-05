const router = require('express').Router();
const auth = require('../middleware/auth');
const Profile = require('../models/profile.model');
const Skill = require('../models/skill.model');
const Experience = require('../models/experience.model');
const Project = require('../models/project.model');
const Certification = require('../models/certification.model');
const Settings = require('../models/settings.model');

/* ── helpers ── */
const stripInternals = ({ _id, __v, createdAt, updatedAt, ...rest }) => rest;
const stripImage     = ({ imageUrl, images, avatarUrl, resumeUrl, ...rest }) => rest;

/* ── GET /admin/export  ?type=profile|skills|experience|projects|certifications|settings ── */
router.get('/admin/export', auth, async (req, res, next) => {
  const { type } = req.query;
  try {
    if (type === 'profile') {
      const doc = await Profile.findOne().lean();
      return res.json({ success: true, data: doc ? stripImage(stripInternals(doc)) : null });
    }
    if (type === 'skills') {
      const docs = await Skill.find().lean();
      return res.json({ success: true, data: docs.map(stripInternals) });
    }
    if (type === 'experience') {
      const docs = await Experience.find().sort({ order: 1 }).lean();
      return res.json({ success: true, data: docs.map(stripInternals) });
    }
    if (type === 'projects') {
      const docs = await Project.find().sort({ order: 1 }).lean();
      return res.json({ success: true, data: docs.map(d => stripImage(stripInternals(d))) });
    }
    if (type === 'certifications') {
      const docs = await Certification.find().lean();
      return res.json({ success: true, data: docs.map(d => stripImage(stripInternals(d))) });
    }
    if (type === 'settings') {
      const doc = await Settings.findOne().lean();
      return res.json({ success: true, data: doc ? stripInternals(doc) : null });
    }

    // Full snapshot (no type)
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
        profile:        profile        ? stripImage(stripInternals(profile))        : null,
        skills:         skills.map(stripInternals),
        experience:     experience.map(stripInternals),
        projects:       projects.map(d => stripImage(stripInternals(d))),
        certifications: certifications.map(d => stripImage(stripInternals(d))),
        settings:       settings       ? stripInternals(settings)                   : null,
      },
    });
  } catch (err) { next(err); }
});

/* ── POST /admin/import  ?type=profile|skills|experience|projects|certifications|settings ── */
router.post('/admin/import', auth, async (req, res, next) => {
  const { type } = req.query;
  try {
    /* ─ Module-wise import ─ */
    if (type === 'profile') {
      const { _id, __v, createdAt, updatedAt, avatarUrl, resumeUrl, ...data } = req.body;
      await Profile.findOneAndUpdate({}, data, { upsert: true, new: true });
      return res.json({ success: true, data: { profile: 'imported' } });
    }

    if (type === 'skills') {
      const items = Array.isArray(req.body) ? req.body : (req.body.skills ?? []);
      for (const s of items) {
        const { _id, __v, createdAt, updatedAt, ...data } = s;
        await Skill.findOneAndUpdate({ name: data.name }, data, { upsert: true });
      }
      return res.json({ success: true, data: { skills: `${items.length} upserted` } });
    }

    if (type === 'experience') {
      const items = Array.isArray(req.body) ? req.body : (req.body.experience ?? []);
      for (const s of items) {
        const { _id, __v, createdAt, updatedAt, ...data } = s;
        await Experience.findOneAndUpdate({ company: data.company, role: data.role }, data, { upsert: true });
      }
      return res.json({ success: true, data: { experience: `${items.length} upserted` } });
    }

    if (type === 'projects') {
      const items = Array.isArray(req.body) ? req.body : (req.body.projects ?? []);
      for (const s of items) {
        const { _id, __v, createdAt, updatedAt, imageUrl, images, ...data } = s;
        if (!data.slug) continue;
        await Project.findOneAndUpdate({ slug: data.slug }, { $set: data }, { upsert: true });
      }
      return res.json({ success: true, data: { projects: `${items.length} upserted` } });
    }

    if (type === 'certifications') {
      const items = Array.isArray(req.body) ? req.body : (req.body.certifications ?? []);
      for (const s of items) {
        const { _id, __v, createdAt, updatedAt, imageUrl, ...data } = s;
        await Certification.findOneAndUpdate({ title: data.title }, data, { upsert: true });
      }
      return res.json({ success: true, data: { certifications: `${items.length} upserted` } });
    }

    if (type === 'settings') {
      const { _id, __v, createdAt, updatedAt, ...data } = req.body;
      await Settings.findOneAndUpdate({}, data, { upsert: true });
      return res.json({ success: true, data: { settings: 'imported' } });
    }

    /* ─ Full snapshot import (no type) ─ */
    const { profile, skills, experience, projects, certifications, settings } = req.body;
    const results: Record<string, string> = {};

    if (profile) {
      const { _id, __v, createdAt, updatedAt, avatarUrl, resumeUrl, ...data } = profile;
      await Profile.findOneAndUpdate({}, data, { upsert: true, new: true });
      results.profile = 'imported';
    }
    if (Array.isArray(skills) && skills.length) {
      for (const s of skills) {
        const { _id, __v, createdAt, updatedAt, ...data } = s;
        await Skill.findOneAndUpdate({ name: data.name }, data, { upsert: true });
      }
      results.skills = `${skills.length} upserted`;
    }
    if (Array.isArray(experience) && experience.length) {
      for (const s of experience) {
        const { _id, __v, createdAt, updatedAt, ...data } = s;
        await Experience.findOneAndUpdate({ company: data.company, role: data.role }, data, { upsert: true });
      }
      results.experience = `${experience.length} upserted`;
    }
    if (Array.isArray(projects) && projects.length) {
      for (const s of projects) {
        const { _id, __v, createdAt, updatedAt, imageUrl, images, ...data } = s;
        if (!data.slug) continue;
        await Project.findOneAndUpdate({ slug: data.slug }, { $set: data }, { upsert: true });
      }
      results.projects = `${projects.length} upserted`;
    }
    if (Array.isArray(certifications) && certifications.length) {
      for (const s of certifications) {
        const { _id, __v, createdAt, updatedAt, imageUrl, ...data } = s;
        await Certification.findOneAndUpdate({ title: data.title }, data, { upsert: true });
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

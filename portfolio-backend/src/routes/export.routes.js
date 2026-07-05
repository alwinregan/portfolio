const router = require('express').Router();
const auth   = require('../middleware/auth');

const Profile       = require('../models/profile.model');
const Skill         = require('../models/skill.model');
const Experience    = require('../models/experience.model');
const Project       = require('../models/project.model');
const Certification = require('../models/certification.model');
const Settings      = require('../models/settings.model');
const Blog          = require('../models/blog.model');
const App           = require('../models/app.model');
const Block         = require('../models/block.model');

/* ── helpers ────────────────────────────────────────────── */
const cleanMeta  = ({ _id, __v, createdAt, updatedAt, ...r }) => r;
const cleanMedia = ({ imageUrl, images, avatarUrl, resumeUrl,
                      coverImage, icon, imageUrls, videoUrl, ...r }) => r;
// Blocks keep their _id so parentId references survive round-trips
const cleanBlock = ({ __v, createdAt, updatedAt, imageUrl, imageUrls, videoUrl, ...r }) => r;

/* ═══════════════════════════════════════════════════════════
   GET /admin/export
   ?type = profile | skills | experience | projects |
           certifications | settings | blog | apps | blocks
   (no type = full snapshot)
═══════════════════════════════════════════════════════════ */
router.get('/admin/export', auth, async (req, res, next) => {
  const { type } = req.query;
  try {
    if (type === 'profile') {
      const doc = await Profile.findOne().lean();
      return res.json({ success: true, data: doc ? cleanMedia(cleanMeta(doc)) : null });
    }
    if (type === 'skills') {
      const docs = await Skill.find().lean();
      return res.json({ success: true, data: docs.map(cleanMeta) });
    }
    if (type === 'experience') {
      const docs = await Experience.find().sort({ order: 1 }).lean();
      return res.json({ success: true, data: docs.map(cleanMeta) });
    }
    if (type === 'projects') {
      const docs = await Project.find().sort({ order: 1 }).lean();
      return res.json({ success: true, data: docs.map(d => cleanMedia(cleanMeta(d))) });
    }
    if (type === 'certifications') {
      const docs = await Certification.find().lean();
      return res.json({ success: true, data: docs.map(d => cleanMedia(cleanMeta(d))) });
    }
    if (type === 'settings') {
      const doc = await Settings.findOne().lean();
      return res.json({ success: true, data: doc ? cleanMeta(doc) : null });
    }
    if (type === 'blog') {
      const docs = await Blog.find().lean();
      return res.json({ success: true, data: docs.map(d => cleanMedia(cleanMeta(d))) });
    }
    if (type === 'apps') {
      const docs = await App.find().lean();
      return res.json({ success: true, data: docs.map(d => cleanMedia(cleanMeta(d))) });
    }
    if (type === 'blocks') {
      const docs = await Block.find().lean();
      return res.json({ success: true, data: docs.map(cleanBlock) });
    }

    /* ── Full snapshot ── */
    const [profile, skills, experience, projects, certifications,
           settings, blog, apps, blocks] = await Promise.all([
      Profile.findOne().lean(),
      Skill.find().lean(),
      Experience.find().sort({ order: 1 }).lean(),
      Project.find().sort({ order: 1 }).lean(),
      Certification.find().lean(),
      Settings.findOne().lean(),
      Blog.find().lean(),
      App.find().lean(),
      Block.find().lean(),
    ]);

    res.json({
      success: true,
      data: {
        exportedAt:     new Date().toISOString(),
        version:        '2.0',
        profile:        profile        ? cleanMedia(cleanMeta(profile))          : null,
        skills:         skills.map(cleanMeta),
        experience:     experience.map(cleanMeta),
        projects:       projects.map(d => cleanMedia(cleanMeta(d))),
        certifications: certifications.map(d => cleanMedia(cleanMeta(d))),
        settings:       settings       ? cleanMeta(settings)                     : null,
        blog:           blog.map(d => cleanMedia(cleanMeta(d))),
        apps:           apps.map(d => cleanMedia(cleanMeta(d))),
        blocks:         blocks.map(cleanBlock),
      },
    });
  } catch (err) { next(err); }
});

/* ═══════════════════════════════════════════════════════════
   POST /admin/import
   ?type = same options as above
   (no type = full snapshot)
═══════════════════════════════════════════════════════════ */
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
      let count = 0;
      for (const s of items) {
        const { _id, __v, createdAt, updatedAt, imageUrl, images, ...data } = s;
        if (!data.slug) continue;
        await Project.findOneAndUpdate({ slug: data.slug }, { $set: data }, { upsert: true });
        count++;
      }
      return res.json({ success: true, data: { projects: `${count} upserted` } });
    }
    if (type === 'certifications') {
      const items = Array.isArray(req.body) ? req.body : (req.body.certifications ?? []);
      for (const s of items) {
        const { _id, __v, createdAt, updatedAt, imageUrl, ...data } = s;
        // FIX: use name (not title) as match key
        await Certification.findOneAndUpdate({ name: data.name }, data, { upsert: true });
      }
      return res.json({ success: true, data: { certifications: `${items.length} upserted` } });
    }
    if (type === 'settings') {
      const { _id, __v, createdAt, updatedAt, ...data } = req.body;
      await Settings.findOneAndUpdate({}, data, { upsert: true });
      return res.json({ success: true, data: { settings: 'imported' } });
    }
    if (type === 'blog') {
      const items = Array.isArray(req.body) ? req.body : (req.body.blog ?? []);
      for (const s of items) {
        const { _id, __v, createdAt, updatedAt, coverImage, ...data } = s;
        if (!data.slug) continue;
        await Blog.findOneAndUpdate({ slug: data.slug }, { $set: data }, { upsert: true });
      }
      return res.json({ success: true, data: { blog: `${items.length} upserted` } });
    }
    if (type === 'apps') {
      const items = Array.isArray(req.body) ? req.body : (req.body.apps ?? []);
      for (const s of items) {
        const { _id, __v, createdAt, updatedAt, icon, ...data } = s;
        if (!data.slug) continue;
        await App.findOneAndUpdate({ slug: data.slug }, { $set: data }, { upsert: true });
      }
      return res.json({ success: true, data: { apps: `${items.length} upserted` } });
    }
    if (type === 'blocks') {
      const items = Array.isArray(req.body) ? req.body : (req.body.blocks ?? []);
      for (const s of items) {
        const { __v, createdAt, updatedAt, imageUrl, imageUrls, videoUrl, ...data } = s;
        // Use _id if present (preserved in export) so parentId refs survive
        const query = data._id ? { _id: data._id } : { type: data.type, content: data.content };
        await Block.findOneAndUpdate(query, { $set: data }, { upsert: true });
      }
      return res.json({ success: true, data: { blocks: `${items.length} upserted` } });
    }

    /* ─ Full snapshot import ─ */
    const { profile, skills, experience, projects,
            certifications, settings, blog, apps, blocks } = req.body;
    const results = {};

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
      let count = 0;
      for (const s of projects) {
        const { _id, __v, createdAt, updatedAt, imageUrl, images, ...data } = s;
        if (!data.slug) continue;
        await Project.findOneAndUpdate({ slug: data.slug }, { $set: data }, { upsert: true });
        count++;
      }
      results.projects = `${count} upserted`;
    }
    if (Array.isArray(certifications) && certifications.length) {
      for (const s of certifications) {
        const { _id, __v, createdAt, updatedAt, imageUrl, ...data } = s;
        // FIX: use name (not title)
        await Certification.findOneAndUpdate({ name: data.name }, data, { upsert: true });
      }
      results.certifications = `${certifications.length} upserted`;
    }
    if (settings) {
      const { _id, __v, createdAt, updatedAt, ...data } = settings;
      await Settings.findOneAndUpdate({}, data, { upsert: true });
      results.settings = 'imported';
    }
    if (Array.isArray(blog) && blog.length) {
      for (const s of blog) {
        const { _id, __v, createdAt, updatedAt, coverImage, ...data } = s;
        if (!data.slug) continue;
        await Blog.findOneAndUpdate({ slug: data.slug }, { $set: data }, { upsert: true });
      }
      results.blog = `${blog.length} upserted`;
    }
    if (Array.isArray(apps) && apps.length) {
      for (const s of apps) {
        const { _id, __v, createdAt, updatedAt, icon, ...data } = s;
        if (!data.slug) continue;
        await App.findOneAndUpdate({ slug: data.slug }, { $set: data }, { upsert: true });
      }
      results.apps = `${apps.length} upserted`;
    }
    if (Array.isArray(blocks) && blocks.length) {
      for (const s of blocks) {
        const { __v, createdAt, updatedAt, imageUrl, imageUrls, videoUrl, ...data } = s;
        const query = data._id ? { _id: data._id } : { type: data.type };
        await Block.findOneAndUpdate(query, { $set: data }, { upsert: true });
      }
      results.blocks = `${blocks.length} upserted`;
    }

    res.json({ success: true, data: results });
  } catch (err) { next(err); }
});

module.exports = router;

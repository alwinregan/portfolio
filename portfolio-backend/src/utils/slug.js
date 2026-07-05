function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function ensureUniqueSlug(Model, baseSlug, excludeId) {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Model.findOne(query);
    if (!existing) return slug;
    slug = `${baseSlug}-${counter++}`;
  }
}

module.exports = { generateSlug, ensureUniqueSlug };

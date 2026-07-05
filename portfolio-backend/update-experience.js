const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

const experienceSchema = new mongoose.Schema({
  company:      { type: String, required: true },
  role:         { type: String, required: true },
  location:     { type: String },
  startDate:    { type: String, required: true },
  endDate:      { type: String },
  isCurrent:    { type: Boolean, default: false },
  highlights:   [{ type: String }],
  description:  [{ type: String }],
  technologies: [{ type: String }],
  order:        { type: Number, default: 0 },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

const Experience = mongoose.model('Experience', experienceSchema);

const updates = [
  {
    match: { company: /novac/i, role: /associate project manager/i },
    highlights: [
      'Represented the team in vendor, product, and planning meetings — owned requirements through delivery',
      'Led code reviews, task splitting, and sprint planning across concurrent platform initiatives',
      'Maintained on-time delivery for UPI, BBPS, Merchant Acquisition, and internal tooling simultaneously',
      'Self-initiated AI developer tools (MCP servers, PR automation, Extremist) without being asked',
    ],
  },
  {
    match: { company: /novac/i, role: /senior software engineer/i },
    highlights: [
      'Owned the full feature delivery cycle — requirements from Jira, product meetings, production deployment',
      'Built 300+ Fixed Deposit scheme pages using Angular SSR, delivering under tight campaign timelines',
      'Delivered features across 3 loan product lines (UCL, Personal Loan, Business Loan) for Shriram Finance',
      'Hardened application security through a full authentication and authorization overhaul',
    ],
  },
  {
    match: { company: /ziga/i },
    highlights: [
      'Led the team end-to-end — client meetings, requirements gathering, architecture, implementation, and delivery',
      'Sole technical and client-facing owner across all projects with no handholding',
      'Architected and shipped production-grade SaaS and e-commerce platforms from scratch',
      'Established CI/CD pipelines, REST API standards, and engineering practices for the team',
    ],
  },
];

async function run() {
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  for (const { match, highlights } of updates) {
    const docs = await Experience.find(match);
    if (docs.length === 0) {
      console.log(`No match for ${JSON.stringify(match)}`);
      continue;
    }
    for (const doc of docs) {
      doc.highlights = highlights;
      await doc.save();
      console.log(`Updated: ${doc.role} @ ${doc.company}`);
    }
  }

  await mongoose.disconnect();
  console.log('Done');
}

run().catch(err => { console.error(err); process.exit(1); });

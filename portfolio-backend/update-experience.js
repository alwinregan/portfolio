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
  impact:       [{ type: String }],
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
      'Represented the team in vendor, product, and planning meetings — sole technical voice in all cross-functional decisions',
      'Led code reviews, task splitting, and sprint planning — maintained on-time delivery across every initiative without exception',
      'Delivered 4 concurrent platforms (UPI, BBPS, Merchant Acquisition, internal tooling) with 5+ third-party vendor integrations',
      'Self-initiated 3 AI developer tools (MCP servers, PR automation, Extremist) entirely outside assigned workload',
    ],
    impact: ['4 Platforms', '5+ Vendors', '3 AI Tools', 'On-Time Delivery'],
  },
  {
    match: { company: /novac/i, role: /senior software engineer/i },
    highlights: [
      'Owned the full feature cycle independently — Jira requirements to product meetings to production deployment',
      'Built 300+ Fixed Deposit scheme pages via Angular SSR, delivering under tight campaign launch timelines',
      'Delivered across 3 loan product lines (UCL, Personal Loan, Business Loan) serving 10,000+ Shriram Finance customers',
      'Overhauled authentication and authorization layer, hardening security across the full application',
    ],
    impact: ['300+ Pages', '3 Loan Products', '10,000+ Customers'],
  },
  {
    match: { company: /ziga/i },
    highlights: [
      'Led the team end-to-end for 3+ years — sole owner of client meetings, requirements, architecture, implementation, and delivery',
      'Served as both technical architect and client-facing representative across every project with no senior oversight',
      'Architected and shipped 5+ production-grade SaaS and e-commerce platforms from greenfield to go-live',
      'Established CI/CD pipelines, REST API standards, and engineering practices that became the team baseline',
    ],
    impact: ['3+ Years', '5+ Projects', 'Solo Delivery', 'CI/CD Built'],
  },
];

async function run() {
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  for (const { match, highlights, impact } of updates) {
    const docs = await Experience.find(match);
    if (docs.length === 0) {
      console.log(`No match for ${JSON.stringify(match)}`);
      continue;
    }
    for (const doc of docs) {
      doc.highlights = highlights;
      doc.impact = impact;
      await doc.save();
      console.log(`Updated: ${doc.role} @ ${doc.company}`);
    }
  }

  await mongoose.disconnect();
  console.log('Done');
}

run().catch(err => { console.error(err); process.exit(1); });

if (!globalThis.crypto) globalThis.crypto = require('crypto').webcrypto;
require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./src/models/project.model');

const caseStudy = {
  subtitle: 'Full-Stack Web Application · 2025 – 2026',
  tagline: 'A complete gym management platform — from QR kiosk check-in to automated invoice delivery — built to replace manual processes for a gym with 2,000+ members.',
  meta: { developer: 'Sole Developer & Designer', stackHighlight: ['Laravel 13','PHP 8.4','React 19','Inertia.js v3','MySQL','Tailwind CSS v4','Vite 8'] },
  sections: [
    {
      id: 'problem', number: '01', type: 'problem',
      title: 'The Problem',
      lead: 'A ₹50 lakh business running on WhatsApp groups and a front-desk register.',
      body: '2,000 members. Zero visibility into who was active, who had expired, or who had walked out and never came back.',
      items: [
        { emoji: '💸', title: 'Invisible Revenue Leaks', body: 'Membership renewals were tracked in spreadsheets. Expired members kept using the gym for weeks — no one knew until they manually cross-checked a list.' },
        { emoji: '📋', title: 'Paper Attendance Logbook', body: 'A handwritten register at the front desk. No timestamps, no duration tracking, no way to see who came in but never checked out.' },
        { emoji: '🔕', title: 'No Automated Reminders', body: 'Expiry warnings, payment due reminders, and birthday messages were either sent manually (an hour-long daily task) or skipped entirely.' },
        { emoji: '📊', title: 'Zero Business Visibility', body: 'No data on revenue trends, peak hours, plan popularity, or member retention. Every decision was made on gut feel and memory.' },
      ],
    },
    {
      id: 'solution', number: '02', type: 'solution',
      title: 'The Solution',
      lead: 'A full-stack management platform covering every workflow the gym runs.',
      body: 'FitCore is a SaaS-grade system designed and built from scratch — a single, integrated platform replacing every spreadsheet, paper log, and manual reminder with a real-time, auditable system.',
      items: [
        { emoji: '🪪', title: 'Smart Membership Management', body: 'Assign plans by month or day. Before confirming, the system checks for overlapping active memberships and offers to schedule the new plan after the current one ends — or force-assign with an explicit override.' },
        { emoji: '📷', title: 'QR Kiosk — Self-Service Check-In', body: 'An always-on camera reads member QR codes the moment they\'re held up. The system auto-decides check-in or check-out based on open attendance records — no staff interaction required.' },
        { emoji: '📧', title: 'Automated Email Notifications', body: 'Welcome, expiry warning, payment due, birthday wishes, and invoice delivery all fire automatically on a daily schedule. Each channel can be toggled on or off from Settings without touching the codebase.' },
        { emoji: '🧾', title: 'Invoice Generation & PDF', body: 'Recording a payment auto-creates a sequentially numbered, tax-applied PDF invoice. Download from the app or send directly to the member\'s email — one click.' },
        { emoji: '📈', title: 'Analytics Dashboard', body: 'Last-30-day trend charts for daily revenue collected, new members joined, and attendance count. Server-side daily aggregates; updates on each page load — no manual export needed.' },
        { emoji: '🏋️', title: 'Workout Plan Management', body: 'Build reusable templates and assign them to members with per-exercise sets, reps, and duration. Trainers can manage their own members\' programs.' },
        { emoji: '🚶', title: 'Visitor Pipeline', body: 'Log walk-in enquiries and move them through a lightweight funnel — enquiry → trial → member. Prevents leads from falling through the cracks when the front desk is busy.' },
        { emoji: '🖼️', title: 'Kiosk Advertisement Display', body: 'Upload promotional images from the Advertisements module. They auto-rotate on the kiosk\'s right panel with crossfade transitions — a passive upsell channel built into the check-in screen.' },
        { emoji: '🎨', title: 'Full White-Label Branding', body: 'Gym name, logo, and two brand colors — changed once in Settings, reflected immediately on the login page, sidebar, kiosk display, email headers, and PDF invoices.' },
        { emoji: '📋', title: 'Reports & Exports', body: 'Revenue, attendance, member, and trainer reports — each exportable as a PDF or Excel file directly from the browser. Designed for month-end reviews.' },
        { emoji: '🔍', title: 'Audit Log', body: 'Every significant action — login, member added, payment recorded, plan assigned — is written to a timestamped log with the acting user. Full trail, always available in-app.' },
        { emoji: '🎯', title: 'Fitness Goal Tracking', body: 'Configurable fitness goal categories attached to member profiles. Helps trainers filter and group members by program type and track progress over time.' },
      ],
    },
    {
      id: 'engineering', number: '03', type: 'challenges',
      title: 'Engineering Challenges',
      lead: 'Three non-trivial problems solved during the build.',
      body: 'Real-world constraints produced real engineering problems — not homework exercises.',
      items: [
        {
          constraint: 'Carbon 3 changed its sign convention',
          constraintBody: 'Upgrading to Laravel 13 / Carbon 3 silently flipped the sign of diffInDays() and diffInMinutes() — in Carbon 2 these always returned positive values; in Carbon 3 they return negative when the first date is later than the second. Attendance durations showed as –47 minutes and birthday reminders fired for every member.',
          codeBefore: '// Carbon 2 — always positive\n$out->diffInMinutes($in)  // → 47\n\n// Carbon 3 — sign-aware\n$out->diffInMinutes($in)  // → -47',
          resolution: 'Wrapped in abs() at the model boundary',
          resolutionBody: 'The fix was applied at the model accessor level — wrapping both computations with abs() rather than patching call sites. This keeps the behavior consistent regardless of argument order.',
          codeAfter: '// Attendance model accessor\nreturn abs(\n    $this->check_out\n        ->diffInMinutes($this->check_in)\n);',
        },
        {
          constraint: 'Membership overlap detection without data corruption',
          constraintBody: 'When a staff member assigns a new plan with a start date that falls inside an existing active membership, two concurrent active memberships would silently coexist — one of them a data error the gym owner would only discover at month-end.',
          resolution: 'A conflict-aware assignment flow with three exits',
          resolutionBody: 'The backend detects an overlap and returns a structured membershipConflict flash instead of a validation error. The frontend presents three options: Schedule after current (auto-fills next start date), Assign anyway (force-overlap with force: true flag), or Cancel.',
          codeAfter: '// Backend: structured conflict response\nif ($conflict) {\n    return back()->with(\'membershipConflict\', [\n        \'existing_end\' => $active->end_date,\n        \'suggested_start\' => $active->end_date\n            ->addDay()->toDateString(),\n    ]);\n}',
        },
        {
          constraint: 'Shared hosting with no Node.js runtime',
          constraintBody: 'The production server is a cPanel shared host. It has no Node.js — so Vite\'s manifest-based asset serving threw a ViteManifestNotFoundException on every page load after deployment.',
          resolution: 'Built assets committed directly to the repository',
          resolutionBody: 'Removed /public/build from .gitignore and committed the compiled frontend bundle to the repository itself. A deployment is then a plain git pull with no build step needed on the server.',
          codeAfter: '# .gitignore — removed this line:\n# /public/build\n\n# Deploy is now simply:\ngit pull origin main',
        },
      ],
    },
    {
      id: 'stack', number: '04', type: 'stack',
      title: 'Tech Stack',
      lead: 'Chosen for production reliability, not trend.',
      categories: [
        { name: 'Backend', items: ['Laravel 13','PHP 8.4','MySQL 8','Eloquent ORM','Laravel Scheduler','Laravel Mail','Artisan Commands'] },
        { name: 'Frontend', items: ['React 19','Inertia.js v3','Tailwind CSS v4','Vite 8','Lucide Icons','Recharts','Sonner (Toasts)'] },
        { name: 'Libraries', items: ['barryvdh/laravel-dompdf','simplesoftwareio/simple-qrcode','jsQR (client-side QR)','maatwebsite/excel','Carbon 3'] },
        { name: 'Infrastructure', items: ['cPanel Shared Hosting','Git-based deploy','PHP-FPM','SMTP Email'] },
      ],
    },
    {
      id: 'impact', number: '05', type: 'impact',
      title: 'Scope & Impact',
      lead: 'Built end-to-end by one developer, in production for a real gym.',
      stats: [
        { value: '2,000+', label: 'Member records in production' },
        { value: '15+',    label: 'Feature modules built' },
        { value: '18',     label: 'Page user guide written for the gym owner' },
        { value: '0',      label: 'DevOps overhead — git pull deploys' },
        { value: '1',      label: 'Developer — design to deployment' },
      ],
      highlights: [
        { emoji: '✅', title: 'Full audit trail', body: 'Every significant action — login, member creation, payment recorded, plan assigned — is written to a timestamped audit log, viewable in-app.' },
        { emoji: '🔒', title: 'DB-level uniqueness', body: 'Member and trainer codes share one people table with a UNIQUE INDEX on the code column — enforced at both DB and application validation levels.' },
        { emoji: '📱', title: 'Kiosk runs without login', body: 'The check-in kiosk is a public route — no staff credential required. Members walk up, QR is auto-scanned, and they\'re checked in or out in under 2 seconds.' },
      ],
    },
  ],
};

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const result = await Project.findOneAndUpdate(
    { slug: 'fitcore-gym-management-platform' },
    {
      $set: {
        caseStudy,
        liveUrl: 'https://fitcore.abbazi.in/login',
        techStack: ['Laravel 13','PHP 8.4','React 19','Inertia.js v3','MySQL','Tailwind CSS v4','Vite 8'],
        tags: ['SaaS','Full-Stack','Freelance','Production'],
      }
    },
    { new: true }
  );
  console.log(result ? '✅ FitCore updated with case study' : '❌ FitCore not found');
  await mongoose.disconnect();
}

run().catch(e => { console.error(e.message); process.exit(1); });

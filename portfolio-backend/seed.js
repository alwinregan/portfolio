if (!globalThis.crypto) globalThis.crypto = require('crypto').webcrypto;
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Profile = require('./src/models/profile.model');
const Skill = require('./src/models/skill.model');
const Experience = require('./src/models/experience.model');
const Project = require('./src/models/project.model');
const Settings = require('./src/models/settings.model');
const User = require('./src/models/user.model');

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected.');

  await Promise.all([
    Profile.deleteMany({}),
    Skill.deleteMany({}),
    Experience.deleteMany({}),
    Project.deleteMany({}),
    Settings.deleteMany({}),
  ]);
  console.log('Cleared old data.');

  // ── Profile ──────────────────────────────────────────────────────────────
  await Profile.create({
    name: 'Alwin Regan P',
    email: 'alwinregancse98@gmail.com',
    phone: '+91 7010383237',
    location: { en: 'Chennai, Tamil Nadu, India' },
    role: { en: 'Full-Stack Developer' },
    heroPrefix: { en: "Hi, I'm" },
    heroSuffix: { en: 'Building scalable systems.' },
    bannerTitle: { en: 'Quality Driven' },
    bannerSubtitle: { en: 'Design → Build → Deploy' },
    titles: [
      { en: 'Full-Stack Developer' },
      { en: 'Associate Project Manager' },
      { en: 'Fintech Engineer' },
      { en: 'MCP & AI Workflow Builder' },
    ],
    summary: { en: 'Results-driven Full-Stack Developer with 5+ years of experience architecting and building scalable fintech and enterprise platforms. Expertise in Laravel, .NET, Node.js and Angular/React.js across microservices, UPI, BBPS, and merchant acquisition platforms.' },
    about: { en: 'I architect and build production-grade systems that handle real financial workloads. From UPI transaction microservices to SaaS platforms serving live customers, I care about performance, maintainability, and shipping things that work at scale. I also build custom MCP servers and AI-assisted developer tooling to accelerate engineering workflows.' },
    socialLinks: {
      github: 'https://github.com/alwinregan',
      linkedin: 'https://linkedin.com/in/alwinregan',
    },
  });
  console.log('✓ Profile');

  // ── Skills ───────────────────────────────────────────────────────────────
  await Skill.insertMany([
    { name: 'Laravel (PHP)', category: 'backend', level: 90, isActive: true },
    { name: 'Node.js', category: 'backend', level: 90, isActive: true },
    { name: '.NET', category: 'backend', level: 80, isActive: true },
    { name: 'Golang', category: 'backend', level: 70, isActive: true },
    { name: 'MySQL', category: 'database', level: 90, isActive: true },
    { name: 'PostgreSQL', category: 'database', level: 85, isActive: true },
    { name: 'MongoDB', category: 'database', level: 85, isActive: true },
    { name: 'Microsoft SQL Server', category: 'database', level: 85, isActive: true },
    { name: 'Redis', category: 'database', level: 80, isActive: true },
    { name: 'React.js', category: 'frontend', level: 85, isActive: true },
    { name: 'Angular', category: 'frontend', level: 85, isActive: true },
    { name: 'React Native', category: 'frontend', level: 75, isActive: true },
    { name: 'TypeScript', category: 'frontend', level: 85, isActive: true },
    { name: 'Angular Universal (SSR)', category: 'frontend', level: 80, isActive: true },
    { name: 'AWS', category: 'devops', level: 70, isActive: true },
    { name: 'CI/CD', category: 'devops', level: 75, isActive: true },
    { name: 'Git / Bitbucket', category: 'devops', level: 90, isActive: true },
    { name: 'REST API Design', category: 'devops', level: 90, isActive: true },
    { name: 'Dynatrace', category: 'devops', level: 70, isActive: true },
    { name: 'MCP Server Development', category: 'other', level: 85, isActive: true },
    { name: 'Microservices Architecture', category: 'other', level: 85, isActive: true },
    { name: 'Design Patterns', category: 'other', level: 85, isActive: true },
    { name: 'AI-Assisted Workflows', category: 'other', level: 80, isActive: true },
  ]);
  console.log('✓ Skills');

  // ── Experience ───────────────────────────────────────────────────────────
  await Experience.insertMany([
    {
      company: 'Novac Technology Solutions Pvt Ltd',
      role: 'Associate Project Manager',
      location: 'Chennai, Tamil Nadu',
      startDate: 'April 2025',
      endDate: '',
      isCurrent: true,
      description: [
        'Designed and built the UPI platform on a microservices-based architecture with independently deployable services for onboarding, transactions, accounting entries, and payments.',
        'Built backend APIs in .NET for UPI transaction processing, integrating HDFC Bank as the bank vendor with MSSQL table partitioning for high transaction volumes.',
        'Built the Angular web front end for BBPS covering bill payment flows, biller search, and transaction status tracking.',
        'Built a Laravel wrapper API exposing BBPS to the web channel, integrating billing vendors BillDesk and PayU using an Abstract Factory pattern.',
        'Re-architecting BBPS into a single omnichannel API so web and app consume the same backend, retiring the separate wrapper layer.',
        'Owned end-to-end technical delivery of the UPI merchant acquisition platform — Laravel REST APIs for Merchant App and Mziva field-agent app, supporting merchant onboarding, KYC (PAN, Aadhaar, CKYC, GST, trade license) and business workflows.',
        'Built an internal React.js/Node.js CRM for master data management, merchant logs, and reporting.',
        'Integrated onboarding vendors Yes Bank and CAMS, and sound-box vendors ToneTag and CWD using Abstract Factory pattern.',
        'Built custom MCP server integrations for Jira, Bitbucket, Rediffmail, Snap DB, and Dynatrace enabling AI-assisted developer workflows.',
        'Designed and developed "Extremist" — a Golang-based Ubuntu desktop app for engineering collaboration with real-time chat, LAN file sharing, and multi-database management console (MySQL, MSSQL, MongoDB, PostgreSQL).',
        'Built an automated PR Automation Tool with AI-assisted code reviews, quality gates, release tagging, and merge automation.',
      ],
      technologies: ['Laravel', '.NET', 'Angular', 'React.js', 'Node.js', 'Golang', 'MSSQL', 'MongoDB', 'MySQL', 'Redis', 'MCP', 'UPI', 'BBPS'],
      order: 1,
    },
    {
      company: 'Novac Technology Solutions Pvt Ltd',
      role: 'Senior Software Engineer',
      location: 'Chennai, Tamil Nadu',
      startDate: 'March 2024',
      endDate: 'April 2025',
      isCurrent: false,
      description: [
        'Built 50+ marketing campaign pages and 300+ Fixed Deposit scheme pages for BBPS web using Angular with server-side rendering (Node.js).',
        'Developed lending platform features across Shriram Finance\'s Used Car Loan (UCL), Personal Loan (PL), and Business Loan (BL) products, and a two-wheeler dealer portal.',
        'Designed and implemented secure authentication and authorization workflows, strengthening system security and access control.',
        'Boosted application performance by optimizing APIs, reducing latency, and improving database performance through efficient queries and indexing.',
      ],
      technologies: ['Angular', 'Angular Universal', 'Node.js', 'Laravel', 'MSSQL', 'MongoDB'],
      order: 2,
    },
    {
      company: 'Ziga Infotech Ventures',
      role: 'Senior Programmer Analyst',
      location: 'Chennai, Tamil Nadu',
      startDate: 'March 2021',
      endDate: 'March 2024',
      isCurrent: false,
      description: [
        'Delivered scalable full-stack solutions for E-commerce and SaaS platforms using modern web technologies.',
        'Designed and developed REST APIs and real-time data systems for high-performance applications.',
        'Enhanced system scalability and performance through optimized backend architecture.',
        'Led the development team, driving end-to-end project execution and delivering multiple projects on time.',
        'Established CI/CD pipelines to streamline deployment, reduce manual effort, and improve release efficiency.',
        'Worked closely with clients and stakeholders to translate business requirements into technical solutions.',
      ],
      technologies: ['Laravel', 'React.js', 'Node.js', 'MySQL', 'PostgreSQL', 'REST API', 'CI/CD'],
      order: 3,
    },
  ]);
  console.log('✓ Experience');

  // ── Projects ─────────────────────────────────────────────────────────────
  await Project.insertMany([
    // ── RupeeCollect ─────────────────────────────────────────────────────────
    {
      title: { en: 'RupeeCollect' },
      slug: 'rupeecollect',
      description: { en: 'Full-stack SaaS platform for chit funds, NBFCs, and microfinance companies — ₹50+ crore collected, 500+ companies onboarded, 10,000+ customers served across Tamil Nadu.' },
      longDescription: { en: 'Designed and developed a production-grade SaaS platform that digitises the entire loan collection lifecycle for chit funds, NBFCs, and microfinance companies.\n\nField agents use a React Native mobile app to record collections on-the-go, manage repayment schedules, receive overdue-payment alerts, and operate without continuous internet connectivity. The React.js web back-office provides agent performance dashboards, role-based access control (Admin, Super User, Data Entry), and fully automated income, expense, and profit & loss reporting.\n\nThe platform has processed over ₹50 crore in collections, onboarded 500+ companies, and serves 10,000+ customers across Tamil Nadu in active production.\n\nArchitected with PostgreSQL for transactional integrity, Redis for high-speed caching, and MongoDB for application logs and audit trails — ensuring reliability at scale.' },
      techStack: ['React.js', 'React Native', 'Node.js', 'PostgreSQL', 'Redis', 'MongoDB'],
      tags: ['SaaS', 'Fintech', 'Full-Stack', 'Mobile', 'Production'],
      liveUrl: 'https://rupeecollect.in',
      featured: true,
      published: true,
      order: 1,
      caseStudy: {
        subtitle: 'Fintech · Loan Collection SaaS',
        tagline: 'Replacing spreadsheets and WhatsApp groups with a production-grade collection platform',
        meta: {
          developer: 'Sole Developer (Full-Stack)',
          stackHighlight: ['React Native', 'Node.js', 'PostgreSQL', 'Redis'],
          impact: ['₹50+ Crore Collected', '500+ Companies', '10,000+ Customers'],
        },
        sections: [
          {
            id: 'problem', type: 'problem', number: '01', title: 'Problem Identified',
            lead: 'Finance companies were running collections on Excel, WhatsApp, and paper registers — creating a data and accountability black hole.',
            body: 'Chit funds, NBFCs, and microfinance lenders had no digital infrastructure for field collection. Agents tracked repayments in notebooks, managers chased status via WhatsApp, and back-office teams spent days reconciling Excel sheets. There was no real-time visibility into overdue accounts, agent performance, or cash flow.',
            items: [
              { emoji: '📋', title: 'Manual Tracking', body: 'Collections recorded in notebooks and Excel — error-prone, slow to reconcile, impossible to audit in real time.' },
              { emoji: '📵', title: 'Zero Field-Agent Tooling', body: 'Field agents had no mobile app — they relied on paper receipts and WhatsApp, leading to missed collections and disputed records.' },
              { emoji: '📊', title: 'No P&L Visibility', body: 'Profit & loss, overdue aging, and cash flow were calculated manually, weeks after the fact.' },
              { emoji: '🔐', title: 'No Access Control', body: 'No role segregation between field agents, data entry operators, and management — raising compliance and fraud risks.' },
            ],
          },
          {
            id: 'solution', type: 'solution', number: '02', title: 'Solution We Gave',
            lead: 'A complete digital collection ecosystem — mobile app for agents, back-office dashboard, and automated financial reporting — live in production.',
            body: 'Built an end-to-end SaaS platform that digitises the entire collection workflow. Field agents use a React Native app to record daily/weekly/monthly collections in real time. Back-office teams get a React.js dashboard with live overdue alerts, agent performance metrics, and automated P&L reports.',
            items: [
              { emoji: '📱', title: 'React Native Field App', body: 'Agents record collections, view repayment schedules, and receive overdue alerts on mobile — with offline support.' },
              { emoji: '🏢', title: 'Back-Office Dashboard', body: 'Real-time visibility into agent performance, collection totals, overdue aging, and portfolio health.' },
              { emoji: '📈', title: 'Automated P&L Reporting', body: 'Income, expense, and profit & loss reports generated automatically from live transaction data.' },
              { emoji: '🔑', title: 'Role-Based Access Control', body: 'Three-tier permission system (Admin, Super User, Data Entry) — each user sees and does exactly what their role requires.' },
            ],
          },
        ],
      },
    },

    // ── FitCore ───────────────────────────────────────────────────────────────
    {
      title: { en: 'FitCore – Gym Management Platform' },
      slug: 'fitcore',
      description: { en: 'Full-stack gym management SaaS in active production — member management, trainer scheduling, attendance kiosk, invoicing, workout plans, and reporting in one unified platform.' },
      longDescription: { en: 'Built and deployed a full-featured gym management platform as a freelance project, currently live and in use at a real gym.\n\nOwners manage members, trainers, and membership plans from a single dashboard. The self-service attendance kiosk lets members check in via QR code or ID without staff involvement. Automated invoicing tracks payments and surfaces overdue memberships immediately.\n\nTrainers assign personalised workout plans with progression tracking per member. Reporting dashboards give owners real-time visibility into revenue, retention, and trainer workload.\n\nArchitected with a role-based access system for admins, trainers, and members. Built with white-label multi-tenant SaaS expansion in mind.' },
      techStack: ['Laravel', 'React.js', 'PostgreSQL', 'REST API'],
      tags: ['SaaS', 'Full-Stack', 'Freelance', 'Production'],
      liveUrl: 'https://fitcore.abbazi.in/login',
      featured: true,
      published: true,
      order: 2,
      caseStudy: {
        subtitle: 'SaaS · Gym Management',
        tagline: 'One platform to replace the register, the WhatsApp group, and the accountant',
        meta: {
          developer: 'Sole Developer (Freelance)',
          stackHighlight: ['Laravel', 'React.js', 'PostgreSQL'],
          impact: ['Live Production', 'Multi-tenant Ready', 'Fully Automated Billing'],
        },
        sections: [
          {
            id: 'problem', type: 'problem', number: '01', title: 'Problem Identified',
            lead: 'Gym owners managed members, payments, and trainers across WhatsApp, Excel, and a physical register — with no single source of truth.',
            body: 'Small and mid-sized gyms operated without dedicated software. Membership renewals were tracked in spreadsheets, attendance in registers, payments in WhatsApp chats. Owners had no real-time view of revenue, retention, or which members were overdue.',
            items: [
              { emoji: '📒', title: 'Paper & Spreadsheet Operations', body: 'Attendance registers and Excel sheets were the only record — no digital history, no search, no audit trail for disputes.' },
              { emoji: '💸', title: 'Missed Payments & Renewals', body: 'No automated billing meant overdue members went unnoticed for weeks, directly impacting revenue.' },
              { emoji: '🏋️', title: 'No Trainer Workflow', body: 'Trainers had no structured way to assign or track workout plans — guidance was verbal and inconsistent.' },
              { emoji: '📉', title: 'No Business Visibility', body: 'Revenue, retention, and trainer performance were invisible without hours of manual data consolidation each month.' },
            ],
          },
          {
            id: 'solution', type: 'solution', number: '02', title: 'Solution We Gave',
            lead: 'A unified gym management platform with a self-service kiosk, automated invoicing, trainer workout tools, and live business dashboards.',
            body: 'Built a complete gym operations platform covering every workflow an owner, trainer, and member needs. Members self-check-in at a kiosk. Invoicing is automated with overdue alerts. Trainers assign progression-based workout plans. Owners see revenue, retention, and trainer performance in real time.',
            items: [
              { emoji: '🖥️', title: 'Self-Service Attendance Kiosk', body: 'Members check in via QR code or ID — no staff required, attendance tracked automatically.' },
              { emoji: '🧾', title: 'Automated Invoicing', body: 'Membership billing runs on schedule. Overdue members are flagged instantly on the owner dashboard.' },
              { emoji: '💪', title: 'Trainer Workout Plans', body: 'Trainers build personalised plans and track member progression over time — structured and measurable.' },
              { emoji: '📊', title: 'Owner Business Dashboard', body: 'Live revenue, retention rate, trainer workload, and membership health — no spreadsheets needed.' },
            ],
          },
        ],
      },
    },

    // ── Shriram UPI ───────────────────────────────────────────────────────────
    {
      title: { en: 'Shriram One – UPI Platform' },
      slug: 'shriram-one-upi',
      description: { en: 'Enterprise UPI payment platform built on a microservices architecture for Shriram Finance, processing real transactions via HDFC Bank integration with MSSQL table partitioning for high-volume throughput.' },
      longDescription: { en: 'Designed and built the UPI platform as part of Shriram Finance\'s digital payments initiative, serving the Shriram One super-app.\n\nArchitected independently deployable microservices covering UPI onboarding, transaction processing, accounting entries, and payment settlements. Built .NET backend APIs integrating HDFC Bank as the bank vendor, handling UPI intent, collect, and mandate flows.\n\nImplemented MSSQL table partitioning to sustain high transaction volumes without performance degradation. Used MongoDB for logging and audit trails across all services.\n\nThe platform processes real financial transactions for Shriram Finance customers as part of their broader digital banking strategy.' },
      techStack: ['.NET', 'MSSQL', 'MongoDB', 'Microservices', 'UPI', 'HDFC Bank'],
      tags: ['Enterprise', 'Fintech', 'Microservices', 'UPI', 'NPCI'],
      featured: true,
      published: true,
      order: 3,
    },

    // ── Shriram BBPS ──────────────────────────────────────────────────────────
    {
      title: { en: 'Shriram One – BBPS Platform' },
      slug: 'shriram-one-bbps',
      description: { en: 'Omnichannel BBPS bill payment platform for Shriram Finance — Angular SSR web frontend, Laravel API gateway, and BillDesk/PayU integrations using the Abstract Factory pattern.' },
      longDescription: { en: 'Built the Angular web front end for BBPS within the Shriram One ecosystem, covering biller search, bill payment flows, and transaction status tracking with server-side rendering for performance and SEO.\n\nBuilt a Laravel wrapper API that exposes BBPS capabilities to the web channel, integrating billing vendors BillDesk and PayU using the Abstract Factory pattern — enabling vendor switching without touching business logic.\n\nCurrently leading the re-architecture into a single omnichannel API layer shared by web and mobile app channels, eliminating duplication and ensuring feature parity across platforms.' },
      techStack: ['Angular', 'Angular Universal', 'Laravel', '.NET', 'BillDesk', 'PayU', 'MSSQL'],
      tags: ['Enterprise', 'Fintech', 'BBPS', 'Full-Stack', 'NPCI'],
      featured: false,
      published: true,
      order: 4,
    },

    // ── Shriram Merchant Acquisition ──────────────────────────────────────────
    {
      title: { en: 'Shriram Merchant Acquisition Platform' },
      slug: 'shriram-merchant-acquisition',
      description: { en: 'End-to-end UPI merchant acquisition platform — Laravel APIs, KYC verification (PAN, Aadhaar, CKYC, GST), sound-box integrations (ToneTag, CWD), and an internal React.js CRM for operations.' },
      longDescription: { en: 'Owned end-to-end technical delivery of the merchant acquisition platform, enabling Shriram Finance to onboard UPI merchants at scale.\n\nBuilt Laravel REST APIs powering the Merchant App and Mziva field-agent app, supporting merchant onboarding, account management, and full KYC verification (PAN, Aadhaar, CKYC, GST, trade licence) via Yes Bank and CAMS.\n\nIntegrated sound-box vendors ToneTag and CWD using the Abstract Factory pattern for vendor-agnostic payment confirmation alerts.\n\nBuilt an internal React.js/Node.js CRM for master data management, merchant logs, and reporting. Built the QC portal used by the Customer Care team to validate and approve merchant applications before activation.' },
      techStack: ['Laravel', 'React.js', 'Node.js', 'MySQL', 'Redis', 'MongoDB'],
      tags: ['Enterprise', 'Fintech', 'KYC', 'Full-Stack', 'UPI'],
      featured: false,
      published: true,
      order: 5,
    },

    // ── Extremist ─────────────────────────────────────────────────────────────
    {
      title: { en: 'Extremist – Engineering Collaboration App' },
      slug: 'extremist',
      description: { en: 'Golang desktop app for engineering teams on Ubuntu — replaces Microsoft Teams with real-time LAN chat and file sharing, and consolidates MySQL, MSSQL, MongoDB, and PostgreSQL into one unified database console.' },
      longDescription: { en: 'Designed and developed "Extremist" — a lightweight Golang desktop application for internal engineering collaboration, built to solve specific pain points in the team\'s daily workflow.\n\nThe app provides real-time team chat over LAN with secure file sharing — no external servers, no internet required. The integrated multi-database console supports MySQL, MSSQL, MongoDB, and PostgreSQL in a single interface, covering CRUD operations, SQL query execution, stored procedures, triggers, views, and database administration.\n\nBuilt in Golang for minimal system resource usage — a deliberate choice to replace Electron-based tools that burdened developer machines.' },
      techStack: ['Golang', 'MySQL', 'MSSQL', 'MongoDB', 'PostgreSQL'],
      tags: ['Desktop', 'Tooling', 'Internal', 'Golang'],
      featured: false,
      published: true,
      order: 6,
      caseStudy: {
        subtitle: 'Internal Tooling · Golang Desktop App',
        tagline: 'One lightweight app to replace Teams, four database clients, and a file-sharing utility',
        meta: {
          developer: 'Sole Developer',
          stackHighlight: ['Golang', 'Multi-DB Console', 'LAN Networking'],
          impact: ['Replaced 6+ Tools', 'Zero External Dependencies', 'Minimal Resource Footprint'],
        },
        sections: [
          {
            id: 'problem', type: 'problem', number: '01', title: 'Problem Identified',
            lead: 'The engineering team ran six separate tools for daily work — each one fighting for RAM and requiring constant context-switching.',
            body: 'Developer machines were burdened by Microsoft Teams alongside multiple database clients — MySQL Workbench, SSMS, MongoDB Compass, and pgAdmin. LAN file transfers required a separate third-party app. Every context switch broke focus and slowed the team down.',
            items: [
              { emoji: '🐘', title: 'Microsoft Teams Overhead', body: 'Teams consumed 400–600 MB RAM as an Electron app, consistently slowing developer machines.' },
              { emoji: '🗃️', title: 'Four Separate DB Clients', body: 'Switching between MySQL Workbench, SSMS, Compass, and pgAdmin added unnecessary context-switching and desktop clutter.' },
              { emoji: '📁', title: 'No Easy LAN File Transfer', body: 'Sharing files between team machines required third-party apps — an avoidable dependency for an internal network.' },
              { emoji: '⚡', title: 'Resource Competition', body: 'All tools running simultaneously competed for CPU and RAM, degrading performance for actual development work.' },
            ],
          },
          {
            id: 'solution', type: 'solution', number: '02', title: 'Solution We Gave',
            lead: 'A single Golang desktop app replacing all of them — real-time LAN chat, file sharing, and a unified multi-database console with a minimal footprint.',
            body: 'Built Extremist in Golang for low system overhead. The app handles real-time team chat over LAN, secure file sharing, and a unified database console supporting MySQL, MSSQL, MongoDB, and PostgreSQL in one interface. Developers open one tool for everything — no alt-tabbing, no RAM drain.',
            items: [
              { emoji: '💬', title: 'Real-Time LAN Chat', body: 'Team chat runs entirely over the local network — no external servers, no Teams subscription required.' },
              { emoji: '📤', title: 'Integrated File Sharing', body: 'File transfers between machines over LAN, built directly into the app — no third-party tools.' },
              { emoji: '🗄️', title: 'Unified Multi-DB Console', body: 'MySQL, MSSQL, MongoDB, and PostgreSQL in a single interface — CRUD, SQL, stored procedures, and admin tasks all in one place.' },
              { emoji: '🚀', title: 'Minimal Resource Footprint', body: 'Golang\'s compiled binary uses a fraction of the RAM of Electron apps — developer machines stay fast.' },
            ],
          },
        ],
      },
    },

    // ── PR Automation ─────────────────────────────────────────────────────────
    {
      title: { en: 'PR Automation Tool' },
      slug: 'pr-automation-tool',
      description: { en: 'Automated Pull Request pipeline that monitors repositories, runs AI-assisted code reviews, enforces configurable quality gates, auto-merges on pass, and handles semantic release tagging.' },
      longDescription: { en: 'Built an automated PR Automation Tool that continuously monitors Bitbucket repositories for new pull requests and orchestrates the entire review-to-merge lifecycle.\n\nCapabilities:\n• AI-assisted code review on every PR — identifies quality issues, logic errors, and style violations automatically\n• Configurable quality gates: linting, test coverage thresholds, build verification\n• Repository command execution based on review outcomes\n• Auto-merges PRs only when all quality gates pass — removing human error from the merge decision\n• Automated semantic version tagging on successful merge — no manual release management\n• Consistent code quality enforced across the team regardless of reviewer availability' },
      techStack: ['Node.js', 'AI', 'MCP', 'Bitbucket', 'Automation', 'Git'],
      tags: ['Tooling', 'AI', 'Automation', 'DevOps'],
      featured: false,
      published: true,
      order: 7,
      caseStudy: {
        subtitle: 'DevOps · AI-Assisted Automation',
        tagline: 'Removing bottlenecks and human error from the PR review-to-merge lifecycle',
        meta: {
          developer: 'Sole Developer',
          stackHighlight: ['Node.js', 'AI Review Engine', 'Bitbucket API'],
          impact: ['Zero Missed Quality Checks', 'Auto-Merge on Pass', 'Automated Release Tags'],
        },
        sections: [
          {
            id: 'problem', type: 'problem', number: '01', title: 'Problem Identified',
            lead: 'Code review was a bottleneck — PRs sat waiting for senior devs, quality was inconsistent, and merges were made manually with no enforcement.',
            body: 'As the team scaled, PRs would sit unreviewed for hours or days when senior developers were unavailable. Quality was inconsistent — different reviewers caught different things, with no enforced gates. Merges were made manually, and release tagging was also a manual step adding overhead to every deployment.',
            items: [
              { emoji: '⏳', title: 'Review Bottlenecks', body: 'PRs queued behind senior devs — when they were in meetings or on leave, the entire delivery pipeline slowed down.' },
              { emoji: '📉', title: 'Inconsistent Code Quality', body: 'Without enforced gates, review quality varied by reviewer — some PRs were scrutinised, others waved through.' },
              { emoji: '💥', title: 'Unsafe Manual Merges', body: 'Merges were triggered by humans after a visual check — easy to approve before all tests had finished.' },
              { emoji: '🏷️', title: 'Manual Release Tagging', body: 'Every release required a developer to manually create a version tag — repetitive overhead that occasionally got forgotten.' },
            ],
          },
          {
            id: 'solution', type: 'solution', number: '02', title: 'Solution We Gave',
            lead: 'A fully automated PR pipeline — AI review, configurable quality gates, conditional auto-merge, and automatic release tagging on every merge.',
            body: 'Built a tool that monitors Bitbucket for new PRs and orchestrates the full lifecycle automatically. AI reviews every PR for quality issues. Configurable gates must all pass before any merge is allowed. The tool auto-merges only when all gates are green — no human in the loop for routine PRs.',
            items: [
              { emoji: '🤖', title: 'AI-Assisted Code Review', body: 'Every PR gets an AI review pass covering code quality, logic errors, and style — consistent, thorough, and instant.' },
              { emoji: '🔒', title: 'Configurable Quality Gates', body: 'Linting, test coverage thresholds, and build verification run as required gates — a PR cannot merge until every gate passes.' },
              { emoji: '✅', title: 'Conditional Auto-Merge', body: 'When all gates pass, the tool merges automatically — no human needed for routine PRs, no risk of premature merges.' },
              { emoji: '🏷️', title: 'Automatic Release Tagging', body: 'Semantic version tags are created on every successful merge — version management is fully automated.' },
            ],
          },
        ],
      },
    },

    // ── MCP Servers ───────────────────────────────────────────────────────────
    {
      title: { en: 'MCP Server Integrations' },
      slug: 'mcp-server-integrations',
      description: { en: 'Custom Model Context Protocol server integrations for Jira, Bitbucket, Rediffmail, Snap DB, and Dynatrace — letting AI assistants query and act on enterprise tools via natural language.' },
      longDescription: { en: 'Built custom MCP server integrations that bridge enterprise tooling to AI assistants, enabling developers to query and operate business systems through natural language without context-switching.\n\nIntegrations built:\n• Jira – AI-assisted issue creation, sprint management, and ticket queries\n• Bitbucket – code browsing, PR status, and pipeline queries\n• Rediffmail – email reading and composition via AI\n• Snap DB – natural language database queries against internal data stores\n• Dynatrace – monitoring alert queries and performance metric lookups\n\nDevelopers stay in their AI assistant while the MCP servers handle authentication, data fetching, and action execution against each enterprise system.' },
      techStack: ['MCP', 'Node.js', 'AI', 'Jira', 'Bitbucket', 'Dynatrace', 'Rediffmail'],
      tags: ['AI', 'Tooling', 'MCP', 'Automation', 'Developer Productivity'],
      featured: false,
      published: true,
      order: 8,
      caseStudy: {
        subtitle: 'AI Tooling · MCP Integrations',
        tagline: 'Letting AI assistants operate your enterprise stack so developers stay in flow',
        meta: {
          developer: 'Sole Developer',
          stackHighlight: ['MCP Protocol', 'Node.js', 'Jira API', 'Dynatrace API'],
          impact: ['5 Enterprise Systems', 'Zero Context-Switching', 'Natural Language Queries'],
        },
        sections: [
          {
            id: 'problem', type: 'problem', number: '01', title: 'Problem Identified',
            lead: 'Developers using AI assistants were still manually switching to five different enterprise tools — breaking flow state dozens of times a day.',
            body: 'The engineering team used AI assistants for coding but had to manually check Jira, open Bitbucket for PR status, log into Dynatrace for alerts, check Rediffmail for stakeholder emails, and query Snap DB for data — often mid-task. Each switch broke developer context.',
            items: [
              { emoji: '🔀', title: 'Constant Context-Switching', body: 'Developers broke flow state dozens of times per day moving between their AI assistant, Jira, Bitbucket, Dynatrace, email, and database tools.' },
              { emoji: '🤖', title: 'AI Assistants Lacked Context', body: 'AI tools couldn\'t answer "what\'s in my sprint?" or "are there any alerts?" — they had no access to enterprise systems.' },
              { emoji: '🐌', title: 'Manual Information Retrieval', body: 'Every lookup — ticket status, PR review comments, monitoring alerts — required manual navigation through multiple authenticated portals.' },
              { emoji: '📧', title: 'Enterprise Email Silos', body: 'Rediffmail sat entirely outside the development workflow — emails required a separate login, breaking the unified working environment.' },
            ],
          },
          {
            id: 'solution', type: 'solution', number: '02', title: 'Solution We Gave',
            lead: 'Five custom MCP servers connecting AI assistants directly to Jira, Bitbucket, Dynatrace, Rediffmail, and Snap DB — operate everything via natural language.',
            body: 'Built custom MCP servers for each enterprise system following the Model Context Protocol standard. Developers ask their AI assistant to check sprint status, review PR comments, query monitoring dashboards, read emails, or run database queries — MCP servers handle authentication, API calls, and data formatting transparently.',
            items: [
              { emoji: '📋', title: 'Jira MCP Server', body: 'Create tickets, query sprint status, update issue fields — all from the AI assistant prompt.' },
              { emoji: '🔀', title: 'Bitbucket MCP Server', body: 'Browse code, check PR status and review comments, query pipeline results — the AI answers "what\'s blocking my PR?" instantly.' },
              { emoji: '📡', title: 'Dynatrace MCP Server', body: 'Query monitoring alerts, performance metrics, and anomaly reports in natural language — no dashboard login needed.' },
              { emoji: '🗃️', title: 'Snap DB & Rediffmail Servers', body: 'Database queries and email operations through the AI assistant — internal data and stakeholder communication unified in the development workflow.' },
            ],
          },
        ],
      },
    },
  ]);
  console.log('✓ Projects');

  // ── Settings ─────────────────────────────────────────────────────────────
  await Settings.create({
    siteName: 'Alwin Regan P – Portfolio',
    metaTitle: 'Alwin Regan P | Full-Stack Developer & APM',
    metaDescription: 'Full-Stack Developer & Associate Project Manager specializing in fintech platforms, microservices, and AI-assisted engineering workflows.',
    featureToggles: {
      showProjects: true,
      showSkills: true,
      showContactForm: true,
      showExperience: true,
      showCertifications: true,
      showApps: false,
      enableBlog: false,
    },
    metadata: {
      pageLayout: {
        sections: [
          { id: 'hero',           label: 'Hero',           visible: true,  locked: true,  order: 0 },
          { id: 'about',          label: 'About',          visible: true,  locked: false, order: 1 },
          { id: 'projects',       label: 'Projects',       visible: true,  locked: false, order: 2 },
          { id: 'skills',         label: 'Skills',         visible: true,  locked: false, order: 3 },
          { id: 'experience',     label: 'Experience',     visible: true,  locked: false, order: 4 },
          { id: 'certifications', label: 'Certifications', visible: true,  locked: false, order: 5 },
          { id: 'contact',        label: 'Contact',        visible: true,  locked: false, order: 6 },
        ],
      },
      theme: {
        primary: '#7c3aed',
        primaryDark: '#6d28d9',
        accent: '#f59e0b',
        brand: '#c6613f',
        bgLight: '#fafafa',
        bgDark: '#09090b',
        glowPrimary: 0.12,
        glowAccent: 0.07,
        glowPrimaryDark: 0.22,
        glowAccentDark: 0.13,
      },
      customSections: [],
    },
  });
  console.log('✓ Settings');

  // ── Admin user ────────────────────────────────────────────────────────────
  await User.deleteMany({});
  const hashed = await bcrypt.hash('Alwin@2527', 10);
  await User.create({ username: 'alwin_regan', password: hashed, role: 'admin' });
  console.log('✓ Admin user');

  console.log('\n✅ Database seeded successfully!');
  console.log('─────────────────────────────────────');
  console.log('Admin panel: /admin/login');
  console.log('Username:    alwin_regan');
  console.log('Password:    Alwin@2527');
  console.log('─────────────────────────────────────');

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});

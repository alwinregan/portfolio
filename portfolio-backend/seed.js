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
    {
      title: { en: 'RupeeCollect' },
      slug: 'rupeecollect',
      description: { en: 'Full-stack SaaS platform for chit funds, NBFCs, and microfinance companies. In production pilot with paying customers across Tamil Nadu, streamlining loan collection and back-office operations.' },
      longDescription: { en: 'Designed and developed a full-stack SaaS platform for chit funds, NBFCs, and microfinance companies, currently undergoing production pilot testing with paying customers across Tamil Nadu.\n\nField agents use React.js web and React Native mobile apps to record daily, weekly, and monthly collections, manage repayment schedules, receive overdue-payment alerts, and operate in the field.\n\nBack-office includes agent performance tracking, role-based access control (Admin, Super User, Data Entry), and income, expense, and profit & loss reporting.\n\nArchitected with PostgreSQL for transactional data, Redis for caching, and MongoDB for application logs and audit trails.' },
      techStack: ['React.js', 'React Native', 'Node.js', 'PostgreSQL', 'Redis', 'MongoDB'],
      tags: ['SaaS', 'Fintech', 'Full-Stack', 'Mobile'],
      liveUrl: 'https://rupeecollect.in',
      featured: true,
      published: true,
      order: 1,
    },
    {
      title: { en: 'FitCore – Gym Management Platform' },
      slug: 'fitcore',
      description: { en: 'Self-initiated freelance gym management platform in production for a live gym. Centralizes member, trainer, membership, payment, invoicing, attendance, workout planning, and reporting.' },
      longDescription: { en: 'Built and deployed a full-stack gym management platform using Laravel, React.js, and PostgreSQL.\n\nFeatures: member and trainer management, membership plans, payment and invoicing, attendance kiosk (self-service check-ins), personalized workout plan assignments, and reporting dashboards.\n\nRole-based access control for trainers, members, and admins. Architected for future white-label multi-tenant SaaS expansion.' },
      techStack: ['Laravel', 'React.js', 'PostgreSQL', 'REST API'],
      tags: ['SaaS', 'Full-Stack', 'Freelance', 'Production'],
      liveUrl: 'https://fitcore.abbazi.in/login',
      featured: true,
      published: true,
      order: 2,
    },
    {
      title: { en: 'Shriram One – UPI Platform' },
      slug: 'shriram-one-upi',
      description: { en: 'Enterprise UPI payment platform on microservices architecture for Shriram Finance, processing real transactions with HDFC Bank integration and MSSQL table partitioning for high volumes.' },
      longDescription: { en: 'Designed and built the UPI platform on a microservices-based architecture, with independently deployable services for onboarding, transactions, accounting entries, and payments.\n\nBuilt backend APIs in .NET integrating HDFC Bank as the bank vendor. Used MSSQL with table partitioning for high transaction volumes, and MongoDB for logging.' },
      techStack: ['.NET', 'MSSQL', 'MongoDB', 'Microservices', 'UPI'],
      tags: ['Enterprise', 'Fintech', 'Microservices', 'UPI'],
      featured: true,
      published: true,
      order: 3,
    },
    {
      title: { en: 'Shriram One – BBPS Platform' },
      slug: 'shriram-one-bbps',
      description: { en: 'Omnichannel BBPS bill payment platform for Shriram Finance — Angular SSR web frontend, Laravel API gateway, and BillDesk/PayU integrations using the Abstract Factory pattern.' },
      longDescription: { en: 'Built the Angular web front end for BBPS covering bill payment flows, biller search, and transaction status tracking.\n\nBuilt a Laravel wrapper API exposing BBPS to the web channel, integrating billing vendors BillDesk and PayU using Abstract Factory pattern.\n\nCurrently re-architecting into a single omnichannel API so web and app share the same backend.' },
      techStack: ['Angular', 'Angular Universal', 'Laravel', '.NET', 'BillDesk', 'PayU', 'MSSQL'],
      tags: ['Enterprise', 'Fintech', 'BBPS', 'Full-Stack'],
      featured: false,
      published: true,
      order: 4,
    },
    {
      title: { en: 'Shriram Merchant Acquisition Platform' },
      slug: 'shriram-merchant-acquisition',
      description: { en: 'End-to-end UPI merchant acquisition platform with Laravel APIs, KYC verification (PAN, Aadhaar, CKYC, GST), sound-box integrations (ToneTag, CWD), and an internal React.js CRM.' },
      longDescription: { en: 'Owned end-to-end technical delivery of the merchant acquisition platform.\n\nBuilt Laravel REST APIs for the Merchant App and Mziva field-agent app, supporting merchant onboarding, account management, and KYC (PAN, Aadhaar, CKYC, GST, trade license).\n\nBuilt an internal React.js/Node.js CRM for master data management, merchant logs, and reporting. Built the QC portal for the Customer Care team to validate and approve merchants.\n\nIntegrated onboarding vendors Yes Bank and CAMS, and sound-box vendors ToneTag and CWD using Abstract Factory pattern.' },
      techStack: ['Laravel', 'React.js', 'Node.js', 'MySQL', 'Redis', 'MongoDB'],
      tags: ['Enterprise', 'Fintech', 'KYC', 'Full-Stack'],
      featured: false,
      published: true,
      order: 5,
    },
    {
      title: { en: 'Extremist – Engineering Collaboration App' },
      slug: 'extremist',
      description: { en: 'Golang-based Ubuntu desktop app for internal engineering collaboration, replacing Microsoft Teams. Features real-time chat, LAN file sharing, and a unified multi-database management console.' },
      longDescription: { en: 'Designed and developed "Extremist" — a Golang-based Ubuntu desktop app for internal engineering collaboration.\n\nFeatures:\n• Real-time team chat\n• Secure LAN file sharing\n• Multi-database management console: MySQL, MSSQL, MongoDB, PostgreSQL\n• CRUD operations, SQL query execution, stored procedures, triggers, views, and database administration through a single interface.' },
      techStack: ['Golang', 'MySQL', 'MSSQL', 'MongoDB', 'PostgreSQL'],
      tags: ['Desktop', 'Tooling', 'Internal', 'Golang'],
      featured: false,
      published: true,
      order: 6,
    },
    {
      title: { en: 'PR Automation Tool' },
      slug: 'pr-automation-tool',
      description: { en: 'Automated Pull Request tool that monitors repositories, runs AI-assisted code reviews, executes quality gates, auto-merges on pass, and handles release tagging.' },
      longDescription: { en: 'Built an automated PR Automation Tool that continuously monitors repositories for new pull requests.\n\nCapabilities:\n• AI-assisted code reviews and static quality checks\n• Executes repository commands based on review outcomes\n• Auto-merges PRs when all quality gates pass\n• Automates release tagging and merge workflows\n• Ensures consistent code quality across the team' },
      techStack: ['AI', 'MCP', 'Git', 'Bitbucket', 'Automation'],
      tags: ['Tooling', 'AI', 'Automation', 'DevOps'],
      featured: false,
      published: true,
      order: 7,
    },
    {
      title: { en: 'MCP Server Integrations' },
      slug: 'mcp-server-integrations',
      description: { en: 'Custom Model Context Protocol (MCP) server integrations for Jira, Bitbucket, Rediffmail, Snap DB, and Dynatrace — enabling AI assistants to interact with enterprise tools via natural language.' },
      longDescription: { en: 'Built custom MCP server integrations for enterprise tools:\n\n• Jira – AI-assisted issue tracking and sprint management\n• Bitbucket – code management and PR workflows\n• Rediffmail – email automation\n• Snap DB – database query via AI\n• Dynatrace – monitoring and alerting\n\nEnables developer productivity by allowing AI assistants to interact with these systems through natural language.' },
      techStack: ['MCP', 'AI', 'Jira', 'Bitbucket', 'Dynatrace', 'Node.js'],
      tags: ['AI', 'Tooling', 'MCP', 'Automation'],
      featured: false,
      published: true,
      order: 8,
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

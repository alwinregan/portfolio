/**
 * update-projects.js
 * Run once on the server to update all project content + add case studies.
 * Usage: node update-projects.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./src/models/project.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

const projects = [
  // ── RupeeCollect ──────────────────────────────────────────────────────────
  {
    slug: 'rupeecollect',
    title: { en: 'RupeeCollect' },
    description: {
      en: 'Full-stack SaaS platform for chit funds, NBFCs, and microfinance companies — ₹50+ crore collected, 500+ companies onboarded, 10,000+ customers served across Tamil Nadu.',
    },
    longDescription: {
      en: 'Designed and developed a production-grade SaaS platform that digitises the entire loan collection lifecycle for chit funds, NBFCs, and microfinance companies.\n\nField agents use a React Native mobile app to record collections on-the-go, manage repayment schedules, receive overdue-payment alerts, and operate without continuous internet connectivity. The React.js web back-office provides agent performance dashboards, role-based access control (Admin, Super User, Data Entry), and fully automated income, expense, and profit & loss reporting.\n\nThe platform has processed over ₹50 crore in collections, onboarded 500+ companies, and serves 10,000+ customers across Tamil Nadu in active production.\n\nArchitected with PostgreSQL for transactional integrity, Redis for high-speed caching, and MongoDB for application logs and audit trails — ensuring reliability at scale.',
    },
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
          id: 'problem',
          type: 'problem',
          number: '01',
          title: 'Problem Identified',
          lead: 'Finance companies were running collections on Excel, WhatsApp, and paper registers — creating a data and accountability black hole.',
          body: 'Chit funds, NBFCs, and microfinance lenders had no digital infrastructure for field collection. Agents tracked repayments in notebooks, managers chased status via WhatsApp, and back-office teams spent days reconciling Excel sheets. There was no real-time visibility into overdue accounts, agent performance, or cash flow — meaning the business was always flying blind.',
          items: [
            {
              emoji: '📋',
              title: 'Manual Tracking',
              body: 'Collections were recorded in notebooks and consolidated into Excel — error-prone, slow to reconcile, and impossible to audit in real time.',
            },
            {
              emoji: '📵',
              title: 'Zero Field-Agent Tooling',
              body: 'Field agents had no mobile app — they relied on paper receipts and WhatsApp, leading to missed collections and disputed records.',
            },
            {
              emoji: '📊',
              title: 'No P&L Visibility',
              body: 'Back-office had no automated financial reporting. Profit & loss, overdue aging, and cash flow were calculated manually, weeks after the fact.',
            },
            {
              emoji: '🔐',
              title: 'No Access Control',
              body: 'Everyone saw everything — no role segregation between field agents, data entry operators, and management, raising compliance and fraud risks.',
            },
          ],
        },
        {
          id: 'solution',
          type: 'solution',
          number: '02',
          title: 'Solution We Gave',
          lead: 'A complete digital collection ecosystem — mobile app for agents, back-office dashboard, and automated financial reporting — live in production.',
          body: 'Built an end-to-end SaaS platform that digitises the entire collection workflow. Field agents use a React Native app to record daily/weekly/monthly collections in real time, even offline. Back-office teams get a React.js dashboard with live overdue alerts, agent performance metrics, and automated P&L reports. Admins enforce role-based access across all user tiers.',
          items: [
            {
              emoji: '📱',
              title: 'React Native Field App',
              body: 'Agents record collections, view repayment schedules, and receive overdue alerts on mobile — with offline support for low-connectivity field conditions.',
            },
            {
              emoji: '🏢',
              title: 'Back-Office Dashboard',
              body: 'Real-time visibility into agent performance, collection totals, overdue aging, and portfolio health — no manual consolidation required.',
            },
            {
              emoji: '📈',
              title: 'Automated P&L Reporting',
              body: 'Income, expense, and profit & loss reports generated automatically from live transaction data — always current, zero spreadsheet effort.',
            },
            {
              emoji: '🔑',
              title: 'Role-Based Access Control',
              body: 'Three-tier permission system (Admin, Super User, Data Entry) ensures each user sees and does exactly what their role requires — nothing more.',
            },
          ],
        },
      ],
    },
  },

  // ── FitCore ───────────────────────────────────────────────────────────────
  {
    slug: 'fitcore',
    title: { en: 'FitCore – Gym Management Platform' },
    description: {
      en: 'Full-stack gym management SaaS in active production — member management, trainer scheduling, attendance kiosk, invoicing, workout plans, and reporting in one unified platform.',
    },
    longDescription: {
      en: 'Built and deployed a full-featured gym management platform as a freelance project, currently live and in use at a real gym.\n\nOwners manage members, trainers, and membership plans from a single dashboard. The self-service attendance kiosk lets members check in via QR code or ID without staff involvement. Automated invoicing tracks payments and surfaces overdue memberships immediately.\n\nTrainers assign personalised workout plans with progression tracking per member. Reporting dashboards give owners real-time visibility into revenue, retention, and trainer workload.\n\nArchitected with a role-based access system for admins, trainers, and members. Built with white-label multi-tenant SaaS expansion in mind — the platform is designed to onboard additional gyms without code changes.',
    },
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
          id: 'problem',
          type: 'problem',
          number: '01',
          title: 'Problem Identified',
          lead: 'Gym owners managed members, payments, and trainers across WhatsApp, Excel, and a physical register — with no single source of truth.',
          body: 'Small and mid-sized gyms operated without dedicated software. Membership renewals were tracked in spreadsheets, attendance was recorded in registers, payments were noted in WhatsApp chats, and trainer assignments were verbal. Owners had no real-time view of revenue, retention, or which members were overdue — decisions were made on gut feel, not data.',
          items: [
            {
              emoji: '📒',
              title: 'Paper & Spreadsheet Operations',
              body: 'Attendance registers and Excel sheets were the only record — no digital history, no search, no audit trail for disputes.',
            },
            {
              emoji: '💸',
              title: 'Missed Payments & Renewals',
              body: 'No automated billing meant overdue members went unnoticed for weeks, directly impacting revenue and member retention.',
            },
            {
              emoji: '🏋️',
              title: 'No Trainer Workflow',
              body: 'Trainers had no structured way to assign or track workout plans — guidance was verbal, inconsistent, and impossible to measure.',
            },
            {
              emoji: '📉',
              title: 'No Business Visibility',
              body: 'Revenue, retention, and trainer performance were invisible to owners without hours of manual data consolidation each month.',
            },
          ],
        },
        {
          id: 'solution',
          type: 'solution',
          number: '02',
          title: 'Solution We Gave',
          lead: 'A unified gym management platform with a self-service kiosk, automated invoicing, trainer workout tools, and live business dashboards.',
          body: 'Built a complete gym operations platform covering every workflow an owner, trainer, and member needs. Members self-check-in at a kiosk via QR or ID. Invoicing is automated with overdue alerts. Trainers assign and track progression-based workout plans per member. Owners see revenue, retention, and trainer performance in real time — all from one dashboard.',
          items: [
            {
              emoji: '🖥️',
              title: 'Self-Service Attendance Kiosk',
              body: 'Members check in via QR code or ID at a front-of-gym kiosk — no staff required, attendance tracked automatically.',
            },
            {
              emoji: '🧾',
              title: 'Automated Invoicing',
              body: 'Membership billing runs on schedule. Overdue members are flagged instantly — owners see unpaid balances the moment they open the dashboard.',
            },
            {
              emoji: '💪',
              title: 'Trainer Workout Plans',
              body: 'Trainers build personalised plans and track member progression over time — giving every member a structured, measurable programme.',
            },
            {
              emoji: '📊',
              title: 'Owner Business Dashboard',
              body: 'Live revenue, retention rate, trainer workload, and membership health — all visible in one place, no spreadsheets needed.',
            },
          ],
        },
      ],
    },
  },

  // ── Shriram UPI ───────────────────────────────────────────────────────────
  {
    slug: 'shriram-one-upi',
    title: { en: 'Shriram One – UPI Platform' },
    description: {
      en: 'Enterprise UPI payment platform built on a microservices architecture for Shriram Finance, processing real transactions via HDFC Bank integration with MSSQL table partitioning for high-volume throughput.',
    },
    longDescription: {
      en: 'Designed and built the UPI platform as part of Shriram Finance\'s digital payments initiative, serving the Shriram One super-app.\n\nArchitected independently deployable microservices covering UPI onboarding, transaction processing, accounting entries, and payment settlements. Built .NET backend APIs integrating HDFC Bank as the bank vendor, handling UPI intent, collect, and mandate flows.\n\nImplemented MSSQL table partitioning to sustain high transaction volumes without performance degradation. Used MongoDB for logging and audit trails across all services.\n\nThe platform processes real financial transactions for Shriram Finance customers as part of their broader digital banking strategy.',
    },
    techStack: ['.NET', 'MSSQL', 'MongoDB', 'Microservices', 'UPI', 'HDFC Bank'],
    tags: ['Enterprise', 'Fintech', 'Microservices', 'UPI', 'NPCI'],
    featured: true,
    published: true,
    order: 3,
    caseStudy: null,
  },

  // ── Shriram BBPS ──────────────────────────────────────────────────────────
  {
    slug: 'shriram-one-bbps',
    title: { en: 'Shriram One – BBPS Platform' },
    description: {
      en: 'Omnichannel BBPS bill payment platform for Shriram Finance — Angular SSR web frontend, Laravel API gateway, and BillDesk/PayU integrations using the Abstract Factory pattern.',
    },
    longDescription: {
      en: 'Built the Angular web front end for BBPS within the Shriram One ecosystem, covering biller search, bill payment flows, and transaction status tracking with server-side rendering for performance and SEO.\n\nBuilt a Laravel wrapper API that exposes BBPS capabilities to the web channel, integrating billing vendors BillDesk and PayU using the Abstract Factory pattern — enabling vendor switching without touching business logic.\n\nCurrently leading the re-architecture into a single omnichannel API layer shared by web and mobile app channels, eliminating duplication and ensuring feature parity across platforms.',
    },
    techStack: ['Angular', 'Angular Universal', 'Laravel', '.NET', 'BillDesk', 'PayU', 'MSSQL'],
    tags: ['Enterprise', 'Fintech', 'BBPS', 'Full-Stack', 'NPCI'],
    featured: false,
    published: true,
    order: 4,
    caseStudy: null,
  },

  // ── Shriram Merchant Acquisition ──────────────────────────────────────────
  {
    slug: 'shriram-merchant-acquisition',
    title: { en: 'Shriram Merchant Acquisition Platform' },
    description: {
      en: 'End-to-end UPI merchant acquisition platform — Laravel APIs, KYC verification (PAN, Aadhaar, CKYC, GST), sound-box integrations (ToneTag, CWD), and an internal React.js CRM for operations.',
    },
    longDescription: {
      en: 'Owned end-to-end technical delivery of the merchant acquisition platform, enabling Shriram Finance to onboard UPI merchants at scale.\n\nBuilt Laravel REST APIs powering the Merchant App and Mziva field-agent app, supporting merchant onboarding, account management, and full KYC verification (PAN, Aadhaar, CKYC, GST, trade licence) via Yes Bank and CAMS.\n\nIntegrated sound-box vendors ToneTag and CWD using the Abstract Factory pattern for vendor-agnostic payment confirmation alerts.\n\nBuilt an internal React.js/Node.js CRM for master data management, merchant logs, and reporting. Built the QC portal used by the Customer Care team to validate and approve merchant applications before activation.',
    },
    techStack: ['Laravel', 'React.js', 'Node.js', 'MySQL', 'Redis', 'MongoDB'],
    tags: ['Enterprise', 'Fintech', 'KYC', 'Full-Stack', 'UPI'],
    featured: false,
    published: true,
    order: 5,
    caseStudy: null,
  },

  // ── Extremist ─────────────────────────────────────────────────────────────
  {
    slug: 'extremist',
    title: { en: 'Extremist – Engineering Collaboration App' },
    description: {
      en: 'Golang desktop app for engineering teams on Ubuntu — replaces Microsoft Teams with real-time LAN chat and file sharing, and consolidates MySQL, MSSQL, MongoDB, and PostgreSQL into one unified database console.',
    },
    longDescription: {
      en: 'Designed and developed "Extremist" — a lightweight Golang desktop application for internal engineering collaboration, built to solve specific pain points in the team\'s daily workflow.\n\nThe app provides real-time team chat over LAN with secure file sharing — no external servers, no internet required. The integrated multi-database console supports MySQL, MSSQL, MongoDB, and PostgreSQL in a single interface, covering CRUD operations, SQL query execution, stored procedures, triggers, views, and database administration.\n\nBuilt in Golang for minimal system resource usage — a deliberate choice to replace Electron-based tools that burdened developer machines.',
    },
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
          id: 'problem',
          type: 'problem',
          number: '01',
          title: 'Problem Identified',
          lead: 'The engineering team ran six separate tools for daily work — each one fighting for RAM and requiring context-switching throughout the day.',
          body: 'Developer machines were burdened by Microsoft Teams (an Electron app consuming 400–600 MB RAM) alongside multiple database clients — MySQL Workbench, SQL Server Management Studio, MongoDB Compass, and pgAdmin. LAN file transfers required a separate third-party app. Every context switch — switching from code to a DB client to Teams to a file share — broke focus and slowed the team down.',
          items: [
            {
              emoji: '🐘',
              title: 'Microsoft Teams Overhead',
              body: 'Teams consumed 400–600 MB RAM as an Electron app, consistently slowing developer machines and offering more than the team needed.',
            },
            {
              emoji: '🗃️',
              title: 'Four Separate DB Clients',
              body: 'Switching between MySQL Workbench, SSMS, Compass, and pgAdmin for different databases added unnecessary context-switching and desktop clutter.',
            },
            {
              emoji: '📁',
              title: 'No Easy LAN File Transfer',
              body: 'Sharing files between team machines required third-party apps — an avoidable dependency for an internal network.',
            },
            {
              emoji: '⚡',
              title: 'Resource Competition',
              body: 'All tools running simultaneously competed for CPU and RAM, degrading performance for the actual development work.',
            },
          ],
        },
        {
          id: 'solution',
          type: 'solution',
          number: '02',
          title: 'Solution We Gave',
          lead: 'A single Golang desktop app replacing all of them — real-time LAN chat, file sharing, and a unified multi-database console, with a minimal resource footprint.',
          body: 'Built Extremist in Golang specifically for low system overhead. The app handles real-time team chat over LAN (no external servers), secure file sharing, and a unified database console supporting MySQL, MSSQL, MongoDB, and PostgreSQL in one interface. Developers open one tool for everything — no alt-tabbing, no RAM drain from Electron, no internet required.',
          items: [
            {
              emoji: '💬',
              title: 'Real-Time LAN Chat',
              body: 'Team chat runs entirely over the local network — no external servers, no Teams subscription, no internet dependency.',
            },
            {
              emoji: '📤',
              title: 'Integrated File Sharing',
              body: 'Drag-and-drop file transfers between machines over LAN, built directly into the app — no third-party tools required.',
            },
            {
              emoji: '🗄️',
              title: 'Unified Multi-DB Console',
              body: 'MySQL, MSSQL, MongoDB, and PostgreSQL in a single interface — CRUD, SQL execution, stored procedures, views, and admin tasks all in one place.',
            },
            {
              emoji: '🚀',
              title: 'Minimal Resource Footprint',
              body: 'Golang\'s compiled binary uses a fraction of the RAM of Electron apps — developer machines stay fast during heavy workloads.',
            },
          ],
        },
      ],
    },
  },

  // ── PR Automation ─────────────────────────────────────────────────────────
  {
    slug: 'pr-automation-tool',
    title: { en: 'PR Automation Tool' },
    description: {
      en: 'Automated Pull Request pipeline that monitors repositories, runs AI-assisted code reviews, enforces configurable quality gates, auto-merges on pass, and handles semantic release tagging.',
    },
    longDescription: {
      en: 'Built an automated PR Automation Tool that continuously monitors Bitbucket repositories for new pull requests and orchestrates the entire review-to-merge lifecycle.\n\nCapabilities:\n• AI-assisted code review on every PR — identifies quality issues, logic errors, and style violations automatically\n• Configurable quality gates: linting, test coverage thresholds, build verification\n• Repository command execution based on review outcomes\n• Auto-merges PRs only when all quality gates pass — removing human error from the merge decision\n• Automated semantic version tagging on successful merge — no manual release management\n• Consistent code quality enforced across the team regardless of reviewer availability',
    },
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
          id: 'problem',
          type: 'problem',
          number: '01',
          title: 'Problem Identified',
          lead: 'Code review was a bottleneck — PRs sat waiting for senior devs, quality was inconsistent, and merges were made manually with no enforcement.',
          body: 'As the team scaled, PRs would sit unreviewed for hours or days when senior developers were unavailable. When reviews did happen, quality was inconsistent — different reviewers caught different things, and there were no enforced gates. Merges were made manually, meaning a single distracted moment could result in a broken build being merged. Release tagging was also manual, adding overhead to every deployment.',
          items: [
            {
              emoji: '⏳',
              title: 'Review Bottlenecks',
              body: 'PRs queued behind senior devs — when they were in meetings or on leave, the entire delivery pipeline slowed down.',
            },
            {
              emoji: '📉',
              title: 'Inconsistent Code Quality',
              body: 'Without enforced gates, review quality varied by reviewer — some PRs were scrutinised, others waved through, creating unpredictable codebase health.',
            },
            {
              emoji: '💥',
              title: 'Unsafe Manual Merges',
              body: 'Merges were triggered by humans after a visual check — easy to approve before all tests had finished, risking broken builds in main.',
            },
            {
              emoji: '🏷️',
              title: 'Manual Release Tagging',
              body: 'Every release required a developer to manually create a version tag — repetitive overhead that occasionally got forgotten.',
            },
          ],
        },
        {
          id: 'solution',
          type: 'solution',
          number: '02',
          title: 'Solution We Gave',
          lead: 'A fully automated PR pipeline — AI review, configurable quality gates, conditional auto-merge, and automatic release tagging on every merge.',
          body: 'Built a tool that monitors Bitbucket for new PRs and orchestrates the full lifecycle automatically. AI reviews every PR for quality issues, logic errors, and style violations. Configurable gates (lint, test coverage, build) must all pass before any merge is allowed. The tool auto-merges only when all gates are green — no human in the loop for routine PRs. Semantic version tags are created automatically on each successful merge.',
          items: [
            {
              emoji: '🤖',
              title: 'AI-Assisted Code Review',
              body: 'Every PR gets an AI review pass covering code quality, logic errors, and style — consistent, thorough, and instant.',
            },
            {
              emoji: '🔒',
              title: 'Configurable Quality Gates',
              body: 'Linting, test coverage thresholds, and build verification run as required gates — a PR cannot merge until every gate passes.',
            },
            {
              emoji: '✅',
              title: 'Conditional Auto-Merge',
              body: 'When all gates pass, the tool merges automatically — no human needed for routine PRs, no risk of premature merges.',
            },
            {
              emoji: '🏷️',
              title: 'Automatic Release Tagging',
              body: 'Semantic version tags are created on every successful merge — version management is fully automated, zero developer overhead.',
            },
          ],
        },
      ],
    },
  },

  // ── MCP Servers ───────────────────────────────────────────────────────────
  {
    slug: 'mcp-server-integrations',
    title: { en: 'MCP Server Integrations' },
    description: {
      en: 'Custom Model Context Protocol server integrations for Jira, Bitbucket, Rediffmail, Snap DB, and Dynatrace — letting AI assistants query and act on enterprise tools via natural language.',
    },
    longDescription: {
      en: 'Built custom MCP server integrations that bridge enterprise tooling to AI assistants, enabling developers to query and operate business systems through natural language without context-switching.\n\nIntegrations built:\n• Jira – AI-assisted issue creation, sprint management, and ticket queries\n• Bitbucket – code browsing, PR status, and pipeline queries\n• Rediffmail – email reading and composition via AI\n• Snap DB – natural language database queries against internal data stores\n• Dynatrace – monitoring alert queries and performance metric lookups\n\nDevelopers stay in their AI assistant while the MCP servers handle authentication, data fetching, and action execution against each enterprise system.',
    },
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
          id: 'problem',
          type: 'problem',
          number: '01',
          title: 'Problem Identified',
          lead: 'Developers using AI assistants were still manually switching to five different enterprise tools — breaking flow state dozens of times a day.',
          body: 'The engineering team used AI assistants for coding but had to manually check Jira for ticket details, open Bitbucket for PR status, log into Dynatrace for alerts, check Rediffmail for stakeholder emails, and query Snap DB for data — often mid-task. Each switch broke the developer\'s context. AI assistants were powerful but isolated from the information they needed to be truly useful.',
          items: [
            {
              emoji: '🔀',
              title: 'Constant Context-Switching',
              body: 'Developers broke flow state dozens of times per day moving between their AI assistant, Jira, Bitbucket, Dynatrace, email, and database tools.',
            },
            {
              emoji: '🤖',
              title: 'AI Assistants Lacked Context',
              body: 'AI tools couldn\'t answer "what\'s in my sprint?" or "are there any alerts?" — they had no access to enterprise systems, limiting their usefulness.',
            },
            {
              emoji: '🐌',
              title: 'Manual Information Retrieval',
              body: 'Every lookup — ticket status, PR review comments, monitoring alerts — required manual navigation through multiple authenticated web portals.',
            },
            {
              emoji: '📧',
              title: 'Enterprise Email Silos',
              body: 'Rediffmail sat entirely outside the development workflow — emails required a separate login, breaking the unified working environment.',
            },
          ],
        },
        {
          id: 'solution',
          type: 'solution',
          number: '02',
          title: 'Solution We Gave',
          lead: 'Five custom MCP servers connecting AI assistants directly to Jira, Bitbucket, Dynatrace, Rediffmail, and Snap DB — operate everything via natural language.',
          body: 'Built custom MCP servers for each enterprise system, following the Model Context Protocol standard so any compatible AI assistant can use them. Developers now ask their AI assistant to check sprint status, review PR comments, query monitoring dashboards, read emails, or run database queries — and the MCP servers handle authentication, API calls, and data formatting transparently. No tab-switching required.',
          items: [
            {
              emoji: '📋',
              title: 'Jira MCP Server',
              body: 'Create tickets, query sprint status, update issue fields, and get AI-summarised backlog views — all from the AI assistant prompt.',
            },
            {
              emoji: '🔀',
              title: 'Bitbucket MCP Server',
              body: 'Browse code, check PR status and review comments, query pipeline results — the AI can answer "what\'s blocking my PR?" instantly.',
            },
            {
              emoji: '📡',
              title: 'Dynatrace MCP Server',
              body: 'Query monitoring alerts, performance metrics, and anomaly reports in natural language — no dashboard login needed for routine checks.',
            },
            {
              emoji: '🗃️',
              title: 'Snap DB & Rediffmail Servers',
              body: 'Database queries and email operations through the AI assistant — internal data and stakeholder communication integrated into the development workflow.',
            },
          ],
        },
      ],
    },
  },
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  for (const data of projects) {
    const { slug, ...update } = data;
    const result = await Project.findOneAndUpdate(
      { slug },
      { $set: update },
      { upsert: true, returnDocument: 'after' }
    );
    console.log(`✓ ${result.title.en}`);
  }

  await mongoose.disconnect();
  console.log('\nDone. All projects updated.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

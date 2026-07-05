
import { motion, AnimatePresence } from 'framer-motion';
import { Experience } from '@/types';
import { Briefcase, Calendar, MapPin, TrendingUp, Zap, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ExperienceTimelineProps {
  experience: Experience[];
}

// Verb → color bucket
const VERB_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  built:          { bg: 'rgba(124,58,237,0.08)',  text: 'rgb(167,139,250)',  border: 'rgba(124,58,237,0.35)' },
  designed:       { bg: 'rgba(124,58,237,0.08)',  text: 'rgb(167,139,250)',  border: 'rgba(124,58,237,0.35)' },
  developed:      { bg: 'rgba(59,130,246,0.08)',  text: 'rgb(147,197,253)',  border: 'rgba(59,130,246,0.35)' },
  integrated:     { bg: 'rgba(245,158,11,0.08)',  text: 'rgb(252,211,77)',   border: 'rgba(245,158,11,0.35)' },
  implemented:    { bg: 'rgba(245,158,11,0.08)',  text: 'rgb(252,211,77)',   border: 'rgba(245,158,11,0.35)' },
  owned:          { bg: 'rgba(16,185,129,0.08)',  text: 'rgb(110,231,183)', border: 'rgba(16,185,129,0.35)' },
  led:            { bg: 'rgba(16,185,129,0.08)',  text: 'rgb(110,231,183)', border: 'rgba(16,185,129,0.35)' },
  delivered:      { bg: 'rgba(16,185,129,0.08)',  text: 'rgb(110,231,183)', border: 'rgba(16,185,129,0.35)' },
  boosted:        { bg: 'rgba(20,184,166,0.08)',  text: 'rgb(94,234,212)',   border: 'rgba(20,184,166,0.35)' },
  optimised:      { bg: 'rgba(20,184,166,0.08)',  text: 'rgb(94,234,212)',   border: 'rgba(20,184,166,0.35)' },
  optimized:      { bg: 'rgba(20,184,166,0.08)',  text: 'rgb(94,234,212)',   border: 'rgba(20,184,166,0.35)' },
  're-architecting': { bg: 'rgba(20,184,166,0.08)', text: 'rgb(94,234,212)', border: 'rgba(20,184,166,0.35)' },
  established:    { bg: 'rgba(99,102,241,0.08)',  text: 'rgb(165,180,252)', border: 'rgba(99,102,241,0.35)' },
  worked:         { bg: 'rgba(99,102,241,0.08)',  text: 'rgb(165,180,252)', border: 'rgba(99,102,241,0.35)' },
};

const DEFAULT_VERB = { bg: 'rgba(100,116,139,0.08)', text: 'rgb(148,163,184)', border: 'rgba(100,116,139,0.3)' };

function getVerbStyle(text: string) {
  const first = text.split(/[\s,]/)[0].toLowerCase().replace(/[^a-z-]/g, '');
  return VERB_COLORS[first] || DEFAULT_VERB;
}

function getVerb(text: string) {
  return text.split(/[\s]/)[0];
}

function getRest(text: string) {
  const words = text.split(' ');
  return words.slice(1).join(' ');
}

// Infer domain chips from description keywords
const DOMAIN_RULES: Array<{ keywords: string[]; label: string; color: string }> = [
  { keywords: ['UPI platform', 'UPI microservice', 'UPI transaction', 'HDFC Bank', 'onboarding, transactions'],  label: 'UPI Platform',          color: 'rgba(124,58,237,0.12)' },
  { keywords: ['BBPS', 'bill payment', 'BillDesk', 'PayU', 'omnichannel'],                                       label: 'BBPS',                  color: 'rgba(59,130,246,0.12)' },
  { keywords: ['merchant acquisition', 'merchant onboarding', 'KYC', 'Mziva', 'sound-box', 'ToneTag'],           label: 'Merchant Acquisition',  color: 'rgba(245,158,11,0.12)' },
  { keywords: ['MCP', 'Jira', 'Bitbucket', 'Dynatrace', 'AI-assisted', 'PR Automation', 'Extremist'],            label: 'AI & Dev Tooling',      color: 'rgba(16,185,129,0.12)' },
  { keywords: ['Angular', 'campaign page', 'Fixed Deposit', 'Angular Universal', 'server-side rendering'],       label: 'Angular / SSR Frontend', color: 'rgba(59,130,246,0.12)' },
  { keywords: ['lending', 'Used Car Loan', 'Personal Loan', 'Business Loan', 'dealer portal'],                   label: 'Lending Platform',      color: 'rgba(245,158,11,0.12)' },
  { keywords: ['authentication', 'authorization', 'security', 'access control'],                                 label: 'Security',              color: 'rgba(239,68,68,0.12)'  },
  { keywords: ['E-commerce', 'SaaS', 'CI/CD', 'REST API'],                                                      label: 'E-commerce / SaaS',     color: 'rgba(20,184,166,0.12)' },
];

function inferDomains(description: string[]): Array<{ label: string; color: string }> {
  const full = description.join(' ');
  const found: Array<{ label: string; color: string }> = [];
  for (const rule of DOMAIN_RULES) {
    if (rule.keywords.some(k => full.toLowerCase().includes(k.toLowerCase()))) {
      found.push({ label: rule.label, color: rule.color });
    }
  }
  return found;
}

const PREVIEW_COUNT = 4;

export default function ExperienceTimeline({ experience }: ExperienceTimelineProps) {
  if (!experience || experience.length === 0) return null;
  const sortedExp = [...experience].sort((a, b) => (a.order || 0) - (b.order || 0));
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <section id="experience" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(135deg, currentColor 1px, transparent 1px), linear-gradient(225deg, currentColor 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-20">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <TrendingUp size={14} />
              Professional Journey
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              Career <span className="text-gradient">Timeline</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.2 }} className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
              {sortedExp.length} positions across leading organisations — from product engineering to APM
            </motion.p>
          </div>

          {/* Timeline */}
          <div style={{ position: 'relative', paddingLeft: '56px' }}>

            {/* Vertical line */}
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: '19px', width: '2px', borderRadius: '9999px',
              background: 'linear-gradient(to bottom, rgb(var(--color-primary)) 0%, rgba(var(--color-primary),0.5) 50%, rgba(var(--color-primary),0.12) 100%)',
              zIndex: 0,
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {sortedExp.map((exp, index) => {
                const domains = inferDomains(exp.description);
                const isExpanded = expandedIds.has(exp._id);
                const hasMore = exp.description.length > PREVIEW_COUNT;
                const visibleItems = isExpanded ? exp.description : exp.description.slice(0, PREVIEW_COUNT);

                return (
                  <div key={exp._id} style={{ position: 'relative' }}>

                    {/* Dot */}
                    <div style={{
                      position: 'absolute', left: '-46px', top: '28px',
                      width: '20px', height: '20px', borderRadius: '50%', zIndex: 2,
                      background: exp.isCurrent ? 'rgb(var(--color-primary))' : 'rgba(var(--color-primary),0.4)',
                      boxShadow: exp.isCurrent
                        ? '0 0 0 5px rgba(var(--color-primary),0.20), 0 0 18px rgba(var(--color-primary),0.45)'
                        : '0 0 0 4px rgba(var(--color-primary),0.12)',
                    }}>
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '8px', height: '8px', borderRadius: '50%', background: exp.isCurrent ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)' }} />
                      {exp.isCurrent && (
                        <div className="animate-ping" style={{ position: 'absolute', inset: '-4px', borderRadius: '50%', background: 'rgba(var(--color-primary),0.25)' }} />
                      )}
                    </div>

                    <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.12, duration: 0.5 }} viewport={{ once: true }}>

                      <div className="premium-card overflow-hidden">

                        {/* Card header */}
                        <div className="p-6 pb-4" style={{ borderBottom: '1px solid var(--card-border)' }}>
                          <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mb-1">
                                {exp.role}
                              </h4>
                              <div className="flex items-center gap-2 text-primary font-semibold text-base">
                                <Briefcase size={15} className="shrink-0" />
                                {exp.company}
                              </div>
                            </div>
                            {exp.isCurrent && (
                              <div className="px-3 py-1.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider rounded-full border border-green-500/20 flex items-center gap-1.5 shrink-0">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                                </span>
                                Current
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-3 text-sm mb-4">
                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                              <Calendar size={13} className="text-primary" />
                              <span className="font-medium">{exp.startDate} – {exp.endDate || 'Present'}</span>
                            </div>
                            {exp.location && (
                              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                <MapPin size={13} className="text-primary" />
                                <span className="font-medium">{exp.location}</span>
                              </div>
                            )}
                          </div>

                          {/* Domain chips */}
                          {domains.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {domains.map(d => (
                                <span key={d.label}
                                  className="text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wide"
                                  style={{ background: d.color, color: 'var(--tw-prose-body, inherit)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                  {d.label}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Contributions */}
                        <div className="p-6 pt-5">
                          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500 mb-4">
                            Key Contributions
                          </p>

                          <div className="space-y-2.5">
                            {visibleItems.map((point, i) => {
                              const vs = getVerbStyle(point);
                              const verb = getVerb(point);
                              const rest = getRest(point);
                              return (
                                <div key={i} className="flex gap-3 items-start rounded-xl p-3 transition-colors"
                                  style={{ background: vs.bg, border: `1px solid ${vs.border}` }}>
                                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md shrink-0 mt-0.5 uppercase tracking-wider"
                                    style={{ background: vs.border, color: vs.text }}>
                                    {verb}
                                  </span>
                                  <span className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {rest}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Expand / collapse */}
                          {hasMore && (
                            <AnimatePresence>
                              <button
                                onClick={() => toggle(exp._id)}
                                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'rgb(var(--color-primary))' }}
                              >
                                {isExpanded
                                  ? <>Show less <ChevronDown size={15} className="rotate-180 transition-transform" /></>
                                  : <>{exp.description.length - PREVIEW_COUNT} more contributions <ChevronDown size={15} className="transition-transform" /></>
                                }
                              </button>
                            </AnimatePresence>
                          )}
                        </div>

                        {/* Tech stack */}
                        <div className="px-6 pb-6 pt-0">
                          <div className="pt-4 flex flex-wrap gap-2 items-center" style={{ borderTop: '1px solid var(--card-border)' }}>
                            <Zap size={13} className="text-primary shrink-0" />
                            {exp.technologies.map((tech) => (
                              <span key={tech}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold hover:border-primary hover:text-primary transition-all"
                                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', backdropFilter: 'blur(8px)' }}>
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary stats */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-20 pt-12 border-t-2 border-[var(--card-border)]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: `${sortedExp.length}`, label: 'Positions', from: '#7c3aed', to: '#f59e0b' },
                { value: `${new Set(sortedExp.map(e => e.company)).size}`, label: 'Companies', from: '#10b981', to: '#059669' },
                { value: `${new Set(sortedExp.flatMap(e => e.technologies)).size}+`, label: 'Technologies', from: '#3b82f6', to: '#2563eb' },
                { value: '6+', label: 'Years Exp', from: '#6366f1', to: '#4f46e5' },
              ].map(({ value, label, from, to }) => (
                <div key={label}>
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-xl"
                    style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
                    <span className="text-2xl font-black text-white">{value}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

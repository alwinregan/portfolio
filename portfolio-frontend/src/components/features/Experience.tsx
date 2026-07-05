
import { motion, AnimatePresence } from 'framer-motion';
import { Experience } from '@/types';
import { Briefcase, Calendar, MapPin, TrendingUp, Zap, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ExperienceTimelineProps {
  experience: Experience[];
}

// Maps each bullet to a domain group by keyword match
const DOMAIN_MAP: Array<{ keywords: string[]; label: string }> = [
  { keywords: ['UPI platform', 'microservice', 'HDFC Bank', 'onboarding, transactions', 'UPI transaction'], label: 'UPI Platform' },
  { keywords: ['BBPS', 'bill payment', 'BillDesk', 'PayU', 'biller', 'omnichannel'], label: 'BBPS' },
  { keywords: ['merchant acquisition', 'merchant onboarding', 'KYC', 'Mziva', 'sound-box', 'ToneTag', 'CWD', 'Yes Bank', 'CAMS', 'merchant app'], label: 'Merchant Acquisition' },
  { keywords: ['MCP', 'Jira', 'Bitbucket', 'Dynatrace', 'Rediffmail', 'AI-assisted', 'PR Automation', 'Extremist', 'Golang', 'Ubuntu desktop', 'LAN file'], label: 'AI & Internal Tooling' },
  { keywords: ['Angular', 'campaign page', 'Fixed Deposit', 'Angular Universal', 'SSR', 'server-side rendering'], label: 'Angular / SSR Frontend' },
  { keywords: ['lending', 'Used Car Loan', 'Personal Loan', 'Business Loan', 'dealer portal', 'two-wheeler'], label: 'Lending Platform' },
  { keywords: ['authentication', 'authorization', 'security', 'access control'], label: 'Security' },
  { keywords: ['CI/CD', 'E-commerce', 'SaaS', 'REST API', 'real-time data', 'scalab', 'performance'], label: 'Engineering' },
  { keywords: ['stakeholder', 'client', 'business requirement', 'project execution', 'deliver', 'team'], label: 'Project Delivery' },
];

function classifyBullet(text: string): string {
  const lower = text.toLowerCase();
  for (const { keywords, label } of DOMAIN_MAP) {
    if (keywords.some(k => lower.includes(k.toLowerCase()))) return label;
  }
  return 'Other';
}

function groupByDomain(bullets: string[]): Array<{ domain: string; items: string[] }> {
  const map = new Map<string, string[]>();
  for (const b of bullets) {
    const domain = classifyBullet(b);
    if (!map.has(domain)) map.set(domain, []);
    map.get(domain)!.push(b);
  }
  return Array.from(map.entries()).map(([domain, items]) => ({ domain, items }));
}

// Strip leading verb for cleaner display (verb shown separately)
function splitVerb(text: string): { verb: string; body: string } {
  const words = text.split(' ');
  return { verb: words[0], body: words.slice(1).join(' ') };
}

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
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(135deg, currentColor 1px, transparent 1px), linear-gradient(225deg, currentColor 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-20">
            <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-xs font-black uppercase tracking-[0.2em] mb-4"
              style={{ color: 'rgb(var(--color-primary))' }}>
              Professional Journey
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
              Work <span className="text-gradient">Experience</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-500 dark:text-slate-400">
              {sortedExp.length} positions · {new Set(sortedExp.map(e => e.company)).size} companies · 6+ years
            </motion.p>
          </div>

          {/* Timeline */}
          <div style={{ position: 'relative', paddingLeft: '48px' }}>

            {/* Vertical line */}
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: '15px', width: '2px', borderRadius: '9999px',
              background: 'linear-gradient(to bottom, rgb(var(--color-primary)) 0%, rgba(var(--color-primary),0.4) 60%, rgba(var(--color-primary),0.08) 100%)',
            }} />

            <div className="space-y-10">
              {sortedExp.map((exp, index) => {
                const groups = groupByDomain(exp.description);
                const isExpanded = expandedIds.has(exp._id);
                const PREVIEW_GROUPS = 2;
                const hasMore = groups.length > PREVIEW_GROUPS;
                const visibleGroups = isExpanded ? groups : groups.slice(0, PREVIEW_GROUPS);

                return (
                  <div key={exp._id} style={{ position: 'relative' }}>

                    {/* Timeline dot */}
                    <div style={{
                      position: 'absolute', left: '-42px', top: '24px',
                      width: '18px', height: '18px', borderRadius: '50%', zIndex: 2,
                      background: exp.isCurrent ? 'rgb(var(--color-primary))' : 'rgba(var(--color-primary),0.35)',
                      boxShadow: exp.isCurrent
                        ? '0 0 0 5px rgba(var(--color-primary),0.15), 0 0 16px rgba(var(--color-primary),0.4)'
                        : '0 0 0 4px rgba(var(--color-primary),0.10)',
                    }}>
                      <div style={{ position: 'absolute', inset: '4px', borderRadius: '50%', background: exp.isCurrent ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)' }} />
                      {exp.isCurrent && (
                        <div className="animate-ping" style={{ position: 'absolute', inset: '-4px', borderRadius: '50%', background: 'rgba(var(--color-primary),0.2)' }} />
                      )}
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <div className="premium-card overflow-hidden">

                        {/* Role header */}
                        <div className="p-7 pb-5" style={{ borderBottom: '1px solid var(--card-border)' }}>
                          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                            <div>
                              <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight mb-1">
                                {exp.role}
                              </h4>
                              <div className="flex items-center gap-2 font-semibold"
                                style={{ color: 'rgb(var(--color-primary))' }}>
                                <Briefcase size={14} className="shrink-0" />
                                {exp.company}
                              </div>
                            </div>
                            {exp.isCurrent && (
                              <span className="px-3 py-1 rounded-full text-xs font-bold border border-green-500/20 bg-green-500/8 text-green-600 dark:text-green-400 flex items-center gap-1.5 shrink-0">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inset-0 rounded-full bg-green-400 opacity-75" />
                                  <span className="relative rounded-full h-2 w-2 bg-green-500" />
                                </span>
                                Current
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1.5">
                              <Calendar size={13} style={{ color: 'rgb(var(--color-primary))' }} />
                              {exp.startDate} – {exp.endDate || 'Present'}
                            </span>
                            {exp.location && (
                              <span className="flex items-center gap-1.5">
                                <MapPin size={13} style={{ color: 'rgb(var(--color-primary))' }} />
                                {exp.location}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Domain-grouped contributions */}
                        <div className="p-7 pt-6 space-y-7">
                          {visibleGroups.map(({ domain, items }) => (
                            <div key={domain}>
                              {/* Domain label */}
                              <div className="flex items-center gap-3 mb-3">
                                <div className="h-px flex-1" style={{ background: 'var(--card-border)' }} />
                                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 shrink-0">
                                  {domain}
                                </span>
                                <div className="h-px flex-1" style={{ background: 'var(--card-border)' }} />
                              </div>

                              {/* Bullets */}
                              <div className="space-y-2.5">
                                {items.map((point, i) => {
                                  const { verb, body } = splitVerb(point);
                                  return (
                                    <div key={i} className="flex gap-3 items-start">
                                      <div className="w-1 shrink-0 mt-[7px] rounded-full self-stretch"
                                        style={{ background: 'rgba(var(--color-primary),0.35)', minHeight: '6px', maxWidth: '2px' }} />
                                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                        <span className="font-bold text-slate-900 dark:text-white">{verb}</span>{' '}{body}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}

                          {/* Expand / collapse */}
                          {hasMore && (
                            <button
                              onClick={() => toggle(exp._id)}
                              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-75"
                              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'rgb(var(--color-primary))' }}
                            >
                              {isExpanded
                                ? <>Show less <ChevronDown size={14} className="rotate-180 transition-transform" /></>
                                : <>{groups.length - PREVIEW_GROUPS} more areas <ChevronDown size={14} /></>
                              }
                            </button>
                          )}
                        </div>

                        {/* Tech stack */}
                        <div className="px-7 pb-6">
                          <div className="pt-5 flex flex-wrap gap-2 items-center" style={{ borderTop: '1px solid var(--card-border)' }}>
                            <Zap size={12} style={{ color: 'rgb(var(--color-primary))' }} className="shrink-0" />
                            {exp.technologies.map(tech => (
                              <span key={tech}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors"
                                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--muted)' }}>
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

          {/* Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-20 pt-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            style={{ borderTop: '2px solid var(--card-border)' }}>
            {[
              { value: `${sortedExp.length}`,                                              label: 'Positions' },
              { value: `${new Set(sortedExp.map(e => e.company)).size}`,                   label: 'Companies' },
              { value: `${new Set(sortedExp.flatMap(e => e.technologies)).size}+`,         label: 'Technologies' },
              { value: '6+',                                                               label: 'Years' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-4xl font-black mb-2 text-slate-900 dark:text-white">{value}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-[0.14em]">{label}</div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}

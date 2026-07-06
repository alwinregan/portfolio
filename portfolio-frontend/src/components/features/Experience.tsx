
import { motion, AnimatePresence } from 'framer-motion';
import { Experience } from '@/types';
import { Briefcase, Calendar, MapPin, Zap, ChevronDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface ExperienceTimelineProps {
  experience: Experience[];
  yearsValue?: string;
}

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

function splitVerb(text: string): { verb: string; body: string } {
  const words = text.split(' ');
  return { verb: words[0], body: words.slice(1).join(' ') };
}

function parseDate(s: string): Date {
  const t = s.trim();
  const MONTHS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  // YYYY-MM-DD or YYYY-MM
  if (/^\d{4}-\d{2}/.test(t)) {
    const [y, m, d] = t.split('-').map(Number);
    return new Date(y, m - 1, d || 1);
  }
  // "Jan 2022" or "January 2022"
  const m1 = t.match(/^([a-zA-Z]+)\s+(\d{4})$/);
  if (m1) {
    const mi = MONTHS.indexOf(m1[1].toLowerCase().slice(0, 3));
    if (mi !== -1) return new Date(Number(m1[2]), mi, 1);
  }
  // "2022" year only
  if (/^\d{4}$/.test(t)) return new Date(Number(t), 0, 1);
  const d = new Date(t);
  return isNaN(d.getTime()) ? new Date() : d;
}

function calculateTenure(startDate: string, endDate?: string, isCurrent?: boolean): string {
  const start = parseDate(startDate);
  const end = (isCurrent || !endDate) ? new Date() : parseDate(endDate);
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (months < 0) months = 0;
  const yrs = Math.floor(months / 12);
  const mos = months % 12;
  if (yrs === 0) return `${mos} mo`;
  if (mos === 0) return `${yrs} yr${yrs > 1 ? 's' : ''}`;
  return `${yrs} yr${yrs > 1 ? 's' : ''} · ${mos} mo`;
}

function normalizeCompany(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export default function ExperienceTimeline({ experience, yearsValue = '5+' }: ExperienceTimelineProps) {
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
    <section id="experience" className="py-20 md:py-32 relative overflow-hidden">
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
              {sortedExp.length} positions · {new Set(sortedExp.map(e => e.company)).size} companies · {yearsValue} years
            </motion.p>
          </div>

          {/* Timeline */}
          <div style={{ position: 'relative', paddingLeft: '48px' }}>

            {/* Vertical line */}
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: '15px', width: '2px', borderRadius: '9999px',
              background: 'linear-gradient(to bottom, rgb(var(--color-primary)) 0%, rgba(var(--color-primary),0.4) 60%, rgba(var(--color-primary),0.08) 100%)',
            }} />

            <div className="space-y-0">
              {sortedExp.map((exp, index) => {
                const hasHighlights = exp.highlights && exp.highlights.length > 0;
                const hasImpact = exp.impact && exp.impact.length > 0;
                const groups = groupByDomain(exp.description);
                const isExpanded = expandedIds.has(exp._id);
                const tenure = calculateTenure(exp.startDate, exp.endDate, exp.isCurrent);

                // Check if the NEXT card in the list is at the same company (they were promoted from it)
                const nextExp = sortedExp[index + 1];
                const isPromotionAbove = nextExp && normalizeCompany(exp.company) === normalizeCompany(nextExp.company);

                return (
                  <div key={exp._id}>
                    <div style={{ position: 'relative', paddingBottom: isPromotionAbove ? '0' : '40px' }}>

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
                            <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
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
                              {/* Tenure badge */}
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold"
                                style={{ background: 'rgba(var(--color-primary),0.08)', color: 'rgb(var(--color-primary))' }}>
                                {tenure}
                              </span>
                            </div>
                          </div>

                          {/* Impact chips */}
                          {hasImpact && (
                            <div className="px-7 pt-5 pb-0 flex flex-wrap gap-2">
                              {exp.impact.map((chip, i) => (
                                <span key={i}
                                  className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide"
                                  style={{
                                    background: 'rgba(var(--color-primary),0.07)',
                                    border: '1px solid rgba(var(--color-primary),0.18)',
                                    color: 'rgb(var(--color-primary))',
                                  }}>
                                  {chip}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Highlights — 2-col grid of what was OWNED */}
                          {hasHighlights && (
                            <div className="p-7 pb-5" style={{ borderBottom: '1px solid var(--card-border)' }}>
                              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 mb-4">
                                Key Responsibilities
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {exp.highlights.map((h, i) => (
                                  <div key={i}
                                    className="flex gap-3 items-start p-4 rounded-xl"
                                    style={{ background: 'rgba(var(--color-primary),0.04)', border: '1px solid rgba(var(--color-primary),0.10)' }}>
                                    <div className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full"
                                      style={{ background: 'rgb(var(--color-primary))' }} />
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-snug">
                                      {h}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Full scope — collapsible domain-grouped bullets */}
                          {groups.length > 0 && (
                            <div className="px-7 pt-4 pb-2">
                              <button
                                onClick={() => toggle(exp._id)}
                                className="flex items-center gap-2 text-sm font-semibold mb-4 transition-opacity hover:opacity-70"
                                style={{ color: 'rgb(var(--color-primary))' }}
                              >
                                <ChevronDown
                                  size={15}
                                  className="transition-transform duration-200"
                                  style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                />
                                {isExpanded ? 'Hide full scope' : 'See full scope'}
                              </button>

                              <AnimatePresence initial={false}>
                                {isExpanded && (
                                  <motion.div
                                    key="scope"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    style={{ overflow: 'hidden' }}
                                  >
                                    <div className="pb-5 space-y-7">
                                      {groups.map(({ domain, items }) => (
                                        <div key={domain}>
                                          <div className="flex items-center gap-3 mb-3">
                                            <div className="h-px flex-1" style={{ background: 'var(--card-border)' }} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 shrink-0">
                                              {domain}
                                            </span>
                                            <div className="h-px flex-1" style={{ background: 'var(--card-border)' }} />
                                          </div>
                                          <div className="space-y-2.5">
                                            {items.map((point, i) => {
                                              const { verb, body } = splitVerb(point);
                                              return (
                                                <div key={i} className="flex gap-3 items-start">
                                                  <div className="w-0.5 shrink-0 mt-[7px] rounded-full self-stretch"
                                                    style={{ background: 'rgba(var(--color-primary),0.3)', minHeight: '6px' }} />
                                                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                                    <span className="font-bold text-slate-900 dark:text-white">{verb}</span>{' '}{body}
                                                  </p>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}

                          {/* Tech stack */}
                          <div className="px-7 pb-6">
                            <div className="pt-5 flex flex-wrap gap-2 items-center" style={{ borderTop: '1px solid var(--card-border)' }}>
                              <Zap size={12} style={{ color: 'rgb(var(--color-primary))' }} className="shrink-0" />
                              {exp.technologies.map(tech => (
                                <span key={tech}
                                  className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                                  style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--muted)' }}>
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    </div>

                    {/* Promotion connector — appears between two cards at the same company */}
                    {isPromotionAbove && (
                      <div className="relative flex items-center gap-2 py-3 mb-10 min-w-0">
                        <div className="h-px flex-1 opacity-40 shrink" style={{ background: 'rgb(var(--color-primary))' }} />
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0"
                          style={{
                            background: 'rgba(var(--color-primary),0.08)',
                            border: '1px solid rgba(var(--color-primary),0.25)',
                            color: 'rgb(var(--color-primary))',
                          }}>
                          <TrendingUp size={12} className="shrink-0" />
                          <span>Internal Promotion</span>
                          <span className="hidden sm:inline">· {exp.company}</span>
                        </div>
                        <div className="h-px flex-1 opacity-40 shrink" style={{ background: 'rgb(var(--color-primary))' }} />
                      </div>
                    )}
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
              { value: yearsValue,                                                          label: 'Years' },
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

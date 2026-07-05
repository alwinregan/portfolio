
import { motion } from 'framer-motion';
import { Experience } from '@/types';
import { Briefcase, Calendar, MapPin, ChevronRight, Award, TrendingUp, Zap } from 'lucide-react';

interface ExperienceTimelineProps {
  experience: Experience[];
}

export default function ExperienceTimeline({ experience }: ExperienceTimelineProps) {
  if (!experience || experience.length === 0) return null;

  const sortedExp = [...experience].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section id="experience" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(135deg, currentColor 1px, transparent 1px), linear-gradient(225deg, currentColor 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
            >
              <TrendingUp size={14} />
              Professional Journey
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6"
            >
              Career <span className="text-gradient">Timeline</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-500 font-medium max-w-2xl mx-auto"
            >
              {sortedExp.length} positions across leading organizations, building scalable solutions
            </motion.p>
          </div>

          {/*
            The vertical line lives in the outer position:relative container.
            Dots are position:absolute within each item, offset left to sit on the line.
            Neither line nor dots are inside any motion.div — they are ALWAYS visible.
            Only the card content animates in on scroll.
          */}
          <div style={{ position: 'relative', paddingLeft: '56px' }}>

            {/* Single continuous vertical line — always rendered */}
            <div style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '19px',
              width: '2px',
              borderRadius: '9999px',
              background: 'linear-gradient(to bottom, rgb(var(--color-primary)) 0%, rgba(var(--color-primary), 0.5) 50%, rgba(var(--color-primary), 0.12) 100%)',
              zIndex: 0,
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {sortedExp.map((exp, index) => (
                <div key={exp._id} style={{ position: 'relative' }}>

                  {/*
                    Dot math:
                      outer paddingLeft = 56px → item left edge at 56px from outer
                      line center = 19 + 1 = 20px from outer left
                      dot width = 20px → dot left edge = 20 - 10 = 10px from outer left
                      dot left relative to item = 10 - 56 = -46px
                  */}
                  <div style={{
                    position: 'absolute',
                    left: '-46px',
                    top: '28px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    zIndex: 2,
                    background: exp.isCurrent
                      ? 'rgb(var(--color-primary))'
                      : 'rgba(var(--color-primary), 0.4)',
                    boxShadow: exp.isCurrent
                      ? '0 0 0 5px rgba(var(--color-primary), 0.20), 0 0 18px rgba(var(--color-primary), 0.45)'
                      : '0 0 0 4px rgba(var(--color-primary), 0.12)',
                  }}>
                    {/* White core so dot is visible on any background */}
                    <div style={{
                      position: 'absolute',
                      top: '50%', left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '8px', height: '8px',
                      borderRadius: '50%',
                      background: exp.isCurrent ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)',
                    }} />
                    {exp.isCurrent && (
                      <div className="animate-ping" style={{
                        position: 'absolute',
                        inset: '-4px',
                        borderRadius: '50%',
                        background: 'rgba(var(--color-primary), 0.25)',
                      }} />
                    )}
                  </div>

                  {/* Only the card animates in — dot/line stay visible always */}
                  <motion.div
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.12, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="premium-card p-8">
                      <div className="mb-6">
                        <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                              {exp.role}
                            </h4>
                            <div className="flex items-center gap-3 text-primary font-bold text-lg mb-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Briefcase size={18} />
                              </div>
                              {exp.company}
                            </div>
                          </div>
                          {exp.isCurrent && (
                            <div className="px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider rounded-full border border-green-500/20 flex items-center gap-2">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                              </span>
                              Current Role
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2 px-3 py-1.5">
                            <Calendar size={14} className="text-primary" />
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {exp.startDate} – {exp.endDate || 'Present'}
                            </span>
                          </div>
                          {exp.location && (
                            <div className="flex items-center gap-2 px-3 py-1.5">
                              <MapPin size={14} className="text-primary" />
                              <span className="font-semibold text-slate-700 dark:text-slate-300">{exp.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--card-border)]">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                            <Award size={16} className="text-primary" />
                          </div>
                          <h5 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Key Achievements & Responsibilities
                          </h5>
                        </div>
                        <ul className="space-y-3">
                          {exp.description.map((point, i) => (
                            <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-400 leading-relaxed">
                              <ChevronRight size={18} className="text-primary shrink-0 mt-0.5" />
                              <span className="text-sm">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-6 border-t border-[var(--card-border)]">
                        <div className="flex items-center gap-2 mb-3">
                          <Zap size={14} className="text-primary" />
                          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Technologies Used
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:border-primary hover:text-primary transition-all hover:scale-105"
                              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', backdropFilter: 'blur(8px)' }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                </div>
              ))}
            </div>
          </div>

          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 pt-12 border-t-2 border-[var(--card-border)]"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl">
                  <span className="text-3xl font-bold text-white">{sortedExp.length}</span>
                </div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Positions</div>
              </div>
              <div>
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-xl">
                  <span className="text-3xl font-bold text-white">
                    {new Set(sortedExp.map(e => e.company)).size}
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Companies</div>
              </div>
              <div>
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl">
                  <span className="text-3xl font-bold text-white">
                    {new Set(sortedExp.flatMap(e => e.technologies)).size}+
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Technologies</div>
              </div>
              <div>
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-xl">
                  <span className="text-3xl font-bold text-white">6+</span>
                </div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Years Exp</div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

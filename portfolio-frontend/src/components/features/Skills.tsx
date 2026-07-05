
import { motion } from 'framer-motion';

interface Skill {
  name: string;
  category: string;
  level: number;
}

interface SkillsProps {
  initialSkills: Skill[];
}

const CATEGORY_LABELS: Record<string, string> = {
  backend:  'Backend',
  frontend: 'Frontend',
  database: 'Database',
  devops:   'DevOps & Cloud',
  other:    'Architecture & Tooling',
};

const CATEGORY_ORDER = ['backend', 'frontend', 'database', 'devops', 'other'];

function levelLabel(level: number) {
  if (level >= 90) return 'Expert';
  if (level >= 80) return 'Advanced';
  if (level >= 70) return 'Proficient';
  return 'Intermediate';
}

export default function SkillsShowcase({ initialSkills }: SkillsProps) {
  const displaySkills = (initialSkills.length > 0 ? initialSkills : []).filter((s: any) => s.isActive !== false);

  const orderedCategories = CATEGORY_ORDER.filter(c =>
    displaySkills.some(s => s.category === c)
  );

  return (
    <section id="skills" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-20">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-black uppercase tracking-[0.2em] mb-4"
              style={{ color: 'rgb(var(--color-primary))' }}
            >
              Technical Arsenal
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4"
            >
              Skills &amp; <span className="text-gradient">Expertise</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-500 dark:text-slate-400 max-w-xl"
            >
              {displaySkills.length} technologies across {orderedCategories.length} domains — built through production systems at scale.
            </motion.p>
          </div>

          {/* Categories */}
          <div className="space-y-14">
            {orderedCategories.map((cat, catIdx) => {
              const skills = displaySkills
                .filter(s => s.category === cat)
                .sort((a, b) => b.level - a.level);

              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIdx * 0.08 }}
                >
                  {/* Category header */}
                  <div className="flex items-baseline justify-between mb-5 pb-3"
                    style={{ borderBottom: '2px solid var(--card-border)' }}>
                    <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-900 dark:text-white">
                      {CATEGORY_LABELS[cat] || cat}
                    </h3>
                    <span className="text-xs font-semibold text-slate-400">
                      {skills.length} {skills.length === 1 ? 'technology' : 'technologies'}
                    </span>
                  </div>

                  {/* Skill rows */}
                  <div className="space-y-4">
                    {skills.map((skill, idx) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: catIdx * 0.06 + idx * 0.04 }}
                        className="grid items-center gap-4"
                        style={{ gridTemplateColumns: '1fr 2fr auto auto' }}
                      >
                        {/* Name */}
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {skill.name}
                        </span>

                        {/* Bar */}
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(var(--color-primary), 0.1)' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: 'easeOut', delay: catIdx * 0.06 + idx * 0.04 + 0.1 }}
                            className="h-full rounded-full"
                            style={{ background: 'rgb(var(--color-primary))' }}
                          />
                        </div>

                        {/* Level label */}
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 text-right whitespace-nowrap">
                          {levelLabel(skill.level)}
                        </span>

                        {/* Percentage */}
                        <span
                          className="text-sm font-black tabular-nums w-10 text-right"
                          style={{ color: 'rgb(var(--color-primary))' }}
                        >
                          {skill.level}%
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer summary — plain numbers, no colored boxes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 pt-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            style={{ borderTop: '2px solid var(--card-border)' }}
          >
            {[
              { value: `${displaySkills.length}`, label: 'Total Skills' },
              { value: `${displaySkills.filter(s => s.level >= 90).length}`, label: 'Expert Level' },
              { value: `${orderedCategories.length}`, label: 'Domains' },
              { value: `${Math.round(displaySkills.reduce((a, s) => a + s.level, 0) / displaySkills.length)}%`, label: 'Avg Proficiency' },
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

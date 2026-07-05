
import { motion } from 'framer-motion';
import { Code2, Zap } from 'lucide-react';

interface Skill {
  name: string;
  category: string;
  level: number;
}

interface SkillsProps {
  initialSkills: Skill[];
}

export default function SkillsShowcase({ initialSkills }: SkillsProps) {
  const displaySkills = (initialSkills.length > 0 ? initialSkills : []).filter((s: any) => s.isActive !== false);
  const categories = Array.from(new Set(displaySkills.map(s => s.category)));

  // Get color based on proficiency level
  const getSkillColor = (level: number) => {
    if (level >= 90) return 'from-emerald-500 to-emerald-600';
    if (level >= 80) return 'from-blue-500 to-blue-600';
    if (level >= 70) return 'from-indigo-500 to-indigo-600';
    return 'from-slate-400 to-slate-500';
  };

  const getSkillBadge = (level: number) => {
    if (level >= 90) return { text: 'Expert', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' };
    if (level >= 80) return { text: 'Advanced', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' };
    if (level >= 70) return { text: 'Proficient', color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' };
    return { text: 'Intermediate', color: 'bg-slate-500/10 text-slate-600 border-slate-500/20' };
  };

  return (
    <section id="skills" className="py-32 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Code2 size={14} />
            Technical Arsenal
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6"
          >
            Skills & <span className="text-gradient">Expertise</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 font-medium"
          >
            Technologies mastered through {displaySkills.length}+ production implementations
          </motion.p>
        </div>

        {/* Skills by Category */}
        <div className="max-w-7xl mx-auto space-y-16">
          {categories.map((category, catIdx) => {
            const categorySkills = displaySkills.filter(s => s.category === category);
            const avgProficiency = Math.round(categorySkills.reduce((acc, s) => acc + s.level, 0) / categorySkills.length);
            
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: catIdx * 0.1 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between pb-6 border-b-2 border-gradient-to-r from-primary/50 to-transparent">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                      <Zap size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{category}</h3>
                      <p className="text-sm text-slate-500 font-semibold">
                        {categorySkills.length} {categorySkills.length === 1 ? 'Technology' : 'Technologies'} • {avgProficiency}% Avg Proficiency
                      </p>
                    </div>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="hidden md:block px-4 py-2">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Specialization</div>
                  </div>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categorySkills.map((skill, idx) => {
                    const badge = getSkillBadge(skill.level);
                    
                    return (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        viewport={{ once: true }}
                        className="group premium-card p-6"
                      >
                        {/* Skill Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                              {skill.name}
                            </h4>
                            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${badge.color}`}>
                              {badge.text}
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-primary">
                            {skill.level}%
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'rgba(var(--color-primary), 0.08)' }}>
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              transition={{ duration: 1.5, ease: "easeOut", delay: idx * 0.05 }}
                              viewport={{ once: true }}
                              className={`h-full bg-gradient-to-r ${getSkillColor(skill.level)} relative`}
                            >
                              <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            </motion.div>
                          </div>
                          
                          {/* Proficiency Scale */}
                          <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            <span>Beginner</span>
                            <span>Intermediate</span>
                            <span>Expert</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Summary Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto mt-24 pt-16 border-t-2" style={{ borderColor: 'var(--card-border)' }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl">
                <span className="text-3xl font-bold text-white">{displaySkills.length}</span>
              </div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Skills</div>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-xl">
                <span className="text-3xl font-bold text-white">{displaySkills.filter(s => s.level >= 90).length}</span>
              </div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Expert Level</div>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl">
                <span className="text-3xl font-bold text-white">{categories.length}</span>
              </div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Categories</div>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-xl">
                <span className="text-3xl font-bold text-white">
                  {Math.round(displaySkills.reduce((acc, s) => acc + s.level, 0) / displaySkills.length)}%
                </span>
              </div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Avg Proficiency</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

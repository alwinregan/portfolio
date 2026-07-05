
import { motion } from 'framer-motion';
import { Award, ExternalLink, ShieldCheck, Calendar, CheckCircle2 } from 'lucide-react';
import { Certification } from '@/types';

interface CertificationsProps {
  certifications: Certification[];
}

export default function Certifications({ certifications }: CertificationsProps) {
  if (!certifications || certifications.length === 0) return null;

  const sortedCerts = [...certifications]
    .filter(cert => cert.isActive !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (sortedCerts.length === 0) return null;

  return (
    <section id="certifications" className="py-32 relative overflow-hidden" style={{ background: 'var(--section-alt-bg)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '48px 48px' }} />
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
            <Award size={14} />
            Professional Credentials
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6"
          >
            Verified <span className="text-gradient">Certifications</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 font-medium"
          >
            Industry-recognized credentials validating expertise and professional excellence
          </motion.p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {sortedCerts.map((cert, index) => (
            <motion.article
              key={cert._id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="premium-card overflow-hidden">
                {/* Certificate Header */}
                <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600">
                  {/* Pattern Overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                  </div>
                  
                  {/* Certificate Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <Award size={48} className="text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  
                  {/* Verified Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500 rounded-lg shadow-lg">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-white" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Verified
                      </span>
                    </div>
                  </div>
                  
                  {/* Issuer Badge */}
                  <div className="absolute bottom-4 left-4 px-3 py-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      {cert.issuer}
                    </span>
                  </div>
                </div>

                {/* Certificate Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Title */}
                  <h4 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {cert.name}
                  </h4>
                  
                  {/* Meta Information */}
                  <div className="mb-4 space-y-2 flex-grow">
                    {cert.issueDate && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Calendar size={14} className="text-primary" />
                        <span className="font-semibold">Issued:</span>
                        <span>{cert.issueDate}</span>
                      </div>
                    )}
                    
                    {cert.expiryDate && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Calendar size={14} className="text-amber-500" />
                        <span className="font-semibold">Expires:</span>
                        <span>{cert.expiryDate}</span>
                      </div>
                    )}
                    
                    {cert.credentialId && (
                      <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <ShieldCheck size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold">ID: </span>
                          <span className="font-mono text-xs break-all">{cert.credentialId}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Footer Link */}
                  <div className="pt-4 border-t border-[var(--card-border)] mt-auto">
                    {cert.credentialUrl ? (
                      <a 
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between text-sm font-bold text-primary hover:text-accent transition-colors group/link"
                      >
                        <span>Verify Credential</span>
                        <ExternalLink size={16} className="group-hover/link:translate-x-1 transition-transform" />
                      </a>
                    ) : (
                      <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                        <ShieldCheck size={16} />
                        <span>Verified Certificate</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Stats Footer */}
        {sortedCerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3">
              <Award size={20} className="text-primary" />
              <span className="font-bold text-slate-900 dark:text-white">
                {sortedCerts.length} {sortedCerts.length === 1 ? 'Certification' : 'Certifications'} Earned
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Grid3x3, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface App {
  _id: string;
  name: {
    en: string;
  } | string;
  description: {
    en: string;
  } | string;
  icon: string;
  url: string;
  color?: string;
  featured?: boolean;
  order: number;
}

interface AppLauncherProps {
  apps: App[];
  onAppClick?: (appId: string, appName: string) => void;
}

export default function AppLauncher({ apps, onAppClick }: AppLauncherProps) {
  const [openNewTab, setOpenNewTab] = useState(false);

  const displayApps = (apps || []).filter(app => app);
  const hasApps = displayApps.length > 0;

  const handleAppClick = (app: App) => {
    // Track usage
    if (onAppClick) {
      const appName = typeof app.name === 'object' ? app.name.en : app.name;
      onAppClick(app._id, appName);
    }

    // Navigate or open
    if (openNewTab) {
      window.open(app.url, '_blank');
    } else {
      if (app.url.startsWith('/')) {
        window.location.href = app.url;
      } else {
        window.open(app.url, '_blank');
      }
    }
  };

  if (!hasApps) return null;

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 via-primary/2 to-slate-50 dark:from-slate-950 dark:via-primary/5 dark:to-slate-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '50px 50px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-primary/20 rounded-xl blur-xl" />
              <div className="relative p-3 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg">
                <Grid3x3 size={28} className="text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Quick Access<span className="text-gradient ml-2">Apps</span>
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400 mt-2 font-medium">
                Your favorite tools at your fingertips
              </p>
            </div>
          </motion.div>

          {/* New Tab Toggle */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative inline-flex">
                <input
                  type="checkbox"
                  checked={openNewTab}
                  onChange={(e) => setOpenNewTab(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center ${
                  openNewTab
                    ? 'bg-primary border-primary'
                    : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {openNewTab && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                Open in new tab
              </span>
            </label>
          </motion.div>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {displayApps.map((app, index) => {
            const appName = typeof app.name === 'object' ? app.name.en : app.name;
            const appDesc = typeof app.description === 'object' ? app.description.en : app.description;
            const isExternal = !app.url.startsWith('/');
            const bgColor = app.color || '#3B82F6';

            return (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ delay: index * 0.06, duration: 0.3 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => handleAppClick(app)}
                  className="w-full group relative h-full"
                  title={appDesc || appName}
                >
                  <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 h-full shadow-sm hover:shadow-xl backdrop-blur-sm overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `radial-gradient(circle at 30% 30%, ${bgColor}15, transparent 70%)` }} />

                    {/* Icon Container */}
                    <div className="relative z-10">
                      <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-110 flex-shrink-0"
                        style={{
                          backgroundColor: `${bgColor}20`,
                          borderLeft: `4px solid ${bgColor}`,
                          borderTop: `4px solid ${bgColor}`,
                        }}
                      >
                        {app.icon.startsWith('http') || app.icon.startsWith('/') ? (
                          <img src={app.icon} alt={appName} className="w-full h-full object-contain p-2 rounded-xl" />
                        ) : (
                          <span>{app.icon}</span>
                        )}
                      </div>
                    </div>

                    {/* Name */}
                    <h3 className="text-base font-bold text-slate-900 dark:text-white text-center group-hover:text-primary transition-colors duration-300 relative z-10 line-clamp-2">
                      {appName}
                    </h3>

                    {/* Description */}
                    {appDesc && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 text-center line-clamp-2 relative z-10">
                        {appDesc}
                      </p>
                    )}

                    {/* CTA Indicator */}
                    <div className="relative z-10 mt-2 text-xs font-semibold text-slate-500 dark:text-slate-500 group-hover:text-primary transition-colors flex items-center gap-1">
                      Click to open
                      {isExternal && <ExternalLink size={12} />}
                    </div>

                    {/* External Link Indicator */}
                    {isExternal && (
                      <div className="absolute top-3 right-3 p-2 bg-white dark:bg-slate-900 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <ExternalLink size={16} className="text-primary" strokeWidth={2.5} />
                      </div>
                    )}
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Info Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 dark:border-primary/20 rounded-xl shadow-sm hover:shadow-md transition-all">
            <span className="text-lg">✨</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {displayApps.length} tools available • Toggle new tab mode to change behavior
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

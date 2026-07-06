import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSettings, getProfile } from '@/lib/api';

export interface ThemeColors {
  primary:      string;
  primaryDark:  string;
  accent:       string;
  brand:        string;
  bgLight:      string;  // page background — light mode
  bgDark:       string;  // page background — dark mode
  glowPrimary?: number;  // gradient glow strength 0–1 (light mode)
  glowAccent?:  number;  // gradient glow strength 0–1 (light mode)
  glowPrimaryDark?: number; // glow strength for dark mode
  glowAccentDark?:  number;
}

export const DEFAULT_THEME: ThemeColors = {
  primary:          '#7c3aed',
  primaryDark:      '#6d28d9',
  accent:           '#f59e0b',
  brand:            '#c6613f',
  bgLight:          '#ffffff',
  bgDark:           '#09090b',
  glowPrimary:      0.04,
  glowAccent:       0.02,
  glowPrimaryDark:  0.22,
  glowAccentDark:   0.13,
};

function hexToRgbTriplet(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '';
  return `${r} ${g} ${b}`;
}

export function applyTheme(colors: Partial<ThemeColors>) {
  const t = { ...DEFAULT_THEME, ...colors };
  const root = document.documentElement;
  root.style.setProperty('--color-primary',      hexToRgbTriplet(t.primary));
  root.style.setProperty('--color-primary-dark',  hexToRgbTriplet(t.primaryDark));
  root.style.setProperty('--color-accent',        hexToRgbTriplet(t.accent));
  root.style.setProperty('--color-brand',         hexToRgbTriplet(t.brand));
  root.style.setProperty('--page-bg-light',        t.bgLight);
  root.style.setProperty('--page-bg-dark',         t.bgDark);
  /* Use --glow-p-l/a-l for light and --glow-p-d/a-d for dark — separate vars avoid
     cascade conflict between applyTheme() inline styles and .dark {} stylesheet rule */
  if (t.glowPrimary !== undefined)     root.style.setProperty('--glow-p-l', String(t.glowPrimary));
  if (t.glowAccent  !== undefined)     root.style.setProperty('--glow-a-l', String(t.glowAccent));
  if (t.glowPrimaryDark !== undefined) root.style.setProperty('--glow-p-d', String(t.glowPrimaryDark));
  if (t.glowAccentDark  !== undefined) root.style.setProperty('--glow-a-d', String(t.glowAccentDark));
}

interface Settings {
  siteName: string;
  featureToggles: Record<string, boolean>;
  defaultLanguage: string;
  supportedLanguages: string[];
  metadata?: { theme?: Partial<ThemeColors> };
}

interface SettingsContextType {
  settings: Settings | null;
  profileName: string;
  profileEmail: string;
  profileGithub: string;
  profileLinkedin: string;
  lang: string;
  setLang: (l: string) => void;
  t: (localized: any) => string;
  theme: ThemeColors;
  refreshSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileGithub, setProfileGithub] = useState('');
  const [profileLinkedin, setProfileLinkedin] = useState('');
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState<ThemeColors>(DEFAULT_THEME);

  const loadSettings = useCallback(async () => {
    try {
      const [settingsData, profileData] = await Promise.all([getSettings(), getProfile()]);
      setSettings(settingsData);
      setProfileName(profileData.name || '');
      setProfileEmail(profileData.email || '');
      setProfileGithub(profileData.socialLinks?.github || '');
      setProfileLinkedin(profileData.socialLinks?.linkedin || '');
      if (settingsData.defaultLanguage) setLang(settingsData.defaultLanguage);

      const savedTheme = settingsData.metadata?.theme;
      if (savedTheme) {
        const merged: ThemeColors = { ...DEFAULT_THEME, ...savedTheme };
        setTheme(merged);
        applyTheme(merged);
      }
    } catch (err) {
      console.error('CMS Sync Error:', err);
    }
  }, []);

  useEffect(() => { loadSettings(); }, [loadSettings]);

  const t = (localized: any): string => {
    if (!localized) return '';
    if (typeof localized === 'string') return localized;
    return localized[lang] || localized['en'] || (Object.values(localized)[0] as string) || '';
  };

  return (
    <SettingsContext.Provider value={{
      settings, profileName, profileEmail, profileGithub, profileLinkedin,
      lang, setLang, t, theme, refreshSettings: loadSettings,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};

export interface LocalizedString {
  en: string;
  [key: string]: string;
}

export interface Profile {
  _id: string;
  name: string;
  bannerTitle?: LocalizedString;
  bannerSubtitle?: LocalizedString;
  role: LocalizedString;
  heroPrefix?: LocalizedString;
  heroSuffix?: LocalizedString;
  summary: LocalizedString;
  about: LocalizedString;
  avatarUrl?: string;
  titles: LocalizedString[];
  location: LocalizedString;
  email: string;
  phone?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  resumeUrl?: string;
}

export interface Skill {
  _id: string;
  name: string;
  category: string;
  level: number;
  experienceYears: number;
  icon?: string;
  description?: string;
  order: number;
  isFeatured: boolean;
  isActive: boolean;
}

export interface Project {
  _id: string;
  title: LocalizedString | string;
  description: LocalizedString | string;
  longDescription?: LocalizedString | string;
  slug: string;
  summary?: string;
  client?: string;
  role?: string;
  year?: number;
  techStack?: string[];
  imageUrl?: string;
  images?: string[];
  githubUrl?: string;
  liveUrl?: string;
  coverImageUrl?: string;
  liveDemoUrl?: string;
  repoUrl?: string;
  tags?: string[];
  body?: string;
  featured?: boolean;
  isFeatured?: boolean;
  published?: boolean;
  order?: number;
  sortOrder?: number;
  isActive?: boolean;
}

export interface Experience {
  _id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  highlights: string[];
  description: string[];
  technologies: string[];
  order: number;
  isActive: boolean;
}

export interface Certification {
  _id: string;
  name: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  order: number;
  isActive: boolean;
}

export interface App {
  _id: string;
  name: LocalizedString | string;
  description: LocalizedString | string;
  icon: string;
  url: string;
  color?: string;
  featured?: boolean;
  published?: boolean;
  order: number;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  category?: string;
  author?: string;
  readTime: number;
  views: number;
  featured: boolean;
  published: boolean;
  publishedAt?: string;
  order: number;
  createdAt: string;
}

export interface Settings {
  _id: string;
  siteName: string;
  metaTitle: string;
  metaDescription: string;
  gaId: string;
  featureToggles: Record<string, boolean>;
  metadata: Record<string, any>;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

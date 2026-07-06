// Generic response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

export interface LocalizedString {
  en: string;
  [key: string]: string;
}

// Project types
export interface Project {
  _id: string;
  title: string | LocalizedString;
  slug: string;
  description: string | LocalizedString;
  longDescription?: string | LocalizedString;
  summary?: string;
  client?: string;
  role?: string;
  year?: number;
  imageUrl?: string;
  images?: string[];
  githubUrl?: string;
  liveUrl?: string;
  coverImageUrl?: string;
  liveDemoUrl?: string;
  repoUrl?: string;
  pdfUrl?: string;
  caseStudy?: Record<string, any>;
  techStack: string[];
  tags?: string[];
  body?: string;
  projectType?: 'work' | 'personal';
  featured?: boolean;
  isFeatured?: boolean;
  published?: boolean;
  isActive?: boolean;
  order?: number;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Skill types
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

// Experience types
export interface Experience {
  _id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string[];
  technologies: string[];
  order: number;
  isActive: boolean;
}

// Certification types
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

// Blog types
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
  updatedAt?: string;
}

// Profile types
export interface Profile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  summary: string;
  about: string;
  avatarUrl?: string;
  location: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  resumeUrl?: string;
}

// Settings types
export interface Settings {
  _id: string;
  siteName: string;
  metaTitle: string;
  metaDescription: string;
  gaId: string;
  featureToggles: Record<string, boolean>;
  metadata: Record<string, any>;
}

// Contact types
export interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

// App types
export interface App {
  _id: string;
  name: string;
  description: string;
  icon: string;
  url: string;
  order: number;
  isActive: boolean;
}

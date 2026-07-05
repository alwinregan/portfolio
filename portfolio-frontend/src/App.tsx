import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { ToastProvider } from './components/ui/Toast';
import PageProgressBar from './components/ui/PageProgressBar';

// Public pages
import HomePage from './pages/Home';
import ProjectsPage from './pages/Projects';
import ProjectDetailPage from './pages/ProjectDetail';
import BlogPage from './pages/Blog';
import BlogDetailPage from './pages/BlogDetail';
import AppsPage from './pages/Apps';

// Admin pages
import AdminLoginPage from './pages/admin/Login';
import AdminDashboardPage from './pages/admin/Dashboard';
import AdminProjectsPage from './pages/admin/Projects';
import AdminProjectEditPage from './pages/admin/ProjectEdit';
import AdminSkillsPage from './pages/admin/Skills';
import AdminExperiencePage from './pages/admin/Experience';
import AdminCertificationsPage from './pages/admin/Certifications';
import AdminBlogPage from './pages/admin/Blog';
import AdminProfilePage from './pages/admin/Profile';
import AdminSettingsPage from './pages/admin/Settings';
import AdminContactsPage from './pages/admin/Contacts';
import AdminMediaPage from './pages/admin/Media';
import AdminAppsPage from './pages/admin/Apps';
import AdminBlocksPage from './pages/admin/Blocks';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SettingsProvider>
          <ToastProvider>
            <PageProgressBar />
            <Routes>
              {/* Public */}
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/apps" element={<AppsPage />} />

              {/* Admin */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/profile" element={<AdminProfilePage />} />
              <Route path="/admin/projects" element={<AdminProjectsPage />} />
              <Route path="/admin/projects/:id" element={<AdminProjectEditPage />} />
              <Route path="/admin/skills" element={<AdminSkillsPage />} />
              <Route path="/admin/experience" element={<AdminExperiencePage />} />
              <Route path="/admin/certifications" element={<AdminCertificationsPage />} />
              <Route path="/admin/blog" element={<AdminBlogPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
              <Route path="/admin/contacts" element={<AdminContactsPage />} />
              <Route path="/admin/media" element={<AdminMediaPage />} />
              <Route path="/admin/apps" element={<AdminAppsPage />} />
              <Route path="/admin/blocks" element={<AdminBlocksPage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </SettingsProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

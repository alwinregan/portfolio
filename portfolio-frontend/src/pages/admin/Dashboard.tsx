
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { getProjects, getSkills, getExperiences, getCertifications } from '@/lib/api';
import { StatCard, Card, LoadingSpinner } from '@/components/admin/AdminUI';
import { 
  FolderOpen, 
  Code2, 
  Briefcase, 
  Award,
  TrendingUp,
  Activity,
  Eye,
  Zap
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ 
    projects: 0, 
    skills: 0, 
    experience: 0, 
    certifications: 0 
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      getProjects(), 
      getSkills(), 
      getExperiences(), 
      getCertifications()
    ])
      .then(([projects, skills, experience, certifications]) => {
        setStats({
          projects: projects?.length || 0,
          skills: skills?.length || 0,
          experience: experience?.length || 0,
          certifications: certifications?.length || 0,
        });
        
        // Mock recent activity
        setRecentActivity([
          { action: 'Updated', item: 'Profile Information', time: '2 hours ago' },
          { action: 'Added', item: 'New Project: Portfolio 2026', time: '5 hours ago' },
          { action: 'Modified', item: 'Skills Section', time: '1 day ago' },
        ]);
        
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Dashboard" subtitle="Portfolio Overview">
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Dashboard" 
      subtitle="Welcome back! Here's your portfolio overview"
    >
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Total Projects" 
            value={stats.projects} 
            icon={<FolderOpen size={24} />}
            trend="+2 this month"
            color="primary"
          />
          <StatCard 
            label="Technical Skills" 
            value={stats.skills} 
            icon={<Code2 size={24} />}
            trend="Expert Level"
            color="accent"
          />
          <StatCard 
            label="Experience" 
            value={stats.experience} 
            icon={<Briefcase size={24} />}
            trend="6+ Years"
            color="success"
          />
          <StatCard 
            label="Certifications" 
            value={stats.certifications} 
            icon={<Award size={24} />}
            trend="Verified"
            color="warning"
          />
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card 
            title="Quick Actions" 
            subtitle="Common tasks and shortcuts"
            icon={<Zap size={20} />}
          >
            <div className="grid grid-cols-2 gap-4">
              <QuickActionButton 
                href="/admin/projects"
                icon={<FolderOpen size={20} />}
                label="Add Project"
                color="primary"
              />
              <QuickActionButton 
                href="/admin/skills"
                icon={<Code2 size={20} />}
                label="Add Skill"
                color="accent"
              />
              <QuickActionButton 
                href="/admin/experience"
                icon={<Briefcase size={20} />}
                label="Add Experience"
                color="success"
              />
              <QuickActionButton 
                href="/admin/profile"
                icon={<Eye size={20} />}
                label="Edit Profile"
                color="warning"
              />
            </div>
          </Card>

          {/* Recent Activity */}
          <Card 
            title="Recent Activity" 
            subtitle="Your latest updates"
            icon={<Activity size={20} />}
          >
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800"
                >
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary"></div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {activity.action} <span className="text-primary">{activity.item}</span>
                    </div>
                    <div className="text-sm text-slate-500 mt-1">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Performance Overview */}
        <Card 
          title="Portfolio Performance" 
          subtitle="Key metrics and insights"
          icon={<TrendingUp size={20} />}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard 
              label="Profile Completeness"
              value="95%"
              description="Almost there! Add more projects"
              color="emerald"
            />
            <MetricCard 
              label="Content Quality"
              value="Excellent"
              description="Well-structured and detailed"
              color="blue"
            />
            <MetricCard 
              label="Last Updated"
              value="Today"
              description="Keep your content fresh"
              color="amber"
            />
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

// Quick Action Button Component
function QuickActionButton({ href, icon, label, color }: any) {
  const colors: Record<string, string> = {
    primary: 'from-blue-500 to-blue-600 hover:shadow-blue-500/25',
    accent: 'from-emerald-500 to-emerald-600 hover:shadow-emerald-500/25',
    success: 'from-green-500 to-green-600 hover:shadow-green-500/25',
    warning: 'from-amber-500 to-amber-600 hover:shadow-amber-500/25',
  };

  return (
    <a
      href={href}
      className={`
        flex flex-col items-center justify-center gap-3 p-6 
        bg-gradient-to-br ${colors[color]} 
        text-white rounded-xl shadow-lg hover:shadow-xl
        transition-all hover:scale-105 active:scale-95
      `}
    >
      {icon}
      <span className="font-bold text-sm">{label}</span>
    </a>
  );
}

// Metric Card Component
function MetricCard({ label, value, description, color }: any) {
  const colors: Record<string, string> = {
    emerald: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
    blue: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
    amber: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
      <div className={`inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border ${colors[color]}`}>
        {label}
      </div>
      <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
        {value}
      </div>
      <div className="text-sm text-slate-500">
        {description}
      </div>
    </div>
  );
}

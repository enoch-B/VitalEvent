import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Baby,
  Heart,
  UserPlus,
  Gavel,
  Cross,
  Building2,
  TrendingUp,
  FileSearch,
  UserCog,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: ['registrar', 'registrant', 'admin', 'office_manager', 'health_institution', 'court', 'religious_institution']
  },
  {
    title: 'Register Birth',
    href: '/register/birth',
    icon: Baby,
    roles: ['registrar', 'health_institution']
  },
  {
    title: 'Register Death',
    href: '/register/death',
    icon: Cross,
    roles: ['registrar', 'health_institution']
  },
  {
    title: 'Register Marriage',
    href: '/register/marriage',
    icon: Heart,
    roles: ['registrar', 'religious_institution', 'court']
  },
  {
    title: 'Register Divorce',
    href: '/register/divorce',
    icon: Gavel,
    roles: ['registrar', 'court']
  },
  {
    title: 'Register Adoption',
    href: '/register/adoption',
    icon: UserPlus,
    roles: ['registrar', 'court']
  },
  {
    title: 'Records',
    href: '/records',
    icon: FileSearch,
    roles: ['registrar', 'registrant', 'office_manager', 'health_institution', 'court', 'religious_institution']
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: BarChart3,
    roles: ['registrar', 'office_manager', 'health_institution', 'court', 'religious_institution']
  },
  {
    title: 'AI Analytics',
    href: '/analytics',
    icon: TrendingUp,
    roles: ['office_manager']
  },
  {
    title: 'User Management',
    href: '/users',
    icon: UserCog,
    roles: ['admin']
  },
  {
    title: 'Institutions',
    href: '/institutions',
    icon: Building2,
    roles: ['admin']
  }
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const filteredNavItems = navItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <div className={cn(
      "flex flex-col h-screen bg-card border-r border-border transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gradient">VEIMS</h1>
              <p className="text-xs text-muted-foreground">Vital Events System</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="hover:bg-muted"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200",
                "hover:bg-muted hover:scale-105",
                isActive && "bg-primary text-primary-foreground shadow-md"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{item.title}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      {user && (
        <div className="p-4 border-t border-border">
          {!collapsed ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user.role.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">
                  {user.name.charAt(0)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
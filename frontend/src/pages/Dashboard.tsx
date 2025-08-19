import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { BackendStatus } from '@/components/BackendStatus';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  Baby,
  Heart,
  UserPlus,
  Gavel,
  Cross,
  Calendar,
  BarChart3,
  Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Mock data
const monthlyStats = [
  { month: 'Jan', births: 120, deaths: 45, marriages: 80, divorces: 15 },
  { month: 'Feb', births: 135, deaths: 52, marriages: 95, divorces: 18 },
  { month: 'Mar', births: 148, deaths: 41, marriages: 110, divorces: 22 },
  { month: 'Apr', births: 162, deaths: 38, marriages: 125, divorces: 19 },
  { month: 'May', births: 175, deaths: 43, marriages: 140, divorces: 25 },
  { month: 'Jun', births: 188, deaths: 39, marriages: 165, divorces: 21 }
];

const eventDistribution = [
  { name: 'Births', value: 1028, color: '#10b981' },
  { name: 'Deaths', value: 258, color: '#ef4444' },
  { name: 'Marriages', value: 715, color: '#8b5cf6' },
  { name: 'Divorces', value: 120, color: '#f59e0b' },
  { name: 'Adoptions', value: 45, color: '#3b82f6' }
];

const recentActivities = [
  { id: 1, type: 'birth', description: 'Birth registered for Emma Johnson', time: '2 hours ago', status: 'completed' },
  { id: 2, type: 'marriage', description: 'Marriage certificate issued to Smith & Wilson', time: '4 hours ago', status: 'completed' },
  { id: 3, type: 'death', description: 'Death certificate pending verification', time: '6 hours ago', status: 'pending' },
  { id: 4, type: 'adoption', description: 'Adoption case filed by Miller family', time: '1 day ago', status: 'processing' }
];

export default function Dashboard() {
  const { user } = useAuth();

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'birth': return <Baby className="w-4 h-4" />;
      case 'death': return <Cross className="w-4 h-4" />;
      case 'marriage': return <Heart className="w-4 h-4" />;
      case 'divorce': return <Gavel className="w-4 h-4" />;
      case 'adoption': return <UserPlus className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'birth': return 'event-birth';
      case 'death': return 'event-death';
      case 'marriage': return 'event-marriage';
      case 'divorce': return 'event-divorce';
      case 'adoption': return 'event-adoption';
      default: return 'bg-muted';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="secondary" className="bg-success text-success-foreground">Completed</Badge>;
      case 'pending': return <Badge variant="secondary" className="bg-warning text-warning-foreground">Pending</Badge>;
      case 'processing': return <Badge variant="secondary" className="bg-info text-info-foreground">Processing</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case 'registrant':
        return (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>My Records</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 event-birth rounded-full flex items-center justify-center">
                          <Baby className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Birth Certificate</span>
                      </div>
                      <Badge variant="secondary" className="bg-success text-success-foreground">Available</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>Account Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Index Number: {user.indexNumber}</p>
                    <Badge variant="secondary" className="bg-success text-success-foreground">Verified</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'admin':
        return (
          <>
                      
             {/* Backend Status */}
             <div className="flex justify-center">
            <BackendStatus />
          </div>
           
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="stat-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Registrars</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">Across 12 offices</p>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Institutions</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28</div>
                <p className="text-xs text-muted-foreground">Hospitals, Courts, Religious</p>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.8%</div>
                <p className="text-xs text-muted-foreground">Uptime this month</p>
              </CardContent>
            </Card>
          </div>
          </>
        );

      case 'court':
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="stat-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Court Cases</CardTitle>
                <Gavel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Divorces</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Adoptions</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Marriages</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">67</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="stat-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Births</CardTitle>
                <Baby className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,028</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Deaths</CardTitle>
                <Cross className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">258</div>
                <p className="text-xs text-muted-foreground">-2% from last month</p>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Marriages</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">715</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,166</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gradient">
          Welcome back, {user?.name}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening in your {user?.role.replace('_', ' ')} dashboard today.
        </p>
      </div>



      {/* Role-specific stats */}
      {getRoleDashboard()}

      {/* Charts and Analytics */}
      {user?.role !== 'registrant' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Events Chart */}
          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Monthly Events</CardTitle>
              <CardDescription>Event registrations over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="births" fill="#10b981" />
                  <Bar dataKey="deaths" fill="#ef4444" />
                  <Bar dataKey="marriages" fill="#8b5cf6" />
                  <Bar dataKey="divorces" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Event Distribution */}
          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Event Distribution</CardTitle>
              <CardDescription>Breakdown of all recorded events this year</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={eventDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {eventDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activities */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Recent Activities</span>
          </CardTitle>
          <CardDescription>Latest events and system activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getEventColor(activity.type)}`}>
                  {getEventIcon(activity.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                {getStatusBadge(activity.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
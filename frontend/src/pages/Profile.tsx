import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Building2, 
  Shield, 
  FileText, 
  Calendar,
  MapPin,
  Phone,
  Edit3,
  Save,
  X,
  Key,
  Activity,
  Award,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    bio: ''
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      name: user.name,
      email: user.email,
      phone: '',
      address: '',
      bio: ''
    });
  };

  const handleSave = () => {
    // In a real app, this would update the user profile in the backend
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user.name,
      email: user.email,
      phone: '',
      address: '',
      bio: ''
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'registrar': return <FileText className="w-4 h-4" />;
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'office_manager': return <Activity className="w-4 h-4" />;
      case 'health_institution': return <Building2 className="w-4 h-4" />;
      case 'court': return <Award className="w-4 h-4" />;
      case 'religious_institution': return <Building2 className="w-4 h-4" />;
      case 'registrant': return <User className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'registrar': return 'bg-blue-100 text-blue-800';
      case 'admin': return 'bg-red-100 text-red-800';
      case 'office_manager': return 'bg-purple-100 text-purple-800';
      case 'health_institution': return 'bg-green-100 text-green-800';
      case 'court': return 'bg-orange-100 text-orange-800';
      case 'religious_institution': return 'bg-indigo-100 text-indigo-800';
      case 'registrant': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'registrar': return 'Civil Registration Officer with full access to all registration forms';
      case 'admin': return 'System Administrator with complete system control and user management';
      case 'office_manager': return 'Office Manager with analytics and reporting capabilities';
      case 'health_institution': return 'Healthcare facility authorized for birth and death registrations';
      case 'court': return 'Legal institution with access to court-related registrations';
      case 'religious_institution': return 'Religious organization authorized for marriage registrations';
      case 'registrant': return 'Citizen with access to view personal records and submit registrations';
      default: return 'User with basic system access';
    }
  };

  const getRolePermissions = (role: string) => {
    switch (role) {
      case 'registrar':
        return [
          'Create and edit all types of registrations',
          'Generate official certificates',
          'Access to all system features',
          'Manage local office operations'
        ];
      case 'admin':
        return [
          'Manage all users and roles',
          'System configuration and settings',
          'Access to all data and reports',
          'System maintenance and updates'
        ];
      case 'office_manager':
        return [
          'Generate analytics and reports',
          'View system statistics',
          'Manage office workflows',
          'Access to predictive analytics'
        ];
      case 'health_institution':
        return [
          'Register births and deaths',
          'Generate health-related certificates',
          'Access to medical records',
          'Submit institutional reports'
        ];
      case 'court':
        return [
          'Register divorces',
          'Register adoptions',
          'Register marriages',
          'Access court records',
          'Generate legal documents',
          'Manage case files'
        ];
      case 'religious_institution':
        return [
          'Register marriages',
          'Generate marriage certificates',
          'Access religious records',
          'Submit marriage reports'
        ];
      case 'registrant':
        return [
          'View personal records',
          'Submit registration requests',
          'Track application status',
          'Download personal certificates'
        ];
      default:
        return ['Basic system access'];
    }
  };

  const getRoleStats = (role: string) => {
    switch (role) {
      case 'registrar':
        return [
          { label: 'Registrations Processed', value: '1,247', icon: <FileText className="w-4 h-4" /> },
          { label: 'Certificates Generated', value: '1,189', icon: <FileText className="w-4 h-4" /> },
          { label: 'Years of Service', value: '8', icon: <Calendar className="w-4 h-4" /> },
          { label: 'Office Location', value: 'Central Registry', icon: <MapPin className="w-4 h-4" /> }
        ];
      case 'admin':
        return [
          { label: 'Users Managed', value: '2,847', icon: <User className="w-4 h-4" /> },
          { label: 'System Uptime', value: '99.8%', icon: <Activity className="w-4 h-4" /> },
          { label: 'Active Sessions', value: '156', icon: <Clock className="w-4 h-4" /> },
          { label: 'Last Maintenance', value: '2 days ago', icon: <Calendar className="w-4 h-4" /> }
        ];
      case 'office_manager':
        return [
          { label: 'Reports Generated', value: '89', icon: <FileText className="w-4 h-4" /> },
          { label: 'Analytics Created', value: '23', icon: <Activity className="w-4 h-4" /> },
          { label: 'Team Members', value: '12', icon: <User className="w-4 h-4" /> },
          { label: 'Office Performance', value: '94%', icon: <Award className="w-4 h-4" /> }
        ];
      case 'health_institution':
        return [
          { label: 'Births Registered', value: '456', icon: <FileText className="w-4 h-4" /> },
          { label: 'Deaths Registered', value: '89', icon: <FileText className="w-4 h-4" /> },
          { label: 'Staff Members', value: '45', icon: <User className="w-4 h-4" /> },
          { label: 'Accreditation', value: 'Level A', icon: <Award className="w-4 h-4" /> }
        ];
      case 'court':
        return [
          { label: 'Divorces Registered', value: '89', icon: <FileText className="w-4 h-4" /> },
          { label: 'Adoptions Registered', value: '23', icon: <FileText className="w-4 h-4" /> },
          { label: 'Marriages Registered', value: '67', icon: <FileText className="w-4 h-4" /> },
          { label: 'Court Type', value: 'District', icon: <Building2 className="w-4 h-4" /> }
        ];
      case 'religious_institution':
        return [
          { label: 'Marriages Registered', value: '178', icon: <FileText className="w-4 h-4" /> },
          { label: 'Clergy Members', value: '6', icon: <User className="w-4 h-4" /> },
          { label: 'Denomination', value: 'Catholic', icon: <Building2 className="w-4 h-4" /> },
          { label: 'Years Established', value: '45', icon: <Calendar className="w-4 h-4" /> }
        ];
      case 'registrant':
        return [
          { label: 'Records Viewed', value: '12', icon: <FileText className="w-4 h-4" /> },
          { label: 'Applications', value: '3', icon: <FileText className="w-4 h-4" /> },
          { label: 'Member Since', value: '2020', icon: <Calendar className="w-4 h-4" /> },
          { label: 'Verification', value: 'Verified', icon: <Award className="w-4 h-4" /> }
        ];
      default:
        return [
          { label: 'System Access', value: 'Basic', icon: <Key className="w-4 h-4" /> },
          { label: 'Last Login', value: 'Today', icon: <Clock className="w-4 h-4" /> }
        ];
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <User className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gradient">Profile</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Overview */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card className="card-elegant">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="" alt={user.name} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <div className="flex items-center justify-center space-x-2 mt-2">
                {getRoleIcon(user.role)}
                <Badge className={getRoleColor(user.role)}>
                  {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {user.indexNumber && (
                  <div className="flex items-center space-x-3">
                    <Key className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">ID: {user.indexNumber}</span>
                  </div>
                )}
                {user.institutionName && (
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{user.institutionName}</span>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="text-center">
                <Button 
                  onClick={handleEdit} 
                  variant="outline" 
                  className="w-full"
                  disabled={isEditing}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Role Information */}
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Role Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {getRoleDescription(user.role)}
              </p>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Permissions:</h4>
                <ul className="space-y-1">
                  {getRolePermissions(user.role).map((permission, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>{permission}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Profile Form */}
          {isEditing && (
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={editData.address}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      placeholder="123 Main St, City, State"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={handleSave} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="flex-1">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Role Statistics */}
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle>Role Statistics</CardTitle>
              <CardDescription>Key metrics and information for your role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {getRoleStats(user.role).map((stat, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{stat.label}</p>
                      <p className="text-lg font-bold text-primary">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Profile viewed</p>
                    <p className="text-xs text-muted-foreground">Just now</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Logged in successfully</p>
                    <p className="text-xs text-muted-foreground">Today at 9:30 AM</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Role permissions updated</p>
                    <p className="text-xs text-muted-foreground">Yesterday at 2:15 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

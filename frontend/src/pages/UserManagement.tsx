
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  UserPlus, 
  Edit, 
  Trash2, 
  Shield, 
  Users,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import AddUserDialog from '@/components/forms/AddUserDialog';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  institutionName?: string;
  indexNumber?: string;
}

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.registrar@veims.gov',
    role: 'registrar',
    status: 'active',
    lastLogin: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Sarah Manager',
    email: 'sarah.manager@veims.gov',
    role: 'office_manager',
    status: 'active',
    lastLogin: '2024-01-14T15:45:00Z'
  },
  {
    id: '3',
    name: 'City General Hospital',
    email: 'records@cityhospital.org',
    role: 'health_institution',
    status: 'active',
    lastLogin: '2024-01-13T09:20:00Z',
    institutionName: 'City General Hospital'
  },
  {
    id: '4',
    name: 'Family Court',
    email: 'records@familycourt.gov',
    role: 'court',
    status: 'inactive',
    lastLogin: '2024-01-10T14:15:00Z',
    institutionName: 'Metropolitan Family Court'
  },
  {
    id: '5',
    name: 'St. Mary\'s Church',
    email: 'admin@stmarys.org',
    role: 'religious_institution',
    status: 'active',
    lastLogin: '2024-01-12T11:30:00Z',
    institutionName: 'St. Mary\'s Church'
  },
  {
    id: '6',
    name: 'Jane Citizen',
    email: 'jane.citizen@email.com',
    role: 'registrant',
    status: 'active',
    lastLogin: '2024-01-11T16:20:00Z',
    indexNumber: 'ID123456789'
  }
];

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [users, setUsers] = useState(mockUsers);
  const { user } = useAuth();

  const handleAddUser = (newUser: User) => {
    setUsers([...users, newUser]);
  };

  const getRoleBadge = (role: UserRole) => {
    const roleColors = {
      registrar: 'bg-blue-100 text-blue-800',
      office_manager: 'bg-purple-100 text-purple-800',
      health_institution: 'bg-green-100 text-green-800',
      court: 'bg-orange-100 text-orange-800',
      religious_institution: 'bg-indigo-100 text-indigo-800',
      admin: 'bg-red-100 text-red-800',
      registrant: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge variant="secondary" className={roleColors[role]}>
        {role.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-success text-success-foreground">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="secondary" className="bg-destructive text-destructive-foreground">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access user management.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gradient">User Management</h1>
          <p className="text-muted-foreground">
            Manage system users, roles, and permissions
          </p>
        </div>
        <AddUserDialog onAddUser={handleAddUser} />
      </div>

      {/* Filters */}
      <Card className="card-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Search & Filter Users</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="registrar">Registrar</SelectItem>
                <SelectItem value="office_manager">Office Manager</SelectItem>
                <SelectItem value="health_institution">Health Institution</SelectItem>
                <SelectItem value="court">Court</SelectItem>
                <SelectItem value="religious_institution">Religious Institution</SelectItem>
                <SelectItem value="registrant">Registrant</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Users ({filteredUsers.length})</span>
          </CardTitle>
          <CardDescription>Manage system users and their access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Index Number</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.institutionName || '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.indexNumber || '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="mr-2 h-4 w-4" />
                            Manage Permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No users found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

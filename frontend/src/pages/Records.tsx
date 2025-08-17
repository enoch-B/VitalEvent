import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Baby, 
  Heart, 
  Cross, 
  Gavel, 
  UserPlus,
  Calendar,
  FileText,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

interface Record {
  id: string;
  type: 'birth' | 'death' | 'marriage' | 'divorce' | 'adoption';
  registrationNumber: string;
  fullName: string;
  date: string;
  status: 'completed' | 'pending' | 'processing' | 'verified';
  registeredBy: string;
  location: string;
}

// Mock data
const mockRecords: Record[] = [
  {
    id: '1',
    type: 'birth',
    registrationNumber: 'BR20240001',
    fullName: 'Emma Johnson',
    date: '2024-01-15',
    status: 'completed',
    registeredBy: 'City General Hospital',
    location: 'New York'
  },
  {
    id: '2',
    type: 'marriage',
    registrationNumber: 'MR20240045',
    fullName: 'John Smith & Mary Wilson',
    date: '2024-01-20',
    status: 'verified',
    registeredBy: 'St. Mary\'s Church',
    location: 'Brooklyn'
  },
  {
    id: '3',
    type: 'death',
    registrationNumber: 'DR20240012',
    fullName: 'Robert Davis',
    date: '2024-01-18',
    status: 'pending',
    registeredBy: 'Metropolitan Hospital',
    location: 'Manhattan'
  },
  {
    id: '4',
    type: 'adoption',
    registrationNumber: 'AR20240003',
    fullName: 'Sophie Miller',
    date: '2024-01-22',
    status: 'processing',
    registeredBy: 'Family Court',
    location: 'Queens'
  },
  {
    id: '5',
    type: 'divorce',
    registrationNumber: 'DV20240008',
    fullName: 'Michael Brown & Lisa Taylor',
    date: '2024-01-25',
    status: 'completed',
    registeredBy: 'Civil Court',
    location: 'Bronx'
  }
];

export default function Records() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
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
      case 'completed':
        return <Badge variant="secondary" className="bg-success text-success-foreground">Completed</Badge>;
      case 'verified':
        return <Badge variant="secondary" className="bg-info text-info-foreground">Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">Pending</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-primary text-primary-foreground">Processing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredRecords = mockRecords.filter(record => {
    const matchesSearch = record.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || record.type === filterType;
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const canEdit = user?.permissions.includes('update_records');
  const canView = user?.permissions.includes('view_records') || user?.permissions.includes('view_own_records');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gradient">Records Management</h1>
        <p className="text-muted-foreground">
          Search, view, and manage vital event records
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="card-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Search & Filter</span>
          </CardTitle>
          <CardDescription>Find specific records using various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name, registration number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Event Type Filter */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="birth">Births</SelectItem>
                <SelectItem value="death">Deaths</SelectItem>
                <SelectItem value="marriage">Marriages</SelectItem>
                <SelectItem value="divorce">Divorces</SelectItem>
                <SelectItem value="adoption">Adoptions</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card className="card-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Records ({filteredRecords.length})</span>
              </CardTitle>
              <CardDescription>Manage and view vital event records</CardDescription>
            </div>
            <Button className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Registration #</TableHead>
                  <TableHead>Name(s)</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered By</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getEventColor(record.type)}`}>
                          {getEventIcon(record.type)}
                        </div>
                        <span className="capitalize font-medium">{record.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                        {record.registrationNumber}
                      </code>
                    </TableCell>
                    <TableCell className="font-medium">{record.fullName}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(record.date).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell className="text-muted-foreground">{record.registeredBy}</TableCell>
                    <TableCell className="text-muted-foreground">{record.location}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {canView && (
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          )}
                          {canEdit && (
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Record
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download Certificate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No records found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        {[
          { type: 'birth', count: mockRecords.filter(r => r.type === 'birth').length, label: 'Births' },
          { type: 'death', count: mockRecords.filter(r => r.type === 'death').length, label: 'Deaths' },
          { type: 'marriage', count: mockRecords.filter(r => r.type === 'marriage').length, label: 'Marriages' },
          { type: 'divorce', count: mockRecords.filter(r => r.type === 'divorce').length, label: 'Divorces' },
          { type: 'adoption', count: mockRecords.filter(r => r.type === 'adoption').length, label: 'Adoptions' }
        ].map((stat) => (
          <Card key={stat.type} className="stat-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stat.count}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getEventColor(stat.type)}`}>
                  {getEventIcon(stat.type)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
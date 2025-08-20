import { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Search, Building2, Plus, Edit, MapPin, Users, MoreHorizontal, 
  Hospital, Gavel, Church 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AddInstitutionDialog from '@/components/forms/AddInstitutionDialog';
import { institutionsAPI } from '@/lib/api';

interface Institution {
  id: string;
  name: string;
  type: 'health_institution' | 'court' | 'religious_institution';
  email: string;
  address: string;
  city: string;
  status: 'active' | 'inactive' | 'pending';
  registrationDate: string;
  contactPerson: string;
  phone: string;
}

export default function Institutions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch institutions from API
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        setIsLoading(true);
        const response = await institutionsAPI.getAll();
        setInstitutions(response.data); // adjust if your API response is different
      } catch (error) {
        console.error("Failed to fetch institutions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstitutions();
  }, []);

  const handleAddInstitution = (newInstitution: Institution) => {
    setInstitutions([...institutions, newInstitution]);
  };

  const getInstitutionIcon = (type: string) => {
    switch (type) {
      case 'health_institution': return <Hospital className="w-4 h-4" />;
      case 'court': return <Gavel className="w-4 h-4" />;
      case 'religious_institution': return <Church className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeColors = {
      health_institution: 'bg-green-100 text-green-800',
      court: 'bg-orange-100 text-orange-800',
      religious_institution: 'bg-indigo-100 text-indigo-800'
    };

    const typeLabels = {
      health_institution: 'Health Institution',
      court: 'Court',
      religious_institution: 'Religious Institution'
    };

    return (
      <Badge variant="secondary" className={typeColors[type as keyof typeof typeColors]}>
        {typeLabels[type as keyof typeof typeLabels]}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-success text-success-foreground">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">Inactive</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-info text-info-foreground">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredInstitutions = institutions.filter(institution => {
    const matchesSearch = institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          institution.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          institution.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || institution.type === filterType;
    const matchesStatus = filterStatus === 'all' || institution.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gradient">Institutions</h1>
          <p className="text-muted-foreground">
            Manage registered institutions and their access
          </p>
        </div>
        <AddInstitutionDialog onAddInstitution={handleAddInstitution} />
      </div>

      {/* Filters */}
      <Card className="card-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Search & Filter Institutions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name, email, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="health_institution">Health Institutions</SelectItem>
                <SelectItem value="court">Courts</SelectItem>
                <SelectItem value="religious_institution">Religious Institutions</SelectItem>
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
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Institutions Table */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>Institutions ({filteredInstitutions.length})</span>
          </CardTitle>
          <CardDescription>Manage registered institutions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading institutions...</div>
          ) : filteredInstitutions.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No institutions found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Institution</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInstitutions.map((institution) => (
                    <TableRow key={institution.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            {getInstitutionIcon(institution.type)}
                          </div>
                          <div>
                            <div className="font-medium">{institution.name}</div>
                            <div className="text-sm text-muted-foreground">{institution.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(institution.type)}</TableCell>
                      <TableCell>{getStatusBadge(institution.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm">{institution.address}</div>
                            <div className="text-xs text-muted-foreground">{institution.city}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">{institution.contactPerson}</div>
                          <div className="text-xs text-muted-foreground">{institution.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(institution.registrationDate).toLocaleDateString()}
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
                              Edit Institution
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="mr-2 h-4 w-4" />
                              View Users
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {institutions.filter(i => i.type === 'health_institution').length}
                </p>
                <p className="text-sm text-muted-foreground">Health Institutions</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Hospital className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {institutions.filter(i => i.type === 'court').length}
                </p>
                <p className="text-sm text-muted-foreground">Courts</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Gavel className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {institutions.filter(i => i.type === 'religious_institution').length}
                </p>
                <p className="text-sm text-muted-foreground">Religious</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Church className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

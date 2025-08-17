import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UserPlus, User, Building2, Hash } from 'lucide-react';
import { UserRole } from '@/contexts/AuthContext';

interface AddUserDialogProps {
  onAddUser?: (user: any) => void;
}

export default function AddUserDialog({ onAddUser }: AddUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '' as UserRole | '',
    institutionName: '',
    indexNumber: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Validate index number for registrants
    if (formData.role === 'registrant' && !formData.indexNumber.trim()) {
      alert('Index number is required for new citizens');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role as UserRole,
      status: 'active' as const,
      lastLogin: new Date().toISOString(),
      institutionName: formData.institutionName || undefined,
      indexNumber: formData.role === 'registrant' ? formData.indexNumber : undefined
    };

    onAddUser?.(newUser);
    setOpen(false);
    setFormData({
      name: '',
      email: '',
      role: '',
      institutionName: '',
      indexNumber: '',
      password: '',
      confirmPassword: ''
    });
  };

  const requiresInstitution = ['health_institution', 'court', 'religious_institution'].includes(formData.role);
  const isRegistrant = formData.role === 'registrant';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with the appropriate role and permissions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter full name"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter email address"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value: UserRole) => setFormData({...formData, role: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="registrar">Registrar</SelectItem>
                  <SelectItem value="office_manager">Office Manager</SelectItem>
                  <SelectItem value="health_institution">Health Institution</SelectItem>
                  <SelectItem value="court">Court</SelectItem>
                  <SelectItem value="religious_institution">Religious Institution</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="registrant">New Citizen (Registrant)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Index Number field for new citizens */}
            {isRegistrant && (
              <div className="grid gap-2">
                <Label htmlFor="indexNumber" className="flex items-center space-x-2">
                  <Hash className="w-4 h-4" />
                  <span>Index Number *</span>
                </Label>
                <Input
                  id="indexNumber"
                  value={formData.indexNumber}
                  onChange={(e) => setFormData({...formData, indexNumber: e.target.value})}
                  placeholder="Enter citizen index number (e.g., ID123456789)"
                  required
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  This is the unique identifier for the new citizen in the system.
                </p>
              </div>
            )}

            {requiresInstitution && (
              <div className="grid gap-2">
                <Label htmlFor="institutionName" className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4" />
                  <span>Institution Name</span>
                </Label>
                <Input
                  id="institutionName"
                  value={formData.institutionName}
                  onChange={(e) => setFormData({...formData, institutionName: e.target.value})}
                  placeholder="Enter institution name"
                  required
                />
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Enter password"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="Confirm password"
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow">
              {isRegistrant ? 'Create Citizen Account' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Cross, Upload, Check, User, MapPin, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const deathSchema = z.object({
  deceasedFirstName: z.string().min(1, 'First name is required'),
  deceasedLastName: z.string().min(1, 'Last name is required'),
  deceasedDateOfBirth: z.date({ required_error: 'Date of birth is required' }),
  deceasedDateOfDeath: z.date({ required_error: 'Date of death is required' }),
  deceasedAge: z.string().min(1, 'Age is required'),
  deceasedGender: z.enum(['male', 'female', 'other']),
  placeOfDeath: z.string().min(1, 'Place of death is required'),
  addressOfDeath: z.string().min(1, 'Address of death is required'),
  immediateCause: z.string().min(1, 'Immediate cause is required'),
  underlyingCause: z.string().min(1, 'Underlying cause is required'),
  mannerOfDeath: z.enum(['natural', 'accident', 'suicide', 'homicide', 'undetermined']),
  attendingPhysician: z.string().min(1, 'Attending physician is required'),
  hospitalName: z.string().min(1, 'Hospital name is required'),
  informantFirstName: z.string().min(1, 'Informant first name is required'),
  informantLastName: z.string().min(1, 'Informant last name is required'),
  informantRelationship: z.string().min(1, 'Relationship to deceased is required'),
  informantPhone: z.string().min(1, 'Informant phone is required'),
});

type DeathFormData = z.infer<typeof deathSchema>;

export default function DeathRegistration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DeathFormData>({
    resolver: zodResolver(deathSchema),
  });

  const deceasedDateOfBirth = watch('deceasedDateOfBirth');
  const deceasedDateOfDeath = watch('deceasedDateOfDeath');

  const onSubmit = async (data: DeathFormData) => {
    setIsSubmitting(true);
    
    const registrationNumber = `DR${Date.now().toString().slice(-8)}`;
    
    const newRecord = {
      id: registrationNumber,
      type: 'death',
      registrationNumber,
      fullName: `${data.deceasedFirstName} ${data.deceasedLastName}`,
      date: data.deceasedDateOfDeath.toISOString().split('T')[0],
      status: 'completed',
      registeredBy: user?.name || 'Current User',
      location: data.hospitalName
    };

    if (typeof window !== 'undefined') {
      const existingRecords = JSON.parse(localStorage.getItem('veims_records') || '[]');
      existingRecords.unshift(newRecord);
      localStorage.setItem('veims_records', JSON.stringify(existingRecords));
      
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'veims_records',
        newValue: JSON.stringify(existingRecords)
      }));
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Death registered successfully!",
      description: `Registration number: ${registrationNumber}`,
    });
    
    setIsSubmitting(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileNames = Array.from(files).map(file => file.name);
      setUploadedFiles(prev => [...prev, ...fileNames]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 event-death rounded-lg flex items-center justify-center">
          <Cross className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gradient">Death Registration</h1>
          <p className="text-muted-foreground">
            Register a death and generate death certificate
            {user && (
              <span className="block text-xs text-primary mt-1">
                Accessible to: {user.role.replace('_', ' ')} role
              </span>
            )}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Deceased Person Information */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Deceased Person Information</span>
            </CardTitle>
            <CardDescription>Personal details of the deceased person</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="deceasedFirstName">First Name *</Label>
                <Input
                  id="deceasedFirstName"
                  {...register('deceasedFirstName')}
                  className={errors.deceasedFirstName ? 'border-destructive' : ''}
                />
                {errors.deceasedFirstName && (
                  <p className="text-sm text-destructive">{errors.deceasedFirstName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deceasedLastName">Last Name *</Label>
                <Input
                  id="deceasedLastName"
                  {...register('deceasedLastName')}
                  className={errors.deceasedLastName ? 'border-destructive' : ''}
                />
                {errors.deceasedLastName && (
                  <p className="text-sm text-destructive">{errors.deceasedLastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Date of Birth *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !deceasedDateOfBirth && "text-muted-foreground",
                        errors.deceasedDateOfBirth && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deceasedDateOfBirth ? format(deceasedDateOfBirth, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={deceasedDateOfBirth}
                      onSelect={(date) => setValue('deceasedDateOfBirth', date!)}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.deceasedDateOfBirth && (
                  <p className="text-sm text-destructive">{errors.deceasedDateOfBirth.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Date of Death *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !deceasedDateOfDeath && "text-muted-foreground",
                        errors.deceasedDateOfDeath && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deceasedDateOfDeath ? format(deceasedDateOfDeath, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={deceasedDateOfDeath}
                      onSelect={(date) => setValue('deceasedDateOfDeath', date!)}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.deceasedDateOfDeath && (
                  <p className="text-sm text-destructive">{errors.deceasedDateOfDeath.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="deceasedAge">Age at Death *</Label>
                <Input
                  id="deceasedAge"
                  type="number"
                  {...register('deceasedAge')}
                  className={errors.deceasedAge ? 'border-destructive' : ''}
                />
                {errors.deceasedAge && (
                  <p className="text-sm text-destructive">{errors.deceasedAge.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deceasedGender">Gender *</Label>
                <Select onValueChange={(value) => setValue('deceasedGender', value as any)}>
                  <SelectTrigger className={errors.deceasedGender ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.deceasedGender && (
                  <p className="text-sm text-destructive">{errors.deceasedGender.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Place of Death */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Place of Death</span>
            </CardTitle>
            <CardDescription>Location where death occurred</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="placeOfDeath">Place of Death *</Label>
              <Input
                id="placeOfDeath"
                {...register('placeOfDeath')}
                className={errors.placeOfDeath ? 'border-destructive' : ''}
                placeholder="e.g., City General Hospital"
              />
              {errors.placeOfDeath && (
                <p className="text-sm text-destructive">{errors.placeOfDeath.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressOfDeath">Full Address *</Label>
              <Input
                id="addressOfDeath"
                {...register('addressOfDeath')}
                className={errors.addressOfDeath ? 'border-destructive' : ''}
                placeholder="Street address, building, room number"
              />
              {errors.addressOfDeath && (
                <p className="text-sm text-destructive">{errors.addressOfDeath.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cause of Death */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Cause of Death</span>
            </CardTitle>
            <CardDescription>Medical information about the cause of death</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="immediateCause">Immediate Cause of Death *</Label>
              <Input
                id="immediateCause"
                {...register('immediateCause')}
                className={errors.immediateCause ? 'border-destructive' : ''}
                placeholder="e.g., Cardiac arrest, Respiratory failure"
              />
              {errors.immediateCause && (
                <p className="text-sm text-destructive">{errors.immediateCause.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="underlyingCause">Underlying Cause of Death *</Label>
              <Input
                id="underlyingCause"
                {...register('underlyingCause')}
                className={errors.underlyingCause ? 'border-destructive' : ''}
                placeholder="e.g., Heart disease, Cancer, Diabetes"
              />
              {errors.underlyingCause && (
                <p className="text-sm text-destructive">{errors.underlyingCause.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mannerOfDeath">Manner of Death *</Label>
              <Select onValueChange={(value) => setValue('mannerOfDeath', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select manner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="natural">Natural</SelectItem>
                  <SelectItem value="accident">Accident</SelectItem>
                  <SelectItem value="suicide">Suicide</SelectItem>
                  <SelectItem value="homicide">Homicide</SelectItem>
                  <SelectItem value="undetermined">Undetermined</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
            <CardDescription>Details about medical care and certification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="attendingPhysician">Attending Physician *</Label>
                <Input
                  id="attendingPhysician"
                  {...register('attendingPhysician')}
                  className={errors.attendingPhysician ? 'border-destructive' : ''}
                />
                {errors.attendingPhysician && (
                  <p className="text-sm text-destructive">{errors.attendingPhysician.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hospitalName">Hospital/Institution Name *</Label>
                <Input
                  id="hospitalName"
                  {...register('hospitalName')}
                  className={errors.hospitalName ? 'border-destructive' : ''}
                />
                {errors.hospitalName && (
                  <p className="text-sm text-destructive">{errors.hospitalName.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informant Information */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Informant Information</CardTitle>
            <CardDescription>Details of the person providing death information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="informantFirstName">First Name *</Label>
                <Input
                  id="informantFirstName"
                  {...register('informantFirstName')}
                  className={errors.informantFirstName ? 'border-destructive' : ''}
                />
                {errors.informantFirstName && (
                  <p className="text-sm text-destructive">{errors.informantFirstName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="informantLastName">Last Name *</Label>
                <Input
                  id="informantLastName"
                  {...register('informantLastName')}
                  className={errors.informantLastName ? 'border-destructive' : ''}
                />
                {errors.informantLastName && (
                  <p className="text-sm text-destructive">{errors.informantLastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="informantRelationship">Relationship to Deceased *</Label>
                <Input
                  id="informantRelationship"
                  {...register('informantRelationship')}
                  className={errors.informantRelationship ? 'border-destructive' : ''}
                  placeholder="e.g., Spouse, Child, Parent, Sibling"
                />
                {errors.informantRelationship && (
                  <p className="text-sm text-destructive">{errors.informantRelationship.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="informantPhone">Phone Number *</Label>
                <Input
                  id="informantPhone"
                  {...register('informantPhone')}
                  className={errors.informantPhone ? 'border-destructive' : ''}
                />
                {errors.informantPhone && (
                  <p className="text-sm text-destructive">{errors.informantPhone.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Supporting Documents</CardTitle>
            <CardDescription>Upload relevant medical records and certificates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="documents">Supporting Documents</Label>
              <div className="border-2 border-dashed border-muted rounded-lg p-6 hover:border-primary transition-colors">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="mt-4">
                    <Input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" asChild>
                        <span>Choose Files</span>
                      </Button>
                    </Label>
                    <p className="text-sm text-muted-foreground mt-2">
                      PDF, JPG, JPEG, PNG up to 10MB each
                    </p>
                  </div>
                </div>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Uploaded files:</p>
                  <ul className="text-sm text-muted-foreground">
                    {uploadedFiles.map((file, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-4 h-4 mr-2 text-green-500" />
                        {file}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
            {isSubmitting ? 'Registering...' : 'Register Death'}
          </Button>
        </div>
      </form>
    </div>
  );
}

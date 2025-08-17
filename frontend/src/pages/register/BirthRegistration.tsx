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
import { CalendarIcon, Baby, Upload, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const birthSchema = z.object({
  // Child Information
  childFirstName: z.string().min(1, 'First name is required'),
  childMiddleName: z.string().optional(),
  childLastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.date({ required_error: 'Date of birth is required' }),
  timeOfBirth: z.string().min(1, 'Time of birth is required'),
  placeOfBirth: z.string().min(1, 'Place of birth is required'),
  gender: z.enum(['male', 'female']),
  weight: z.string().optional(),
  
  // Mother Information
  motherFirstName: z.string().min(1, 'Mother first name is required'),
  motherMiddleName: z.string().optional(),
  motherLastName: z.string().min(1, 'Mother last name is required'),
  motherIdNumber: z.string().min(1, 'Mother ID number is required'),
  motherNationality: z.string().min(1, 'Mother nationality is required'),
  motherOccupation: z.string().optional(),
  motherAge: z.string().min(1, 'Mother age is required'),
  
  // Father Information
  fatherFirstName: z.string().min(1, 'Father first name is required'),
  fatherMiddleName: z.string().optional(),
  fatherLastName: z.string().min(1, 'Father last name is required'),
  fatherIdNumber: z.string().min(1, 'Father ID number is required'),
  fatherNationality: z.string().min(1, 'Father nationality is required'),
  fatherOccupation: z.string().optional(),
  fatherAge: z.string().min(1, 'Father age is required'),
  
  // Registration Details
  hospitalName: z.string().min(1, 'Hospital/Institution name is required'),
  attendingPhysician: z.string().min(1, 'Attending physician is required'),
  registrarNotes: z.string().optional(),
});

type BirthFormData = z.infer<typeof birthSchema>;

export default function BirthRegistration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BirthFormData>({
    resolver: zodResolver(birthSchema),
  });

  const dateOfBirth = watch('dateOfBirth');

  const onSubmit = async (data: BirthFormData) => {
    setIsSubmitting(true);
    
    // Generate registration number
    const registrationNumber = `BR${Date.now().toString().slice(-8)}`;
    
    // Simulate real-time update
    const newRecord = {
      id: registrationNumber,
      type: 'birth',
      registrationNumber,
      fullName: `${data.childFirstName} ${data.childLastName}`,
      date: data.dateOfBirth.toISOString().split('T')[0],
      status: 'completed',
      registeredBy: 'Current User',
      location: data.hospitalName
    };

    // Add to records (simulate real-time update)
    if (typeof window !== 'undefined') {
      const existingRecords = JSON.parse(localStorage.getItem('veims_records') || '[]');
      existingRecords.unshift(newRecord);
      localStorage.setItem('veims_records', JSON.stringify(existingRecords));
      
      // Trigger storage event for real-time updates
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'veims_records',
        newValue: JSON.stringify(existingRecords)
      }));
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Birth registered successfully!",
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
        <div className="w-10 h-10 event-birth rounded-lg flex items-center justify-center">
          <Baby className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gradient">Birth Registration</h1>
          <p className="text-muted-foreground">Register a new birth and generate certificate</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Child Information */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Child Information</CardTitle>
            <CardDescription>Basic details about the newborn child</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="childFirstName">First Name *</Label>
                <Input
                  id="childFirstName"
                  {...register('childFirstName')}
                  className={errors.childFirstName ? 'border-destructive' : ''}
                />
                {errors.childFirstName && (
                  <p className="text-sm text-destructive">{errors.childFirstName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="childMiddleName">Middle Name</Label>
                <Input id="childMiddleName" {...register('childMiddleName')} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="childLastName">Last Name *</Label>
                <Input
                  id="childLastName"
                  {...register('childLastName')}
                  className={errors.childLastName ? 'border-destructive' : ''}
                />
                {errors.childLastName && (
                  <p className="text-sm text-destructive">{errors.childLastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Date of Birth *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateOfBirth && "text-muted-foreground",
                        errors.dateOfBirth && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateOfBirth ? format(dateOfBirth, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateOfBirth}
                      onSelect={(date) => setValue('dateOfBirth', date!)}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.dateOfBirth && (
                  <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeOfBirth">Time of Birth *</Label>
                <Input
                  id="timeOfBirth"
                  type="time"
                  {...register('timeOfBirth')}
                  className={errors.timeOfBirth ? 'border-destructive' : ''}
                />
                {errors.timeOfBirth && (
                  <p className="text-sm text-destructive">{errors.timeOfBirth.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select onValueChange={(value) => setValue('gender', value as 'male' | 'female')}>
                  <SelectTrigger className={errors.gender ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-destructive">{errors.gender.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="placeOfBirth">Place of Birth *</Label>
                <Input
                  id="placeOfBirth"
                  {...register('placeOfBirth')}
                  placeholder="Hospital/Location name"
                  className={errors.placeOfBirth ? 'border-destructive' : ''}
                />
                {errors.placeOfBirth && (
                  <p className="text-sm text-destructive">{errors.placeOfBirth.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (optional)</Label>
                <Input
                  id="weight"
                  {...register('weight')}
                  placeholder="e.g., 3.2 kg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mother Information */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Mother Information</CardTitle>
            <CardDescription>Details about the mother</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="motherFirstName">First Name *</Label>
                <Input
                  id="motherFirstName"
                  {...register('motherFirstName')}
                  className={errors.motherFirstName ? 'border-destructive' : ''}
                />
                {errors.motherFirstName && (
                  <p className="text-sm text-destructive">{errors.motherFirstName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="motherMiddleName">Middle Name</Label>
                <Input id="motherMiddleName" {...register('motherMiddleName')} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="motherLastName">Last Name *</Label>
                <Input
                  id="motherLastName"
                  {...register('motherLastName')}
                  className={errors.motherLastName ? 'border-destructive' : ''}
                />
                {errors.motherLastName && (
                  <p className="text-sm text-destructive">{errors.motherLastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="motherIdNumber">ID Number *</Label>
                <Input
                  id="motherIdNumber"
                  {...register('motherIdNumber')}
                  className={errors.motherIdNumber ? 'border-destructive' : ''}
                />
                {errors.motherIdNumber && (
                  <p className="text-sm text-destructive">{errors.motherIdNumber.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="motherAge">Age *</Label>
                <Input
                  id="motherAge"
                  type="number"
                  {...register('motherAge')}
                  className={errors.motherAge ? 'border-destructive' : ''}
                />
                {errors.motherAge && (
                  <p className="text-sm text-destructive">{errors.motherAge.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="motherNationality">Nationality *</Label>
                <Input
                  id="motherNationality"
                  {...register('motherNationality')}
                  className={errors.motherNationality ? 'border-destructive' : ''}
                />
                {errors.motherNationality && (
                  <p className="text-sm text-destructive">{errors.motherNationality.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="motherOccupation">Occupation</Label>
                <Input id="motherOccupation" {...register('motherOccupation')} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Father Information */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Father Information</CardTitle>
            <CardDescription>Details about the father</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="fatherFirstName">First Name *</Label>
                <Input
                  id="fatherFirstName"
                  {...register('fatherFirstName')}
                  className={errors.fatherFirstName ? 'border-destructive' : ''}
                />
                {errors.fatherFirstName && (
                  <p className="text-sm text-destructive">{errors.fatherFirstName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fatherMiddleName">Middle Name</Label>
                <Input id="fatherMiddleName" {...register('fatherMiddleName')} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fatherLastName">Last Name *</Label>
                <Input
                  id="fatherLastName"
                  {...register('fatherLastName')}
                  className={errors.fatherLastName ? 'border-destructive' : ''}
                />
                {errors.fatherLastName && (
                  <p className="text-sm text-destructive">{errors.fatherLastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fatherIdNumber">ID Number *</Label>
                <Input
                  id="fatherIdNumber"
                  {...register('fatherIdNumber')}
                  className={errors.fatherIdNumber ? 'border-destructive' : ''}
                />
                {errors.fatherIdNumber && (
                  <p className="text-sm text-destructive">{errors.fatherIdNumber.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fatherAge">Age *</Label>
                <Input
                  id="fatherAge"
                  type="number"
                  {...register('fatherAge')}
                  className={errors.fatherAge ? 'border-destructive' : ''}
                />
                {errors.fatherAge && (
                  <p className="text-sm text-destructive">{errors.fatherAge.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fatherNationality">Nationality *</Label>
                <Input
                  id="fatherNationality"
                  {...register('fatherNationality')}
                  className={errors.fatherNationality ? 'border-destructive' : ''}
                />
                {errors.fatherNationality && (
                  <p className="text-sm text-destructive">{errors.fatherNationality.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fatherOccupation">Occupation</Label>
                <Input id="fatherOccupation" {...register('fatherOccupation')} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registration Details */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Registration Details</CardTitle>
            <CardDescription>Official registration information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="hospitalName">Hospital/Institution *</Label>
                <Input
                  id="hospitalName"
                  {...register('hospitalName')}
                  className={errors.hospitalName ? 'border-destructive' : ''}
                />
                {errors.hospitalName && (
                  <p className="text-sm text-destructive">{errors.hospitalName.message}</p>
                )}
              </div>
              
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrarNotes">Additional Notes</Label>
              <Textarea
                id="registrarNotes"
                {...register('registrarNotes')}
                placeholder="Any additional information or special circumstances"
                rows={3}
              />
            </div>

            {/* File Upload */}
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
                    <Label
                      htmlFor="file-upload"
                      className="cursor-pointer text-primary hover:underline"
                    >
                      Click to upload files
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload medical reports, ID copies, or other supporting documents
                    </p>
                  </div>
                </div>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploaded files:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <Check className="w-4 h-4 text-success" />
                      <span>{file}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-birth to-green-600 hover:shadow-glow transition-all duration-300"
          >
            {isSubmitting ? 'Registering...' : 'Register Birth'}
          </Button>
        </div>
      </form>
    </div>
  );
}
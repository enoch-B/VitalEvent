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
import { CalendarIcon, Users, Upload, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const adoptionSchema = z.object({
  // Child Information
  childFirstName: z.string().min(1, 'Child first name is required'),
  childMiddleName: z.string().optional(),
  childLastName: z.string().min(1, 'Child last name is required'),
  childDateOfBirth: z.date({ required_error: 'Child date of birth is required' }),
  childBirthLocation: z.string().min(1, 'Child birth location is required'),
  childGender: z.enum(['male', 'female']),
  childBirthCertificateNumber: z.string().min(1, 'Birth certificate number is required'),
  
  // Biological Parent(s) Information
  biologicalMotherFirstName: z.string().optional(),
  biologicalMotherLastName: z.string().optional(),
  biologicalMotherIdNumber: z.string().optional(),
  biologicalFatherFirstName: z.string().optional(),
  biologicalFatherLastName: z.string().optional(),
  biologicalFatherIdNumber: z.string().optional(),
  parentalRightsTerminated: z.enum(['yes', 'no']),
  terminationDate: z.date().optional(),
  terminationReason: z.string().optional(),
  
  // Adoptive Parent 1 Information
  adoptiveParent1FirstName: z.string().min(1, 'Adoptive parent 1 first name is required'),
  adoptiveParent1MiddleName: z.string().optional(),
  adoptiveParent1LastName: z.string().min(1, 'Adoptive parent 1 last name is required'),
  adoptiveParent1IdNumber: z.string().min(1, 'Adoptive parent 1 ID number is required'),
  adoptiveParent1Age: z.string().min(1, 'Adoptive parent 1 age is required'),
  adoptiveParent1Occupation: z.string().optional(),
  adoptiveParent1Address: z.string().min(1, 'Adoptive parent 1 address is required'),
  adoptiveParent1Relationship: z.enum(['single', 'married', 'divorced', 'widowed']),
  
  // Adoptive Parent 2 Information (if applicable)
  hasSecondParent: z.enum(['yes', 'no']),
  adoptiveParent2FirstName: z.string().optional(),
  adoptiveParent2MiddleName: z.string().optional(),
  adoptiveParent2LastName: z.string().optional(),
  adoptiveParent2IdNumber: z.string().optional(),
  adoptiveParent2Age: z.string().optional(),
  adoptiveParent2Occupation: z.string().optional(),
  adoptiveParent2Address: z.string().optional(),
  
  // Adoption Details
  adoptionDate: z.date({ required_error: 'Adoption date is required' }),
  courtName: z.string().min(1, 'Court name is required'),
  caseNumber: z.string().min(1, 'Case number is required'),
  judgeName: z.string().min(1, 'Judge name is required'),
  adoptionType: z.enum(['agency', 'private', 'stepparent', 'relative', 'international']),
  agencyName: z.string().optional(),
  attorneyName: z.string().optional(),
  homeStudyCompleted: z.enum(['yes', 'no']),
  homeStudyDate: z.date().optional(),
  homeStudyAgency: z.string().optional(),
  
  // Additional Information
  childNewFirstName: z.string().optional(),
  childNewMiddleName: z.string().optional(),
  childNewLastName: z.string().optional(),
  sealedRecords: z.enum(['yes', 'no']),
  contactAgreement: z.enum(['yes', 'no']),
  specialNeeds: z.enum(['yes', 'no']),
  specialNeedsDescription: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type AdoptionFormData = z.infer<typeof adoptionSchema>;

export default function AdoptionRegistration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AdoptionFormData>({
    resolver: zodResolver(adoptionSchema),
  });

  const childDateOfBirth = watch('childDateOfBirth');
  const adoptionDate = watch('adoptionDate');
  const terminationDate = watch('terminationDate');
  const homeStudyDate = watch('homeStudyDate');
  const hasSecondParent = watch('hasSecondParent');
  const parentalRightsTerminated = watch('parentalRightsTerminated');
  const adoptionType = watch('adoptionType');
  const homeStudyCompleted = watch('homeStudyCompleted');
  const specialNeeds = watch('specialNeeds');

  const onSubmit = async (data: AdoptionFormData) => {
    setIsSubmitting(true);
    
    const registrationNumber = `AR${Date.now().toString().slice(-8)}`;
    
    // Simulate real-time update
    const newRecord = {
      id: registrationNumber,
      type: 'adoption',
      registrationNumber,
      fullName: `${data.childFirstName} ${data.childLastName} (adopted by ${data.adoptiveParent1FirstName} ${data.adoptiveParent1LastName})`,
      date: data.adoptionDate.toISOString().split('T')[0],
      status: 'completed',
      registeredBy: 'Current User',
      location: data.courtName
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
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Adoption registered successfully!",
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
        <div className="w-10 h-10 event-adoption rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gradient">Adoption Registration</h1>
          <p className="text-muted-foreground">Register an adoption and generate certificate</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Child Information */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Child Information</CardTitle>
            <CardDescription>Details about the child being adopted</CardDescription>
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
                        !childDateOfBirth && "text-muted-foreground",
                        errors.childDateOfBirth && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {childDateOfBirth ? format(childDateOfBirth, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={childDateOfBirth}
                      onSelect={(date) => setValue('childDateOfBirth', date!)}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.childDateOfBirth && (
                  <p className="text-sm text-destructive">{errors.childDateOfBirth.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="childGender">Gender *</Label>
                <Select onValueChange={(value) => setValue('childGender', value as 'male' | 'female')}>
                  <SelectTrigger className={errors.childGender ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.childGender && (
                  <p className="text-sm text-destructive">{errors.childGender.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="childBirthCertificateNumber">Birth Certificate Number *</Label>
                <Input
                  id="childBirthCertificateNumber"
                  {...register('childBirthCertificateNumber')}
                  className={errors.childBirthCertificateNumber ? 'border-destructive' : ''}
                />
                {errors.childBirthCertificateNumber && (
                  <p className="text-sm text-destructive">{errors.childBirthCertificateNumber.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="childBirthLocation">Birth Location *</Label>
              <Input
                id="childBirthLocation"
                {...register('childBirthLocation')}
                className={errors.childBirthLocation ? 'border-destructive' : ''}
              />
              {errors.childBirthLocation && (
                <p className="text-sm text-destructive">{errors.childBirthLocation.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Biological Parents Information */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Biological Parents Information</CardTitle>
            <CardDescription>Information about the child's biological parents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="font-medium">Biological Mother</h4>
                <div className="space-y-2">
                  <Label htmlFor="biologicalMotherFirstName">First Name</Label>
                  <Input id="biologicalMotherFirstName" {...register('biologicalMotherFirstName')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biologicalMotherLastName">Last Name</Label>
                  <Input id="biologicalMotherLastName" {...register('biologicalMotherLastName')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biologicalMotherIdNumber">ID Number</Label>
                  <Input id="biologicalMotherIdNumber" {...register('biologicalMotherIdNumber')} />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Biological Father</h4>
                <div className="space-y-2">
                  <Label htmlFor="biologicalFatherFirstName">First Name</Label>
                  <Input id="biologicalFatherFirstName" {...register('biologicalFatherFirstName')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biologicalFatherLastName">Last Name</Label>
                  <Input id="biologicalFatherLastName" {...register('biologicalFatherLastName')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biologicalFatherIdNumber">ID Number</Label>
                  <Input id="biologicalFatherIdNumber" {...register('biologicalFatherIdNumber')} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentalRightsTerminated">Parental Rights Terminated? *</Label>
              <Select onValueChange={(value) => setValue('parentalRightsTerminated', value as 'yes' | 'no')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {parentalRightsTerminated === 'yes' && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Termination Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !terminationDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {terminationDate ? format(terminationDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={terminationDate}
                          onSelect={(date) => setValue('terminationDate', date)}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="terminationReason">Termination Reason</Label>
                    <Input id="terminationReason" {...register('terminationReason')} />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Adoptive Parent 1 Information */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Primary Adoptive Parent Information</CardTitle>
            <CardDescription>Details about the primary adoptive parent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="adoptiveParent1FirstName">First Name *</Label>
                <Input
                  id="adoptiveParent1FirstName"
                  {...register('adoptiveParent1FirstName')}
                  className={errors.adoptiveParent1FirstName ? 'border-destructive' : ''}
                />
                {errors.adoptiveParent1FirstName && (
                  <p className="text-sm text-destructive">{errors.adoptiveParent1FirstName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adoptiveParent1MiddleName">Middle Name</Label>
                <Input id="adoptiveParent1MiddleName" {...register('adoptiveParent1MiddleName')} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adoptiveParent1LastName">Last Name *</Label>
                <Input
                  id="adoptiveParent1LastName"
                  {...register('adoptiveParent1LastName')}
                  className={errors.adoptiveParent1LastName ? 'border-destructive' : ''}
                />
                {errors.adoptiveParent1LastName && (
                  <p className="text-sm text-destructive">{errors.adoptiveParent1LastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="adoptiveParent1IdNumber">ID Number *</Label>
                <Input
                  id="adoptiveParent1IdNumber"
                  {...register('adoptiveParent1IdNumber')}
                  className={errors.adoptiveParent1IdNumber ? 'border-destructive' : ''}
                />
                {errors.adoptiveParent1IdNumber && (
                  <p className="text-sm text-destructive">{errors.adoptiveParent1IdNumber.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adoptiveParent1Age">Age *</Label>
                <Input
                  id="adoptiveParent1Age"
                  type="number"
                  {...register('adoptiveParent1Age')}
                  className={errors.adoptiveParent1Age ? 'border-destructive' : ''}
                />
                {errors.adoptiveParent1Age && (
                  <p className="text-sm text-destructive">{errors.adoptiveParent1Age.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="adoptiveParent1Occupation">Occupation</Label>
                <Input id="adoptiveParent1Occupation" {...register('adoptiveParent1Occupation')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adoptiveParent1Relationship">Relationship Status *</Label>
                <Select onValueChange={(value) => setValue('adoptiveParent1Relationship', value as any)}>
                  <SelectTrigger className={errors.adoptiveParent1Relationship ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
                {errors.adoptiveParent1Relationship && (
                  <p className="text-sm text-destructive">{errors.adoptiveParent1Relationship.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adoptiveParent1Address">Address *</Label>
              <Input
                id="adoptiveParent1Address"
                {...register('adoptiveParent1Address')}
                className={errors.adoptiveParent1Address ? 'border-destructive' : ''}
              />
              {errors.adoptiveParent1Address && (
                <p className="text-sm text-destructive">{errors.adoptiveParent1Address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hasSecondParent">Is there a second adoptive parent? *</Label>
              <Select onValueChange={(value) => setValue('hasSecondParent', value as 'yes' | 'no')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Second Adoptive Parent Information */}
        {hasSecondParent === 'yes' && (
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle>Second Adoptive Parent Information</CardTitle>
              <CardDescription>Details about the second adoptive parent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="adoptiveParent2FirstName">First Name</Label>
                  <Input id="adoptiveParent2FirstName" {...register('adoptiveParent2FirstName')} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adoptiveParent2MiddleName">Middle Name</Label>
                  <Input id="adoptiveParent2MiddleName" {...register('adoptiveParent2MiddleName')} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adoptiveParent2LastName">Last Name</Label>
                  <Input id="adoptiveParent2LastName" {...register('adoptiveParent2LastName')} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="adoptiveParent2IdNumber">ID Number</Label>
                  <Input id="adoptiveParent2IdNumber" {...register('adoptiveParent2IdNumber')} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adoptiveParent2Age">Age</Label>
                  <Input
                    id="adoptiveParent2Age"
                    type="number"
                    {...register('adoptiveParent2Age')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adoptiveParent2Occupation">Occupation</Label>
                  <Input id="adoptiveParent2Occupation" {...register('adoptiveParent2Occupation')} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adoptiveParent2Address">Address</Label>
                <Input id="adoptiveParent2Address" {...register('adoptiveParent2Address')} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Adoption Details */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Adoption Details</CardTitle>
            <CardDescription>Information about the adoption proceedings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Adoption Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !adoptionDate && "text-muted-foreground",
                        errors.adoptionDate && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {adoptionDate ? format(adoptionDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={adoptionDate}
                      onSelect={(date) => setValue('adoptionDate', date!)}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.adoptionDate && (
                  <p className="text-sm text-destructive">{errors.adoptionDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="adoptionType">Adoption Type *</Label>
                <Select onValueChange={(value) => setValue('adoptionType', value as any)}>
                  <SelectTrigger className={errors.adoptionType ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agency">Agency Adoption</SelectItem>
                    <SelectItem value="private">Private Adoption</SelectItem>
                    <SelectItem value="stepparent">Stepparent Adoption</SelectItem>
                    <SelectItem value="relative">Relative Adoption</SelectItem>
                    <SelectItem value="international">International Adoption</SelectItem>
                  </SelectContent>
                </Select>
                {errors.adoptionType && (
                  <p className="text-sm text-destructive">{errors.adoptionType.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="courtName">Court Name *</Label>
                <Input
                  id="courtName"
                  {...register('courtName')}
                  className={errors.courtName ? 'border-destructive' : ''}
                />
                {errors.courtName && (
                  <p className="text-sm text-destructive">{errors.courtName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="caseNumber">Case Number *</Label>
                <Input
                  id="caseNumber"
                  {...register('caseNumber')}
                  className={errors.caseNumber ? 'border-destructive' : ''}
                />
                {errors.caseNumber && (
                  <p className="text-sm text-destructive">{errors.caseNumber.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="judgeName">Judge Name *</Label>
                <Input
                  id="judgeName"
                  {...register('judgeName')}
                  className={errors.judgeName ? 'border-destructive' : ''}
                />
                {errors.judgeName && (
                  <p className="text-sm text-destructive">{errors.judgeName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="attorneyName">Attorney Name</Label>
                <Input id="attorneyName" {...register('attorneyName')} />
              </div>
            </div>

            {(adoptionType === 'agency' || adoptionType === 'international') && (
              <div className="space-y-2">
                <Label htmlFor="agencyName">Agency Name</Label>
                <Input id="agencyName" {...register('agencyName')} />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="homeStudyCompleted">Home Study Completed? *</Label>
              <Select onValueChange={(value) => setValue('homeStudyCompleted', value as 'yes' | 'no')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {homeStudyCompleted === 'yes' && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Home Study Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !homeStudyDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {homeStudyDate ? format(homeStudyDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={homeStudyDate}
                        onSelect={(date) => setValue('homeStudyDate', date)}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="homeStudyAgency">Home Study Agency</Label>
                  <Input id="homeStudyAgency" {...register('homeStudyAgency')} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Optional information and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Child's New Legal Name (if changing)</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="childNewFirstName">New First Name</Label>
                  <Input id="childNewFirstName" {...register('childNewFirstName')} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="childNewMiddleName">New Middle Name</Label>
                  <Input id="childNewMiddleName" {...register('childNewMiddleName')} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="childNewLastName">New Last Name</Label>
                  <Input id="childNewLastName" {...register('childNewLastName')} />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sealedRecords">Sealed Records? *</Label>
                <Select onValueChange={(value) => setValue('sealedRecords', value as 'yes' | 'no')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactAgreement">Contact Agreement? *</Label>
                <Select onValueChange={(value) => setValue('contactAgreement', value as 'yes' | 'no')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialNeeds">Child has Special Needs? *</Label>
              <Select onValueChange={(value) => setValue('specialNeeds', value as 'yes' | 'no')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {specialNeeds === 'yes' && (
              <div className="space-y-2">
                <Label htmlFor="specialNeedsDescription">Special Needs Description</Label>
                <Textarea
                  id="specialNeedsDescription"
                  {...register('specialNeedsDescription')}
                  placeholder="Describe the child's special needs"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                {...register('additionalNotes')}
                placeholder="Any additional information"
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
            {isSubmitting ? 'Registering...' : 'Register Adoption'}
          </Button>
        </div>
      </form>
    </div>
  );
}
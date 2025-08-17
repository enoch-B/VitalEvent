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
import { CalendarIcon, FileX, Upload, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const divorceSchema = z.object({
  // Petitioner Information
  petitionerFirstName: z.string().min(1, 'Petitioner first name is required'),
  petitionerMiddleName: z.string().optional(),
  petitionerLastName: z.string().min(1, 'Petitioner last name is required'),
  petitionerIdNumber: z.string().min(1, 'Petitioner ID number is required'),
  petitionerAge: z.string().min(1, 'Petitioner age is required'),
  petitionerAddress: z.string().min(1, 'Petitioner address is required'),
  petitionerOccupation: z.string().optional(),
  
  // Respondent Information
  respondentFirstName: z.string().min(1, 'Respondent first name is required'),
  respondentMiddleName: z.string().optional(),
  respondentLastName: z.string().min(1, 'Respondent last name is required'),
  respondentIdNumber: z.string().min(1, 'Respondent ID number is required'),
  respondentAge: z.string().min(1, 'Respondent age is required'),
  respondentAddress: z.string().min(1, 'Respondent address is required'),
  respondentOccupation: z.string().optional(),
  
  // Marriage & Divorce Details
  marriageDate: z.date({ required_error: 'Marriage date is required' }),
  marriageLocation: z.string().min(1, 'Marriage location is required'),
  marriageCertificateNumber: z.string().min(1, 'Marriage certificate number is required'),
  divorceDate: z.date({ required_error: 'Divorce date is required' }),
  courtName: z.string().min(1, 'Court name is required'),
  caseNumber: z.string().min(1, 'Case number is required'),
  divorceReason: z.enum(['irreconcilable_differences', 'adultery', 'abandonment', 'abuse', 'other']),
  otherReason: z.string().optional(),
  
  // Children Information
  hasChildren: z.enum(['yes', 'no']),
  numberOfChildren: z.string().optional(),
  childrenNames: z.string().optional(),
  custodyArrangement: z.string().optional(),
  
  // Legal Details
  judgeName: z.string().min(1, 'Judge name is required'),
  attorneyName: z.string().optional(),
  alimonyDetails: z.string().optional(),
  propertyDivision: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type DivorceFormData = z.infer<typeof divorceSchema>;

export default function DivorceRegistration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DivorceFormData>({
    resolver: zodResolver(divorceSchema),
  });

  const marriageDate = watch('marriageDate');
  const divorceDate = watch('divorceDate');
  const hasChildren = watch('hasChildren');
  const divorceReason = watch('divorceReason');

  const onSubmit = async (data: DivorceFormData) => {
    setIsSubmitting(true);
    
    const registrationNumber = `DR${Date.now().toString().slice(-8)}`;
    
    // Simulate real-time update
    const newRecord = {
      id: registrationNumber,
      type: 'divorce',
      registrationNumber,
      fullName: `${data.petitionerFirstName} ${data.petitionerLastName} vs ${data.respondentFirstName} ${data.respondentLastName}`,
      date: data.divorceDate.toISOString().split('T')[0],
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
      title: "Divorce registered successfully!",
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
        <div className="w-10 h-10 event-divorce rounded-lg flex items-center justify-center">
          <FileX className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gradient">Divorce Registration</h1>
          <p className="text-muted-foreground">Register a divorce decree and generate certificate</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Petitioner Information */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Petitioner Information</CardTitle>
            <CardDescription>Details about the person filing for divorce</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="petitionerFirstName">First Name *</Label>
                <Input
                  id="petitionerFirstName"
                  {...register('petitionerFirstName')}
                  className={errors.petitionerFirstName ? 'border-destructive' : ''}
                />
                {errors.petitionerFirstName && (
                  <p className="text-sm text-destructive">{errors.petitionerFirstName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="petitionerMiddleName">Middle Name</Label>
                <Input id="petitionerMiddleName" {...register('petitionerMiddleName')} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="petitionerLastName">Last Name *</Label>
                <Input
                  id="petitionerLastName"
                  {...register('petitionerLastName')}
                  className={errors.petitionerLastName ? 'border-destructive' : ''}
                />
                {errors.petitionerLastName && (
                  <p className="text-sm text-destructive">{errors.petitionerLastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="petitionerIdNumber">ID Number *</Label>
                <Input
                  id="petitionerIdNumber"
                  {...register('petitionerIdNumber')}
                  className={errors.petitionerIdNumber ? 'border-destructive' : ''}
                />
                {errors.petitionerIdNumber && (
                  <p className="text-sm text-destructive">{errors.petitionerIdNumber.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="petitionerAge">Age *</Label>
                <Input
                  id="petitionerAge"
                  type="number"
                  {...register('petitionerAge')}
                  className={errors.petitionerAge ? 'border-destructive' : ''}
                />
                {errors.petitionerAge && (
                  <p className="text-sm text-destructive">{errors.petitionerAge.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="petitionerAddress">Address *</Label>
                <Input
                  id="petitionerAddress"
                  {...register('petitionerAddress')}
                  className={errors.petitionerAddress ? 'border-destructive' : ''}
                />
                {errors.petitionerAddress && (
                  <p className="text-sm text-destructive">{errors.petitionerAddress.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="petitionerOccupation">Occupation</Label>
                <Input id="petitionerOccupation" {...register('petitionerOccupation')} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Respondent Information */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Respondent Information</CardTitle>
            <CardDescription>Details about the other spouse</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="respondentFirstName">First Name *</Label>
                <Input
                  id="respondentFirstName"
                  {...register('respondentFirstName')}
                  className={errors.respondentFirstName ? 'border-destructive' : ''}
                />
                {errors.respondentFirstName && (
                  <p className="text-sm text-destructive">{errors.respondentFirstName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="respondentMiddleName">Middle Name</Label>
                <Input id="respondentMiddleName" {...register('respondentMiddleName')} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="respondentLastName">Last Name *</Label>
                <Input
                  id="respondentLastName"
                  {...register('respondentLastName')}
                  className={errors.respondentLastName ? 'border-destructive' : ''}
                />
                {errors.respondentLastName && (
                  <p className="text-sm text-destructive">{errors.respondentLastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="respondentIdNumber">ID Number *</Label>
                <Input
                  id="respondentIdNumber"
                  {...register('respondentIdNumber')}
                  className={errors.respondentIdNumber ? 'border-destructive' : ''}
                />
                {errors.respondentIdNumber && (
                  <p className="text-sm text-destructive">{errors.respondentIdNumber.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="respondentAge">Age *</Label>
                <Input
                  id="respondentAge"
                  type="number"
                  {...register('respondentAge')}
                  className={errors.respondentAge ? 'border-destructive' : ''}
                />
                {errors.respondentAge && (
                  <p className="text-sm text-destructive">{errors.respondentAge.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="respondentAddress">Address *</Label>
                <Input
                  id="respondentAddress"
                  {...register('respondentAddress')}
                  className={errors.respondentAddress ? 'border-destructive' : ''}
                />
                {errors.respondentAddress && (
                  <p className="text-sm text-destructive">{errors.respondentAddress.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="respondentOccupation">Occupation</Label>
                <Input id="respondentOccupation" {...register('respondentOccupation')} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Marriage & Divorce Details */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Marriage & Divorce Details</CardTitle>
            <CardDescription>Information about the marriage and divorce proceedings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Marriage Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !marriageDate && "text-muted-foreground",
                        errors.marriageDate && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {marriageDate ? format(marriageDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={marriageDate}
                      onSelect={(date) => setValue('marriageDate', date!)}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.marriageDate && (
                  <p className="text-sm text-destructive">{errors.marriageDate.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Divorce Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !divorceDate && "text-muted-foreground",
                        errors.divorceDate && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {divorceDate ? format(divorceDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={divorceDate}
                      onSelect={(date) => setValue('divorceDate', date!)}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.divorceDate && (
                  <p className="text-sm text-destructive">{errors.divorceDate.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="marriageLocation">Marriage Location *</Label>
                <Input
                  id="marriageLocation"
                  {...register('marriageLocation')}
                  className={errors.marriageLocation ? 'border-destructive' : ''}
                />
                {errors.marriageLocation && (
                  <p className="text-sm text-destructive">{errors.marriageLocation.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="marriageCertificateNumber">Marriage Certificate Number *</Label>
                <Input
                  id="marriageCertificateNumber"
                  {...register('marriageCertificateNumber')}
                  className={errors.marriageCertificateNumber ? 'border-destructive' : ''}
                />
                {errors.marriageCertificateNumber && (
                  <p className="text-sm text-destructive">{errors.marriageCertificateNumber.message}</p>
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
                <Label htmlFor="divorceReason">Reason for Divorce *</Label>
                <Select onValueChange={(value) => setValue('divorceReason', value as any)}>
                  <SelectTrigger className={errors.divorceReason ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="irreconcilable_differences">Irreconcilable Differences</SelectItem>
                    <SelectItem value="adultery">Adultery</SelectItem>
                    <SelectItem value="abandonment">Abandonment</SelectItem>
                    <SelectItem value="abuse">Abuse</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.divorceReason && (
                  <p className="text-sm text-destructive">{errors.divorceReason.message}</p>
                )}
              </div>

              {divorceReason === 'other' && (
                <div className="space-y-2">
                  <Label htmlFor="otherReason">Specify Other Reason</Label>
                  <Input id="otherReason" {...register('otherReason')} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Children Information */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Children Information</CardTitle>
            <CardDescription>Details about children from the marriage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hasChildren">Are there children from this marriage? *</Label>
              <Select onValueChange={(value) => setValue('hasChildren', value as 'yes' | 'no')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasChildren === 'yes' && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="numberOfChildren">Number of Children</Label>
                    <Input
                      id="numberOfChildren"
                      type="number"
                      {...register('numberOfChildren')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="childrenNames">Children Names</Label>
                    <Input
                      id="childrenNames"
                      {...register('childrenNames')}
                      placeholder="Full names separated by commas"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custodyArrangement">Custody Arrangement</Label>
                  <Textarea
                    id="custodyArrangement"
                    {...register('custodyArrangement')}
                    placeholder="Describe custody arrangement"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Legal Details */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Legal Details</CardTitle>
            <CardDescription>Additional legal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div className="space-y-2">
              <Label htmlFor="alimonyDetails">Alimony Details</Label>
              <Textarea
                id="alimonyDetails"
                {...register('alimonyDetails')}
                placeholder="Details about alimony arrangements"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyDivision">Property Division</Label>
              <Textarea
                id="propertyDivision"
                {...register('propertyDivision')}
                placeholder="Details about property division"
              />
            </div>

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
            {isSubmitting ? 'Registering...' : 'Register Divorce'}
          </Button>
        </div>
      </form>
    </div>
  );
}
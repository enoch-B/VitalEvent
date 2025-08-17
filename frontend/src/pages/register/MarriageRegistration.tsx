import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Heart, Upload, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const marriageSchema = z.object({
  // Groom Information
  groomFirstName: z.string().min(1, 'Groom first name is required'),
  groomMiddleName: z.string().optional(),
  groomLastName: z.string().min(1, 'Groom last name is required'),
  groomIdNumber: z.string().min(1, 'Groom ID number is required'),
  groomAge: z.string().min(1, 'Groom age is required'),
  groomNationality: z.string().min(1, 'Groom nationality is required'),
  groomOccupation: z.string().optional(),
  groomAddress: z.string().min(1, 'Groom address is required'),
  
  // Bride Information
  brideFirstName: z.string().min(1, 'Bride first name is required'),
  brideMiddleName: z.string().optional(),
  brideLastName: z.string().min(1, 'Bride last name is required'),
  brideIdNumber: z.string().min(1, 'Bride ID number is required'),
  brideAge: z.string().min(1, 'Bride age is required'),
  brideNationality: z.string().min(1, 'Bride nationality is required'),
  brideOccupation: z.string().optional(),
  brideAddress: z.string().min(1, 'Bride address is required'),
  
  // Marriage Details
  marriageDate: z.date({ required_error: 'Marriage date is required' }),
  marriageLocation: z.string().min(1, 'Marriage location is required'),
  officiant: z.string().min(1, 'Officiant name is required'),
  witness1Name: z.string().min(1, 'First witness name is required'),
  witness1Id: z.string().min(1, 'First witness ID is required'),
  witness2Name: z.string().min(1, 'Second witness name is required'),
  witness2Id: z.string().min(1, 'Second witness ID is required'),
});

type MarriageFormData = z.infer<typeof marriageSchema>;

export default function MarriageRegistration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MarriageFormData>({
    resolver: zodResolver(marriageSchema),
  });

  const marriageDate = watch('marriageDate');

  const onSubmit = async (data: MarriageFormData) => {
    setIsSubmitting(true);
    
    const registrationNumber = `MR${Date.now().toString().slice(-8)}`;
    
    // Simulate real-time update
    const newRecord = {
      id: registrationNumber,
      type: 'marriage',
      registrationNumber,
      fullName: `${data.groomFirstName} ${data.groomLastName} & ${data.brideFirstName} ${data.brideLastName}`,
      date: data.marriageDate.toISOString().split('T')[0],
      status: 'completed',
      registeredBy: 'Current User',
      location: data.marriageLocation
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
      title: "Marriage registered successfully!",
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
        <div className="w-10 h-10 event-marriage rounded-lg flex items-center justify-center">
          <Heart className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gradient">Marriage Registration</h1>
          <p className="text-muted-foreground">Register a marriage and generate certificate</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Groom Information */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Groom Information</CardTitle>
            <CardDescription>Details about the groom</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="groomFirstName">First Name *</Label>
                <Input
                  id="groomFirstName"
                  {...register('groomFirstName')}
                  className={errors.groomFirstName ? 'border-destructive' : ''}
                />
                {errors.groomFirstName && (
                  <p className="text-sm text-destructive">{errors.groomFirstName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="groomMiddleName">Middle Name</Label>
                <Input id="groomMiddleName" {...register('groomMiddleName')} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="groomLastName">Last Name *</Label>
                <Input
                  id="groomLastName"
                  {...register('groomLastName')}
                  className={errors.groomLastName ? 'border-destructive' : ''}
                />
                {errors.groomLastName && (
                  <p className="text-sm text-destructive">{errors.groomLastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="groomIdNumber">ID Number *</Label>
                <Input
                  id="groomIdNumber"
                  {...register('groomIdNumber')}
                  className={errors.groomIdNumber ? 'border-destructive' : ''}
                />
                {errors.groomIdNumber && (
                  <p className="text-sm text-destructive">{errors.groomIdNumber.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="groomAge">Age *</Label>
                <Input
                  id="groomAge"
                  type="number"
                  {...register('groomAge')}
                  className={errors.groomAge ? 'border-destructive' : ''}
                />
                {errors.groomAge && (
                  <p className="text-sm text-destructive">{errors.groomAge.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="groomNationality">Nationality *</Label>
                <Input
                  id="groomNationality"
                  {...register('groomNationality')}
                  className={errors.groomNationality ? 'border-destructive' : ''}
                />
                {errors.groomNationality && (
                  <p className="text-sm text-destructive">{errors.groomNationality.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="groomOccupation">Occupation</Label>
                <Input id="groomOccupation" {...register('groomOccupation')} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="groomAddress">Address *</Label>
              <Input
                id="groomAddress"
                {...register('groomAddress')}
                className={errors.groomAddress ? 'border-destructive' : ''}
              />
              {errors.groomAddress && (
                <p className="text-sm text-destructive">{errors.groomAddress.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bride Information */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Bride Information</CardTitle>
            <CardDescription>Details about the bride</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="brideFirstName">First Name *</Label>
                <Input
                  id="brideFirstName"
                  {...register('brideFirstName')}
                  className={errors.brideFirstName ? 'border-destructive' : ''}
                />
                {errors.brideFirstName && (
                  <p className="text-sm text-destructive">{errors.brideFirstName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brideMiddleName">Middle Name</Label>
                <Input id="brideMiddleName" {...register('brideMiddleName')} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brideLastName">Last Name *</Label>
                <Input
                  id="brideLastName"
                  {...register('brideLastName')}
                  className={errors.brideLastName ? 'border-destructive' : ''}
                />
                {errors.brideLastName && (
                  <p className="text-sm text-destructive">{errors.brideLastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="brideIdNumber">ID Number *</Label>
                <Input
                  id="brideIdNumber"
                  {...register('brideIdNumber')}
                  className={errors.brideIdNumber ? 'border-destructive' : ''}
                />
                {errors.brideIdNumber && (
                  <p className="text-sm text-destructive">{errors.brideIdNumber.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brideAge">Age *</Label>
                <Input
                  id="brideAge"
                  type="number"
                  {...register('brideAge')}
                  className={errors.brideAge ? 'border-destructive' : ''}
                />
                {errors.brideAge && (
                  <p className="text-sm text-destructive">{errors.brideAge.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="brideNationality">Nationality *</Label>
                <Input
                  id="brideNationality"
                  {...register('brideNationality')}
                  className={errors.brideNationality ? 'border-destructive' : ''}
                />
                {errors.brideNationality && (
                  <p className="text-sm text-destructive">{errors.brideNationality.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brideOccupation">Occupation</Label>
                <Input id="brideOccupation" {...register('brideOccupation')} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brideAddress">Address *</Label>
              <Input
                id="brideAddress"
                {...register('brideAddress')}
                className={errors.brideAddress ? 'border-destructive' : ''}
              />
              {errors.brideAddress && (
                <p className="text-sm text-destructive">{errors.brideAddress.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Marriage Details */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Marriage Details</CardTitle>
            <CardDescription>Information about the marriage ceremony</CardDescription>
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
                <Label htmlFor="marriageLocation">Marriage Location *</Label>
                <Input
                  id="marriageLocation"
                  {...register('marriageLocation')}
                  placeholder="Church, courthouse, venue name"
                  className={errors.marriageLocation ? 'border-destructive' : ''}
                />
                {errors.marriageLocation && (
                  <p className="text-sm text-destructive">{errors.marriageLocation.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="officiant">Officiant *</Label>
              <Input
                id="officiant"
                {...register('officiant')}
                placeholder="Name of person who performed the ceremony"
                className={errors.officiant ? 'border-destructive' : ''}
              />
              {errors.officiant && (
                <p className="text-sm text-destructive">{errors.officiant.message}</p>
              )}
            </div>

            {/* Witnesses */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="font-medium">First Witness</h4>
                <div className="space-y-2">
                  <Label htmlFor="witness1Name">Full Name *</Label>
                  <Input
                    id="witness1Name"
                    {...register('witness1Name')}
                    className={errors.witness1Name ? 'border-destructive' : ''}
                  />
                  {errors.witness1Name && (
                    <p className="text-sm text-destructive">{errors.witness1Name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="witness1Id">ID Number *</Label>
                  <Input
                    id="witness1Id"
                    {...register('witness1Id')}
                    className={errors.witness1Id ? 'border-destructive' : ''}
                  />
                  {errors.witness1Id && (
                    <p className="text-sm text-destructive">{errors.witness1Id.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Second Witness</h4>
                <div className="space-y-2">
                  <Label htmlFor="witness2Name">Full Name *</Label>
                  <Input
                    id="witness2Name"
                    {...register('witness2Name')}
                    className={errors.witness2Name ? 'border-destructive' : ''}
                  />
                  {errors.witness2Name && (
                    <p className="text-sm text-destructive">{errors.witness2Name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="witness2Id">ID Number *</Label>
                  <Input
                    id="witness2Id"
                    {...register('witness2Id')}
                    className={errors.witness2Id ? 'border-destructive' : ''}
                  />
                  {errors.witness2Id && (
                    <p className="text-sm text-destructive">{errors.witness2Id.message}</p>
                  )}
                </div>
              </div>
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
                      Upload ID copies, photos, or other supporting documents
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
            className="bg-gradient-to-r from-marriage to-purple-600 hover:shadow-glow transition-all duration-300"
          >
            {isSubmitting ? 'Registering...' : 'Register Marriage'}
          </Button>
        </div>
      </form>
    </div>
  );
}
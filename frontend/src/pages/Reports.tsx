
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { 
  BarChart3, 
  Download, 
  FileText, 
  Calendar,
  Filter,
  TrendingUp,
  Users,
  MapPin
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { DateRange } from 'react-day-picker';

// Mock report data
const monthlyReportData = [
  { month: 'Jan', births: 120, deaths: 45, marriages: 80, divorces: 15, adoptions: 5 },
  { month: 'Feb', births: 135, deaths: 52, marriages: 95, divorces: 18, adoptions: 7 },
  { month: 'Mar', births: 148, deaths: 41, marriages: 110, divorces: 22, adoptions: 6 },
  { month: 'Apr', births: 162, deaths: 38, marriages: 125, divorces: 19, adoptions: 8 },
  { month: 'May', births: 175, deaths: 43, marriages: 140, divorces: 25, adoptions: 9 },
  { month: 'Jun', births: 188, deaths: 39, marriages: 165, divorces: 21, adoptions: 12 }
];

const regionData = [
  { name: 'Manhattan', value: 450, color: '#8884d8' },
  { name: 'Brooklyn', value: 380, color: '#82ca9d' },
  { name: 'Queens', value: 320, color: '#ffc658' },
  { name: 'Bronx', value: 280, color: '#ff7300' },
  { name: 'Staten Island', value: 150, color: '#0088fe' }
];

export default function Reports() {
  const [reportType, setReportType] = useState('overview');
  const [eventType, setEventType] = useState('all');
  const [region, setRegion] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const generateReport = () => {
    console.log('Generating report with filters:', {
      reportType,
      eventType,
      region,
      dateRange
    });
    // Here you would make an API call to generate the report
  };

  const exportReport = (format: string) => {
    console.log(`Exporting report as ${format}`);
    // Here you would trigger the export functionality
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gradient">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Generate comprehensive reports and analyze vital event data
        </p>
      </div>

      {/* Report Filters */}
      <Card className="card-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Report Configuration</span>
          </CardTitle>
          <CardDescription>Configure your report parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview Report</SelectItem>
                  <SelectItem value="demographic">Demographic Analysis</SelectItem>
                  <SelectItem value="trend">Trend Analysis</SelectItem>
                  <SelectItem value="regional">Regional Comparison</SelectItem>
                  <SelectItem value="institutional">Institutional Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type</Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="manhattan">Manhattan</SelectItem>
                  <SelectItem value="brooklyn">Brooklyn</SelectItem>
                  <SelectItem value="queens">Queens</SelectItem>
                  <SelectItem value="bronx">Bronx</SelectItem>
                  <SelectItem value="staten-island">Staten Island</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={generateReport} className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow">
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => exportReport('pdf')}>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={() => exportReport('excel')}>
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
              <Button variant="outline" onClick={() => exportReport('csv')}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">1,228</p>
                <p className="text-sm text-muted-foreground">Total Events</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-green-600">+12% from last period</p>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">728</p>
                <p className="text-sm text-muted-foreground">Births</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-green-600">+8% increase</p>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">198</p>
                <p className="text-sm text-muted-foreground">Deaths</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-red-600">-3% decrease</p>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">265</p>
                <p className="text-sm text-muted-foreground">Marriages</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-green-600">+15% increase</p>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">37</p>
                <p className="text-sm text-muted-foreground">Other Events</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-blue-600">Stable</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Trends */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Monthly Event Trends</CardTitle>
            <CardDescription>Event registrations over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyReportData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="births" fill="#10b981" name="Births" />
                <Bar dataKey="deaths" fill="#ef4444" name="Deaths" />
                <Bar dataKey="marriages" fill="#8b5cf6" name="Marriages" />
                <Bar dataKey="divorces" fill="#f59e0b" name="Divorces" />
                <Bar dataKey="adoptions" fill="#3b82f6" name="Adoptions" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Regional Distribution */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
            <CardDescription>Events distribution across regions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Trend Analysis */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle>Trend Analysis</CardTitle>
          <CardDescription>Long-term trends and patterns in vital events</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyReportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="births" stroke="#10b981" strokeWidth={2} name="Births" />
              <Line type="monotone" dataKey="deaths" stroke="#ef4444" strokeWidth={2} name="Deaths" />
              <Line type="monotone" dataKey="marriages" stroke="#8b5cf6" strokeWidth={2} name="Marriages" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

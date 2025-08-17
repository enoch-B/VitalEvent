import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { 
  TrendingUp, 
  Calendar as CalendarIcon, 
  Download, 
  RefreshCw,
  BarChart3,
  Activity,
  Target,
  Zap
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';

// Mock prediction data
const birthPredictions = [
  { month: 'Mar 2024', actual: 148, predicted: 152, confidence: 0.89 },
  { month: 'Apr 2024', actual: 162, predicted: 165, confidence: 0.92 },
  { month: 'May 2024', actual: 175, predicted: 171, confidence: 0.85 },
  { month: 'Jun 2024', actual: null, predicted: 189, confidence: 0.87 },
  { month: 'Jul 2024', actual: null, predicted: 195, confidence: 0.84 },
  { month: 'Aug 2024', actual: null, predicted: 203, confidence: 0.81 },
];

const demographicTrends = [
  { category: 'Urban Birth Rate', current: 12.5, predicted: 13.2, change: '+5.6%' },
  { category: 'Rural Birth Rate', current: 15.8, predicted: 15.1, change: '-4.4%' },
  { category: 'Marriage Rate', current: 8.2, predicted: 8.9, change: '+8.5%' },
  { category: 'Divorce Rate', current: 2.1, predicted: 2.3, change: '+9.5%' },
];

const regionalData = [
  { region: 'Metropolitan', births: 45, deaths: 12, marriages: 32, population: 2800000 },
  { region: 'Suburban', births: 38, deaths: 8, marriages: 28, population: 1500000 },
  { region: 'Rural', births: 22, deaths: 15, marriages: 18, population: 800000 },
  { region: 'Coastal', births: 31, deaths: 9, marriages: 24, population: 1200000 },
];

const ageDistribution = [
  { age: '0-18', births: 0, deaths: 2, color: '#10b981' },
  { age: '19-35', births: 128, deaths: 5, color: '#3b82f6' },
  { age: '36-50', births: 47, deaths: 8, color: '#8b5cf6' },
  { age: '51-65', births: 0, deaths: 18, color: '#f59e0b' },
  { age: '65+', births: 0, deaths: 25, color: '#ef4444' },
];

export default function Analytics() {
  const [selectedEventType, setSelectedEventType] = useState('births');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePrediction = async () => {
    setIsGenerating(true);
    // Simulate AI prediction generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gradient">AI Predictive Analytics</h1>
        <p className="text-muted-foreground">
          AI-driven insights and predictions for demographic trends and vital events
        </p>
      </div>

      {/* Controls */}
      <Card className="card-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Prediction Parameters</span>
          </CardTitle>
          <CardDescription>Configure parameters for AI analysis and predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {/* Event Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Type</label>
              <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="births">Births</SelectItem>
                  <SelectItem value="deaths">Deaths</SelectItem>
                  <SelectItem value="marriages">Marriages</SelectItem>
                  <SelectItem value="divorces">Divorces</SelectItem>
                  <SelectItem value="all">All Events</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Region */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Region</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="metropolitan">Metropolitan</SelectItem>
                  <SelectItem value="suburban">Suburban</SelectItem>
                  <SelectItem value="rural">Rural</SelectItem>
                  <SelectItem value="coastal">Coastal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button 
              onClick={generatePrediction}
              disabled={isGenerating}
              className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Prediction
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Confidence Score */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.7%</div>
            <p className="text-xs text-muted-foreground">Based on last 1000 predictions</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confidence Level</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Current prediction confidence</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Points</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.2K</div>
            <p className="text-xs text-muted-foreground">Records analyzed</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h ago</div>
            <p className="text-xs text-muted-foreground">Model refresh frequency</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Prediction vs Actual */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Birth Predictions vs Actual</span>
            </CardTitle>
            <CardDescription>
              AI predictions compared to actual registrations
              <Badge variant="secondary" className="ml-2 bg-success text-success-foreground">
                89% Accuracy
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={birthPredictions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Actual"
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Predicted"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Regional Analysis */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Regional Event Distribution</CardTitle>
            <CardDescription>Event patterns across different regions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="births" fill="#10b981" name="Births" />
                <Bar dataKey="deaths" fill="#ef4444" name="Deaths" />
                <Bar dataKey="marriages" fill="#8b5cf6" name="Marriages" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Demographic Trends */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle>Demographic Trend Predictions</CardTitle>
          <CardDescription>
            AI-predicted changes in demographic patterns over the next 12 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {demographicTrends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{trend.category}</p>
                  <p className="text-sm text-muted-foreground">
                    Current: {trend.current}% → Predicted: {trend.predicted}%
                  </p>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="secondary" 
                    className={trend.change.startsWith('+') ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'}
                  >
                    {trend.change}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Age Distribution Analysis */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle>Age Distribution Analysis</CardTitle>
          <CardDescription>
            Birth and death patterns by age groups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h4 className="font-medium mb-4">Age Distribution (Births)</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={ageDistribution.filter(item => item.births > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ age, births }) => `${age}: ${births}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="births"
                  >
                    {ageDistribution.filter(item => item.births > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Age Distribution (Deaths)</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ageDistribution} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="age" type="category" />
                  <Tooltip />
                  <Bar dataKey="deaths" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
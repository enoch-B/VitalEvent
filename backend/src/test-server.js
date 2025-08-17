import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// CORS configuration - must come before other middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'VEIMS Backend is running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'VEIMS Backend Server',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/v1/auth'
    }
  });
});

// Simple auth test endpoint with original credentials
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Test users with original credentials from seed file
  const testUsers = [
    {
      email: 'admin@veims.gov.et',
      password: 'Password123!',
      user: {
        id: '1',
        name: 'Admin User',
        email: 'admin@veims.gov.et',
        role: 'admin',
        permissions: ['manage_users', 'system_config', 'view_all_records']
      }
    },
    {
      email: 'john.doe@veims.gov.et',
      password: 'Password123!',
      user: {
        id: '2',
        name: 'John Doe',
        email: 'john.doe@veims.gov.et',
        role: 'registrar',
        permissions: ['create_records', 'update_records', 'view_records']
      }
    },
    {
      email: 'sarah.johnson@tash.gov.et',
      password: 'Password123!',
      user: {
        id: '3',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@tash.gov.et',
        role: 'health_institution',
        permissions: ['register_births', 'register_deaths']
      }
    },
    {
      email: 'michael.chen@fsc.gov.et',
      password: 'Password123!',
      user: {
        id: '4',
        name: 'Judge Michael Chen',
        email: 'michael.chen@fsc.gov.et',
        role: 'court',
        permissions: ['register_divorces', 'register_adoptions']
      }
    },
    {
      email: 'abebe.kebede@eotc.org.et',
      password: 'Password123!',
      user: {
        id: '5',
        name: 'Father Abebe Kebede',
        email: 'abebe.kebede@eotc.org.et',
        role: 'religious_institution',
        permissions: ['register_marriages']
      }
    },
    {
      email: 'manager@veims.gov.et',
      password: 'Password123!',
      user: {
        id: '6',
        name: 'Office Manager',
        email: 'manager@veims.gov.et',
        role: 'office_manager',
        permissions: ['generate_reports', 'view_analytics']
      }
    }
  ];
  
  // Find matching user
  const foundUser = testUsers.find(u => u.email === email && u.password === password);
  
  if (foundUser) {
    res.json({
      success: true,
      message: 'Login successful',
      user: foundUser.user,
      token: `test_jwt_token_${foundUser.user.id}`
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Root: http://localhost:${PORT}/`);
  console.log(`🔐 Test login: POST http://localhost:${PORT}/api/v1/auth/login`);
  console.log(`🌐 CORS enabled for: http://localhost:3000, http://localhost:8080`);
  console.log(`👥 Available test accounts with password: Password123!`);
});

export default app;

# VEIMS Backend

A comprehensive backend system for the Vital Events Information Management System (VEIMS) with AI-powered features, secure authentication, and robust data management.

## 🚀 Features

### Core Features
- **User Management**: Role-based access control with multiple user types
- **Institution Management**: Support for various institution types
- **Record Management**: Comprehensive vital events record handling
- **Document Management**: File upload, storage, and processing
- **Audit Logging**: Complete system activity tracking

### AI-Powered Features
- **OCR Processing**: Text extraction from images and documents
- **Document Analysis**: AI-powered document content analysis
- **Fraud Detection**: Intelligent fraud detection and anomaly detection
- **Automatic Classification**: Smart categorization of records and documents
- **Data Validation**: AI-assisted data quality checks

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Granular permission management
- **Rate Limiting**: Protection against abuse and attacks
- **Input Validation**: Comprehensive request validation
- **Audit Trail**: Complete activity logging

## 🛠️ Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: SQLite with Knex.js query builder
- **Authentication**: JWT + bcrypt
- **AI Services**: OpenAI GPT-4, Tesseract.js OCR
- **File Processing**: Multer, Sharp
- **Validation**: Express-validator, Joi
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate limiting

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- OpenAI API key (for AI features)
- Sufficient disk space for file uploads

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd veims/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   
   # Database Configuration
   DB_NAME=veims.db
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   
   # AI Configuration
   OPENAI_API_KEY=your-openai-api-key
   ENABLE_AI_FEATURES=true
   ENABLE_OCR_PROCESSING=true
   ENABLE_DOCUMENT_ANALYSIS=true
   ENABLE_FRAUD_DETECTION=true
   
   # File Upload Configuration
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   ```

4. **Create required directories**
   ```bash
   mkdir -p uploads logs
   ```

5. **Initialize database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

6. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📊 Database Schema

### Core Tables
- **users**: User accounts and authentication
- **institutions**: Institution information and types
- **records**: Vital events records
- **documents**: File uploads and metadata
- **ai_analyses**: AI processing results
- **audit_logs**: System activity tracking

### Key Relationships
- Users belong to institutions
- Records are created by users and associated with institutions
- Documents are linked to records
- AI analyses are performed on records and documents
- All activities are logged in audit_logs

## 🔐 Authentication

### User Roles
- **admin**: Full system access
- **registrar**: Record creation and management
- **office_manager**: Administrative and reporting access
- **health_institution**: Health-related record access
- **court**: Legal record access
- **religious_institution**: Religious ceremony record access

### JWT Tokens
- Access tokens: 7 days validity
- Refresh tokens: 30 days validity
- Automatic token refresh endpoint

## 🤖 AI Services

### OpenAI Integration
- Document analysis and classification
- Fraud detection and anomaly detection
- Data validation and quality checks
- Natural language processing

### OCR Processing
- Text extraction from images
- Multi-language support (English, Amharic)
- Region-based text extraction
- Form data extraction

### AI Analysis Pipeline
1. Document upload and preprocessing
2. OCR text extraction (if applicable)
3. AI-powered content analysis
4. Fraud detection and validation
5. Result storage and retrieval

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Token refresh
- `POST /api/v1/auth/logout` - User logout

### AI Services
- `GET /api/v1/ai/status` - AI service status
- `POST /api/v1/ai/ocr` - Document OCR processing
- `POST /api/v1/ai/analyze` - Document analysis
- `POST /api/v1/ai/fraud-detection` - Fraud detection
- `POST /api/v1/ai/classify` - Record classification
- `POST /api/v1/ai/validate` - Data validation
- `POST /api/v1/ai/batch-process` - Batch document processing

### Records Management
- `GET /api/v1/records` - List records
- `POST /api/v1/records` - Create record
- `GET /api/v1/records/:id` - Get record details
- `PUT /api/v1/records/:id` - Update record
- `DELETE /api/v1/records/:id` - Delete record

### User Management
- `GET /api/v1/users` - List users (admin only)
- `POST /api/v1/users` - Create user (admin only)
- `GET /api/v1/users/:id` - Get user details
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Deactivate user

## 🔧 Configuration

### Environment Variables

#### Server Configuration
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port
- `HOST`: Server host

#### Database Configuration
- `DB_TYPE`: Database type (sqlite)
- `DB_NAME`: Database filename
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`: Database connection

#### Security Configuration
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRES_IN`: Access token expiration
- `JWT_REFRESH_EXPIRES_IN`: Refresh token expiration
- `BCRYPT_ROUNDS`: Password hashing rounds

#### AI Configuration
- `OPENAI_API_KEY`: OpenAI API key
- `AI_MODEL_NAME`: AI model to use
- `ENABLE_AI_FEATURES`: Enable/disable AI features
- `ENABLE_OCR_PROCESSING`: Enable/disable OCR
- `ENABLE_DOCUMENT_ANALYSIS`: Enable/disable document analysis
- `ENABLE_FRAUD_DETECTION`: Enable/disable fraud detection

#### File Upload Configuration
- `MAX_FILE_SIZE`: Maximum file size in bytes
- `UPLOAD_PATH`: File upload directory
- `ALLOWED_FILE_TYPES`: Comma-separated allowed MIME types

## 🚀 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm start            # Start production server
npm run build        # Build for production
npm test             # Run tests
npm run lint         # Lint code
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:reset     # Reset and reseed database
```

### Development Workflow
1. Make changes to source code
2. Run linting: `npm run lint`
3. Run tests: `npm test`
4. Test locally: `npm run dev`
5. Commit changes with proper commit messages

### Code Structure
```
src/
├── database/          # Database configuration and migrations
├── middleware/        # Express middleware
├── routes/           # API route handlers
├── services/         # Business logic and external services
│   └── ai/          # AI service implementations
├── utils/            # Utility functions
└── server.js         # Main server file
```

## 🧪 Testing

### Test Configuration
- Jest testing framework
- Supertest for API testing
- Test database isolation
- Mock external services

### Running Tests
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
```

## 📝 Logging

### Log Levels
- **error**: Error conditions
- **warn**: Warning conditions
- **info**: General information
- **debug**: Debug information

### Log Outputs
- Console (development)
- File-based logging (production)
- Structured JSON format
- Request/response logging

## 🔒 Security Considerations

### Authentication & Authorization
- JWT token validation
- Role-based access control
- Institution-level data isolation
- Session management

### Data Protection
- Password hashing with bcrypt
- Input validation and sanitization
- SQL injection prevention
- XSS protection

### Rate Limiting
- API rate limiting
- Authentication attempt limiting
- IP-based throttling
- DDoS protection

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure JWT secrets
4. Enable HTTPS
5. Configure reverse proxy (nginx)
6. Set up monitoring and logging

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Variables for Production
```env
NODE_ENV=production
JWT_SECRET=<secure-random-string>
OPENAI_API_KEY=<your-openai-key>
DB_NAME=veims_prod.db
LOG_LEVEL=warn
```

## 📊 Monitoring & Health Checks

### Health Endpoints
- `/health` - Overall system health
- `/api/v1/ai/health` - AI services health

### Metrics
- Request/response times
- Error rates
- AI service performance
- Database connection status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Machine Learning Models**: Custom ML models for specific use cases
- **Real-time Processing**: WebSocket support for real-time updates
- **Advanced Analytics**: Business intelligence and reporting
- **Mobile API**: Mobile-optimized endpoints
- **Integration APIs**: Third-party system integrations
- **Advanced OCR**: Handwriting recognition and form processing
- **Blockchain Integration**: Immutable record verification
- **Multi-language Support**: Internationalization and localization

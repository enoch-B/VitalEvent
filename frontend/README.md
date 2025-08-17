# Life Event Pulse - VEIMS System

A comprehensive Vital Events Information Management System for registering and managing life events like births, deaths, marriages, divorces, and adoptions.

## Features

- **Multi-role Access**: Support for different user roles with appropriate permissions
- **Life Event Registration**: Complete forms for all major life events
- **Real-time Updates**: Live data synchronization across the system
- **Role-based Dashboard**: Customized views based on user permissions
- **User Profiles**: Personalized profile pages with role-specific information and statistics
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## User Roles and Access

### Available Roles

1. **Registrar** - Full access to all registration forms and system features
2. **Registrant** - Access to view own records and submit registrations
3. **Admin** - System administration and user management
4. **Office Manager** - Analytics and reporting capabilities
5. **Health Institution** - Birth and death registration access
6. **Court** - Divorce and adoption registration access
7. **Religious Institution** - Marriage registration access

### Registration Access by Role

| Registration Type | Accessible Roles |
|------------------|------------------|
| Birth | Registrar, Health Institution |
| Death | Registrar, Health Institution |
| Marriage | Registrar, Religious Institution |
| **Divorce** | **Registrar Only** |
| **Adoption** | **Registrar Only** |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd life-event-pulse
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Demo Users

Use these credentials to test different roles:

#### Registrar Access
- Email: `john.registrar@veims.gov`
- Password: `password123`

#### Court Access  
- Email: `court@citycourt.gov`
- Password: `password123`

#### Religious Institution Access
- Email: `marriage@stmarychurch.org`
- Password: `password123`

#### Health Institution Access
- Email: `records@cityhospital.org`
- Password: `password123`

#### Admin Access
- Email: `admin@veims.gov`
- Password: `password123`

#### Office Manager Access
- Email: `sarah.manager@veims.gov`
- Password: `password123`

#### Citizen/Registrant Access
- Email: `jane.citizen@email.com`
- Password: `password123`

## Testing Divorce and Adoption Registration

### For Registrar Role Only

Both divorce and adoption registration forms are restricted to registrar users only. To test:

1. Login with the registrar account:
   - Email: `john.registrar@veims.gov`
   - Password: `password123`
2. Navigate to the sidebar and click on:
   - "Register Divorce" for divorce registration
   - "Register Adoption" for adoption registration
3. Fill out the comprehensive forms with required information
4. Submit to generate registration numbers and certificates

**Note**: Other user roles (court, health institution, religious institution, etc.) will not see these options in their sidebar and cannot access these registration forms.

## Testing Death Registration

### For Registrar and Health Institution Roles

Death registration is accessible to both registrar and health institution users. To test:

1. Login with either:
   - **Registrar**: `john.registrar@veims.gov` / `password123`
   - **Health Institution**: `records@cityhospital.org` / `password123`
2. Navigate to the sidebar and click "Register Death"
3. Fill out the comprehensive death registration form including:
   - Deceased person information (name, dates, age, gender)
   - Place of death details
   - Cause of death (immediate and underlying)
   - Medical information (attending physician, hospital)
   - Informant details
   - Supporting documents
4. Submit to generate death registration numbers and certificates

### Form Features

- **Divorce Registration**: Complete petitioner/respondent information, marriage details, court proceedings, and legal documentation
- **Adoption Registration**: Child information, biological parents, adoptive parents, court proceedings, and special considerations
- **Death Registration**: Comprehensive death certificate with medical, legal, and administrative information

## User Profile System

### Personalized Profiles for All Roles

Every user has access to a personalized profile page that displays:

- **Profile Overview**: Avatar, name, email, role badge, and basic information
- **Role Information**: Detailed description of the user's role and permissions
- **Role Statistics**: Role-specific metrics and key performance indicators
- **Recent Activity**: Timeline of user actions and system interactions
- **Profile Editing**: Ability to update personal information (name, email, phone, address, bio)

## Admin User Management

### New Citizen Registration

Administrators can create new citizen accounts with assigned index numbers:

1. **Login** with admin account:
   - Email: `admin@veims.gov`
   - Password: `password123`

2. **Navigate** to "User Management" in the sidebar

3. **Click** "Add User" button

4. **Select** "New Citizen (Registrant)" role

5. **Enter** required information:
   - Full name
   - Email address
   - **Index Number** (unique citizen identifier)
   - Password and confirmation

6. **Submit** to create the new citizen account

### Features

- **Index Number Assignment**: Admins can assign unique index numbers to new citizens
- **Role-based Forms**: Different form fields appear based on selected role
- **Validation**: Ensures index numbers are provided for registrants
- **User Tracking**: All new users are tracked with creation dates and status
- **Comprehensive Management**: View, filter, and manage all system users

### Role-Specific Profile Content

Each role displays different information and statistics:

- **Registrar**: Registration counts, certificates generated, years of service, office location
- **Admin**: Users managed, system uptime, active sessions, maintenance status
- **Office Manager**: Reports generated, analytics created, team size, performance metrics
- **Health Institution**: Birth/death registrations, staff count, accreditation level
- **Court**: Cases processed, judge count, court type, success rate
- **Religious Institution**: Marriages registered, clergy members, denomination, establishment year
- **Registrant**: Records viewed, applications submitted, member since, verification status

### Accessing Your Profile

1. **Login** with any demo account
2. **Click** on your user avatar in the top-right corner of the header
3. **Select** "View Profile" from the dropdown menu
4. **View** your personalized profile information
5. **Edit** your profile details using the "Edit Profile" button

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── pages/             # Page components
│   ├── register/      # Registration forms
│   └── auth/          # Authentication pages
└── main.tsx           # Application entry point
```

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, CSS Modules
- **UI Components**: Radix UI, Lucide Icons
- **Forms**: React Hook Form, Zod validation
- **Routing**: React Router v6
- **State Management**: React Context API

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

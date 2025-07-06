# 🚨 SafeStep - Emergency Services Application

A comprehensive emergency services application with real-time location tracking, emergency contacts management, dynamic emergency service discovery, and a powerful admin dashboard system.

## 🌟 Features

### 🔐 Authentication & Security
- **OTP-based Registration** - Secure email verification during signup
- **JWT Authentication** - Token-based secure authentication
- **Password Reset** - OTP-based password recovery system
- **Protected Routes** - Secure access to user-specific features
- **Admin Authentication** - Separate admin login with OTP verification

### 🏛️ Admin Dashboard System
- **Admin Registration** - OTP-based admin signup with email verification
- **Comprehensive Dashboard** - Overview, users, alerts, analytics, and system health
- **User Management** - View, activate/deactivate users with reasons
- **Alert Management** - Monitor and update emergency alert statuses
- **Analytics & Charts** - Visual data representation with Chart.js
- **System Health Monitoring** - Real-time system status and performance metrics
- **Data Export** - CSV export functionality for reports

### 🌍 Internationalization (i18n)
- **Multi-language Support** - English, Arabic, and Hindi
- **Dynamic Language Switching** - Collapsible language tray with flags
- **Translated UI Elements** - All major pages and components translated
- **RTL Support** - Right-to-left layout for Arabic
- **Seamless Language Toggle** - Instant language switching without page reload

### 📍 Location Services
- **Real-time GPS Tracking** - Automatic user location detection
- **Emergency Services Map** - Interactive map with nearby emergency services
- **POI Integration** - Dynamic discovery of emergency services via OpenStreetMap
- **Distance Calculation** - Real-time distance to emergency services

### 👥 Emergency Contacts Management
- **Add/Remove Contacts** - Manage emergency contact list
- **Contact Validation** - Email-based contact verification
- **Dashboard Statistics** - Track contact count and alert history
- **Inline Contact Form** - Seamless contact addition with validation

### 🚨 Emergency Alert System
- **One-Click Alert** - Send emergency alerts to all contacts
- **Location Sharing** - Automatically include user's current location
- **Email Notifications** - Instant email alerts to emergency contacts
- **Alert History** - Track all sent emergency alerts
- **Alert Status Management** - Active, resolved, and false alarm statuses

### 🏥 Emergency Services Discovery
- **Seeded Data** - 16 verified emergency services in Qatar
- **POI Search** - Dynamic discovery via OverstreetMap API
- **Service Categories** - Police, Fire, Hospital, Poison Control
- **Interactive Map** - Click to call emergency services
- **Color-coded Cards** - Detailed service information with quick actions

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email services
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI framework
- **React Router** - Client-side routing
- **React Leaflet** - Interactive maps
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications
- **React i18next** - Internationalization
- **Chart.js** - Data visualization
- **React Chart.js** - Chart.js React wrapper

### APIs & Services
- **OpenStreetMap** - Base map tiles
- **Overpass API** - POI data for emergency services
- **Geolocation API** - User location detection

## 📁 Project Structure

```
SafeStep/
├── backend/
│   ├── controllers/
│   │   ├── adminController.js           # Admin dashboard logic
│   │   ├── authController.js            # Authentication logic
│   │   ├── emergencyAlertController.js  # Alert management
│   │   ├── emergencyContactController.js # Contact management
│   │   ├── emergencyServiceController.js # Services API
│   │   └── userController.js            # User management
│   ├── middleware/
│   │   ├── adminAuth.js                 # Admin authentication
│   │   └── auth.js                      # JWT authentication
│   ├── models/
│   │   ├── Admin.js                     # Admin schema
│   │   ├── EmergencyAlert.js            # Alert schema
│   │   ├── EmergencyContact.js          # Contact schema
│   │   ├── EmergencyService.js          # Service schema
│   │   ├── Otp.js                       # OTP schema
│   │   └── User.js                      # User schema
│   ├── routes/
│   │   ├── admin.js                     # Admin endpoints
│   │   ├── auth.js                      # Auth endpoints
│   │   ├── emergencyAlerts.js           # Alert endpoints
│   │   ├── emergencyContacts.js         # Contact endpoints
│   │   ├── emergencyServices.js         # Service endpoints
│   │   └── user.js                      # User endpoints
│   ├── utils/
│   │   ├── emergencyMailer.js           # Emergency email service
│   │   ├── generateOtp.js               # OTP generation
│   │   ├── mailer.js                    # Email service
│   │   └── userConfirmationMailer.js    # User confirmation emails
│   ├── seedEmergencyServices.js         # Database seeding
│   ├── server.js                        # Main server file
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── locales/                     # Translation files
│   │   │   ├── en/                      # English translations
│   │   │   ├── ar/                      # Arabic translations
│   │   │   └── hi/                      # Hindi translations
│   │   └── ...
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmergencyServicesMap.jsx # Interactive map
│   │   │   └── ProtectedRoute.jsx       # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # Authentication context
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx       # Admin dashboard
│   │   │   ├── AdminLogin.jsx           # Admin login
│   │   │   ├── AdminSignup.jsx          # Admin signup
│   │   │   ├── ChangePassword.jsx       # Password reset
│   │   │   ├── Dashboard.jsx            # Main dashboard
│   │   │   ├── Landing.jsx              # Landing page
│   │   │   ├── Login.jsx                # Login page
│   │   │   └── Register.jsx             # Registration page
│   │   ├── services/
│   │   │   └── api.js                   # API configuration
│   │   ├── i18n/
│   │   │   └── i18n.js                  # i18n configuration
│   │   ├── App.jsx                      # Main app component
│   │   └── main.jsx                     # App entry point
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Gmail account (for email services)

### Backend Setup

1. **Clone and navigate to backend**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/safestep
JWT_SECRET=your_jwt_secret_here
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

4. **Seed the database**
```bash
npm run seed
```

5. **Start the server**
```bash
npm start
```

### Frontend Setup

1. **Navigate to frontend**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

## 📱 Application Flow

### 1. User Registration
```
Email Input → OTP Verification → Account Creation → Dashboard Access
```

### 2. Admin Registration
```
Admin Signup → OTP to paul2744walker@gmail.com → Verification → Admin Dashboard Access
```

### 3. Emergency Contact Management
```
Add Contact → Email Validation → Contact Saved → Dashboard Update
```

### 4. Emergency Alert System
```
User Location → Alert Button → Email Notifications → Alert History → Admin Review
```

### 5. Emergency Services Discovery
```
User Location → Map Display → POI Search → Service Information
```

### 6. Language Switching
```
Language Tray → Flag Selection → Instant UI Translation → RTL Support (Arabic)
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Direct user registration
- `POST /api/auth/login` - User login
- `POST /api/auth/send-otp` - Send registration OTP
- `POST /api/auth/verify-otp` - Verify registration OTP
- `POST /api/auth/send-reset-password-otp` - Send password reset OTP
- `POST /api/auth/verify-reset-password-otp` - Verify password reset OTP
- `POST /api/auth/reset-password` - Reset password

### Admin Authentication
- `POST /api/admin/send-otp` - Send admin signup OTP
- `POST /api/admin/verify-otp` - Verify admin signup OTP
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users with pagination
- `GET /api/admin/alerts` - Get all alerts with pagination
- `PATCH /api/admin/users/:id/status` - Update user status
- `PATCH /api/admin/alerts/:id/status` - Update alert status
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/system-health` - Get system health metrics
- `GET /api/admin/export` - Export data as CSV

### User Management
- `GET /api/user/dashboard-stats` - Get user statistics

### Emergency Contacts
- `GET /api/emergency-contacts` - Get user's contacts
- `POST /api/emergency-contacts` - Add new contact
- `DELETE /api/emergency-contacts/:id` - Remove contact

### Emergency Alerts
- `POST /api/emergency-alerts` - Send emergency alert

### Emergency Services
- `GET /api/emergency-services/nearby` - Get nearby services

## 🗺️ Emergency Services Data

### Seeded Services (Qatar)
- **5 Police Stations** - Doha Central, West Bay, Al Wakrah, Al Sadd, Al Khor
- **4 Fire Stations** - Doha Central, Hamad Airport, Al Wakrah, Al Khor
- **6 Hospitals** - Hamad General, Al Wakra, Al Khor, Sidra Medicine, Al Ahli, Al Emadi
- **1 Poison Control Center** - Qatar Poison Control Center

### POI Integration
- **Dynamic Discovery** - Real-time emergency service search
- **OpenStreetMap Data** - Comprehensive global coverage
- **Automatic Updates** - Always current information
- **Multiple Categories** - Police, Fire, Hospital, Specialized Services

## 🏛️ Admin Dashboard Features

### Dashboard Overview
- **Real-time Statistics** - Total users, alerts, active alerts, resolved alerts
- **Quick Actions** - Direct access to user and alert management
- **System Status** - Live monitoring of application health
- **Recent Activity** - Latest user registrations and alert activities

### User Management
- **User List** - Comprehensive user database with search and pagination
- **User Details** - Complete user information including registration date
- **Status Control** - Activate/deactivate users with reason tracking
- **Deactivation History** - Track when and why users were deactivated
- **Bulk Operations** - Manage multiple users efficiently

### Alert Management
- **Alert Monitoring** - Real-time emergency alert tracking
- **Status Updates** - Mark alerts as resolved or false alarms
- **Alert Details** - Complete alert information with user and location data
- **Filtering Options** - Filter by status, date range, and user
- **Admin Notes** - Add notes and comments to alerts

### Analytics & Reporting
- **Chart.js Integration** - Interactive charts and graphs
- **Alert Trends** - Time-based alert analysis
- **User Analytics** - Registration and activity patterns
- **Status Distribution** - Visual breakdown of alert statuses
- **Hourly Analysis** - Peak usage time identification
- **Period Selection** - Customizable date ranges for analysis

### System Health
- **Performance Metrics** - Response times and system load
- **Database Status** - Connection health and query performance
- **Memory Usage** - System resource monitoring
- **Error Tracking** - Application error monitoring
- **Uptime Monitoring** - System availability tracking

### Data Export
- **CSV Export** - Download user and alert data
- **Filtered Exports** - Export specific data subsets
- **Report Generation** - Automated report creation
- **Data Backup** - Regular data export capabilities

## 🌍 Internationalization (i18n) System

### Supported Languages
- **English (en)** - Primary language with complete translations
- **Arabic (ar)** - Full RTL support with Arabic translations
- **Hindi (hi)** - Complete Hindi language support

### Translation Features
- **Dynamic Language Switching** - Instant language changes
- **Collapsible Language Tray** - Elegant language selector with flags
- **RTL Layout Support** - Proper right-to-left layout for Arabic
- **Contextual Translations** - Context-aware translation system
- **Fallback System** - Graceful fallback to English for missing translations

### UI Components Translated
- **Authentication Pages** - Login, register, password reset
- **Dashboard Elements** - All dashboard text and labels
- **Emergency Services** - Service names and descriptions
- **Navigation** - Menu items and navigation text
- **Notifications** - Toast messages and alerts
- **Forms** - Input labels, placeholders, and validation messages

### Language Tray Design
- **Flag Icons** - Visual language identification
- **Smooth Animations** - Elegant expand/collapse transitions
- **Fixed Positioning** - Always accessible language switcher
- **Responsive Design** - Works on all screen sizes

## 🔒 Security Features

- **JWT Token Authentication** - Secure session management
- **Password Hashing** - bcrypt encryption
- **OTP Verification** - Email-based security
- **Protected Routes** - Role-based access control
- **Input Validation** - Server-side data validation
- **CORS Protection** - Cross-origin security

## 📧 Email Services

### Email Templates
- **Registration OTP** - Account verification
- **Password Reset OTP** - Password recovery
- **Emergency Alerts** - Contact notifications
- **User Confirmations** - Account status updates

### Email Configuration
- **Gmail SMTP** - Reliable email delivery
- **App Passwords** - Secure authentication
- **HTML Templates** - Professional formatting
- **Error Handling** - Graceful failure management

## 🎨 UI/UX Features

### Modern Design
- **Responsive Layout** - Mobile-first design
- **Gradient Backgrounds** - Modern visual appeal
- **Interactive Maps** - Real-time location services
- **Toast Notifications** - User feedback
- **Loading States** - Smooth user experience

### User Experience
- **Intuitive Navigation** - Easy-to-use interface
- **Real-time Updates** - Live data synchronization
- **Error Handling** - User-friendly error messages
- **Accessibility** - Inclusive design principles

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to Heroku, Vercel, or AWS
4. Set up email service credentials

### Frontend Deployment
1. Build the production version
2. Deploy to Netlify, Vercel, or AWS S3
3. Configure API endpoint URLs
4. Set up custom domain (optional)

## 🔧 Configuration

### Environment Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/safestep

# Authentication
JWT_SECRET=your_secure_jwt_secret

# Email Service
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

# Server
PORT=5000
NODE_ENV=development
```

### API Configuration
The frontend uses a centralized API configuration in `src/services/api.js`:
- Base URL configuration
- Endpoint management
- Authentication headers
- Error handling
  

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **OpenStreetMap** - Map data and POI information
- **React Leaflet** - Interactive map components
- **Tailwind CSS** - Utility-first CSS framework
- **MongoDB** - Database solution
- **Node.js Community** - Backend framework and tools

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation

---

**Built with ❤️ by @fowzan2744 for emergency safety and community protection** 

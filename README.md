# HealthFlow Backend API

A robust, industry-standard Node.js/Express backend API for the HealthFlow healthcare MVP application. The API manages medication reminders, compliance logging, patient profiles, and smartwatch device integration.

## 🚀 Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Patient Profiles**: Comprehensive patient health management system
- **Medication Management**: Track medications with detailed information
- **Reminder System**: Schedule and manage medication reminders
- **Compliance Tracking**: Log medication adherence and health metrics
- **Smartwatch Integration**: Support for smartwatch and health device data synchronization
- **Health Data Analytics**: Track trends and generate compliance reports
- **Role-Based Access Control**: Admin, patient, caregiver, and doctor roles
- **Error Handling**: Comprehensive error handling and validation
- **MongoDB Integration**: Persistent data storage with optimized queries
- **Security**: CORS, helmet, rate limiting, and secure headers

## 📋 Prerequisites

- Node.js v14+ or higher
- npm v6+ or higher
- MongoDB v4.4+ (local or cloud instance)

## 🔧 Installation

### 1. Clone or Extract Project

```bash
cd your-project-directory
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory using `.env.example` as a template:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/healthflow

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRATION=7d

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### 4. Start the Server

**Development Mode (with auto-reload):**

```bash
npm run dev
```

**Production Mode:**

```bash
npm start
```

The server will start on the configured PORT (default: 5000).

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

Most endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Endpoints Overview

#### 🔐 Authentication (`/auth`)

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info
- `PUT /auth/profile` - Update user profile
- `POST /auth/change-password` - Change password
- `POST /auth/logout` - Logout user

#### 👥 Patients (`/patients`)

- `GET /patients/:patientId` - Get patient profile
- `PUT /patients/:patientId` - Update patient profile
- `GET /patients/:patientId/health-summary` - Get health summary
- `POST /patients/:patientId/caregivers` - Add caregiver
- `DELETE /patients/:patientId/caregivers` - Remove caregiver
- `POST /patients/:patientId/devices` - Link device
- `DELETE /patients/:patientId/devices` - Unlink device

#### 💊 Medications (`/health-data/medications`)

- `POST /health-data/medications` - Create medication
- `GET /health-data/medications/patient/:patientId` - Get medications
- `GET /health-data/medications/:medicationId` - Get medication details
- `PUT /health-data/medications/:medicationId` - Update medication
- `DELETE /health-data/medications/:medicationId` - Delete medication

#### ⏰ Reminders (`/reminders`)

- `POST /reminders` - Create reminder
- `GET /reminders/patient/:patientId` - Get all reminders
- `GET /reminders/:reminderId` - Get single reminder
- `PUT /reminders/:reminderId` - Update reminder
- `PATCH /reminders/:reminderId/status` - Update reminder status
- `DELETE /reminders/:reminderId` - Delete reminder
- `GET /reminders/patient/:patientId/pending` - Get pending reminders
- `GET /reminders/patient/:patientId/today` - Get today's reminders
- `POST /reminders/:reminderId/snooze` - Snooze reminder

#### ✅ Compliance (`/compliance`)

- `POST /compliance` - Create compliance log
- `GET /compliance/patient/:patientId` - Get compliance logs
- `GET /compliance/:logId` - Get single log
- `PUT /compliance/:logId` - Update log
- `DELETE /compliance/:logId` - Delete log
- `GET /compliance/patient/:patientId/rate` - Get compliance rate
- `GET /compliance/patient/:patientId/trends` - Get health trends
- `GET /compliance/patient/:patientId/missed` - Get missed medications report
- `GET /compliance/patient/:patientId/side-effects` - Get side effects report

#### 📱 Devices (Smartwatch) (`/devices`)

- `POST /devices` - Register device
- `GET /devices/patient/:patientId` - Get patient devices
- `GET /devices/:deviceId` - Get device details
- `PUT /devices/:deviceId` - Update device
- `DELETE /devices/:deviceId` - Delete device
- `POST /devices/:deviceId/connect` - Connect device
- `POST /devices/:deviceId/disconnect` - Disconnect device
- `PATCH /devices/:deviceId/battery` - Update battery status
- `POST /devices/:deviceId/sync` - **Sync smartwatch data (Key endpoint)**
- `GET /devices/:deviceId/data` - Get device health data
- `GET /devices/:deviceId/health-summary` - Get device health summary

#### 📊 Health Data (`/health-data`)

- `GET /health-data/patient/:patientId/dashboard` - Get dashboard overview
- `GET /health-data/patient/:patientId/timeline` - Get health timeline
- `GET /health-data/patient/:patientId/metrics` - Get metrics summary
- `GET /health-data/patient/:patientId/interactions` - Get medication interactions
- `GET /health-data/patient/:patientId/export` - Export health data

### 🔑 Health Check

```
GET /api/health
```

Returns the API status and uptime.

## 📊 Database Models

### User

- Email, password (hashed), name, phone
- Role-based access control
- Account security features (login attempts, lockout)

### Patient

- Medical history, allergies, chronic conditions
- Emergency contact, insurance info
- Blood type, height, weight
- Linked devices, assigned caregivers
- Consent management

### Medication

- Name, generic name, dosage, type
- Prescription details, expiration date
- Side effects, interactions, storage instructions
- Active status tracking

### Reminder

- Scheduled time, frequency (daily, weekly, monthly, as-needed)
- Medication link, device sync settings
- Completion history and statistics
- Snooze and missed tracking

### ComplianceLog

- Medication taken status
- Symptoms, side effects observed
- Mood, energy, pain levels
- Sleep, water intake, exercise data
- Device data sync status

### Device

- Device type, manufacturer, model
- Connection type and status
- Battery level and status
- Supported data types
- Notification and permission settings

### DeviceData

- Stores health metrics from devices
- Heart rate, blood pressure, glucose, sleep data
- Steps, calories, weight, temperature, SpO2
- Stress level, hydration tracking
- Anomaly detection and verification flags

## 🔒 Security Features

1. **JWT Authentication** - Secure token-based authentication
2. **Password Hashing** - bcryptjs for secure password storage
3. **CORS Protection** - Configurable CORS headers
4. **Helmet.js** - Security headers middleware
5. **Rate Limiting** - Protect against brute force attacks
6. **Input Validation** - Joi schema validation
7. **Error Handling** - Secure error messages
8. **MongoDB Injection Prevention** - Mongoose sanitization

## 🧪 Testing

```bash
npm test
```

## 📈 Project Structure

```
src/
├── server.js                 # Main entry point
├── config/
│   ├── database.js          # MongoDB connection
│   └── constants.js         # App-wide constants
├── models/                  # MongoDB schemas
│   ├── User.js
│   ├── Patient.js
│   ├── Medication.js
│   ├── Reminder.js
│   ├── ComplianceLog.js
│   ├── Device.js
│   └── DeviceData.js
├── controllers/             # Business logic
│   ├── authController.js
│   ├── patientController.js
│   ├── reminderController.js
│   ├── complianceController.js
│   ├── deviceController.js
│   └── healthController.js
├── routes/                  # API endpoints
│   ├── authRoutes.js
│   ├── patientRoutes.js
│   ├── reminderRoutes.js
│   ├── complianceRoutes.js
│   ├── deviceRoutes.js
│   └── healthRoutes.js
├── middleware/              # Middleware functions
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── validationMiddleware.js
└── utils/                   # Utility functions
    ├── responseUtil.js
    └── validators.js
```

## 🔌 Integration with Smartwatch

The API is designed to accept and manage data from smartwatches and health devices:

### Device Registration

1. Register device with device type (smartwatch, fitness band, etc.)
2. Specify supported data types
3. Set up connection preferences

### Data Synchronization

```bash
POST /api/devices/:deviceId/sync
Content-Type: application/json

{
  "patientId": "patient_id_here",
  "dataPoints": [
    {
      "type": "heart_rate",
      "timestamp": "2024-01-15T10:30:00Z",
      "data": {
        "bpm": 75,
        "quality": "good"
      }
    },
    {
      "type": "blood_pressure",
      "timestamp": "2024-01-15T10:30:00Z",
      "data": {
        "systolic": 120,
        "diastolic": 80,
        "pulse": 75
      }
    },
    {
      "type": "sleep",
      "timestamp": "2024-01-15T08:00:00Z",
      "data": {
        "duration": 480,
        "quality": "good",
        "deepSleep": 120
      }
    }
  ]
}
```

### Supported Data Types

- Heart Rate
- Blood Pressure
- Glucose
- Weight
- Temperature
- SpO2 (Oxygen Saturation)
- Sleep Data
- Activity/Steps
- Stress Level
- Hydration
- Location

## 📝 Example Usage

### 1. Register User

```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### 2. Login

```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### 3. Create Medication

```bash
POST /api/health-data/medications
{
  "patientId": "patient_id",
  "name": "Aspirin",
  "dosage": "500",
  "unit": "mg",
  "medicationType": "tablet",
  "purpose": "Pain Relief",
  "prescribedDate": "2024-01-01"
}
```

### 4. Create Reminder

```bash
POST /api/reminders
{
  "patientId": "patient_id",
  "medicationId": "med_id",
  "title": "Take Aspirin",
  "scheduledTime": "09:00",
  "frequency": "daily",
  "startDate": "2024-01-01"
}
```

### 5. Log Compliance

```bash
POST /api/compliance
{
  "patientId": "patient_id",
  "medicationId": "med_id",
  "medicationTaken": true,
  "quantityTaken": 1,
  "moodLevel": 8,
  "sleepHours": 7
}
```

## 🚀 Deployment

### Environment-Specific Configuration

Update `.env` for production:

```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_secret_key
PORT=8080
```

### Deploy with PM2

```bash
npm install -g pm2
pm2 start src/server.js --name "healthflow-api"
pm2 save
pm2 startup
```

## 📞 Support & Issues

For issues and questions:

1. Check the error messages in logs
2. Verify environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check request payload format

## 📄 License

MIT License - Feel free to use this code in your projects

## 🙏 Contributing

This is a team project for HealthFlow MVP. Ensure you:

- Follow the existing code structure
- Add comments for complex logic
- Test all endpoints before committing
- Keep the API documentation updated

---

**Happy Coding!** 🎉

# HealthFlow Backend API - Quick Start Guide

## ✅ Installation Complete

Your robust, industry-standard HealthFlow backend API has been successfully set up with all required packages and configurations.

### Installed Core Dependencies

✓ **Express.js** - Web framework  
✓ **MongoDB/Mongoose** - Database & ORM  
✓ **JWT** - Authentication  
✓ **bcryptjs** - Password encryption  
✓ **Joi** - Input validation  
✓ **Helmet** - Security headers  
✓ **CORS** - Cross-origin requests  
✓ **Morgan** - Logging  
✓ **UUID** - Unique identifiers  
✓ **Axios** - HTTP client

## 🚀 Getting Started

### 1. Setup MongoDB

**Option A: Local MongoDB**

```bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string

### 2. Configure Environment Variables

Create `.env` file in the root directory:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/healthflow

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production_12345
JWT_EXPIRATION=7d

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### 3. Start the Server

```bash
# Development mode (basic)
npm start

# OR for development with auto-reload (install nodemon manually)
# npm install -g nodemon
# npm run dev
```

The server will start on `http://localhost:5000`

Check health: `GET http://localhost:5000/api/health`

## 📚 Complete API Endpoints

### Authentication

```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
GET    /api/auth/me                - Get current user
PUT    /api/auth/profile           - Update profile
POST   /api/auth/change-password   - Change password
```

### Patient Management

```
GET    /api/patients/:patientId           - Get patient profile
PUT    /api/patients/:patientId           - Update profile
GET    /api/patients/:patientId/health-summary  - Health summary
```

### Medications

```
POST   /api/health-data/medications              - Create medication
GET    /api/health-data/medications/patient/:id - Get medications
GET    /api/health-data/medications/:medId      - Get single medication
PUT    /api/health-data/medications/:medId      - Update medication
DELETE /api/health-data/medications/:medId      - Delete medication
```

### Reminders

```
POST   /api/reminders                    - Create reminder
GET    /api/reminders/patient/:patientId - Get reminders
PATCH  /api/reminders/:reminderId/status - Update status
POST   /api/reminders/:reminderId/snooze - Snooze reminder
```

### Compliance Logging

```
POST   /api/compliance                          - Create log
GET    /api/compliance/patient/:patientId       - Get logs
GET    /api/compliance/patient/:patientId/rate  - Get compliance rate
GET    /api/compliance/patient/:patientId/trends     - Health trends
GET    /api/compliance/patient/:patientId/missed     - Missed medications
GET    /api/compliance/patient/:patientId/side-effects - Side effects
```

### Device Management (Smartwatch Integration)

```
POST   /api/devices                      - Register device
GET    /api/devices/patient/:patientId   - Get devices
POST   /api/devices/:deviceId/sync       - ⭐ SYNC SMARTWATCH DATA
GET    /api/devices/:deviceId/data       - Get device data
PATCH  /api/devices/:deviceId/battery    - Update battery
```

### Health Dashboard

```
GET    /api/health-data/patient/:patientId/dashboard   - Dashboard overview
GET    /api/health-data/patient/:patientId/timeline    - Health timeline
GET    /api/health-data/patient/:patientId/metrics     - Metrics summary
GET    /api/health-data/patient/:patientId/interactions - Drug interactions
```

## 🔌 Smartwatch Integration (Key Feature)

The API is fully designed to accept and sync smartwatch data:

### Sync Smartwatch Data

```bash
POST /api/devices/:deviceId/sync

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
      "timestamp": "2024-01-14T23:00:00Z",
      "data": {
        "duration": 480,
        "quality": "good",
        "deepSleep": 120
      }
    }
  ]
}
```

### Supported Data Types from Devices

- ❤️ Heart Rate
- 🩸 Blood Pressure
- 🍬 Glucose
- ⚖️ Weight
- 🌡️ Temperature
- 💨 SpO2 (Oxygen Saturation)
- 😴 Sleep Data
- 👟 Steps/Activity
- 😟 Stress Level
- 💧 Hydration
- 📍 Location

## 📁 Project Structure

```
capstone/
├── src/
│   ├── server.js                    # Main entry point
│   ├── config/
│   │   ├── database.js              # MongoDB config
│   │   └── constants.js             # App constants
│   ├── models/                      # Database schemas
│   │   ├── User.js
│   │   ├── Patient.js
│   │   ├── Medication.js
│   │   ├── Reminder.js
│   │   ├── ComplianceLog.js
│   │   ├── Device.js
│   │   └── DeviceData.js
│   ├── controllers/                 # Business logic
│   │   ├── authController.js
│   │   ├── patientController.js
│   │   ├── reminderController.js
│   │   ├── complianceController.js
│   │   ├── deviceController.js
│   │   └── healthController.js
│   ├── routes/                      # API routes
│   │   ├── authRoutes.js
│   │   ├── patientRoutes.js
│   │   ├── reminderRoutes.js
│   │   ├── complianceRoutes.js
│   │   ├── deviceRoutes.js
│   │   └── healthRoutes.js
│   ├── middleware/                  # Middleware
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   └── validationMiddleware.js
│   └── utils/                       # Utilities
│       ├── responseUtil.js
│       └── validators.js
├── package.json                     # Dependencies
├── .env.example                     # Environment template
├── .gitignore                       # Git ignore rules
├── README.md                        # Full documentation
└── API_DOCUMENTATION.md             # Complete API reference
```

## 🧪 Test the API

### 1. Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

### 3. Use Returned Token

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔒 Security Features

✓ JWT-based authentication  
✓ bcryptjs password hashing  
✓ Helmet security headers  
✓ CORS protection  
✓ Input validation (Joi)  
✓ Rate limiting ready  
✓ Account lockout protection  
✓ Error sanitization

## 📊 Database Collections

The API automatically creates these MongoDB collections:

- **users** - User accounts and authentication
- **patients** - Patient profiles and health info
- **medications** - Medication records
- **reminders** - Medication reminders
- **compliancelogs** - Medication adherence logs
- **devices** - Smartwatch/device registrations
- **devicedata** - Device sensor data

## 🎯 Key Features Implemented

### 1. User Management

- Secure registration and login
- JWT token authentication
- Password hashing with bcrypt
- Account lockout after failed attempts
- Profile management

### 2. Patient Profiles

- Comprehensive health information
- Medical history tracking
- Emergency contacts
- Insurance information
- Device linking
- Caregiver management

### 3. Medication Management

- Add medications with detailed info
- Track dosage and frequency
- Monitor expiration dates
- Log side effects and interactions
- Prescription tracking

### 4. Reminder System

- Create daily, weekly, monthly reminders
- Schedule medication reminders
- Track completion history
- Snooze functionality
- Compliance rate calculation

### 5. Compliance Logging

- Log medication adherence
- Track symptoms and side effects
- Monitor mood and energy levels
- Record sleep, exercise, hydration
- Generate compliance reports

### 6. Smartwatch Integration

- Register devices
- Sync health data automatically
- Support multiple data types
- Battery monitoring
- Device permissions and settings

### 7. Health Analytics

- Compliance rate tracking
- Health trend analysis
- Medication interaction detection
- Dashboard overview
- Data export functionality

## 🚀 Next Steps

1. **Install MongoDB** locally or use MongoDB Atlas
2. **Create .env file** with your configuration
3. **Start the server** with `npm start`
4. **Test endpoints** using cURL or Postman
5. **Connect frontend** to this API
6. **Configure smartwatch** SDK for device sync

## 📖 Documentation Files

- **README.md** - Full project documentation
- **API_DOCUMENTATION.md** - Complete API reference with examples
- **This file** - Quick start guide

## 🔧 Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:** Make sure MongoDB is running (`mongod`)

### Invalid JWT Secret

```
Error: secret should be a string or buffer
```

**Solution:** Add JWT_SECRET to .env file

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:** Change PORT in .env or kill process using port 5000

### CORS Error

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:** Add frontend URL to CORS_ORIGIN in .env

## 📞 Support

For issues:

1. Check error messages in terminal
2. Verify MongoDB is running
3. Check .env configuration
4. Review API_DOCUMENTATION.md
5. Check project logs

## 🎉 You're All Set!

Your HealthFlow backend API is ready for:

- ✅ User authentication and management
- ✅ Patient profile management
- ✅ Medication tracking
- ✅ Reminder scheduling
- ✅ Compliance monitoring
- ✅ Smartwatch device integration
- ✅ Health data analytics

**Happy Coding!** Build an amazing healthcare app! 🏥💪

---

**Created:** May 2026  
**Project:** HealthFlow - Healthcare MVP  
**Version:** 1.0.0

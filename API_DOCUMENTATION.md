# HealthFlow API - Complete Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All endpoints (except registration and login) require a JWT token:

```
Authorization: Bearer <jwt_token>
```

---

## 1. Authentication Endpoints

### Register User

**POST** `/auth/register`

Request:

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1-555-123-4567",
  "dateOfBirth": "1990-05-15",
  "gender": "male"
}
```

Response (201):

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login User

**POST** `/auth/login`

Request:

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

Response (200):

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "patient"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User

**GET** `/auth/me`

Headers:

```
Authorization: Bearer <token>
```

Response (200):

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1-555-123-4567",
      "role": "patient"
    }
  }
}
```

### Update Profile

**PUT** `/auth/profile`

Request:

```json
{
  "firstName": "Jonathan",
  "phone": "+1-555-987-6543",
  "gender": "male"
}
```

Response (200):

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "Jonathan",
      "phone": "+1-555-987-6543"
    }
  }
}
```

---

## 2. Patient Profile Endpoints

### Get Patient Profile

**GET** `/patients/:patientId`

Response (200):

```json
{
  "success": true,
  "message": "Patient profile retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "medicalHistory": {
      "allergies": ["Penicillin", "Shellfish"],
      "chronicConditions": ["Hypertension", "Type 2 Diabetes"],
      "pastSurgeries": ["Appendectomy"]
    },
    "bloodType": "O+",
    "height": 180,
    "weight": 75,
    "emergencyContact": {
      "name": "Jane Doe",
      "relationship": "Spouse",
      "phone": "+1-555-999-0000"
    }
  }
}
```

### Update Patient Profile

**PUT** `/patients/:patientId`

Request:

```json
{
  "medicalHistory": {
    "allergies": ["Penicillin"],
    "chronicConditions": ["Hypertension"]
  },
  "bloodType": "O+",
  "height": 180,
  "weight": 75,
  "timezone": "America/New_York",
  "preferredNotificationMethod": "push"
}
```

---

## 3. Medication Endpoints

### Create Medication

**POST** `/health-data/medications`

Request:

```json
{
  "patientId": "507f1f77bcf86cd799439012",
  "name": "Lisinopril",
  "genericName": "Enalapril",
  "dosage": "10",
  "unit": "mg",
  "medicationType": "tablet",
  "purpose": "Blood Pressure Control",
  "prescribedDate": "2024-01-01",
  "expirationDate": "2025-01-01",
  "prescribedBy": "Dr. Smith",
  "refillsRemaining": 3,
  "sideEffects": ["Dry cough", "Dizziness"],
  "interactions": ["NSAIDs", "Potassium supplements"]
}
```

Response (201):

```json
{
  "success": true,
  "message": "Medication created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439050",
    "name": "Lisinopril",
    "dosage": "10",
    "unit": "mg",
    "isActive": true
  }
}
```

### Get Patient Medications

**GET** `/health-data/medications/patient/:patientId?page=1&limit=10&isActive=true`

Response (200):

```json
{
  "success": true,
  "message": "Medications retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439050",
      "name": "Lisinopril",
      "dosage": "10",
      "unit": "mg",
      "purpose": "Blood Pressure Control"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

## 4. Reminder Endpoints

### Create Reminder

**POST** `/reminders`

Request:

```json
{
  "patientId": "507f1f77bcf86cd799439012",
  "medicationId": "507f1f77bcf86cd799439050",
  "title": "Take Lisinopril",
  "description": "Morning medication for blood pressure",
  "scheduledTime": "09:00",
  "frequency": "daily",
  "daysOfWeek": [1, 2, 3, 4, 5, 6, 7],
  "startDate": "2024-01-15",
  "quantity": 1,
  "notificationMethod": "push"
}
```

Response (201):

```json
{
  "success": true,
  "message": "Reminder created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439051",
    "title": "Take Lisinopril",
    "scheduledTime": "09:00",
    "frequency": "daily",
    "status": "pending",
    "isActive": true,
    "completionRate": 0
  }
}
```

### Get Today's Reminders

**GET** `/reminders/patient/:patientId/today`

Response (200):

```json
{
  "success": true,
  "message": "Today reminders retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439051",
      "title": "Take Lisinopril",
      "scheduledTime": "09:00",
      "medicationId": {
        "_id": "507f1f77bcf86cd799439050",
        "name": "Lisinopril"
      },
      "status": "pending"
    }
  ]
}
```

### Update Reminder Status

**PATCH** `/reminders/:reminderId/status`

Request:

```json
{
  "status": "completed",
  "completedAt": "2024-01-15T09:15:00Z",
  "notes": "Took medication with breakfast"
}
```

Response (200):

```json
{
  "success": true,
  "message": "Reminder status updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439051",
    "status": "completed",
    "completionRate": 50
  }
}
```

### Snooze Reminder

**POST** `/reminders/:reminderId/snooze`

Request:

```json
{
  "snoozeMinutes": 15
}
```

Response (200):

```json
{
  "success": true,
  "message": "Reminder snoozed for 15 minutes",
  "data": {
    "_id": "507f1f77bcf86cd799439051",
    "status": "snoozed",
    "lastSnoozedUntil": "2024-01-15T09:15:00Z"
  }
}
```

---

## 5. Compliance Logging Endpoints

### Log Medication Compliance

**POST** `/compliance`

Request:

```json
{
  "patientId": "507f1f77bcf86cd799439012",
  "medicationId": "507f1f77bcf86cd799439050",
  "reminderId": "507f1f77bcf86cd799439051",
  "medicationTaken": true,
  "quantityTaken": 1,
  "symptoms": [
    {
      "symptom": "Headache",
      "severity": "mild",
      "notes": "Slight headache in the afternoon"
    }
  ],
  "sideEffectsObserved": ["Dry cough"],
  "moodLevel": 7,
  "energyLevel": 8,
  "painLevel": 2,
  "sleepHours": 7,
  "waterIntake": 2000,
  "exerciseMinutes": 30,
  "notes": "Felt good today"
}
```

Response (201):

```json
{
  "success": true,
  "message": "Compliance log created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439060",
    "medicationTaken": true,
    "logDate": "2024-01-15T10:30:00Z",
    "complianceRate": 100
  }
}
```

### Get Compliance Rate

**GET** `/compliance/patient/:patientId/rate?startDate=2024-01-01&endDate=2024-01-31`

Response (200):

```json
{
  "success": true,
  "message": "Compliance rate retrieved successfully",
  "data": {
    "complianceRate": 85,
    "totalLogs": 20,
    "medicationsTaken": 17,
    "medicationsMissed": 3,
    "averageMoodLevel": 7.5,
    "averageEnergyLevel": 7.8
  }
}
```

### Get Health Trends

**GET** `/compliance/patient/:patientId/trends?days=30`

Response (200):

```json
{
  "success": true,
  "message": "Health trends retrieved successfully",
  "data": {
    "moodTrend": [
      { "date": "2024-01-01T00:00:00Z", "value": 7 },
      { "date": "2024-01-02T00:00:00Z", "value": 8 }
    ],
    "energyTrend": [
      { "date": "2024-01-01T00:00:00Z", "value": 7 },
      { "date": "2024-01-02T00:00:00Z", "value": 8 }
    ],
    "sleepTrend": [
      { "date": "2024-01-01T00:00:00Z", "value": 7 },
      { "date": "2024-01-02T00:00:00Z", "value": 8 }
    ]
  }
}
```

### Get Missed Medications Report

**GET** `/compliance/patient/:patientId/missed?days=30`

Response (200):

```json
{
  "success": true,
  "message": "Missed medications report retrieved successfully",
  "data": {
    "totalMissed": 3,
    "missedLogs": [
      {
        "_id": "507f1f77bcf86cd799439061",
        "medicationTaken": false,
        "reasonIfMissed": "forgot",
        "logDate": "2024-01-10T00:00:00Z"
      }
    ],
    "reasonBreakdown": {
      "forgot": 2,
      "too_busy": 1
    }
  }
}
```

---

## 6. Device (Smartwatch) Endpoints

### Register Device

**POST** `/devices`

Request:

```json
{
  "patientId": "507f1f77bcf86cd799439012",
  "deviceName": "Apple Watch Series 8",
  "deviceType": "smartwatch",
  "manufacturer": "Apple",
  "model": "Series 8",
  "serialNumber": "ABC123XYZ",
  "bluetoothAddress": "00:1A:7D:DA:71:13",
  "connectionType": "bluetooth",
  "supportedDataTypes": [
    "heart_rate",
    "steps",
    "sleep",
    "blood_pressure",
    "calories"
  ]
}
```

Response (201):

```json
{
  "success": true,
  "message": "Device registered successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439070",
    "deviceName": "Apple Watch Series 8",
    "isConnected": false,
    "batteryLevel": null
  }
}
```

### Sync Device Data (Smartwatch Data)

**POST** `/devices/:deviceId/sync`

This is the KEY endpoint for syncing smartwatch data:

Request:

```json
{
  "patientId": "507f1f77bcf86cd799439012",
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
        "deepSleep": 120,
        "lightSleep": 240,
        "remSleep": 120
      }
    },
    {
      "type": "activity",
      "timestamp": "2024-01-15T10:30:00Z",
      "data": {
        "steps": 5000,
        "distance": 3.5,
        "calories": 250,
        "duration": 60,
        "intensity": "medium"
      }
    },
    {
      "type": "glucose",
      "timestamp": "2024-01-15T08:00:00Z",
      "data": {
        "level": 95,
        "mealType": "fasting"
      }
    }
  ]
}
```

Response (201):

```json
{
  "success": true,
  "message": "Device data synced successfully",
  "data": {
    "deviceId": "507f1f77bcf86cd799439070",
    "syncedDataPoints": 5,
    "dataPoints": [
      {
        "_id": "507f1f77bcf86cd799439080",
        "dataType": "heart_rate",
        "heartRate": {
          "bpm": 75,
          "quality": "good"
        }
      }
    ]
  }
}
```

### Get Device Health Data

**GET** `/devices/:deviceId/data?page=1&limit=10&dataType=heart_rate`

Response (200):

```json
{
  "success": true,
  "message": "Device data retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439080",
      "dataType": "heart_rate",
      "dataTimestamp": "2024-01-15T10:30:00Z",
      "heartRate": {
        "bpm": 75,
        "quality": "good"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
```

### Get Device Health Summary

**GET** `/devices/:deviceId/health-summary?days=7`

Response (200):

```json
{
  "success": true,
  "message": "Device health summary retrieved successfully",
  "data": {
    "device": "Apple Watch Series 8",
    "dataTypes": ["heart_rate", "steps", "sleep"],
    "lastSync": "2024-01-15T10:30:00Z",
    "isConnected": true,
    "batteryLevel": 85,
    "heart_rate": {
      "bpm": 72,
      "quality": "good"
    },
    "steps": {
      "steps": 8500,
      "distance": 6.2
    },
    "sleep": {
      "duration": 420,
      "quality": "excellent"
    }
  }
}
```

### Update Battery Status

**PATCH** `/devices/:deviceId/battery`

Request:

```json
{
  "batteryLevel": 85,
  "batteryStatus": "charging"
}
```

---

## 7. Health Dashboard Endpoints

### Get Dashboard Overview

**GET** `/health-data/patient/:patientId/dashboard`

Response (200):

```json
{
  "success": true,
  "message": "Dashboard overview retrieved successfully",
  "data": {
    "activeMedications": 3,
    "activeReminders": 5,
    "todayLogsCount": 2,
    "complianceRate": 85,
    "complianceDays": 7,
    "latestHealthData": {
      "dataType": "heart_rate",
      "heartRate": {
        "bpm": 72
      }
    }
  }
}
```

### Get Medication Interactions

**GET** `/health-data/patient/:patientId/interactions`

Response (200):

```json
{
  "success": true,
  "message": "Medication interactions retrieved successfully",
  "data": {
    "medicationCount": 3,
    "interactions": [
      {
        "medications": ["Lisinopril", "NSAIDs"],
        "severity": "moderate",
        "recommendation": "Consult with healthcare provider"
      }
    ],
    "medications": [
      {
        "id": "507f1f77bcf86cd799439050",
        "name": "Lisinopril",
        "dosage": "10 mg"
      }
    ]
  }
}
```

---

## Error Responses

### Invalid Request (400)

```json
{
  "success": false,
  "message": "Validation error",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "message": "Invalid or expired token",
  "code": "INVALID_TOKEN"
}
```

### Not Found (404)

```json
{
  "success": false,
  "message": "Patient not found",
  "code": "PATIENT_NOT_FOUND"
}
```

### Server Error (500)

```json
{
  "success": false,
  "message": "Internal server error",
  "code": "INTERNAL_SERVER_ERROR"
}
```

---

## Response Format

All responses follow a consistent format:

```json
{
  "success": true/false,
  "message": "Description of the response",
  "code": "OPTIONAL_ERROR_CODE",
  "data": {},
  "pagination": {},
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Testing with cURL

### Register

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

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

### Get Patient Profile

```bash
curl -X GET http://localhost:5000/api/patients/PATIENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Sync Device Data

```bash
curl -X POST http://localhost:5000/api/devices/DEVICE_ID/sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "patientId": "PATIENT_ID",
    "dataPoints": [
      {
        "type": "heart_rate",
        "timestamp": "2024-01-15T10:30:00Z",
        "data": {"bpm": 75, "quality": "good"}
      }
    ]
  }'
```

---

**End of Documentation**

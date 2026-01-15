# 🏥 Medicus System Architecture

## 📊 Database Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         MONGODB ATLAS                            │
│                     medicus_db Database                          │
│                                                                   │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │  doctors    │    │  patients    │    │  prescriptions   │  │
│  │             │    │              │    │                  │  │
│  │ • fullName  │    │ • fullName   │    │ • prescCode      │  │
│  │ • email     │    │ • email      │    │ • diagnosis      │  │
│  │ • phone     │    │ • age        │    │ • medications[]  │  │
│  │ • license   │    │ • gender     │    │ • patient (ref)  │  │
│  │ • password  │    │ • bloodType  │    │ • doctor (ref)   │  │
│  └──────┬──────┘    │ • allergies  │    │ • status         │  │
│         │           │ • conditions │    │ • date           │  │
│         │           └──────┬───────┘    └─────────┬────────┘  │
│         │                  │                      │            │
│         │                  │                      │            │
│         └──────────────────┼──────────────────────┘            │
│                            │                                    │
└────────────────────────────┼────────────────────────────────────┘
                             │
                             │ API Calls
                             │
┌────────────────────────────┼────────────────────────────────────┐
│                    BACKEND SERVER                                │
│                (Express + Mongoose)                              │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    API ENDPOINTS                            │ │
│  │                                                              │ │
│  │  Authentication:                                            │ │
│  │  POST /api/auth/register/doctor                            │ │
│  │  POST /api/auth/login                                       │ │
│  │                                                              │ │
│  │  Patient Management:                                        │ │
│  │  GET  /api/patient/:id                                      │ │
│  │  POST /api/patient                                          │ │
│  │  GET  /api/patient/:id/history                             │ │
│  │                                                              │ │
│  │  Prescription Management:                                   │ │
│  │  GET  /api/prescription/recent                              │ │
│  │  POST /api/prescription                                     │ │
│  │  GET  /api/prescription/:id                                 │ │
│  │  PUT  /api/prescription/:id/status                          │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────────┼────────────────────────────────────┘
                             │
                             │ HTTP Requests
                             │
┌────────────────────────────┼────────────────────────────────────┐
│                       FRONTEND (React)                           │
│                                                                   │
│  ┌────────────────────┐                                         │
│  │   api.js Service   │                                         │
│  │                    │                                         │
│  │ • registerDoctor() │                                         │
│  │ • loginUser()      │                                         │
│  │ • getPatient()     │◄────┐                                  │
│  │ • createPatient()  │     │                                  │
│  │ • getHistory()     │     │                                  │
│  │ • getPrescriptions()│    │                                  │
│  │ • createPrescription()   │                                  │
│  └────────────────────┘     │                                  │
│                              │                                  │
│  ┌──────────────────────────┴───────────────────────────────┐ │
│  │                 COMPONENTS                                 │ │
│  │                                                             │ │
│  │  Doctorreg.jsx    → Registers doctor                      │ │
│  │  Doctorlog.jsx    → Login, get JWT token                 │ │
│  │  Doctordash.jsx   → Search patient by ID                 │ │
│  │  Diagnosis.jsx    → View patient, create prescription    │ │
│  │  Recentpes.jsx    → View doctor's prescriptions          │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 User Flow: Create Prescription

```
┌────────────┐
│   Doctor   │
│   Login    │
└──────┬─────┘
       │
       │ POST /api/auth/login
       │ Returns: JWT token
       ▼
┌─────────────────┐
│  Dashboard      │
│  Enter Patient  │
│  ID             │
└──────┬──────────┘
       │
       │ GET /api/patient/:id
       │ Returns: Patient data
       ▼
┌─────────────────────┐
│  Diagnosis Page     │
│                     │
│  • View patient info│◄─── GET /api/patient/:id/history
│  • See history      │     (Shows past prescriptions)
│  • Fill diagnosis   │
│  • Add medications  │
└──────┬──────────────┘
       │
       │ User clicks "Send to Pharmacy"
       ▼
┌─────────────────────┐
│ Confirmation Modal  │
│                     │
│  • Patient details  │
│  • Diagnosis        │
│  • Medications      │
└──────┬──────────────┘
       │
       │ User confirms
       │ POST /api/prescription
       │ Body: {
       │   patient: patientId,
       │   diagnosis: {...},
       │   medications: [...]
       │ }
       ▼
┌─────────────────────┐
│   MongoDB Saves:    │
│                     │
│  Prescription Doc   │
│  • Code: RX0001     │
│  • Patient ref      │
│  • Doctor ref       │
│  • Medications      │
│  • Date             │
│  • Status: Active   │
└──────┬──────────────┘
       │
       │ Success!
       ▼
┌─────────────────────┐
│ Recent Prescriptions│
│ Page                │
│                     │
│ Shows new RX0001    │
└─────────────────────┘
```

---

## 📋 Data Relationships

```
┌──────────────┐
│    Doctor    │
│              │
│ _id: abc123  │
│ name: "..."  │
└──────┬───────┘
       │
       │ Creates ───────────────┐
       │                        │
       │                        ▼
       │              ┌──────────────────┐
       │              │  Prescription    │
       │              │                  │
       │              │ doctor: abc123 ──┘
       │              │ patient: xyz789 ─┐
       │              │ code: RX0001     │
       │              │ medications: []  │
       │              └──────────────────┘
       │                        │
       │                        │ Belongs to
       │                        │
       │                        ▼
       │              ┌──────────────────┐
       │              │     Patient      │
       │              │                  │
       │              │ _id: xyz789      │
       └─Registered───│ name: "..."      │
                      │ age: 25          │
                      │ allergies: []    │
                      └──────────────────┘
```

**Key Points:**
- Each Prescription **references** a Patient (via patient field)
- Each Prescription **references** a Doctor (via doctor field)
- Each Patient can have **multiple** Prescriptions
- Each Doctor can create **multiple** Prescriptions

---

## 🔐 Authentication Flow

```
1. Doctor Registration
   ┌──────────────────────────────────────────┐
   │ Doctorreg.jsx                            │
   │  • User fills form                       │
   │  • Password hashed by bcrypt             │
   │  • Saved to doctors collection           │
   │  • JWT token generated and returned      │
   └──────────────────────────────────────────┘

2. Doctor Login
   ┌──────────────────────────────────────────┐
   │ Doctorlog.jsx                            │
   │  • Enter email + password                │
   │  • Backend verifies password             │
   │  • JWT token generated                   │
   │  • Token stored in localStorage          │
   └──────────────────────────────────────────┘

3. Protected API Calls
   ┌──────────────────────────────────────────┐
   │ Every request to patient/prescription    │
   │  • Includes: Authorization: Bearer TOKEN │
   │  • Middleware verifies token             │
   │  • Extracts doctor ID from token         │
   │  • Allows request to proceed             │
   └──────────────────────────────────────────┘
```

---

## 📂 File Organization

```
Medicus-main/
│
├── backend/
│   ├── models/
│   │   ├── Doctor.js          ← Schema for doctors
│   │   ├── Patient.js         ← Schema for patients    🆕
│   │   └── Prescription.js    ← Schema for prescriptions 🆕
│   │
│   ├── routes/
│   │   ├── auth.js            ← Login/Register
│   │   ├── doctor.js          ← Doctor profile
│   │   ├── patient.js         ← Patient CRUD          🆕
│   │   └── prescription.js    ← Prescription CRUD     🆕
│   │
│   ├── middleware/
│   │   └── auth.js            ← JWT verification
│   │
│   ├── config/
│   │   └── database.js        ← MongoDB connection
│   │
│   ├── scripts/
│   │   └── seedPatients.js    ← Add test data        🆕
│   │
│   ├── .env                   ← Environment variables
│   ├── package.json
│   └── server.js              ← Express app
│
└── src/
    ├── services/
    │   └── api.js             ← API functions         🆕 Updated
    │
    ├── components/
    │   ├── Doctorreg/         ← Doctor registration
    │   ├── Doctorlog/         ← Doctor login
    │   ├── Doctordash/
    │   │   ├── Doctordash.jsx ← Dashboard
    │   │   └── Recentpes.jsx  ← Recent prescriptions 🆕 Updated
    │   │
    │   └── Diagnosispage/
    │       └── Diagnosis.jsx  ← Patient view + create Rx 🆕 Updated
    │
    └── context/
        └── AuthContext.jsx    ← User state management
```

---

## 🎯 Component Responsibilities

| Component | Purpose | DB Interactions |
|-----------|---------|-----------------|
| **Doctorreg.jsx** | Doctor registration form | POST /api/auth/register/doctor |
| **Doctorlog.jsx** | Doctor login | POST /api/auth/login |
| **Doctordash.jsx** | Search patient by ID | None (just navigation) |
| **Diagnosis.jsx** | View patient, create prescription | GET /api/patient/:id<br>GET /api/patient/:id/history<br>POST /api/prescription |
| **Recentpes.jsx** | View doctor's prescriptions | GET /api/prescription/recent |

---

## 💾 Sample Data Structure

### Patient in Database
```json
{
  "_id": "6789abc123",
  "fullName": "Sinlam Ahmed",
  "email": "sinlam@example.com",
  "phone": "1234567890",
  "dob": "1999-05-15T00:00:00.000Z",
  "age": 25,
  "gender": "Male",
  "bloodType": "A+",
  "allergies": ["Penicillin", "Sulfa drugs"],
  "chronicConditions": ["Hypertension"],
  "address": {
    "street": "123 Main St",
    "city": "Dhaka",
    "state": "Dhaka Division",
    "zipCode": "1000"
  },
  "createdAt": "2026-01-16T...",
  "updatedAt": "2026-01-16T..."
}
```

### Prescription in Database
```json
{
  "_id": "1234def456",
  "prescriptionCode": "RX0001",
  "patient": "6789abc123",
  "doctor": "5678ghi789",
  "diagnosis": {
    "condition": "Common Cold",
    "symptoms": ["Fever", "Cough"],
    "notes": "Rest and fluids"
  },
  "medications": [
    {
      "name": "Paracetamol",
      "dosage": "500mg",
      "frequency": "3 times daily",
      "duration": "5 days",
      "instructions": "Take after meals"
    }
  ],
  "status": "Active",
  "prescriptionDate": "2026-01-16T...",
  "createdAt": "2026-01-16T...",
  "updatedAt": "2026-01-16T..."
}
```

---

## ✅ Testing Checklist

- [ ] Backend server starts successfully
- [ ] MongoDB connection established
- [ ] Sample patients added via seed script
- [ ] Doctor can register
- [ ] Doctor can login
- [ ] Doctor can search patient by ID
- [ ] Patient profile displays correctly
- [ ] Patient history shows past prescriptions
- [ ] Doctor can create new prescription
- [ ] Prescription saves to database
- [ ] Recent prescriptions page shows all prescriptions
- [ ] Prescription codes auto-generate (RX0001, RX0002...)

---

**🎉 Your Medicus app now has a complete database-integrated patient and prescription management system!**

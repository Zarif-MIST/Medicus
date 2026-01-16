# 🎯 API Quick Reference - All Endpoints

## Authentication Endpoints

### Doctor Authentication
```bash
# Register Doctor
POST http://localhost:5000/api/auth/register/doctor
Content-Type: application/json

{
  "fullName": "Dr. Ahmed",
  "email": "doctor@example.com",
  "phone": "1234567890",
  "dob": "1990-01-01",
  "license": "MD12345",
  "password": "password123"
}

# Response:
{
  "success": true,
  "data": {
    "id": "...",
    "fullName": "Dr. Ahmed",
    "email": "doctor@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiI..."
}
```

```bash
# Login Doctor
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "doctor@example.com",
  "password": "password123",
  "role": "Doctor"
}
```

### Pharmacist Authentication ✨
```bash
# Register Pharmacist
POST http://localhost:5000/api/auth/register/pharmacist
Content-Type: application/json

{
  "fullName": "Ahmed Khan",
  "email": "pharmacist@pharmacy.com",
  "phone": "0123456789",
  "pharmacyLicense": "PH12345",
  "password": "password123",
  "pharmacy": {
    "name": "City Pharmacy",
    "address": "123 Pharmacy St",
    "phone": "0123456789"
  }
}
```

```bash
# Login Pharmacist
POST http://localhost:5000/api/auth/login-pharmacist
Content-Type: application/json

{
  "email": "pharmacist@pharmacy.com",
  "password": "password123"
}
```

### Patient Authentication ✨
```bash
# Register Patient
POST http://localhost:5000/api/auth/register/patient
Content-Type: application/json

{
  "fullName": "Sinlam Ahmed",
  "email": "patient@example.com",
  "phone": "1234567890",
  "password": "password123"
}
```

```bash
# Login Patient
POST http://localhost:5000/api/auth/login-patient
Content-Type: application/json

{
  "email": "patient@example.com",
  "password": "password123"
}
```

---

## Patient Management Endpoints

### Get Patient Details
```bash
GET http://localhost:5000/api/patient/PATIENT_ID
Headers:
  Authorization: Bearer TOKEN
  Content-Type: application/json

# Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "fullName": "Sinlam Ahmed",
    "email": "sinlam@example.com",
    "age": 25,
    "gender": "Male",
    "bloodType": "A+",
    "allergies": ["Penicillin"],
    "chronicConditions": ["Hypertension"]
  }
}
```

### Create Patient
```bash
POST http://localhost:5000/api/patient
Headers:
  Authorization: Bearer TOKEN
  Content-Type: application/json

{
  "fullName": "Sinlam Ahmed",
  "email": "sinlam@example.com",
  "phone": "1234567890",
  "dob": "1999-05-15",
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
  }
}
```

### Get Patient Prescription History
```bash
GET http://localhost:5000/api/patient/PATIENT_ID/history
Headers:
  Authorization: Bearer TOKEN

# Response:
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "prescriptionCode": "RX0001",
      "diagnosis": "Common Cold",
      "medications": [...],
      "status": "Active",
      "prescriptionDate": "2026-01-16T..."
    },
    {
      "_id": "...",
      "prescriptionCode": "RX0002",
      "diagnosis": "Fever",
      "medications": [...],
      "status": "Completed",
      "prescriptionDate": "2026-01-15T..."
    }
  ]
}
```

---

## Prescription Management Endpoints

### Create Prescription
```bash
POST http://localhost:5000/api/prescription
Headers:
  Authorization: Bearer TOKEN
  Content-Type: application/json

{
  "patient": "PATIENT_ID",
  "diagnosis": {
    "condition": "Common Cold",
    "symptoms": ["Fever", "Cough"],
    "notes": "Rest and fluids recommended"
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
  "status": "Active"
}

# Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "prescriptionCode": "RX0001",
    "patient": {...},
    "doctor": {...},
    "diagnosis": {...},
    "medications": [...],
    "status": "Active"
  }
}
```

### Get Doctor's Recent Prescriptions
```bash
GET http://localhost:5000/api/prescription/recent?limit=10
Headers:
  Authorization: Bearer TOKEN

# Response:
{
  "success": true,
  "count": 3,
  "data": [
    {
      "prescriptionCode": "RX0001",
      "patient": { "fullName": "Sinlam Ahmed" },
      "diagnosis": "Common Cold",
      "medications": [...],
      "status": "Active",
      "prescriptionDate": "2026-01-16T..."
    }
  ]
}
```

### Get Prescription Details
```bash
GET http://localhost:5000/api/prescription/PRESCRIPTION_ID
Headers:
  Authorization: Bearer TOKEN
```

### Update Prescription Status
```bash
PUT http://localhost:5000/api/prescription/PRESCRIPTION_ID/status
Headers:
  Authorization: Bearer TOKEN
  Content-Type: application/json

{
  "status": "Completed"  // or "Cancelled"
}
```

---

## Pharmacist Endpoints ✨

### Get All Active Prescriptions
```bash
GET http://localhost:5000/api/pharmacist/prescriptions?status=Active
Headers:
  Authorization: Bearer PHARMACIST_TOKEN

# Returns all prescriptions waiting to be fulfilled
```

### Get Prescription Details (Pharmacist View)
```bash
GET http://localhost:5000/api/pharmacist/prescriptions/PRESCRIPTION_ID
Headers:
  Authorization: Bearer PHARMACIST_TOKEN

# Response includes:
{
  "prescriptionCode": "RX0001",
  "patient": {
    "fullName": "Sinlam Ahmed",
    "age": 25,
    "allergies": ["Penicillin"],
    "phone": "1234567890"
  },
  "doctor": {
    "fullName": "Dr. Ahmed",
    "license": "MD12345",
    "email": "doctor@example.com"
  },
  "diagnosis": {...},
  "medications": [...]
}
```

### Mark Prescription as Fulfilled
```bash
PUT http://localhost:5000/api/pharmacist/prescriptions/PRESCRIPTION_ID/status
Headers:
  Authorization: Bearer PHARMACIST_TOKEN
  Content-Type: application/json

{
  "status": "Completed"
}
```

---

## Patient Portal Endpoints ✨

### Get Own Prescriptions
```bash
GET http://localhost:5000/api/patient-portal/my-prescriptions
Headers:
  Authorization: Bearer PATIENT_TOKEN

# Response:
{
  "success": true,
  "count": 2,
  "data": [
    {
      "prescriptionCode": "RX0001",
      "diagnosis": "Common Cold",
      "medications": [
        {
          "name": "Paracetamol",
          "dosage": "500mg",
          "frequency": "3 times daily",
          "duration": "5 days"
        }
      ],
      "doctor": {
        "fullName": "Dr. Ahmed",
        "license": "MD12345"
      },
      "status": "Active",
      "prescriptionDate": "2026-01-16T..."
    }
  ]
}
```

### Get Prescription Details (Patient View)
```bash
GET http://localhost:5000/api/patient-portal/prescriptions/PRESCRIPTION_ID
Headers:
  Authorization: Bearer PATIENT_TOKEN

# Shows prescription with doctor and medication details
```

### Get Patient Profile
```bash
GET http://localhost:5000/api/patient-portal/profile
Headers:
  Authorization: Bearer PATIENT_TOKEN

# Returns patient's own profile info
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Patient not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error",
  "error": "..."
}
```

---

## Testing with cURL

```bash
# Register Doctor
curl -X POST http://localhost:5000/api/auth/register/doctor \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Dr. Ahmed",
    "email": "doctor@example.com",
    "phone": "1234567890",
    "dob": "1990-01-01",
    "license": "MD12345",
    "password": "password123"
  }'

# Login Doctor
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "doctor@example.com",
    "password": "password123",
    "role": "Doctor"
  }'

# Get Patient
curl -X GET http://localhost:5000/api/patient/PATIENT_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"
```

---

## Example Complete Flow

### 1. Doctor registers & logs in
```
POST /api/auth/register/doctor → Get TOKEN
POST /api/auth/login → Confirm TOKEN
```

### 2. Doctor creates prescription
```
POST /api/patient → Create/Get patient
POST /api/prescription → Create prescription with RX code
```

### 3. Pharmacist sees prescription
```
POST /api/auth/login-pharmacist → Get PHARMACIST_TOKEN
GET /api/pharmacist/prescriptions → See all RX codes
GET /api/pharmacist/prescriptions/RX0001 → See details
PUT /api/pharmacist/prescriptions/RX0001/status → Mark done
```

### 4. Patient sees prescription
```
POST /api/auth/register/patient → Register
POST /api/auth/login-patient → Get PATIENT_TOKEN
GET /api/patient-portal/my-prescriptions → See all prescriptions
GET /api/patient-portal/prescriptions/RX0001 → See details
```

---

**Ready to test! Start your backend and test these endpoints!** 🚀

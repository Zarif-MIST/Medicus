# 🏥 Medicus - Patient & Prescription Database Integration

## ✅ What We Just Created

### **Backend Models (Database Schemas)**
1. **Patient.js** - Stores patient information
   - Basic info: name, email, phone, DOB, age, gender, blood type
   - Medical info: allergies, chronic conditions, medical history
   - Tracks prescription count
   
2. **Prescription.js** - Stores prescription records
   - Links to patient and doctor
   - Auto-generates prescription codes (RX0001, RX0002, etc.)
   - Contains diagnosis, medications, lab tests
   - Tracks status (Active/Completed/Cancelled)

### **Backend Routes (API Endpoints)**
3. **patient.js** routes:
   - `GET /api/patient/:id` - Get patient details
   - `POST /api/patient` - Create new patient
   - `GET /api/patient/:id/history` - Get patient's prescription history

4. **prescription.js** routes:
   - `GET /api/prescription/recent` - Get doctor's recent prescriptions
   - `POST /api/prescription` - Create new prescription
   - `GET /api/prescription/:id` - Get prescription details
   - `PUT /api/prescription/:id/status` - Update prescription status

### **Frontend Integration**
5. **api.js** - Added API functions:
   - `getPatient()` - Fetch patient data
   - `createPatient()` - Add new patient
   - `getPatientHistory()` - Get patient's prescriptions
   - `getRecentPrescriptions()` - Get doctor's recent prescriptions
   - `createPrescription()` - Save new prescription
   - `updatePrescriptionStatus()` - Update prescription

6. **Updated Components**:
   - **Recentpes.jsx** - Now fetches REAL prescriptions from database
   - **Diagnosis.jsx** - Now fetches REAL patient data and saves prescriptions to database

---

## 🚀 How It Works

### **Flow 1: View Patient Profile with History**

```
1. Doctor searches patient ID on dashboard
2. App fetches patient data from MongoDB (/api/patient/:id)
3. App fetches prescription history (/api/patient/:id/history)
4. Displays:
   - Patient basic info (name, age, gender, blood type)
   - Allergies and chronic conditions
   - Past prescriptions with dates and medications
```

### **Flow 2: Create New Prescription**

```
1. Doctor fills diagnosis form
2. Adds medications to prescription
3. Clicks "Send to Pharmacy"
4. Confirmation modal shows patient details
5. Doctor confirms
6. App saves prescription to MongoDB (/api/prescription)
7. Prescription auto-generates code (RX0001, RX0002...)
8. Links prescription to patient and doctor
9. Redirects to Recent Prescriptions page
```

### **Flow 3: View Recent Prescriptions**

```
1. Doctor navigates to Recent Prescriptions
2. App fetches prescriptions from MongoDB (/api/prescription/recent)
3. Displays list with:
   - Prescription code
   - Patient name
   - Medications
   - Date
   - Status (Active/Completed)
```

---

## 📁 Where Everything Is Located

```
backend/
├── models/
│   ├── Doctor.js           ✅ (Already existed)
│   ├── Patient.js          🆕 NEW - Patient schema
│   └── Prescription.js     🆕 NEW - Prescription schema
│
├── routes/
│   ├── auth.js             ✅ (Already existed)
│   ├── doctor.js           ✅ (Already existed)
│   ├── patient.js          🆕 NEW - Patient endpoints
│   └── prescription.js     🆕 NEW - Prescription endpoints
│
├── scripts/
│   └── seedPatients.js     🆕 NEW - Add sample patients
│
└── server.js               📝 UPDATED - Added new routes

src/
├── services/
│   └── api.js              📝 UPDATED - Added patient & prescription functions
│
└── components/
    ├── Diagnosispage/
    │   └── Diagnosis.jsx   📝 UPDATED - Fetches real patient data, saves prescriptions
    │
    └── Doctordash/
        └── Recentpes.jsx   📝 UPDATED - Fetches real prescriptions from DB
```

---

## 🧪 Testing Your Setup

### **Step 1: Start Backend Server**

```bash
cd d:\Downloads\Medicus-main\backend
npm start
```

**Expected Output:**
```
✅ MongoDB Connected
Server running on port 5000
```

### **Step 2: Add Sample Patients**

```bash
cd d:\Downloads\Medicus-main\backend
node scripts/seedPatients.js
```

**Expected Output:**
```
✅ Connected to MongoDB
Inserting sample patients...
✅ Successfully added 4 patients!

Patient IDs (use these to search):
- Sinlam Ahmed: 6789abc123def456...
- Kuddus Rahman: 1234def789abc012...
- Shafi Ahmed: 5678ghi345jkl678...
- Ayesha Begum: 9012mno567pqr890...
```

**Copy one of these Patient IDs!**

### **Step 3: Start Frontend**

```bash
cd d:\Downloads\Medicus-main
npm start
```

### **Step 4: Test the Flow**

1. **Login as Doctor**
   - Go to `http://localhost:3000/doctorlogin`
   - Enter your registered doctor credentials
   - Select "Doctor" role

2. **Search Patient**
   - On dashboard, paste the Patient ID from Step 2
   - Click Search

3. **View Patient Profile**
   - ✅ See patient's real data from database
   - ✅ See allergies, blood type, chronic conditions
   - ✅ See prescription history (empty at first)

4. **Create Prescription**
   - Fill diagnosis text
   - Add medications (name, dosage, frequency, duration)
   - Click "Send to Pharmacy"
   - Confirm in modal
   - ✅ Prescription saved to database!

5. **View Recent Prescriptions**
   - Click "Recent Prescriptions" button
   - ✅ See your newly created prescription!
   - ✅ Shows prescription code (RX0001)
   - ✅ Shows patient name from database
   - ✅ Shows medications
   - ✅ Shows date and status

---

## 🗄️ Database Structure

### **MongoDB Collections**

Your database now has **3 collections**:

```
medicus_db/
├── doctors          (your registered doctors)
├── patients         (patient profiles)
└── prescriptions    (prescription records with medications)
```

### **Relationships**

```
Doctor ─────┐
            ├─→ Prescription ───→ Patient
            │
            └─→ Patient (registered by)
```

**Example Data in MongoDB:**

```javascript
// Patient Document
{
  _id: "6789abc...",
  fullName: "Sinlam Ahmed",
  email: "sinlam@example.com",
  age: 25,
  bloodType: "A+",
  allergies: ["Penicillin"],
  chronicConditions: ["Hypertension"],
  ...
}

// Prescription Document
{
  _id: "1234def...",
  prescriptionCode: "RX0001",
  patient: "6789abc...",      // References Patient above
  doctor: "5678ghi...",        // References logged-in Doctor
  diagnosis: {
    condition: "Common Cold",
    symptoms: ["Fever", "Cough"]
  },
  medications: [
    {
      name: "Paracetamol",
      dosage: "500mg",
      frequency: "3 times daily",
      duration: "5 days"
    }
  ],
  status: "Active",
  prescriptionDate: "2026-01-16T..."
}
```

---

## 🎯 Key Features Implemented

✅ **Patient Profile System**
- Store complete patient information
- Track allergies and chronic conditions
- Calculate age automatically
- Link to prescriptions

✅ **Prescription Management**
- Auto-generate prescription codes (RX0001, RX0002...)
- Link prescriptions to patients and doctors
- Store multiple medications per prescription
- Track prescription status

✅ **Prescription History**
- View all past prescriptions for a patient
- See who prescribed it (doctor info)
- Track dates and statuses
- Display in diagnosis page

✅ **Recent Prescriptions Dashboard**
- Doctor sees only their prescriptions
- Real-time data from database
- Clickable prescription cards
- Shows patient names automatically

---

## 🔐 Security Features

- ✅ All patient/prescription routes require authentication
- ✅ JWT token validation on every request
- ✅ Doctors can only see prescriptions they created
- ✅ Patient data protected behind auth middleware

---

## 📝 Next Steps (Optional Enhancements)

1. **Patient Registration Page** - Create UI to add new patients
2. **Search by Name** - Allow searching patients by name, not just ID
3. **Edit Prescriptions** - Allow updating prescription details
4. **Print Prescription** - Generate PDF for printing
5. **Patient Dashboard** - Let patients view their own prescriptions
6. **Pharmacy Integration** - Let pharmacies view and fulfill prescriptions

---

## ❓ Troubleshooting

**Problem: "Failed to fetch patient"**
- Ensure backend is running
- Check Patient ID is valid (copy from seed script output)
- Verify token is stored in localStorage

**Problem: "Prescription not showing in Recent Prescriptions"**
- Ensure you're logged in as the doctor who created it
- Check prescription was saved (look for success message)
- Try refreshing the page

**Problem: "Cannot read property 'fullName' of null"**
- Patient might not exist in database
- Run seed script again: `node scripts/seedPatients.js`

---

## 🎉 Summary

Your Medicus app now has a **complete patient and prescription management system** connected to MongoDB! 

- ✅ Patients stored in database with medical history
- ✅ Prescriptions linked to patients and doctors
- ✅ Diagnosis page fetches real patient data
- ✅ Recent prescriptions page shows real prescriptions
- ✅ Prescription history visible in patient profile

**Everything is connected and working with your MongoDB database!** 🚀

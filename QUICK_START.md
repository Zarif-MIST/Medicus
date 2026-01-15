# 🚀 Quick Start Guide - Database Testing

## Step-by-Step Testing Instructions

### 1️⃣ Start Backend Server

```bash
cd d:\Downloads\Medicus-main\backend
npm start
```

**Expected:**
```
✅ MongoDB Connected
Server running on port 5000
```

---

### 2️⃣ Add Sample Patients to Database

```bash
cd d:\Downloads\Medicus-main\backend
node scripts/seedPatients.js
```

**Expected:**
```
✅ Successfully added 4 patients!

Patient IDs (COPY THESE):
- Sinlam Ahmed: 67897abc123def456...
- Kuddus Rahman: 1234def789abc012...
- Shafi Ahmed: 5678ghi345jkl678...
- Ayesha Begum: 9012mno567pqr890...
```

**📋 COPY ONE PATIENT ID - You'll need it for testing!**

---

### 3️⃣ Start Frontend

Open a **NEW terminal**:

```bash
cd d:\Downloads\Medicus-main
npm start
```

**Opens:** `http://localhost:3000`

---

### 4️⃣ Register as Doctor

1. Go to: `http://localhost:3000/register/doctor`
2. Fill the form:
   - Full Name: `Dr. Your Name`
   - Email: `yourname@example.com`
   - Phone: `1234567890` (10 digits)
   - Date of Birth: `1990-01-01`
   - Medical License: `MD12345`
   - Password: `password123` (minimum 6 chars)
3. Click **Register**
4. **Success!** → Redirects to dashboard

---

### 5️⃣ Search for Patient

1. On Dashboard, find "Patient Lookup" section
2. **Paste the Patient ID** you copied in Step 2
3. Click **Search** 🔍

---

### 6️⃣ View Patient Profile with History

You should now see:

✅ **Patient Information:**
- Name: Sinlam Ahmed (or whichever patient you searched)
- Age: 25
- Gender: Male
- Blood Type: A+

✅ **Medical Details:**
- Allergies: Penicillin, Sulfa drugs
- Chronic Conditions: Hypertension

✅ **Prescription History:**
- (Empty at first - you'll create the first one!)

---

### 7️⃣ Create Prescription

1. **Fill Diagnosis:**
   ```
   Patient presents with common cold symptoms. Recommended rest and medication.
   ```

2. **Click "+ Add Medicine"**

3. **Fill Medication Form:**
   - Medicine Name: `Paracetamol`
   - Dosage: `500mg`
   - Quantity: `15 tablets`
   - Frequency: `3 times daily`
   - Duration: `5 days`

4. **Click "Add"** - Medicine appears in list

5. **Add another medication (optional):**
   - Medicine Name: `Amoxicillin`
   - Dosage: `250mg`
   - Quantity: `21 capsules`
   - Frequency: `3 times daily`
   - Duration: `7 days`

6. **Click "Send to Pharmacy"** button

---

### 8️⃣ Confirm Prescription

A modal appears showing:
- ✅ Patient details
- ✅ Diagnosis
- ✅ All medications

**Click "Confirm & Send"**

**Success Message:** "Prescription created successfully!"

**Redirects to:** Recent Prescriptions page

---

### 9️⃣ View Recent Prescriptions

You should now see:

```
RX0001 - Sinlam Ahmed
├─ Paracetamol 500mg
├─ Amoxicillin 250mg
├─ Diagnosis: Patient presents with common cold...
└─ Date: Jan 16, 2026  |  Status: Active
```

---

### 🔟 Verify in Database (Optional)

**Using MongoDB Compass:**
1. Open MongoDB Compass
2. Connect to your cluster
3. Navigate to `medicus_db` database
4. Check collections:
   - `patients` - See your 4 sample patients
   - `prescriptions` - See your newly created prescription
   - `doctors` - See your registered doctor

**What to look for:**
- Prescription has `patient` field matching Patient ID
- Prescription has `doctor` field matching your Doctor ID
- Medications array contains both medicines
- `prescriptionCode` is "RX0001"

---

## 🎯 What Each File Does

| File | What It Does |
|------|--------------|
| **backend/models/Patient.js** | Defines how patient data is structured in MongoDB |
| **backend/models/Prescription.js** | Defines prescription structure, auto-generates RX codes |
| **backend/routes/patient.js** | API endpoints for patient operations |
| **backend/routes/prescription.js** | API endpoints for prescription operations |
| **backend/server.js** | Connects routes to Express app |
| **src/services/api.js** | Frontend functions that call backend APIs |
| **src/components/Diagnosispage/Diagnosis.jsx** | Fetches patient data, creates prescriptions |
| **src/components/Doctordash/Recentpes.jsx** | Displays doctor's prescriptions from database |

---

## 🔍 Understanding the Flow

### When you search a patient:

```
Frontend (Diagnosis.jsx)
    ↓
    Calls: getPatient(patientId)
    ↓
API Layer (api.js)
    ↓
    Sends: GET http://localhost:5000/api/patient/6789abc...
    ↓
Backend (routes/patient.js)
    ↓
    Queries: Patient.findById(patientId)
    ↓
MongoDB
    ↓
    Returns patient document
    ↓
Frontend displays: Patient info, allergies, history
```

### When you create prescription:

```
Frontend (Diagnosis.jsx)
    ↓
    Calls: createPrescription(data)
    ↓
API Layer (api.js)
    ↓
    Sends: POST http://localhost:5000/api/prescription
    Body: { patient, doctor, diagnosis, medications }
    ↓
Backend (routes/prescription.js)
    ↓
    Creates: new Prescription({ ...data, doctor: loggedInDoctorId })
    ↓
MongoDB
    ↓
    Saves prescription document
    Auto-generates RX0001
    ↓
Frontend shows: Success! Redirects to recent prescriptions
```

---

## 🐛 Common Issues

### ❌ "Failed to fetch patient"
**Cause:** Patient ID doesn't exist in database  
**Fix:** 
1. Run seed script again: `node scripts/seedPatients.js`
2. Copy a Patient ID from output
3. Use that ID in search

### ❌ "401 Unauthorized"
**Cause:** JWT token expired or missing  
**Fix:**
1. Log out
2. Log in again
3. Try again

### ❌ "Cannot read property 'fullName' of null"
**Cause:** Patient data not loaded yet  
**Fix:** 
1. Wait for loading to complete
2. Check console for errors
3. Verify Patient ID is correct

### ❌ Backend crashes with "Invalid scheme"
**Cause:** MONGODB_URI in .env has wrong format  
**Fix:**
Check `.env` file has proper connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/medicus_db?retryWrites=true&w=majority
```

---

## 📊 Data You'll See

### After Step 2 (Seed Patients):
- **4 patients in database**
- Can search any of them by ID

### After Step 7 (Create Prescription):
- **1 prescription in database** (RX0001)
- Linked to selected patient
- Linked to logged-in doctor
- Contains medications

### After Creating More Prescriptions:
- RX0001, RX0002, RX0003...
- Each new prescription increments code
- All show in Recent Prescriptions

---

## ✅ Success Checklist

- [x] Backend models created (Patient, Prescription)
- [x] Backend routes created (patient, prescription)
- [x] Frontend API functions added
- [x] Diagnosis page fetches real patient data
- [x] Prescriptions save to database
- [x] Recent prescriptions fetch from database
- [x] Seed script adds test patients
- [x] Prescription codes auto-generate

---

## 🎉 You're All Set!

Your Medicus application now:
- ✅ Stores patients in MongoDB
- ✅ Stores prescriptions in MongoDB
- ✅ Links prescriptions to patients and doctors
- ✅ Shows patient history
- ✅ Auto-generates prescription codes
- ✅ Tracks prescription status

**Test it thoroughly and see the data flow from frontend → backend → MongoDB!** 🚀

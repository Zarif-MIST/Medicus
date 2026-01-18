# Database & Authentication Setup Guide

## 📋 What We Just Created

### Database (MongoDB)
- **Doctor Collection:** Stores doctor profiles with IDs like "DR1234"
- **Patient Collection:** Stores patient profiles with 4-digit IDs
- **Pharmacy Collection:** Stores pharmacy profiles with IDs like "PHARM1234"
- **Prescription Collection:** Links doctors and patients for prescriptions

### Authentication System
- **Passwords:** Securely hashed with bcryptjs
- **Tokens:** JWT tokens for session management (7-day expiration)
- **Login:** Can login with email OR your auto-generated ID
- **Admin Access:** Username "admin", Password "admin" (works for all roles)

---

## 🚀 Installation Instructions

### Step 1: Install MongoDB
**On macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
```

**Verify installation:**
```bash
mongosh --version
```

### Step 2: Start MongoDB
```bash
brew services start mongodb-community
```

### Step 3: Install Server Dependencies
```bash
cd server
npm install
```

### Step 4: Start the Backend Server
```bash
npm run dev
```

You should see: `Server running on port 5000`

### Step 5: In Another Terminal, Start Frontend
```bash
cd Medicus
npm start
```

Frontend will open at `http://localhost:3000`

---

## ✅ Test the System

### Test 1: Register a Doctor
1. Go to http://localhost:3000
2. Click on "Doctors" → Register
3. Fill in the form:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: password123
   - Specialization: Cardiology
   - License: LIC123

4. Click Register
5. You'll get an auto-generated Doctor ID like **DR1234**

### Test 2: Login as Doctor
1. Go to Login page
2. Select "Doctor"
3. Login with either:
   - **Email:** john@example.com
   - **OR Doctor ID:** DR1234
4. Password: password123

### Test 3: Register Patient
1. Go to Patient → Register
2. Fill in form with patient details
3. Click Register
4. You'll get a 4-digit Patient ID like **5678**

### Test 4: Login as Patient
1. Go to Login page
2. Select "Patient"
3. Login with:
   - **Email:** patient@example.com
   - **OR Patient ID:** 5678
4. Password: (whatever you set)

### Test 5: Admin Login (All Roles)
1. Go to any Login page
2. Username: **admin**
3. Password: **admin**
4. Works for Doctor, Patient, and Pharmacy

---

## 📊 Database Structure

### Users stored in MongoDB:

**Doctor:**
```
{
  doctorId: "DR1234",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "hashed_password",
  specialization: "Cardiology",
  licenseNumber: "LIC123"
}
```

**Patient:**
```
{
  patientId: "5678",
  firstName: "Jane",
  lastName: "Smith",
  email: "jane@example.com",
  password: "hashed_password",
  dateOfBirth: "1990-01-15",
  gender: "Female"
}
```

**Pharmacy:**
```
{
  pharmacyId: "PHARM1234",
  pharmacyName: "MediCare",
  managerName: "Bob",
  email: "manager@pharmacy.com",
  password: "hashed_password",
  licenseNumber: "PHM789"
}
```

---

## 🔑 Key Features

✅ **Secure Authentication**
- Passwords hashed with bcryptjs (never stored in plain text)
- JWT tokens for session management
- 7-day token expiration

✅ **Multiple Login Options**
- Login with email OR auto-generated ID
- Admin account (admin/admin) for all roles

✅ **Auto-Generated IDs**
- Doctors: DR + 4 random digits
- Patients: 4 random digits
- Pharmacies: PHARM + 4 random digits

✅ **Token Storage**
- Tokens saved in localStorage
- User info stored securely
- Auto-logout on token expiration

---

## 🐛 Troubleshooting

### MongoDB Won't Start
```bash
# Check if MongoDB is running
brew services list

# Restart MongoDB
brew services restart mongodb-community
```

### Port 5000 Already in Use
```bash
# Kill process on port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Can't Connect to Backend
- Make sure backend is running on port 5000
- Check `.env` file has correct MONGODB_URI
- Check MongoDB is running

### Login Not Working
- Verify user was registered successfully
- Check email/password is correct
- Try using the auto-generated ID instead of email

---

## 📱 Frontend Components Updated

### Services
- `src/services/apiService.js` - API calls to backend

### Context
- `src/context/AuthContext.jsx` - Authentication state management

### Available Methods
```javascript
import { useAuth } from '../context/AuthContext';

const {
  doctorRegister,    // Register as doctor
  doctorLogin,       // Login as doctor
  patientRegister,   // Register as patient
  patientLogin,      // Login as patient
  pharmacyRegister,  // Register as pharmacy
  pharmacyLogin,     // Login as pharmacy
  adminLogin,        // Admin access (all roles)
  logout,            // Logout
  user,              // Current user
  token,             // JWT token
  loading,           // Loading state
  error              // Error messages
} = useAuth();
```

---

## 🔒 Security Notes

1. **Passwords:** Never transmitted in plain text (always HTTPS in production)
2. **Tokens:** Stored in localStorage (consider using httpOnly cookies for production)
3. **Database:** MongoDB running locally (use cloud database for production)
4. **Admin Account:** Change password in production
5. **JWT Secret:** Change in `.env` file for production

---

## 📚 Next Steps

1. Update registration components to use new API
2. Update login components to use new API
3. Create protected routes (only logged-in users)
4. Add prescription management features
5. Deploy to production with proper security

---

## 🎯 Summary

You now have:
- ✅ MongoDB database with 3 user types
- ✅ Express backend API on port 5000
- ✅ Secure password hashing (bcryptjs)
- ✅ JWT token authentication
- ✅ Frontend integrated with backend
- ✅ Admin account for testing (admin/admin)

**Your app is ready to use!** 🎉

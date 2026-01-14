# 🚀 Quick Setup Checklist

## ✅ Step-by-Step Guide to Get Your MongoDB Integration Running

### Prerequisites
- [ ] Node.js installed (version 14 or higher)
- [ ] VS Code or any code editor
- [ ] Internet connection

---

## Part 1: MongoDB Setup (5 minutes)

### Option A: MongoDB Atlas (Recommended - Cloud)

1. **Create MongoDB Atlas Account**
   - [ ] Go to https://www.mongodb.com/cloud/atlas
   - [ ] Click "Try Free" and sign up
   - [ ] Verify your email

2. **Create a Free Cluster**
   - [ ] Select "Build a Database"
   - [ ] Choose "FREE" tier (M0 Sandbox)
   - [ ] Select cloud provider (AWS recommended)
   - [ ] Choose region closest to you
   - [ ] Click "Create"
   - [ ] Wait 3-5 minutes for cluster creation

3. **Setup Database Access**
   - [ ] Go to "Database Access" in left sidebar
   - [ ] Click "Add New Database User"
   - [ ] Authentication Method: "Password"
   - [ ] Username: `medicus_admin`
   - [ ] Password: Click "Autogenerate Secure Password" and **SAVE IT!**
   - [ ] Database User Privileges: "Atlas admin"
   - [ ] Click "Add User"

4. **Setup Network Access**
   - [ ] Go to "Network Access" in left sidebar
   - [ ] Click "Add IP Address"
   - [ ] Click "Allow Access from Anywhere" (0.0.0.0/0)
   - [ ] Click "Confirm"

5. **Get Connection String**
   - [ ] Go back to "Database" tab
   - [ ] Click "Connect" button on your cluster
   - [ ] Select "Connect your application"
   - [ ] Driver: Node.js, Version: 4.1 or later
   - [ ] Copy the connection string
   - [ ] It looks like: `mongodb+srv://medicus_admin:<password>@cluster0.xxxxx.mongodb.net/`
   - [ ] Save this for later!

---

## Part 2: Backend Setup (10 minutes)

### 1. Create Backend Folder Structure

```bash
# Open terminal in your project root (Medicus-main)
mkdir backend
cd backend
```

### 2. Initialize Node.js Project

```bash
npm init -y
```

### 3. Install Dependencies

```bash
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
npm install --save-dev nodemon
```

### 4. Create Folder Structure

```bash
# Windows PowerShell
mkdir config, models, routes, middleware

# Or create manually:
# backend/
#   ├── config/
#   ├── models/
#   ├── routes/
#   └── middleware/
```

### 5. Create Environment File

Create `backend/.env` and add:

```env
# Replace with your actual MongoDB connection string
MONGODB_URI=mongodb+srv://medicus_admin:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/medicus_db?retryWrites=true&w=majority

# Server Configuration
PORT=5000

# JWT Secret (change this to a long random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_12345_random_string

# Environment
NODE_ENV=development
```

**Important:** Replace:
- `YOUR_PASSWORD_HERE` with your MongoDB password
- `cluster0.xxxxx` with your actual cluster address
- `JWT_SECRET` with a long random string (at least 32 characters)

### 6. Create Backend Files

Create these files with the content from `MONGODB_GUIDE.md`:

- [ ] `backend/config/database.js`
- [ ] `backend/models/Doctor.js`
- [ ] `backend/routes/auth.js`
- [ ] `backend/routes/doctor.js`
- [ ] `backend/middleware/auth.js`
- [ ] `backend/server.js`

### 7. Update package.json Scripts

Edit `backend/package.json` and add these scripts:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 8. Start Backend Server

```bash
# Make sure you're in the backend folder
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000
📡 API available at http://localhost:5000
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
📦 Database: medicus_db
```

---

## Part 3: Test Your Setup (5 minutes)

### 1. Test Backend is Running

Open browser and go to: `http://localhost:5000`

You should see:
```json
{
  "message": "Medicus API is running",
  "version": "1.0.0"
}
```

### 2. Start Frontend

Open a **NEW terminal** (keep backend running):

```bash
# Go to project root
cd ..  # if you're in backend folder
npm start
```

Frontend should open at `http://localhost:3000`

### 3. Test Doctor Registration

1. [ ] Navigate to `http://localhost:3000/register/doctor`
2. [ ] Fill in the form:
   - Full Name: `Dr. Test User`
   - Email: `test@doctor.com`
   - Phone: `1234567890`
   - Date of Birth: `1990-01-01`
   - License: `MD12345`
   - Password: `test123`
   - Confirm Password: `test123`
3. [ ] Check "I agree to terms"
4. [ ] Click "Register"
5. [ ] Should redirect to doctor dashboard

### 4. Verify in MongoDB

1. [ ] Go to MongoDB Atlas dashboard
2. [ ] Click "Browse Collections"
3. [ ] You should see:
   - Database: `medicus_db`
   - Collection: `doctors`
   - One document with your test doctor

### 5. Test Doctor Login

1. [ ] Navigate to `http://localhost:3000/doctorlogin`
2. [ ] Select "Doctor" role
3. [ ] Email: `test@doctor.com`
4. [ ] Password: `test123`
5. [ ] Click "Sign In"
6. [ ] Should redirect to doctor dashboard

---

## Part 4: Troubleshooting

### ❌ Problem: "Cannot connect to MongoDB"

**Solution:**
- Check `.env` file has correct connection string
- Verify MongoDB Atlas username and password are correct
- Make sure IP address is whitelisted (0.0.0.0/0)
- Check internet connection

### ❌ Problem: "CORS Error" in browser console

**Solution:**
- Make sure backend server is running
- Check backend has `app.use(cors())` in server.js
- Verify API_URL in frontend is `http://localhost:5000/api`

### ❌ Problem: "Cannot find module 'express'"

**Solution:**
```bash
cd backend
npm install
```

### ❌ Problem: "Port 5000 already in use"

**Solution:**
- Change PORT in `.env` to different number (e.g., 5001)
- Or stop other process using port 5000

### ❌ Problem: "Email already exists" error

**Solution:**
- Use a different email
- Or delete the existing doctor from MongoDB Atlas:
  1. Go to Atlas dashboard
  2. Browse Collections
  3. Find and delete the document

### ❌ Problem: "Invalid credentials" when logging in

**Solution:**
- Make sure you're using the exact email and password you registered with
- Check for typos
- Passwords are case-sensitive

---

## Part 5: View Your Data

### Using MongoDB Atlas Web Interface

1. [ ] Go to MongoDB Atlas dashboard
2. [ ] Click "Browse Collections"
3. [ ] Select `medicus_db` database
4. [ ] Click `doctors` collection
5. [ ] You can view, edit, or delete documents here

### What You Should See

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "fullName": "Dr. Test User",
  "email": "test@doctor.com",
  "phone": "1234567890",
  "dob": "1990-01-01",
  "license": "MD12345",
  "password": "$2a$10$xxxxxxxxxxx....", // Hashed password
  "role": "Doctor",
  "createdAt": "2026-01-13T10:30:00.000Z"
}
```

**Note:** Password is hashed (encrypted) for security!

---

## 🎉 Success Criteria

You've successfully set up MongoDB integration if:

- ✅ Backend server starts without errors
- ✅ Frontend connects to backend
- ✅ Can register a new doctor
- ✅ Doctor appears in MongoDB Atlas
- ✅ Can login with registered credentials
- ✅ Gets redirected to dashboard after login

---

## 📝 Next Steps

Once everything is working:

1. **Add More Features**
   - Create Patient model and routes
   - Create Prescription model
   - Add appointment scheduling

2. **Enhance Security**
   - Add email verification
   - Add password reset functionality
   - Implement rate limiting

3. **Improve User Experience**
   - Add profile picture upload
   - Add form validation feedback
   - Add success notifications

4. **Deploy Your Application**
   - Deploy backend to Heroku/Railway/Render
   - Deploy frontend to Vercel/Netlify
   - Update CORS settings for production

---

## 🆘 Getting Help

If you're stuck:

1. Check the detailed `MONGODB_GUIDE.md` file
2. Look at browser console for errors (F12)
3. Check backend terminal for errors
4. Review the MongoDB Atlas activity logs
5. Make sure all files are created correctly

---

## 📚 Useful Commands

```bash
# Start backend (in backend folder)
npm run dev

# Start frontend (in project root)
npm start

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
npm install

# Check if port 5000 is in use (Windows)
netstat -ano | findstr :5000

# Kill process using port 5000 (Windows)
taskkill /PID <process_id> /F
```

---

## 🔐 Security Reminders

- ⚠️ Never commit `.env` file to Git
- ⚠️ Use strong passwords in production
- ⚠️ Change JWT_SECRET to a long random string
- ⚠️ Restrict IP addresses in production (not 0.0.0.0/0)
- ⚠️ Use HTTPS in production

---

**Good luck! You're all set to build a full-stack medical application with MongoDB! 🚀**

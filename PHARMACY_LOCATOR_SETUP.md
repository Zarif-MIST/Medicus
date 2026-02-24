# 🗺️ Pharmacy Locator Setup Guide

## Overview
The Pharmacy Locator feature allows patients to find pharmacies near their location using an interactive Google Maps interface.

## Features
✅ **Interactive Map** - Google Maps integration showing pharmacy locations  
✅ **Current Location** - Automatically detects patient's location  
✅ **Distance Calculator** - Shows distance to each pharmacy  
✅ **Quick Actions** - Get directions or call pharmacy directly  
✅ **Real-time Data** - Fetches pharmacies from your database  

---

## 🔑 Google Maps API Setup

### Step 1: Get a Google Maps API Key

1. **Go to Google Cloud Console**
   - Visit: [https://console.cloud.google.com/](https://console.cloud.google.com/)

2. **Create a New Project** (or select existing)
   - Click on the project dropdown at the top
   - Click "New Project"
   - Name it "Medicus" and click "Create"

3. **Enable Required APIs**
   - Go to "APIs & Services" → "Library"
   - Search for and enable:
     - ✅ **Maps JavaScript API**
     - ✅ **Places API**

4. **Create API Key**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the generated API key

5. **Restrict API Key (Optional but Recommended)**
   - Click on the API key you just created
   - Under "Application restrictions", select "HTTP referrers"
   - Add: `http://localhost:3000/*` (for development)
   - Under "API restrictions", select "Restrict key"
   - Select only "Maps JavaScript API" and "Places API"
   - Click "Save"

### Step 2: Add API Key to Your Project

1. **Create `.env` file** in the `Medicus` folder:
   ```bash
   cd Medicus
   cp .env.example .env
   ```

2. **Edit `.env` file** and add your API key:
   ```env
   REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY_HERE
   ```

3. **Restart your development server**:
   ```bash
   npm start
   ```

---

## 📍 How It Works

### 1. Location Detection
- Automatically requests user's location permission
- Falls back to Dhaka, Bangladesh if location is denied
- Shows user's location with a red marker on the map

### 2. Pharmacy Data
- Fetches all registered pharmacies from MongoDB
- Displays pharmacy information:
  - Name
  - Manager
  - Phone number
  - Email
  - Distance from user

### 3. Interactive Features
- **Click on Map Markers** - Select a pharmacy
- **Get Directions** - Opens Google Maps with route
- **Call Button** - Direct phone call to pharmacy
- **Distance Display** - Shows distance in kilometers

---

## 🎨 UI Components

### Patient Dashboard Integration
The Pharmacy Locator appears on the patient dashboard below the tabs:
```
Welcome Card
   ↓
Summary Cards
   ↓
Navigation Tabs
   ↓
🗺️ Pharmacy Locator (NEW!)
   ↓
Active Prescriptions
   ↓
Medical History
```

### Responsive Design
- **Desktop**: Map and list side-by-side
- **Tablet**: Stacked layout
- **Mobile**: Full-width optimized view

---

## 🧪 Testing the Feature

1. **Start the Backend Server** (if not running):
   ```bash
   cd server
   npm run dev
   ```

2. **Start the Frontend** (if not running):
   ```bash
   cd Medicus
   npm start
   ```

3. **Login as a Patient**:
   - Go to http://localhost:3000
   - Navigate to Patient Login
   - Use existing credentials or register a new patient

4. **View Pharmacy Locator**:
   - You'll see the Pharmacy Locator on the dashboard
   - Allow location access when prompted
   - Browse pharmacies on the map and in the list

5. **Test Interactions**:
   - Click on a pharmacy marker
   - Click "Get Directions" button
   - Click "Call" button (on mobile)
   - View distance calculations

---

## 🔧 Customization

### Modify Map Appearance
Edit `/Medicus/src/components/PatDash/PharmacyLocator.jsx`:

```javascript
// Change map zoom level (line ~47)
zoom: 13, // Increase for closer view

// Customize marker colors
fillColor: '#991b1b', // User location marker
fillColor: '#10b981', // Pharmacy marker
```

### Add Real Pharmacy Locations
Currently, the feature generates random coordinates for demo purposes. To use real locations:

1. **Update Pharmacy Model** (`server/models/Pharmacy.js`):
   ```javascript
   const pharmacySchema = new mongoose.Schema({
     // ... existing fields
     location: {
       type: { type: String, enum: ['Point'], default: 'Point' },
       coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
     }
   });
   ```

2. **Update Registration** to accept latitude/longitude
3. **Update PharmacyLocator.jsx** to use real coordinates instead of random ones

---

## 🐛 Troubleshooting

### Map Not Loading
- ✅ Check that `.env` file exists in `Medicus` folder
- ✅ Verify API key is correct (no extra spaces)
- ✅ Make sure APIs are enabled in Google Cloud Console
- ✅ Check browser console for errors (F12)

### "Location Not Available"
- ✅ Allow location access in browser
- ✅ Use HTTPS in production (required for geolocation)
- ✅ Default location (Dhaka) will be used if denied

### Pharmacies Not Showing
- ✅ Ensure backend server is running
- ✅ Check that pharmacies exist in database
- ✅ Verify API endpoint: `http://localhost:5001/api/pharmacies`

### API Key Errors
```
RefererNotAllowedMapError
```
- Add your domain to API restrictions in Google Cloud Console

```
ApiNotActivatedMapError
```
- Enable "Maps JavaScript API" in Google Cloud Console

---

## 💰 Pricing (Google Maps)

**Free Tier**: 
- $200 free credit per month
- ~28,000 map loads/month free
- More than enough for development and small apps

**For Production**:
- Monitor usage in Google Cloud Console
- Set billing alerts
- Consider adding API key restrictions

---

## 🚀 Production Deployment

1. **Update `.env` for production**:
   ```env
   REACT_APP_GOOGLE_MAPS_API_KEY=your_production_api_key
   ```

2. **Restrict API Key**:
   - Add your production domain
   - Remove localhost references

3. **Enable HTTPS**:
   - Required for geolocation API
   - Configure SSL certificate

---

## 📚 Additional Resources

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [React Google Maps API](https://www.npmjs.com/package/@react-google-maps/api)

---

## ✅ Feature Checklist

- [x] Google Maps integration
- [x] User location detection
- [x] Pharmacy markers on map
- [x] Distance calculation
- [x] Get directions button
- [x] Call pharmacy button
- [x] Responsive design
- [x] Database integration
- [ ] Real pharmacy coordinates (optional)
- [ ] Search/filter pharmacies (future)
- [ ] Pharmacy reviews (future)

---

**Need Help?** Check the troubleshooting section or review the code comments in `PharmacyLocator.jsx`.

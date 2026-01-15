/**
 * Seed Script - Add sample patients to database
 * Run this file to populate your database with test data
 * 
 * Usage: node scripts/seedPatients.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Patient = require('../models/Patient');

// Sample patients data
const samplePatients = [
  {
    fullName: "Sinlam Ahmed",
    email: "sinlam.ahmed@example.com",
    phone: "1234567890",
    dob: new Date("1999-05-15"),
    age: 25,
    gender: "Male",
    bloodType: "A+",
    allergies: ["Penicillin", "Sulfa drugs"],
    chronicConditions: ["Hypertension"],
    address: {
      street: "123 Main St",
      city: "Dhaka",
      state: "Dhaka Division",
      zipCode: "1000"
    }
  },
  {
    fullName: "Kuddus Rahman",
    email: "kuddus.rahman@example.com",
    phone: "9876543210",
    dob: new Date("1985-08-22"),
    age: 39,
    gender: "Male",
    bloodType: "O+",
    allergies: [],
    chronicConditions: ["Type 2 Diabetes"],
    address: {
      street: "456 Park Ave",
      city: "Chittagong",
      state: "Chittagong Division",
      zipCode: "4000"
    }
  },
  {
    fullName: "Shafi Ahmed",
    email: "shafi.ahmed@example.com",
    phone: "5551234567",
    dob: new Date("2000-12-10"),
    age: 24,
    gender: "Male",
    bloodType: "B+",
    allergies: ["Aspirin"],
    chronicConditions: [],
    address: {
      street: "789 River Rd",
      city: "Sylhet",
      state: "Sylhet Division",
      zipCode: "3100"
    }
  },
  {
    fullName: "Ayesha Begum",
    email: "ayesha.begum@example.com",
    phone: "5559876543",
    dob: new Date("1992-03-18"),
    age: 32,
    gender: "Female",
    bloodType: "AB+",
    allergies: ["Peanuts"],
    chronicConditions: ["Asthma"],
    address: {
      street: "321 Lake View",
      city: "Rajshahi",
      state: "Rajshahi Division",
      zipCode: "6000"
    }
  }
];

async function seedPatients() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing patients (optional - comment out if you want to keep existing data)
    // await Patient.deleteMany({});
    // console.log('Cleared existing patients');

    // Insert sample patients
    console.log('Inserting sample patients...');
    const insertedPatients = await Patient.insertMany(samplePatients);
    
    console.log(`✅ Successfully added ${insertedPatients.length} patients!`);
    console.log('\nPatient IDs (use these to search in the app):');
    insertedPatients.forEach(patient => {
      console.log(`- ${patient.fullName}: ${patient._id}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding patients:', error);
    process.exit(1);
  }
}

// Run the seed function
seedPatients();

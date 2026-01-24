const mongoose = require('mongoose');

/**
 * Connect to MongoDB
 * This function establishes connection to our database
 */
const connectDB = async () => {
  try {
    // Attempt to connect
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`⚠️  Check your credentials and IP whitelist in MongoDB Atlas`);
    console.error(`📋 URI being used: ${process.env.MONGODB_URI?.substring(0, 50)}...`);
    // Don't exit - let server run so we can debug
    // process.exit(1);
  }
};

module.exports = connectDB;

const mongoose = require('mongoose');

/**
 * Connect to MongoDB
 * This function establishes connection to our database
 */
const connectDB = async () => {
  try {
    // Attempt to connect
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;

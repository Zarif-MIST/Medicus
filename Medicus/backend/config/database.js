const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(' MongoDB Connected Successfully');
    return true;
  } catch (error) {
    console.error(' MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

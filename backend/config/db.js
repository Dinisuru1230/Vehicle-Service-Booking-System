const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vehicle_service_booking';
    const conn = await mongoose.connect(mongoUri);

    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    // Do not exit process immediately so server can still serve health check or retry
    return null;
  }
};

module.exports = connectDB;

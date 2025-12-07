const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // Mongoose v6+ does not require `useNewUrlParser` or `useUnifiedTopology` options.
        // Configure any global options here if needed.
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;

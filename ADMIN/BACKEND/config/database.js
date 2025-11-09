import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error('MONGO_URL is not defined in environment variables');
    }

    console.log('Connecting to MongoDB...');
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    const conn = await mongoose.connect(process.env.MONGO_URL, options);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    
    // Log when connected
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });
    
    // Log any errors after initial connection
    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });
    
    // Log when disconnected
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
    });
    
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      codeName: error.codeName,
      errorResponse: error.errorResponse,
      connectionString: process.env.MONGO_URL ? 
        process.env.MONGO_URL.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://***:***@') : 
        'Not set'
    });
    process.exit(1);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

export default connectDB;
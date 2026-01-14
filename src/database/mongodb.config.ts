import { registerAs } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';

export interface MongoDBConfig {
  uri: string;
  options: MongooseModuleOptions;
}

export const mongodbConfig = registerAs('mongodb', (): MongoDBConfig => {
  const uri = process.env.MONGO_URL;

  if (!uri) {
    throw new Error(
      'MONGO_URL environment variable is required. ' +
      'Please set a valid MongoDB connection string.'
    );
  }

  return {
    uri,
    options: {
      // Connection Pool Configuration
      maxPoolSize: parseInt(process.env.MONGO_POOL_SIZE || '10', 10),
      minPoolSize: parseInt(process.env.MONGO_MIN_POOL_SIZE || '2', 10),
      
      // Timeouts
      serverSelectionTimeoutMS: parseInt(process.env.MONGO_SERVER_SELECTION_TIMEOUT || '5000', 10),
      socketTimeoutMS: parseInt(process.env.MONGO_SOCKET_TIMEOUT || '45000', 10),
      connectTimeoutMS: parseInt(process.env.MONGO_CONNECT_TIMEOUT || '10000', 10),
      
      // Retry Configuration
      retryWrites: true,
      retryReads: true,
      
      // Write Concern for data consistency
      w: 'majority',
      
      // Read Preference - for replica sets
      // readPreference: 'primaryPreferred',
      
      // Automatic index creation (disable in production for better control)
      autoIndex: process.env.NODE_ENV !== 'production',
      
      // Auto-create collections
      autoCreate: process.env.NODE_ENV !== 'production',
    },
  };
});

// MongoDB connection event handlers
export const mongooseConnectionFactory = {
  connectionFactory: (connection: any) => {
    const logger = new Logger('MongoDB');
    
    // Log successful connection
    connection.on('connected', () => {
      logger.log('✅ MongoDB connected successfully', 'MongoDB');
    });

    // Log disconnection
    connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB disconnected', 'MongoDB');
    });

    // Log errors
    connection.on('error', (error: Error) => {
      logger.error(`❌ MongoDB connection error: ${error.message}`, error.stack, 'MongoDB');
    });

    // Log reconnection attempts
    connection.on('reconnected', () => {
      logger.log('🔄 MongoDB reconnected', 'MongoDB');
    });

    return connection;
  },
};



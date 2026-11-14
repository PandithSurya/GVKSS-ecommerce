import mongoose from 'mongoose';
import { config } from './environment.js';
import { logger } from './logger.js';

let isReplicaSet = false;

export async function connectDatabase(): Promise<typeof mongoose> {
  try {
    mongoose.set('strictQuery', true);
    
    const conn = await mongoose.connect(config.mongodbUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });

    logger.info(`Connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
    
    // Check if connected MongoDB deployment supports transactions (replica set)
    try {
      const adminDb = conn.connection.db?.admin();
      if (adminDb) {
        const replSetStatus = await adminDb.command({ replSetGetStatus: 1 }).catch(() => null);
        if (replSetStatus && replSetStatus.ok === 1) {
          isReplicaSet = true;
          logger.info('MongoDB Replica Set detected: Multi-document ACID transactions enabled.');
        } else {
          isReplicaSet = false;
          logger.info('MongoDB Standalone detected: Fallback atomic operations enabled.');
        }
      }
    } catch {
      isReplicaSet = false;
    }

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Reconnecting...');
    });

    return conn;
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export function isReplicaSetDeployment(): boolean {
  return isReplicaSet;
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  logger.info('Disconnected from MongoDB');
}

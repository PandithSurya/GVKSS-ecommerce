import mongoose, { ClientSession } from 'mongoose';
import { isReplicaSetDeployment } from '../config/database.js';
import { logger } from '../config/logger.js';

export async function runInTransaction<T>(
  callback: (session: ClientSession | null) => Promise<T>
): Promise<T> {
  const supportsReplicaSet = isReplicaSetDeployment();

  if (!supportsReplicaSet) {
    // Standalone fallback: execute directly
    return callback(null);
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction({
      readConcern: { level: 'snapshot' },
      writeConcern: { w: 'majority' },
    });

    const result = await callback(session);

    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    logger.error('Transaction aborted due to error:', error);
    throw error;
  } finally {
    await session.endSession();
  }
}

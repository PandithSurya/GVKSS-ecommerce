import { Types } from 'mongoose';
import { AuditLog } from '../models/AuditLog.js';
import { logger } from '../config/logger.js';

export interface AuditLogParams {
  adminId?: Types.ObjectId | string;
  adminEmail?: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
}

export class AuditService {
  static async log(params: AuditLogParams): Promise<void> {
    try {
      await AuditLog.create({
        adminId: params.adminId ? new Types.ObjectId(params.adminId.toString()) : undefined,
        adminEmail: params.adminEmail,
        action: params.action,
        resource: params.resource,
        resourceId: params.resourceId,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        details: params.details,
      });
    } catch (error) {
      logger.error('Failed to write audit log entry:', error);
    }
  }
}

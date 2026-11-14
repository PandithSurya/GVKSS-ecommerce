import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/organic_products_db',
  
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'gvkss_super_secure_access_secret_key_2026_xyz987',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'gvkss_super_secure_refresh_secret_key_2026_abc123',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  cookieSecret: process.env.COOKIE_SECRET || 'gvkss_cookie_signing_secret_998877',
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000').split(',').map(s => s.trim()),
  
  initialAdmin: {
    email: process.env.INITIAL_ADMIN_EMAIL || 'admin@gvkss.org',
    password: process.env.INITIAL_ADMIN_PASSWORD || 'AdminSecure@2026!',
    name: process.env.INITIAL_ADMIN_NAME || 'GVKSS Master Admin',
  },
  
  business: {
    upiId: process.env.BUSINESS_UPI_ID || 'gvkssorganics@upi',
    displayName: process.env.BUSINESS_DISPLAY_NAME || 'GVKSS Organic Collectives',
    email: process.env.BUSINESS_EMAIL || 'ddshyderabad@gmail.com',
    phone: process.env.BUSINESS_PHONE || '9391628344',
  },
  
  email: {
    enabled: process.env.ENABLE_EMAIL === 'true',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'GVKSS Organics <ddshyderabad@gmail.com>',
  }
};

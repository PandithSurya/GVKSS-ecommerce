import { app } from './app.js';
import { config } from './config/environment.js';
import { connectDatabase } from './config/database.js';
import { logger } from './config/logger.js';

async function bootstrap() {
  try {
    await connectDatabase();

    const server = app.listen(config.port, () => {
      logger.info(`Server listening on port ${config.port} (${config.nodeEnv})`);
      logger.info(`Swagger API Docs available at http://localhost:${config.port}/api/docs`);
      logger.info(`API Base Endpoint: http://localhost:${config.port}${config.apiPrefix}`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start backend server:', error);
    process.exit(1);
  }
}

bootstrap();

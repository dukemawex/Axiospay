import { env } from './config/env';
import { createApp } from './app';
import { logger } from './lib/logger';
import { prisma } from './lib/prisma';
import { redis } from './lib/redis';

const PORT = env.PORT;

async function main(): Promise<void> {
  await prisma.$connect();
  logger.info('Database connected');

  await redis.ping();
  logger.info('Redis connected');

  const app = createApp();

  const server = app.listen(PORT, () => {
    logger.info({ port: PORT, env: env.NODE_ENV }, 'Axios Pay API started');
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info({ signal }, 'Shutting down gracefully');
    server.close(async () => {
      await prisma.$disconnect();
      redis.disconnect();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((err) => {
  logger.error(err, 'Fatal error during startup');
  process.exit(1);
});

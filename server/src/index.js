import './config/env.js';
import app from './app.js';
import prisma from './lib/prisma.js';
import { env } from './config/env.js';

async function main() {
  await prisma.$connect();
  console.log('Database connected');

  const server = app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });

  const shutdown = async () => {
    await prisma.$disconnect();
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

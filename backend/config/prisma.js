const { PrismaClient } = require('@prisma/client');

// PrismaClient singleton instance
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

module.exports = prisma;

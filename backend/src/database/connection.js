import knex from 'knex';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import winston from 'winston';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ use winston with ESM import
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

// Database configuration
const dbConfig = {
  client: 'sqlite3',
  connection: {
    filename: join(__dirname, '../../', process.env.DB_NAME || 'veims.db')
  },
  useNullAsDefault: true,
  pool: {
    min: 2,
    max: 10,
    afterCreate: (conn, cb) => {
      conn.run('PRAGMA foreign_keys = ON', cb);
    }
  },
  migrations: {
    directory: join(__dirname, 'migrations')
  },
  seeds: {
    directory: join(__dirname, 'seeds')
  }
};

// Create Knex instance
export const db = knex(dbConfig);

// Test database connection
export async function testConnection() {
  try {
    await db.raw('SELECT 1');
    logger.info('Database connection successful');
    return true;
  } catch (error) {
    logger.error('Database connection failed:', error);
    return false;
  }
}

// Initialize database with tables
export async function initializeDatabase() {
  try {
    await testConnection();
    await db.migrate.latest();
    logger.info('Database migrations completed');

    if (process.env.NODE_ENV === 'development') {
      await db.seed.run();
      logger.info('Database seeded successfully');
    }

    return true;
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
}

// Close database connection
export async function closeConnection() {
  try {
    await db.destroy();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
  }
}

export default db;

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let sequelize;

if (process.env.DATABASE_URL) {
  // Support cloud PostgreSQL (Supabase, Neon, Render, Railway, etc.)
  const isPostgres = process.env.DATABASE_URL.startsWith('postgres');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: isPostgres ? 'postgres' : 'mysql',
    dialectOptions: isPostgres
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  const dialect = process.env.DB_DIALECT || 'sqlite';

  if (dialect === 'mysql') {
    sequelize = new Sequelize(
      process.env.DB_NAME || 'store_rating_db',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
        dialect: 'mysql',
        logging: false,
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      }
    );
  } else if (dialect === 'postgres') {
    sequelize = new Sequelize(
      process.env.DB_NAME || 'store_rating_db',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
        dialect: 'postgres',
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
        logging: false,
      }
    );
  } else {
    // SQLite: support local disk or /tmp for serverless cloud
    const storagePath = process.env.VERCEL
      ? '/tmp/database.sqlite'
      : path.resolve(__dirname, '../../database.sqlite');
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: storagePath,
      logging: false,
    });
  }
}

export default sequelize;

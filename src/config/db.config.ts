import dotenv from 'dotenv';
dotenv.config();

// export const dbConfig = {
//   type: 'mysql',
//   host: process.env.DB_HOST ?? 'localhost',
//   username: process.env.DB_USER ?? 'mysql',
//   password: process.env.DB_PASSWORD ?? 'password',
//   database: process.env.DB_NAME ?? 'user',
//   port: Number(process.env.DB_PORT ?? 5432)
// };

import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  username: process.env.DB_USER ?? 'mysql',
  password: process.env.DB_PASSWORD ?? 'password',
  database: process.env.DB_NAME ?? 'mysql',
  port: Number(process.env.DB_PORT ?? 3306),
  synchronize: false,
  entities: ['**/entities/*.entity.js'],
  migrations: ['**/migrations/*.js'],
  migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true' ? true : false,
});
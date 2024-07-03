import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize('pombal-db', 'pombal-db_owner', process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: 'postgres',
    timezone: 'America/Sao_Paulo',
    ssl: true,
    dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false 
    }
  }
});
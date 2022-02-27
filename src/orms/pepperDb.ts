import { Sequelize } from 'sequelize';
import 'dotenv/config';

if(!process.env.DB_NAME || !process.env.DB_USERNAME || !process.env.DB_PASSWORD) {
  throw 'Database credentials non provided';
}

const pepperDb = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port:  Number(process.env.DB_PORT) || 5439,
  dialect: 'postgres',
  logQueryParameters: true,
});

const initDb = async () => {
  try {
    await pepperDb.authenticate();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

const syncDbModels = async () => {
  await pepperDb.sync({ force: true });
};

export { initDb, syncDbModels, pepperDb };

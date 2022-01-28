import { Sequelize } from 'sequelize';
import 'dotenv/config';

if(!process.env.dbName || !process.env.dbUserName || !process.env.dbPassword) {
  throw 'Database credentials non provided';
}

const pepperDb = new Sequelize(process.env.dbName, process.env.dbUserName, process.env.dbPassword, {
  host: 'localhost',
  port: 5439,
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

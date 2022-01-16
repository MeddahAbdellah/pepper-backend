import { Sequelize } from 'sequelize';

const pepperDb = new Sequelize('pepper', 'pepper', 'sayfEnnar', {
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

  // await pepperDb.sync({ force: true });
};

export { initDb, pepperDb };

'use strict';
const fs = require('fs');
module.exports = {
  async up (queryInterface, Sequelize) {
    const schema = fs.readFileSync('./migrations/pepper_schema.sql', 'utf8');
    await queryInterface.sequelize.query(schema);
  },

  async down (queryInterface, Sequelize) {
  }
};

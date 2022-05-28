'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'address', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.changeColumn('Users', 'description', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.changeColumn('Users', 'job', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.changeColumn('Users', 'interests', {
      type: Sequelize.JSON,
      allowNull: true
    });

  },

  async down () {
  }
};

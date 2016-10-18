'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('tournaments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      format: {
        type: Sequelize.STRING
      },
      rules: {
        type: Sequelize.TEXT
      },
      course: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATE
      },
      entryFee: {
        type: Sequelize.DECIMAL
      },
      userId: {
        type: Sequelize.INTEGER
      },
      mulligans: {
        type: Sequelize.BOOLEAN
      },
      mulliganInfo: {
        type: Sequelize.TEXT
      },
      gimmies: {
        type: Sequelize.BOOLEAN
      },
      gimmieInfo: {
        type: Sequelize.TEXT
      },
      mealInfo: {
        type: Sequelize.TEXT
      },
      details: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('tournaments');
  }
};
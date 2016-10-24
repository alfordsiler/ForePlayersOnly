'use strict';
module.exports = function(sequelize, DataTypes) {
  var users_teams = sequelize.define('users_teams', {
    userId: DataTypes.INTEGER,
    teamId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return users_teams;
};
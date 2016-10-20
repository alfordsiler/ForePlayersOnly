'use strict';
module.exports = function(sequelize, DataTypes) {
  var usersTeams = sequelize.define('usersTeams', {
    userId: DataTypes.INTEGER,
    teamId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return usersTeams;
};
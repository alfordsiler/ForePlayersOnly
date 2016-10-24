'use strict';
module.exports = function(sequelize, DataTypes) {
  var tournaments_teams = sequelize.define('tournaments_teams', {
    teamId: DataTypes.INTEGER,
    tournamentId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return tournaments_teams;
};
'use strict';
module.exports = function(sequelize, DataTypes) {
  var teamsTournaments = sequelize.define('teamsTournaments', {
    teamId: DataTypes.INTEGER,
    tournamentId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return teamsTournaments;
};
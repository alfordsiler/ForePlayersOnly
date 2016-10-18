'use strict';
module.exports = function(sequelize, DataTypes) {
  var map = sequelize.define('map', {
    userId: DataTypes.INTEGER,
    teamId: DataTypes.INTEGER,
    tournamentId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return map;
};
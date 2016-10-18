'use strict';
module.exports = function(sequelize, DataTypes) {
  var team = sequelize.define('team', {
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.team.belongsToMany(models.tournament, {through: "map"});
      }
    }
  });
  return team;
};
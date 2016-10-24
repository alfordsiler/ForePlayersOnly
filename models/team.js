'use strict';
module.exports = function(sequelize, DataTypes) {
  var team = sequelize.define('team', {
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.team.belongsTo(models.user);
        models.team.belongsToMany(models.user, {through: "users_teams"});
        models.team.belongsToMany(models.tournament, {through: "tournaments_teams"});
      }
    }
  });
  return team;
};


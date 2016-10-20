'use strict';
module.exports = function(sequelize, DataTypes) {
  var team = sequelize.define('team', {
    name: DataTypes.STRING,
    ownerId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.team.belongsToMany(models.user, {through: "usersTeams"});
        models.team.belongsToMany(models.tournament, {through: "teamsTournaments"});
      }
    }
  });
  return team;
};


'use strict';
module.exports = function(sequelize, DataTypes) {
  var tournament = sequelize.define('tournament', {
    name: DataTypes.STRING,
    format: DataTypes.STRING,
    rules: DataTypes.TEXT,
    course: DataTypes.STRING,
    date: DataTypes.DATE,
    entryFee: DataTypes.DECIMAL,
    userId: DataTypes.INTEGER,
    mulligans: DataTypes.BOOLEAN,
    mulliganInfo: DataTypes.TEXT,
    gimmies: DataTypes.BOOLEAN,
    gimmieInfo: DataTypes.TEXT,
    mealInfo: DataTypes.TEXT,
    details: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        models.tournament.belongsToMany(models.team, {through: "map"});
      }
    }
  });
  return tournament;
};
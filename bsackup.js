'use strict';
var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    firstName: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 50],
          msg: 'First name must be between 1 and 50 charecters'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 50],
          msg: 'Last name must be between 1 and 50 charecters'
        }
      }
    },    
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Invalid email address'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 99],
          msg: 'Password must be between 8 and 99 characters'
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [10],
          msg: 'Phone number must 10 digits, no dashes'
        }
      }
    },
    handicap: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      validate: {
        max: {
          args: [36.4],
          msg: 'Handicap cannot exceed 36.4'
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: function(createdUser, options, cb) {
        if(createdUser.password){
        var hash = bcrypt.hashSync(createdUser.password, 10);
        createdUser.password = hash;
        }
        cb(null, createdUser);
      }
    },
    classMethods: {
      associate: function(models) {
        models.user.belongsToMany(models.team, {through: "map"});
      }
    },
    instanceMethods: {
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      },
      toJSON: function() {
        var jsonUser = this.get();
        delete jsonUser.password;
        return jsonUser;
      }
    }
  });
  return user;
};

  <div class="form-group">
    <label for="player1">Player 1:</label>
      <select id="player1" name="player1">
        <% users.forEach(function(user){ %>
          <option value="<%= user.id %>">
          <%= user.firstName %> <%= user.lastName %> 
        <% }); %>
      </select>
  </div>

  <div class="form-group">
    <label for="player2">Player 2:</label>
      <select id="player2" name="player2">
        <% users.forEach(function(user){ %>
          <option value="<%= user.id %>">
          <%= user.firstName %> <%= user.lastName %> 
        <% }); %>
      </select>
  </div>

    <div class="form-group">
    <label for="player3">Player 3:</label>
      <select id="player3" name="player3">
        <% users.forEach(function(user){ %>
          <option value="<%= user.id %>">
          <%= user.firstName %> <%= user.lastName %> 
        <% }); %>
      </select>
  </div>

  <div class="form-group">
    <label for="player4">Player 4:</label>
      <select id="player4" name="player4">
        <% users.forEach(function(user){ %>
          <option value="<%= user.id %>">
          <%= user.firstName %> <%= user.lastName %> 
        <% }); %>
      </select>
  </div>

    <div class="form-group">
    <label for="tournament">Join this tournament:</label>

      <select id="tournament" name="tournament">
        <% tournaments.forEach(function(tournament){ %>
          <option value="<%= tournament.id %>">
          <%= tournament.name %>
        <% }); %>
      </select>
  </div>
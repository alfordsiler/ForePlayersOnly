var express = require('express');
var router = express.Router();
var db = require('../models');
var passport = require('../config/ppConfig');
var isLoggedIn = require('../middleware/isLoggedIn');

//get new player form
router.get('/new/player', function(req, res){
  res.render('register/newPlayer');
});

//post new player
router.post('/new/player', function(req, res){
  var email = req.body.email;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var password = req.body.password;
  var phone = req.body.phone || null;
  var handicap = req.body.handicap || null;

  db.user.findOrCreate({
    where: { email: email },
    defaults: {
      firstName: firstName,
      lastName: lastName,
      password: password,
      phone: phone,
      handicap: handicap
    }
  }).spread(function(user, created) {
    if (created) {
      passport.authenticate('local', {
        successRedirect: '/profile',
        successFlash: 'Account created and logged in'
      })(req, res);
    } else {
      req.flash('error', 'Email already exists');
      res.redirect('/register/new/player');
    }
  }).catch(function(error) {
    req.flash('error', error.message);
    res.redirect('/register/new/player');
  });
});

//get new team form
router.get('/new/team', isLoggedIn, function(req, res){
  db.user.findAll().then(function(users){
  res.render('register/newTeam', { users: users });
  });
});

//post new team 
router.post('/new/team', function(req, res){
  console.log('/new/team', req.body);
  var teamName = req.body.teamName;
  var ownerId = req.user.id;
  var player1 = req.body.player1;
  var player2 = req.body.player2;
  var player3 = req.body.player3;
  var player4 = req.body.player4;
  var tournament = req.body.tournament

  db.user.findOne({
    where: { id:req.user.id }
  }).then(function(user){
    if(user) {
      user.createTeam({
        name: teamName,
        ownerId: ownerId,
      }).then(function(team){
        if(team){
          user.addTeam(team);
        }
        callback(null);
      }).then(function(err){
        res.redirect('/new/team');
      });
    }
  });
});

module.exports = router;

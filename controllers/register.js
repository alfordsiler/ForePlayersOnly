var express = require('express');
var router = express.Router();
var db = require('../models');
var passport = require('../config/ppConfig');
var isLoggedIn = require('../middleware/isLoggedIn');
var flash = require('connect-flash');

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
  var name = req.body.teamName;
  var userId = req.user.id;
  db.team.findOrCreate({
    where: {name: name},
    defaults: {
      name: name,
      userId: userId
    }
  }).spread(function(user, created) {
    if(created) {
      req.flash('success','Successfully created team')
      res.redirect("/manage/teams")
    } 
    else {
      req.flash('error', 'Team name already exists, please choose a new name');
      res.redirect('/register/new/team');
    }
  }).catch(function(error) {
    req.flash('error', error.message);
    res.redirect('/tournament/new');
  });
});


module.exports = router;

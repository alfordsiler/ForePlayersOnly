var express = require('express');
var router = express.Router();
var db = require('../models');
var passport = require('../config/ppConfig');

//get new player form
router.get('/new/player', function(req, res){
  res.render('register/newPlayer');
});

//post new player
router.post('/new/player', function(req, res){
  console.log(req.body);
  var email = req.body.email;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var password = req.body.password;
  var phone = req.body.phone;
  var handicap = req.body.handicap;

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
router.get('/new/team', function(req, res){
  res.render('register/newTeam');
});

//post new team 
router.post('/new/team', function(req, res){
  console.log(req.body);
  res.send("success");
});

// router.get('/facebook', passport.authenticate('facebook', {
//   scope: ['public_profile', 'email']
// }));

// router.get('/callback/facebook', passport.authenticate('facebook', {
//   successRedirect: '/',
//   failureRedirect: '/auth/login',
//   failureFlash: 'error occurred, try again dummy',
//   successFlash: 'You logged in with Facebook!'
// }));

module.exports = router;

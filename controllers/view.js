var express = require('express');
var router = express.Router();
var db = require('../models');
var passport = require('../config/ppConfig');
var isLoggedIn = require('../middleware/isLoggedIn');
var flash = require('connect-flash');

//get list of all teams
router.get('/teams', isLoggedIn, function(req, res){
  var user = req.user;
  db.team.findAll({ 
    where: { userId: user.id },
    order: '"name" ASC'
  }).then(function(teams){
    res.render('view/teams', { teams: teams })
  });//end then
});

//get view of all user teams with assigned players
router.get('/teams/:id', isLoggedIn, function(req, res){
  // var user = req.user;
  db.team.find({ 
    where: { id: req.params.id },
  }).then(function(team){
    team.getUsers().then(function(users){
      res.render('view/viewTeams', { team: team.name, users: users })
    });
  });//end then
});

//delete users from teams
router.delete('/teams/:id', function(req, res){
  db.team.findById(req.params.id).then(function(team){
    if(user){
      user.destroy().then(function(){
        req.flash('success', 'Successfully removed player from team');
        res.send({msg: 'success'});
      })
    } else {
      res.status(404).send( {msg: 'error, try again'});
    }
  }).catch(function(err){
    res.status(500).send({ msg: 'error'});
  });
});

//get list of all tournaments
router.get('/tournaments', isLoggedIn, function(req, res){
  var user = req.user;
  db.tournament.findAll({ 
    where: { userId: user.id },
    order: '"name" ASC'
  }).then(function(tournaments){
    res.render('view/tournaments', { tournaments: tournaments })
  });//end then
});

//get view of all user teams with assigned players
router.get('/tournaments/:id', isLoggedIn, function(req, res){
  // var user = req.user;
  db.tournament.find({ 
    where: { id: req.params.id },
  }).then(function(tournament){
    tournament.getTeams().then(function(teams){
      res.render('view/viewTournaments', { tournament: tournament.name, teams: teams })
    });
  });//end then
});


module.exports = router;
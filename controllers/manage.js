var express = require('express');
var router = express.Router();
var db = require('../models');
var passport = require('../config/ppConfig');
var isLoggedIn = require('../middleware/isLoggedIn');

//get to display all created teams by logged in user
router.get("/teams", isLoggedIn, function(req, res){
  var user = req.user;
  db.team.findAll({ 
    where: { userId: user.id }
  }).then(function(teams){
    res.render("manage/manageTeams", { teams: teams })
  });//end then
});

//get to display all tournaments created by logged in user
router.get("/tournaments", isLoggedIn, function(req, res){
  var user = req.user
  db.tournament.findAll({
    where: { userId: user.id }
  }).then(function(tournaments){
    res.render("manage/manageTournaments", { tournaments: tournaments })
  });//end then
});

//post to add teams to tournaments




//post to add users to teams




module.exports = router;
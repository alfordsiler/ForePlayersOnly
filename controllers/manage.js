var express = require('express');
var router = express.Router();
var db = require('../models');
var passport = require('../config/ppConfig');
var isLoggedIn = require('../middleware/isLoggedIn');
var flash = require('connect-flash');

//get to display all created teams by logged in user
router.get('/teams', isLoggedIn, function(req, res){
  var user = req.user;
  db.team.findAll({ 
    where: { userId: user.id },
    order: '"name" ASC'
  }).then(function(teams){
    res.render('manage/manageTeams', { teams: teams })
  });//end then
});

//post to add users to teams
router.post('/teams/add/players', function(req, res){

});

//get to display single team details
router.get('/teams/:id', function(req, res) {
  db.team.findById(req.params.id).then(function(team) {
    if (team) {
      res.render('manage/teamDetails', { team: team });
    } else {
      res.status(404).render('error');
    }
  }).catch(function(err) {
    res.status(500).render('error');
  });
});

//get edit team info
router.get('/teams/:id/edit', function(req, res){
  db.team.findById(req.params.id).then(function(team){
    if(team){
      res.render('manage/editTeam', { team: team});
    } else {
      res.status(404).render('error');
    }
  }).catch(function(err){
    res.status(500).render('error');
  });
});

//put to edit team
router.put('/teams/:id', function(req, res) {
  db.team.findById(req.params.id).then(function(team) {
    // if( ){
    //   req.flash('error', 'Team name already exists');
    //   res.send({msg: 'error'});
    // }
    if (team) {
      team.updateAttributes(req.body).then(function() {
        req.flash('success', 'Successfully edited your team');
        res.send({msg: 'success'});
      });
    } else {
      res.status(404).send({msg: 'error'});
    }
  }).catch(function(err) {
    res.status(500).send({msg: 'error'});
  });
});

//delete team
router.delete('/teams/:id', function(req, res){
  db.team.findById(req.params.id).then(function(team){
    if(team){
      team.destroy().then(function(){
        req.flash('success', 'Successfully deleted your team');
        res.send({msg: 'success'});
      })
    } else {
      res.status(404).send( {msg: 'error, try again'});
    }
  }).catch(function(err){
    res.status(500).send({ msg: 'error'});
  });
});


//get to display all tournaments created by logged in user
router.get("/tournaments", isLoggedIn, function(req, res){
  var user = req.user
  db.tournament.findAll({
    where: { userId: user.id },
    order: '"name" ASC'
  }).then(function(tournaments){
    res.render("manage/manageTournaments", { tournaments: tournaments })
  });//end then
});

//post to add teams to tournaments
router.post('/teams/enterTournament', function(req, res){
  
});

//get to display single tournament details
router.get('/tournaments/:id', function(req, res) {
  db.tournament.findById(req.params.id).then(function(tournament) {
    if (tournament) {
      res.render('manage/tournamentDetails', { tournament: tournament });
    } else {
      res.status(404).render('error');
    }
  }).catch(function(err) {
    res.status(500).render('error');
  });
});


//get edit team info
router.get('/tournaments/:id/edit', function(req, res){
  db.tournament.findById(req.params.id).then(function(tournament){
    if(tournament){
      res.render('manage/editTournament', { tournament: tournament });
    } else {
      res.status(404).render('error');
    }
  }).catch(function(err){
    res.status(500).render('error');
  });
});

//edit tournaments
router.put('/tournaments/:id', function(req, res) {
  db.tournament.findById(req.params.id).then(function(team) {
    if (team) {
      team.updateAttributes(req.body).then(function() {
        req.flash('success', 'Successfully edited your tournament');
        res.send({msg: 'success'});
      });
    } else {
      res.status(404).send({msg: 'error'});
    }
  }).catch(function(err) {
    res.status(500).send({msg: 'error'});
  });
});

//delete tournament
router.delete('/tournaments/:id', function(req, res){
  db.tournament.findById(req.params.id).then(function(tournament){
    if(tournament){
      tournament.destroy().then(function(){
        req.flash('success', 'Successfully deleted your tournament');
        res.send({msg: 'success'});
      })
    } else {
      res.status(404).send( {msg: 'error, try again'});
    }
  }).catch(function(err){
    res.status(500).send({ msg: 'error'});
  });
});



module.exports = router;
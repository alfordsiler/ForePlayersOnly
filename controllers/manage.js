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
    res.render('manage/manageTeams', { teams: teams });
  });//end then
});

//get to show all players with dropdown
router.get("/addplayers", isLoggedIn, function(req, res){
  var users;
  var teams;
  var user = req.user;
    //find all users
    db.user.findAll()
      .then(function(resultsUsers){
        users = resultsUsers;
      })
      //find all teams created by the current user
      .then(function(){
        return db.team.findAll({
          where: { userId: user.id },
          order: '"name" ASC'})
      }).then(function(resultsTeams){
        teams = resultsTeams;
      }).then(function(){
        res.render('manage/addplayers', { users: users, teams: teams });
      });
  });

//post to add user to team via dropdown selection
router.post('/addplayers', function(req, res){
  console.log(req.body);
  db.user.findOne({
    where: { id: req.body.userId }
  }).then(function(user){
    db.team.findOne({
      where: { id: req.body.teams }
    }).then(function(team){
      user.addTeam(team);
      req.flash('success', 'User added to ' + team.name);
      res.redirect('/manage/addplayers');
    });
  });
});

//post to add users to teams
router.post('/teams/:id', function(req, res){
  db.team.findById(req.params.id)
    .then(function(team){
  db.user.findOne({
    where: { id: req.body.user }
    }).then(function(user){
      team.addUser(user);
      req.flash('success', 'User added to ' + team.name);
      res.redirect('back');
    });
  });
});

//get to display players on each team
router.get('/teams/:id', isLoggedIn, function(req, res){
  var allUsers;
  var user = req.user;
  db.user.findAll()
  .then(function(resultsUsers){
    allUsers = resultsUsers;
  })
  .then(function(){
    console.log("req.params.id", req.params.id);
    return db.team.find({ 
      where: { id: req.params.id }
    }).then(function(team){
      team.getUsers().then(function(users){
        res.render('manage/teamDetails', { team: team, users: users, allUsers: allUsers });
      });
    });
  });
});

//get edit team info
router.get('/teams/:id/edit', function(req, res){
  db.team.findById(req.params.id)
  .then(function(team){
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
  db.team.findById(req.params.id)
  .then(function(team) {
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
  db.team.findById(req.params.id)
  .then(function(team){
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

//delete users from teams
router.delete('/teams/user/:id', function(req, res){
  console.log("in delete user")
  db.team.findById(req.params.id)
  .then(function(team){
    console.log("team", team);
    team.getUsers()
    .then(function(user){
      console.log("user", user);
      if(user){
        user.destroy()
        .then(function(){
          req.flash('success', 'Successfully removed player from team');
          res.send({msg: 'success'});
        })
      } else {
        res.status(404).send( {msg: 'error, try again'});
      }
    })
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
    res.render("manage/manageTournaments", { tournaments: tournaments });
  });//end then
});

//get to display single tournament details
router.get('/tournaments/:id', isLoggedIn, function(req, res){
  // var user = req.user;
  db.tournament.find({ 
    where: { id: req.params.id },
  }).then(function(tournament){
    tournament.getTeams().then(function(teams){
      res.render('manage/tournamentDetails', { tournament: tournament.name, teams: teams });
    });
  });//end then
});

//get edit tournament info
router.get('/tournaments/:id/edit', function(req, res){
  db.tournament.findById(req.params.id)
  .then(function(tournament){
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
  db.tournament.findById(req.params.id)
  .then(function(tournament) {
    if (tournament) {
      tournament.updateAttributes(req.body)
      .then(function() {
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
  db.tournament.findById(req.params.id)
  .then(function(tournament){
    if(tournament){
      tournament.destroy()
      .then(function(){
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
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

//get to display players on each team
router.get('/teams/:id', isLoggedIn, function(req, res){
  var allUsers;
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

//get to display all teams user can join
router.get('/joinTeam', isLoggedIn, function(req, res){
  var user = req.user;
  var users;
  db.team.findAll({
    order: '"name" ASC'
  }).then(function(teams){
    db.user.findAll()
    .then(function(creators){
      users = creators;
      res.render('manage/joinTeam', { teams: teams, user: user, users: users });
    });
  });//end then
});

//post for current user to join a team
router.post('/joinTeam', isLoggedIn, function(req, res){
  db.team.findById(req.body.teamId)
    .then(function(team){
  db.user.findOne({
    where: { id: req.body.userId } 
    }).then(function(user){
      team.addUser(user);
      req.flash('success', 'Successfully joined ' + team.name);
      res.redirect('back');
    });//end then
  });//end then
});

//post to add users to teams
router.post('/teams/:id', isLoggedIn, function(req, res){
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

//get edit team info
router.get('/teams/:id/edit', isLoggedIn, function(req, res){
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
router.put('/teams/:id', isLoggedIn, function(req, res) {
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
router.delete('/teams/:id', isLoggedIn, function(req, res){
  db.team.findById(req.params.id)
  .then(function(team){
    if(team){
      team.destroy()
      .then(function(){
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

//delete players from teams
// router.delete('/teams/:id/user', isLoggedIn, function(req, res){
//   console.log("in delete user");
//   db.team.findById(req.params.id)
//   .then(function(team){
//     console.log("team", team);
//     team.getUsers()
//     .then(function(user){
//       console.log("user", user);
//       if(user){
//         user.destroy()
//         .then(function(){
//           req.flash('success', 'Successfully removed player from team');
//           res.send({msg: 'success'});
//         })
//       } else {
//         res.status(404).send( {msg: 'error, try again'});
//       }
//     })
//   }).catch(function(err){
//     res.status(500).send({ msg: 'error'});
//   });
// });

//delete players from team
router.delete('/teams/:id', isLoggedIn, function(req, res){
  console.log("req.params", req.params);
  db.team.find({ 
      where: { id: req.params.id }
    }).then(function(team){
      team.getUsers()
      .then(function(user){
        user.destroy()
        .then(function(){
          req.flash('success', 'Successfully removed player from team');
          res.send({msg: 'success'});
        });
      });
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

//get to display players on each team
router.get('/tournaments/:id', isLoggedIn, function(req, res){
  var allTeams;
  db.team.findAll()
  .then(function(resultsTeams){
    allTeams = resultsTeams;
  })
  .then(function(){
    console.log("req.params.id", req.params.id);
    return db.tournament.find({ 
      where: { id: req.params.id }
    }).then(function(tournament){
      tournament.getTeams().then(function(teams){
        res.render('manage/tournamentDetails', { tournament: tournament, teams: teams, allTeams: allTeams });
      });
    });
  });
});

//post to add teams to tournaments
router.post('/tournaments/:id', isLoggedIn, function(req, res){
  db.tournament.findById(req.params.id)
    .then(function(tournament){
  db.team.findOne({
    where: { id: req.body.team }
    }).then(function(team){
      tournament.addTeam(team);
      req.flash('success', 'Team added to ' + tournament.name);
      res.redirect('back');
    });
  });
});

//get edit tournament info
router.get('/tournaments/:id/edit', isLoggedIn, function(req, res){
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
router.put('/tournaments/:id', isLoggedIn, function(req, res) {
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
router.delete('/tournaments/:id', isLoggedIn, function(req, res){
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
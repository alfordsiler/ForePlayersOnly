var express = require('express');
var router = express.Router();
var db = require('../models');
var passport = require('../config/ppConfig');
var isLoggedIn = require('../middleware/isLoggedIn');
var flash = require('connect-flash');

//get new tournament form
router.get('/new', isLoggedIn, function(req, res){
  res.render('tournament/newTournament');
});

//post the new tournament to table
router.post('/new', function(req, res){
  // console.log("/tournament/new", req.user);
  console.log("/tournament/new post req.body", req.body);
  var name = req.body.tournamentName;
  var format = req.body.format;
  var rules = req.body.rules;
  var course = req.body.course;
  var date = new Date(req.body.date);
  var entryFee = req.body.entryFee;
  var mulligans;
  if(req.body.mulligans === 'mulligans'){
    mulligans = true;
  } else {
    mulligans = false;
  };
  var mulliganInfo = req.body.mulliganInfo || null;
  var gimmies;
  if(req.body.gimmies === 'gimmies'){
    gimmies = true;
  } else {
    gimmies = false;
  };
  var gimmieInfo = req.body.gimmieInfo || null;
  var mealInfo = req.body.mealInfo || null;
  var details = req.body.details || null;
  var userId = req.user.id;

  db.tournament.findOrCreate({
    where: {name: name},
    defaults: {
      name: name,
      format: format,
      rules: rules,
      course: course,
      date: date,
      entryFee: entryFee,
      mulligans: mulligans,
      mulliganInfo: mulliganInfo,
      gimmies: gimmies,
      gimmieInfo: gimmieInfo,
      mealInfo: mealInfo,
      details: details,
      userId: userId
    }
  }).spread(function(user, created) {
    if(created) {
      req.flash('success','Created tournament successfull')
      res.redirect("/manage/tournaments")
    } 
    else {
      req.flash('error', 'Tournament name already exists, please choose a new name');
      res.redirect('/tournament/new');
    }
  }).catch(function(error) {
    req.flash('error', error.message);
    res.redirect('/tournament/new');
  });
});

// get to display all tournaments
router.get("/allTournaments", isLoggedIn, function(req, res){
  var tournaments;
  var teams;
  var user = req.user;
    db.tournament.findAll()
      .then(function(resultsTournaments){
        tournaments = resultsTournaments;
      })
      .then(function(){
        return db.team.findAll({
          where: { userId: user.id },
          order: '"name" ASC'})
      }).then(function(resultsTeams){
        teams = resultsTeams;
      }).then(function(){
        res.render('tournament/showTournaments', { tournaments: tournaments, teams: teams });
      });
  });

//post to add teams to tournaments
// router.post('/allTournaments', function(req, res){
//   console.log('tournaments to teams', req.body)
//   db.team.findOne({
//     where: { id: req.body.teams }
//   }).then(function(team){
    
//     team.addTournament(tournament);
//   })
// });

// app.post("/articles/new", function(req, res){
//     db.author.findOne({
//       where: {id: req.body.author }
//     }).then(function(author){
//       if(author) {
//         author.createArticle({
//           title: req.body.title,
//           content: req.body.content,
//         }).then(function(article){
//           if(tags.length > 0) {

//             async.forEachSeries(tags, function(tagName, callback){
//               db.tag.findOrCreate({
//                 where: {name: tagName}
//               }).spread(function(tag, wasCreated){
//                 if(tag){
//                   article.addTag(tag); //this creates the relation to the map table
//                 }
//                 callback(null);
//             });
//             }, function(err) {
//               res.redirect("/");
//             });//end of call
//       }
//       else {
//         res.send("author does not exist, try again")
//       }
//         }); //end() then for author
//       } //end if
//     });
//   }
// });

//get to display tournament details
router.get('/:id/details', isLoggedIn, function(req, res){
  res.render('/tournament/tournamentDetails');
});

module.exports = router;


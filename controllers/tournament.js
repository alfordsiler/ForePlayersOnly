var express = require('express');
var router = express.Router();
var db = require('../models');
var passport = require('../config/ppConfig');
var isLoggedIn = require('../middleware/isLoggedIn');

router.get('/new', isLoggedIn, function(req, res){
  res.render('tournament/newTournament');
});

//write a request on the backend to check for the 
//value of gimmies and mulligans to check if the value exists before writing to database
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
      req.flash('Created tournament successfull')
      res.redirect("/profile")
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

router.get("/allTournaments", function(req, res){
  db.tournament.findAll({
    include: [db.user],
    order: '"updatedAt" DESC'
  }).then(function(tournaments){
    res.render("tournament/showTournaments", { tournaments: tournaments })
  });//end then
});

router.get('/:id/details', isLoggedIn, function(req, res){
  res.render('/tournament/tournamentDetails');
});
//Get all posts using a certain tag
// app.get("/tag/:id", function(req, res){
//   db.tag.find({
//     where: { id: req.params.id }
//   }).then(function(tag){
//     tag.getArticles().then(function(articles){
//       res.render("tagDetails", { tagName: tag.name, articles: articles });
//     });
//   });//end then
// });

module.exports = router;


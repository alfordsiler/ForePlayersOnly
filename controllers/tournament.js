var express = require('express');
var router = express.Router();
// var db = require('../models');
// var passport = require('../config/ppConfig');

router.get('/new', function(req, res){
  res.render('tournament/newTournament');
});

router.get('/allTournaments', function(req, res){
  res.render('tournament/showTournaments');
});

router.get('/:id/details', function(req, res){
  res.render('tournament/tournamentDetails');
})


module.exports = router;

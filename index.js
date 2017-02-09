//Require
require('dotenv').config();
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var session = require('express-session');
var db = require('./models');
var app = express();
var passport = require('./config/ppConfig');
var isLoggedIn = require('./middleware/isLoggedIn');
var flash = require('connect-flash');
var request = require('request');

//use & set
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET_KEY || 'mysupercoolsecret',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
//flash middleware function
app.use(flash());
app.use(function(req, res, next){
  // console.log("locals user", req.user);
  res.locals.currentUser = req.user;
  res.locals.alerts = req.flash();
  next();
});

//routes
app.get('/', function(req, res) {
  res.render('index');
});

app.get('/dateSelector', function(req, res){
  res.render('dateSelector')
});

app.get('/dateSelectorResults', function(req, res){
  // console.log('req.query results: ' + req.query);
  var searchDate = req.query.searchDate;
  var searchState = req.query.state;
  var searchCity = req.query.city;
  var weatherApi = 'http://api.wunderground.com/api/39ef7c36a910c2ea/planner_' + searchDate
                   + searchDate + '/q/' + searchState + '/' + searchCity + '.json';
  // console.log('weather api address', weatherApi);
  request(weatherApi, function(error, response, body) {
    // console.log('Request weather seach body:', body);
    if(!error && response.statusCode == 200){
      var weatherResults = JSON.parse(body);
      res.render('results', { weather: weatherResults.trip });
    }
    else {
      req.flash('An error occured:' + error + 'Try your search again.');
      res.redirect('/dateSelector');
    }
  });
});

app.get('/contact', function(req, res){
  res.render('contact');
});

app.get('/signin', function(req, res){
  res.render('signin');
});

app.post('/signin', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/signin',
  failureFlash: 'Invalid username and/or password',
  successFlash: 'You have logged in'
}));

app.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You have logged out');
  res.redirect('/');
});

app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});

//controllers
app.use('/register', require('./controllers/register'));
app.use('/tournament', require('./controllers/tournament'));
app.use('/manage', require('./controllers/manage'));
// app.use('/view', require('./controllers/view'));

//listen
var server = app.listen(process.env.PORT || 3000);

module.exports = server;
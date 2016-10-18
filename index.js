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

//use & set
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(session({
  secret: process.env.SESSION_SECRET_KEY || 'mysupercoolsecret',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//flash middleware function
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.alerts = req.flash;
  next();
});

//routes
app.get('/', function(req, res) {
  res.render('index');
});

app.get('/courseSelector', function(req, res){
  res.render('courseSelector');
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

//dont want poeple to get to this page unless they are logged in
app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});

//controllers
app.use('/register', require('./controllers/register'));
app.use('/tournament', require('./controllers/tournament'));

//listen
var server = app.listen(process.env.PORT || 3000);

module.exports = server;
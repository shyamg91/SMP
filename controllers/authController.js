const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose')
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/projects',
  successFlash: 'You have now logged in!'
})

exports.facebookLogin = passport.authenticate('facebook', { scope: 'email' });

exports.facebookLoginCallback = passport.authenticate('facebook', {
  successRedirect: '/projects',
  failureRedirect: '/'
})

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out!');
  res.redirect('/');
}

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  req.flash('error', 'Whoops you need to login before you can create a project')
  res.redirect('/');

}
var config = require('../config');
var User = require('../models/User');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');

function register() {

}
function validateRefreshToken(req, res, next) {
  User.findOne({'refreshToken': req.body.refreshToken}, function (err, user) {
    if (err) {
      return next(err);
    }
    res.user = user;
    next();
  });
}

function rejectToken(req, res, next) {
  var token = req.body.refreshToken;
  User.findOneAndUpdate({'refreshToken': token}, {
      refreshToken: ''
    },
    function (err, doc) {
      if (err) return res.json(500, {error: err});
      return next();
    });
}

//////////////////////
// token generation //
//////////////////////
function generateAccessToken(req, res, next) {
  res.token = res.token || {};
  res.token.accessToken = 'JWT ' + jwt.sign({
      id: res.user.id
    }, config.auth.secret, {
      expiresIn: config.auth.expTime
    });
  next();
}

function generateRefreshToken(req, res, next) {
  // if (req.query.permanent === 'true') {
  res.token.refreshToken = res.user.id.toString() + '.' + crypto.randomBytes(40).toString('hex');
  User.findOneAndUpdate({'_id': res.user.id}, {
      refreshToken: res.token.refreshToken
    },
    function (err, doc) {
      if (err) return res.json(500, {error: err});
      return next();
    });
  /*} else {
   next();
   }*/
}

function checkLogin(req, res, next) {
  User.findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) throw err;

    if (!user) {
      res.send({success: false, message: 'Authentication failed. User not found.'});
    } else {
      // Check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          res.user = user;
          next();
        } else {
          res.send({success: false, message: 'Authentication failed. Passwords did not match.'});
        }
      });
    }
  });
}

module.exports = {
  generateAccessToken: generateAccessToken,
  generateRefreshToken: generateRefreshToken,
  rejectToken: rejectToken,
  validateRefreshToken: validateRefreshToken,
  checkLogin: checkLogin
};
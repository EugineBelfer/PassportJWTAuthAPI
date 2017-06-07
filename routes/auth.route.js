var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
var User = require('../models/User');
var config = require('../config');
var auth = require('../helpers/auth.helper');

// Register new users
router.post('/register', function (req, res) {
  if (!req.body.email || !req.body.password) {
    res.json({
      success: false,
      message: 'Please enter email and password.'
    });
  } else {
    var newUser = new User({
      email: req.body.email,
      password: req.body.password
    });

    // Attempt to save the user
    newUser.save(function (err) {
      if (err) {
        return res.json({
          success: false,
          message: 'That email address already exists.'
        });
      }
      res.json({
        success: true,
        message: 'Successfully created new user.'
      });
    });
  }
});

router.get('/', function (req, res) {
  User.find({}, function (err, users) {
    res.json(users);
  });
});

router.post('/auth',
  auth.checkLogin,
  auth.generateAccessToken,
  auth.generateRefreshToken,
  function (req, res) {
    res.json({
      success: true,
      token: res.token
    });
  });

router.post('/token',
  auth.validateRefreshToken,
  auth.generateAccessToken,
  auth.generateRefreshToken,
  function (req, res) {
    res.json({
      success: true,
      token: res.token
    })
  }
);

router.post('/token/reject', auth.rejectToken, function (req, res) {
  res.json({});
});


module.exports = router;
var express = require('express');
var passport = require('passport');
var router = express.Router();


const allowedOrigins = ['http://localhost:4200','http://localhost:5000'];

router.use(function(request, response, next) {
  var origin = request.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    response.setHeader('Access-Control-Allow-Origin', origin);
  }
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With,Authorization');
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
  response.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({message: 'App works'});
});

// Example of required auth: protect dashboard route with JWT
router.get('/dashboard', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  res.json({message: 'It works!'});
});
module.exports = router;

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var config = require('./index');
var User = require('../models/User');

// Setup work and export for the JWT passport strategy
module.exports = function(passport) {
  var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.auth.secret
  };

  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
      User.findOne({
      '_id': jwt_payload.id
    }, function(err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        done(null, user);
      } else {
        done(null, false);
}
});
}));
};
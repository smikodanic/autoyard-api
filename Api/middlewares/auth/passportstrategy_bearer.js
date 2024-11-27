/**
 * PassportJS authentication middleware
 * Passport-Http-Bearer STRATEGY
 * http://www.passportjs.org/packages/passport-http-bearer/
 *
 * $npm install --save passport-http-bearer
 *
 * Principles:
 * 1. HTTP header --> Authorization: Bearer <token>
 */
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;


// define strategy for Joint API
module.exports.defineStrategy4api = () => {

  passport.use('bearer-api', new BearerStrategy(async (token, done) => {
    // console.log('Bearer token (Joint API)):: ', token);

    if (token != process.env.API_TOKEN) { // when user is not found
      const err = new Error('Bad API Token.');
      err.status = 403;
      done(err, false);
    } else {
      done(null, { user_id: null });
    }
  }));
};

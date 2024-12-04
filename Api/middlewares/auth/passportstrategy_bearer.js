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
  passport.use('scraper-checker', new BearerStrategy(async (token, done) => {
    // console.log('(scraper-checker) Bearer token:: ', token);
    if (!process.env.API_TOKEN) {
      const err = new Error('API Token is not configured.');
      err.status = 500;
      return done(err, false);
    }

    if (token !== process.env.API_TOKEN) {
      const err = new Error('Bad API Token sent from the scraper or checker.');
      err.status = 403;
      done(err, false);
    } else {
      done(null, { user_id: null });
    }
  }));
};

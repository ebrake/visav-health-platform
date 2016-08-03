'use strict';

var loopback = require('loopback');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var uuid = require('uuid');
var _ = require('lodash');

var TWO_WEEKS = 60 * 60 * 24 * 7 * 2;

module.exports = function(app) {
  /*
   * The `app` object provides access to a variety of LoopBack resources such as
   * models (e.g. `app.models.YourModelName`) or data sources (e.g.
   * `app.datasources.YourDataSource`). See
   * http://docs.strongloop.com/display/public/LB/Working+with+LoopBack+objects
   * for more info.
   */

  /* FACEBOOK STRATEGY */
  // setup facebook strategy
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email', 'first_name', 'middle_name', 'last_name', 'link', 'picture.type(large)'],
    passReqToCallback: true
  }, providerFacebook));

  function providerFacebook(req, token, tokenSecret, profile, done) {
    providerHandler('facebook', req, token, tokenSecret, profile, done);
  }

  // initiate facebook authentication
  router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email', 'user_friends'],
    session: false
  }));

  // facebook callback
  // need access to the http context in order to handle login so wrap the passportResultHandler in closure
  router.get('/auth/facebook/callback', function (req, res, next) {
    passport.authenticate('facebook', function (err, user, info) {
      passportResultHandler('facebook', err, user, info, req, res, next);
    })(req, res, next);
  });
  /* END FACEBOOK STRATEGY */


  /* TIE INTO PERSON MODEL */
  // back from passport
  function passportResultHandler(provider, err, user, info, req, res, next) {
    var ctx = req.getCurrentContext();
    var currentUser = ctx.get('currentUser');

    if (err) {

      // id is already linked to a User or email address in use by a User
      if (err.message === "identity-already-linked" || err.message === "email-in-use") {
        console.log('error', 'passportResultHandler %j', err, {});
        return res.redirect('/?alert=' + err.message);
      }
      else { // something else went wrong in passport
        var e = new Error(err, 'passportResultHandler error');
        console.log(e.message);
        console.log(e.stack);
        return next(e);
      }
    }

    if (!user) { // user aborted authorization
      return res.redirect('/?alert=' + provider + '-link-failed');
    }

    // already logged in
    if (currentUser) {
      res.redirect('/');
    }
    else { // log the user in
      doLogin(user, function (err, accessToken) {
        res.cookie('access_token', accessToken.id, {
          signed: req.signedCookies ? true : false,
          maxAge: 1000 * accessToken.ttl
        });
        res.redirect('/');
      });
    }
  }

  // create an access token to log in the user
  function doLogin(user, cb) {

    UserModel.findById(user.id, function (err, user) {

      if (err) {
        var e = new Error(err, 'doLogin: User.findById error');
        return cb(e);
      }

      if (!user) {
        var e = new Error(err, 'doLogin: user not found id: %s', user.id);
        return cb(e);
      }

      user.createAccessToken(TWO_WEEKS, function (err, accessToken) {
        if (err) {
          var e = new Error(err, 'doLogin: user.createAccessToken error');
          return cb(e);
        }
        cb(null, accessToken);
      });

    });
  }

  // set up users and identities
  function providerHandler(provider, req, token, tokenSecret, profile, done) {
    var ctx = req.getCurrentContext();
    var currentUser = ctx.get('currentUser');

    var query = {
      'where': {
        'and': [{
          'provider': provider
        }, {
          'externalId': profile.id
        }]
      },
      'include': ['user']
    };

    server.models.UserIdentity.findOne(query, function (err, identity) {
      if (err) {
        var e = new Error(err, 'providerHandler: UserIdentity.findOne error');
        return done(e);
      }

      // logged in, link account to current user
      if (currentUser) {

        // if identity found, does it belong to the current logged in user?
        if (identity && identity.userId !== currentUser.id) {
          var e = new Error('identity-already-linked');
          return done(e);
        }

        // create identity if it does not exist
        if (!identity) {
          identity = {
            provider: provider,
            externalId: profile.id,
            userId: currentUser.id
          };
        }

        // update with current info from profile
        identity.credentials = {
          token: token,
          secret: tokenSecret
        };
        identity.profile = profile;

        server.models.UserIdentity.upsert(identity, function (err, identity) {
          if (err) {
            var e = new Error(err, 'providerHandler: UserIdentity.upsert error');
            return done(e);
          }

          // already logged in so just pass user back to passport
          return done(null, currentUser, null);
        });
      }
      else {
        if (identity) {
          // UserIdentity exists for profile id, update UserIdentity with new token and profile and login
          identity.credentials = {
            token: token,
            secret: tokenSecret
          };
          identity.profile = profile;

          identity.save(function (err) {
            if (err) {
              var e = new Error(err, 'providerHandler: UserIdentity.save');
              return done(e);
            }

            done(null, identity.user());
          });
        }
        else {

          // identity does not exist for this profile id, create a user and identity and login
          var user = {
            username: 'passport-user-' + uuid.v4(),
            email: 'passport-user-' + uuid.v4() + '-' + profile.id + '@digitopia.com',
            password: uuid.v4(),
            status: 'active'
          };

          user = profileToUser(profile, user); // get name and email etc from passport profile

          // create the User
          UserModel.findOne({
            'where': {
              'email': user.email
            }
          }, function (err, existingUser) {
            if (err) {
              var e = new Error(err, 'providerHandler: User.findOne error');
              return done(e);
            }

            if (existingUser) {
              var e = new Error('email-in-use');
              return done(e);
            }

            UserModel.create(user, function (err, user) {
              if (err) {
                var e = new Error(err, 'providerHandler: User.create error');
                return done(e);
              }

              // create a UserIdentity for the user

              identity = {
                provider: 'facebook',
                externalId: profile.id,
                credentials: {
                  token: token,
                  secret: tokenSecret
                },
                profile: profile,
                userId: user.id
              };

              server.models.UserIdentity.create(identity, function (err, identity) {

                if (err) {
                  var e = new Error(err, 'providerHandler: UserIdentity.create error');
                  return done(e);
                }

                done(null, user);
              });
            });
          });
        }
      }
    });
  }

  // extract values from passport profile
  function profileToUser(profile, user) {

    if (_.has(profile, 'emails[0].value')) {
      user.email = _.get(profile, 'emails[0].value');
    }

    if (!user.firstName) {
      if (_.get(profile, 'name.givenName')) {
        user.firstName = profile.name.givenName;
      }
      if (_.get(profile, 'name.middleName')) {
        user.firstName += ' ' + profile.name.middleName;
      }
    }

    if (!user.lastName) {
      if (_.get(profile, 'name.familyName')) {
        user.lastName = profile.name.familyName;
      }
    }

    return user;
  }

  /* END TIE INTO PERSON MODEL */
};

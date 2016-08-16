var GLOBAL_CONFIG = require('../../global.config');

module.exports = function(Person) {
  Person.remoteCreate = function(req, cb) {
    if (!req.body.email) return cb(null, { error: new Error('No email!'), type: 'email', status: 'error' });
    if (!req.body.password) return cb(null, { error: new Error('No password!'), type: 'password', status: 'error' });

    Person.create({
      email: req.body.email.toLowerCase(),
      password: req.body.password
    }, function(err, createdUser){
      if (err) {
        return cb(null, { error: err, type: 'signup', status: 'error' });
      }

      console.log("Created user "+req.body.email);

      return cb(null, createdUser);
    }) 
  }

  //send verification email after registration
  Person.afterRemote('remoteCreate', function(context, createdObject, next) {

    var createdUser = createdObject.user;

    Person.app.models.Email.send({
      to: createdUser.email,
      from: GLOBAL_CONFIG.SYSTEM_EMAIL,
      subject: 'Welcome to VISAV',
      html: "Account created"
    }, function(err) {
      if (err) return next(err);
      next();
    });

  });

  Person.remoteMethod(
    "remoteCreate",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } }
      ],
      http: { path: '/create', verb: 'post' },
      returns: { arg: 'user', type: 'object' },
      description: "Accepts a new user's email and password, returns the created user"
    }
  );

  Person.remoteLogin = function(req, cb){
    if (!req.body.email) return cb(null, { error: new Error('No email!'), type: 'email', status: 'error' });
    if (!req.body.password) return cb(null, { error: new Error('No password!'), type: 'password', status: 'error' });

    Person.login({
      email: req.body.email.toLowerCase(),
      password: req.body.password
    }, 'user', function(err, token){
      if (err) {
        return cb(null, { error: err, type: 'login', status: 'error' });
      }

      delete token.user.password;
      console.log("Logged in user "+req.body.email);

      return cb(null, token);
    })
  }

  Person.remoteMethod(
    "remoteLogin",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } }
      ],
      http: { path: '/login', verb: 'post' },
      returns: { arg: 'token', type: 'object' },
      description: "Accepts a user's email and password, returns an access token"
    }
  );
}
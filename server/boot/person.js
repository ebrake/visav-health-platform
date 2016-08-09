'use strict';

var loopback = require('loopback');

module.exports = function(app) {

  app.post('/user/create', function(req, res, next){
    var Person = app.models.Person;

    if (!req.body.email) return res.send({ error: new Error('No email!'), type: 'email', status: 'error' });
    if (!req.body.password) return res.send({ error: new Error('No password!'), type: 'password', status: 'error' });

    Person.create({
      email: req.body.email.toLowerCase(),
      password: req.body.password
    }, function(err, createdUser){
      if (err) {
        return res.send({ error: err, type: 'signup', status: 'error' })
      }

      console.log("Created user "+req.body.email);

      return res.send({user: createdUser});
    })
  })

  app.post('/user/login', function(req, res, next){
    var Person = app.models.Person; 

    if (!req.body.email) return res.send({ error: new Error('No email!'), type: 'email', status: 'error' });
    if (!req.body.password) return res.send({ error: new Error('No password!'), type: 'password', status: 'error' });

    Person.login({
      email: req.body.email.toLowerCase(),
      password: req.body.password
    }, 'user', function(err, token){
      if (err) {
        return res.send({ error: err, type: 'login', status: 'error' });
      }

      delete token.user.password;
      console.log("Logged in user "+req.body.email);

      return res.send({ token: token });
    })
  })

};
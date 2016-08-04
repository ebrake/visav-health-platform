'use strict';

var loopback = require('loopback');

module.exports = function(app) {

  app.post('/user/create', function(req, res, next){
    var Person = app.models.Person;

    if (!req.body.email) return res.send({ error: new Error('No email!'), type: 'email', status: 'error' });
    if (!req.body.password) return res.send({ error: new Error('No password!'), type: 'password', status: 'error' });

    Person.create({
      email: req.body.email,
      password: req.body.password
    }, function(err, createdUser){
      if (err) return res.send({ error: error, type: 'signup', status: 'error' })

      res.send({user: createdUser});
    })
  })

  app.post('/user/login', function(req, res, next){
    var Person = app.models.Person; 

    if (!req.body.email) return res.send({ error: new Error('No email!'), type: 'email', status: 'error' });
    if (!req.body.password) return res.send({ error: new Error('No password!'), type: 'password', status: 'error' });

    Person.login({
      email: req.body.email,
      password: req.body.password
    }, 'user', function(err, token){
      if (err) return res.send({ error: error, type: 'login', status: 'error' });

      res.send({token: token});
    })
  })

};

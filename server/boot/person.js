'use strict';

var loopback = require('loopback');

module.exports = function(app) {

  app.post('/user/create', function(req, res, next){
    var Person = app.models.Person;

    var email = req.body.email;
    if (!email) return console.log('No email!');
    var password = req.body.password;
    if (!password) return console.log('No password!');

    Person.create({
      email: email,
      password: password
    }, function(err, createdUser){
      if (err) return console.log(err);

      res.send({user: createdUser});
    })
  })

  app.post('/user/login', function(req, res, next){
    var Person = app.models.Person; 

    Person.login({
      email: req.body.email,
      password: req.body.password
    }, 'user', function(err, token){
      if (err) return console.log(err);

      res.send({token: token});
    })
  })

};

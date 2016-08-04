'use strict';

var loopback = require('loopback');

module.exports = function(app) {

  app.post('/login', function(req, res, next){
    var Person = app.models.Person; 

    Person.login({
      email: req.body.email,
      password: req.body.password
    }, 'user', function(err, token){
      console.log(err);
      console.log(token);
    })
  })

};

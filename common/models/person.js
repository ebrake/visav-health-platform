import React from 'react';
import Oy from 'oy-vey';
import GettingStartedEmail from '../../client/src/components/email-templates/GettingStartedEmail';

var path = require('path');

module.exports = function(Person) {

  Person.createUser = function(req, cb) {
    var err;
    if(!req.body.email){
      err = new Error('Valid email required on req.body.email');
      err.statusCode = 417;
      err.code = 'PERSON_CREATE_FAILED_MISSING_REQUIREMENTS';
      return cb(err, { status: 'failure', message: err.message });
    }
    if(!req.body.password){
      err = new Error('Valid password required on req.body.password');
      err.statusCode = 417;
      err.code = 'PERSON_CREATE_FAILED_MISSING_REQUIREMENTS';
      return cb(err, { status: 'failure', message: err.message });
    }

    Person.create({
      email: req.body.email.toLowerCase(),
      password: req.body.password
    }, function(err, createdUser){
      if (err) return cb(err, { status: 'failure', message: err.message });
      

      console.log("Created user "+req.body.email);

      return cb(null, { status: 'success', message: 'Successfully created user with email: ' + req.body.email, user: createdUser });
    }) 
  }

  //send verification email after registration
  Person.afterRemote('createUser', function(context, response, next) {

    if (response.data.status == 'failure') {
      return next();
    }

    // TODO: Add e-mail to database queue if sending fails

    var user = response.data.user;
    Person.app.models.Email.send({
      to: user.email,
      from: Person.app.globalConfig.SYSTEM_EMAIL,
      subject: 'Welcome to '+Person.app.globalConfig.APP_NAME,
      html: Oy.renderTemplate(<GettingStartedEmail user={user} />, {
        title: 'Getting Started with '+Person.app.globalConfig.APP_NAME,
        previewText: 'Welcome to '+Person.app.globalConfig.APP_NAME+'...'
      })
    }, function(err) {
      if (err) return next(err);
      next();
    });

  });

  Person.loginUser = function(req, cb){
    var err;
    if(!req.body.email){
      err = new Error('Valid email required on req.body.email');
      err.statusCode = 417;
      err.code = 'PERSON_LOGIN_FAILED_MISSING_REQUIREMENTS';
      return cb(err, { status: 'failure', message: err.message });
    }
    if(!req.body.password){
      err = new Error('Valid password required on req.body.password');
      err.statusCode = 417;
      err.code = 'PERSON_LOGIN_FAILED_MISSING_REQUIREMENTS';
      return cb(err, { status: 'failure', message: err.message });
    }
    Person.login({
      email: req.body.email.toLowerCase(),
      password: req.body.password
    }, 'user', function(err, token){
      if (err) return cb(err, { status: 'failure', message: err.message });

      delete token.user.password;
      console.log("Logged in user "+req.body.email);

      return cb(null, { status: 'success', message: 'Successfully logged in user with email: ' + req.body.email, token:token});
    })
  }

  Person.remoteMethod(
    "createUser",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } }
      ],
      http: { path: '/createUser', verb: 'post' },
      returns: { arg: 'data', type: 'object' },
      description: "Accepts a new user's email and password, returns the created user"
    }
  );

  Person.remoteMethod(
    "loginUser",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } }
      ],
      http: { path: '/loginUser', verb: 'post' },
      returns: { arg: 'data', type: 'object' },
      description: "Accepts a user's email and password, returns an access token"
    }
  );
}
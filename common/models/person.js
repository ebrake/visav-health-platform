import React from 'react';
import Oy from 'oy-vey';
import GettingStartedEmail from '../../public/email-templates/GettingStartedEmail.jsx';

var GLOBAL_CONFIG = require('../../global.config');
var path = require('path');

module.exports = function(Person) {
  Person.remoteCreate = function(req, cb) {
    if (!req.body.email) return cb(null, { error: new Error('No email!'), type: 'Please provide a valid email address', status: 'error' });
    if (!req.body.password) return cb(null, { error: new Error('No password!'), type: 'No password was provided', status: 'error' });

    Person.create({
      email: req.body.email.toLowerCase(),
      password: req.body.password
    }, function(err, createdUser){
      if (err) {
        var type = 'Issue creating account. Please try again later';
        if (err.message.toLowerCase().indexOf('email already exists') >= 0) type = 'Email is already in use';
        return cb(null, { error: err, type: type, status: 'error' });
      }

      console.log("Created user "+req.body.email);

      return cb(null, createdUser);
    }) 
  }

  //send verification email after registration
  Person.afterRemote('remoteCreate', function(context, createdObject, next) {

    if (createdObject.user.status == 'error') {
      return next();
    }

    // TODO: Add e-mail to database queue if sending fails

    var createdUser = createdObject.user;
    Person.app.models.Email.send({
      to: createdUser.email,
      from: GLOBAL_CONFIG.SYSTEM_EMAIL,
      subject: 'Welcome to VISAV',
      html: Oy.renderTemplate(<GettingStartedEmail user={createdUser} />, {
        title: 'Getting Started with VISAV',
        previewText: 'Welcome to VISAV...'
      })
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
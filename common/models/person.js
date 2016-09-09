import React from 'react';
import Oy from 'oy-vey';
import GettingStartedEmail from '../../client/src/components/email-templates/GettingStartedEmail';

var globalConfig = require('../../global.config');
var path = require('path');

module.exports = function(Person) {

  Person.remoteCreate = function(req, cb) {
    if (!req.body.email) 
      return cb(null, { error: new Error('No email!'), type: 'Please provide a valid email address', status: 'error' });
    if (!req.body.password) 
      return cb(null, { error: new Error('No password!'), type: 'No password was provided', status: 'error' });
    if (!req.body.organization) 
      return cb(null, { error: new Error('No organization!'), type: 'No organization name provided', status: 'error' });

    Person.create({
      email: req.body.email.toLowerCase(),
      password: req.body.password
    })
    .then(function(createdUser){
      console.log("Created user "+req.body.email);

      return req.app.models.Role.findOne({
        where: { name: 'doctor' }
      })
      .then(function(role){
        role.principals.create({ 
          principalType: req.app.models.RoleMapping.USER,
          principalId: createdUser.id
        })
        .then(function(principal){
          console.log('Successfully created user role:');
          console.log(principal);
        })
        .catch(function(err){
          console.log('Error assigning role to user. Ignoring.');
          console.log(err);
        });

        return cb(null, createdUser);
      })

    }).catch(function(err){
      var type = 'Issue creating account. Please try again later';

      if (err && err.message && err.message.toLowerCase().indexOf('email already exists') >= 0) 
        type = 'Email is already in use';

      return cb(null, { error: err, type: type, status: 'error' });
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
      from: globalConfig.SYSTEM_EMAIL,
      subject: 'Welcome to '+globalConfig.APP_NAME,
      html: Oy.renderTemplate(<GettingStartedEmail user={createdUser} />, {
        title: 'Getting Started with '+globalConfig.APP_NAME,
        previewText: 'Welcome to '+globalConfig.APP_NAME+'...'
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
      http: { path: '/signin', verb: 'post' },
      returns: { arg: 'token', type: 'object' },
      description: "Accepts a user's email and password, returns an access token"
    }
  );
}
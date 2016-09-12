import React from 'react';
import Oy from 'oy-vey';
import GettingStartedEmail from '../../client/src/components/email-templates/GettingStartedEmail';

var globalConfig = require('../../global.config');
var path = require('path');

function checkForUniqueOrganizationAndPerson(email, Person, orgName, Organization) {
  return Promise.all([
    Person.find({
      where: { email: email }
    }),
    Organization.find({ 
      where: { name: orgName }
    })
  ])
}

function createResponseData(email, password, Person, orgName, Organization, queryResult) {
  if (queryResult[0].length > 0) {
    return  Promise.resolve({ 
              error: new Error('Email already in use'), 
              type: 'email', 
              status: 'error' 
            });
  } else if (queryResult[1].length > 0) {
    return  Promise.resolve({ 
              error: new Error('An organization already exists with that name'), 
              type: 'organization', 
              status: 'error' 
            });
  } else {
    return Promise.all([
      Organization.create({
        name: orgName
      }),
      Person.create({
        email: email,
        password: password
      })
    ])
    .then(function(created){
      created = {
        organization: created[0],
        user: created[1]
      };

      created.organization.owner = created.user.id;
      created.organization.save();

      created.user.organization = created.organization.id;
      created.user.save();

      return created;
    })
  }
}

function assignOwnerRole(created, Role, RoleMapping) {
  if (!created) {
    return Promise.reject(new Error("Issue creating user"));
  } else if (created.status == 'error') {
    return Promise.resolve(created);
  }

  return Role.findOne({
    where: { name: 'owner' }
  })
  .then(function(role){
    return role.principals.create({ 
      principalType: RoleMapping.USER,
      principalId: created.user.id
    })
  }).then(function(principal){
    return created;
  })
}

module.exports = function(Person) {

  Person.remoteCreate = function(req, cb) {
    if (!req.body.email) 
      return cb(null, { error: new Error('No email!'), type: 'Please provide a valid email address', status: 'error' });
    if (!req.body.password) 
      return cb(null, { error: new Error('No password!'), type: 'No password was provided', status: 'error' });
    if (!req.body.organization) 
      return cb(null, { error: new Error('No organization!'), type: 'No organization name provided', status: 'error' });

    var Role = req.app.models.Role
      , RoleMapping = req.app.models.RoleMapping
      , Organization = req.app.models.Organization
      , email = req.body.email
      , password = req.body.password
      , orgName = req.body.organization;

    return checkForUniqueOrganizationAndPerson(email, Person, orgName, Organization)
    .then(function(queryResult){
      return createResponseData(email, password, Person, orgName, Organization, queryResult);
    })
    .then(function(created){
      return assignOwnerRole(created, Role, RoleMapping)
    })
    .then(function(data){
      return data;
    }, function(err){
      return { error: err, type: 'general', status: 'error' };
    })
  }

  //send verification email after registration
  Person.afterRemote('remoteCreate', function(context, createdObject, next) {
    if (!createdObject || !createdObject.data || createdObject.data.status == 'error') {
      return next();
    }

    // TODO: Add e-mail to database queue if sending fails
    var createdUser = createdObject.data.user;
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
      returns: { arg: 'data', type: 'object' },
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
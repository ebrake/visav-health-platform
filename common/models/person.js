import React from 'react';
import Oy from 'oy-vey';
import GettingStartedEmail from '../../client/src/components/email-templates/GettingStartedEmail';

var path = require('path');

module.exports = function(Person) {

  Person.signup = function(req, cb) {
    if (!req.body.email) 
      return cb(null, { error: new Error('No email!'), type: 'email', status: 'error' });
    if (!req.body.password) 
      return cb(null, { error: new Error('No password!'), type: 'password', status: 'error' });
    if (!req.body.organization) 
      return cb(null, { error: new Error('No organization!'), type: 'organization', status: 'error' });

    var Role = req.app.models.Role
      , RoleMapping = req.app.models.RoleMapping
      , Organization = req.app.models.Organization
      , email = req.body.email
      , password = req.body.password
      , orgFilter = { name: req.body.organization };

    return findPersonAndOrganization(email, Person, orgFilter, Organization)
    .then(function(queryResult){
      if (queryResult[0]) {
        return { 
          error: new Error('Email already in use'), 
          type: 'email', 
          status: 'error' 
        };
      } else if (queryResult[1]) {
        return { 
          error: new Error('An organization already exists with that name'), 
          type: 'organization', 
          status: 'error' 
        };
      } else {
        var personData = {
          email: email,
          password: password
        };

        return Organization.create(orgFilter)
        .then(function(createdOrganization){
          console.log('Organization created: '+createdOrganization.name);
          
          return createPersonWithRoleAndBindToOrganization(personData, 'owner', Person, createdOrganization, Role, RoleMapping);
        })
      }
    })
    .then(function(data){
      return data;
    }, function(err){
      console.log('Error signing up person/organization:');
      console.log(err);
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
      from: Person.app.globalConfig.SYSTEM_EMAIL,
      subject: 'Welcome to '+Person.app.globalConfig.APP_NAME,
      html: Oy.renderTemplate(<GettingStartedEmail user={createdUser} />, {
        title: 'Getting Started with '+Person.app.globalConfig.APP_NAME,
        previewText: 'Welcome to '+Person.app.globalConfig.APP_NAME+'...'
      })
    }, function(err) {
      if (err) return next(err);
      next();
    });

  });

  Person.remoteMethod(
    "signup",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } }
      ],
      http: { path: '/signup', verb: 'post' },
      returns: { arg: 'data', type: 'object' },
      description: "Accepts a new user's email and password, returns the created user"
    }
  );

  Person.signin = function(req, cb){
    if (!req.body.email) return cb(null, { error: new Error('No email!'), type: 'email', status: 'error' });
    if (!req.body.password) return cb(null, { error: new Error('No password!'), type: 'password', status: 'error' });

    return Promise.all([
      Person.login({
        email: req.body.email.toLowerCase(),
        password: req.body.password
      }),
      Person.findOne({
        where: { email: req.body.email }
      })
    ])
    .then(function(data){
      data = {
        token: data[0],
        user: data[1]
      };

      return data;
    })
    .catch(function(err){
      return { error: err, type: 'login', status: 'error' };
    })
  }

  Person.remoteMethod(
    "signin",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } }
      ],
      http: { path: '/signin', verb: 'post' },
      returns: { arg: 'data', type: 'object' },
      description: "Accepts a user's email and password, returns an access token"
    }
  );

  Person.invite = function(req, cb) {
    if (!req.body.email) 
      return cb(null, { error: new Error('No email!'), type: 'email', status: 'error' });
    if (!req.body.role) 
      return cb(null, { error: new Error('No role!'), type: 'role', status: 'error' });
    if (!req.user.organization)
      return cb(null, { error: new Error('No organization associated with user!'), type: 'organization', status: 'error' });

    var email = req.body.email;
    var roleToAssign = req.body.role;
    var orgFilter = { id: req.user.organization.id };
    var Organization = req.app.models.Organization;
    var Person = req.app.models.Person;
    var Role = req.app.models.Role;
    var RoleMapping = req.app.models.RoleMapping;

    return findPersonAndOrganization(email, Person, orgFilter, Organization)
    .then(function(queryResult){
      if (queryResult[0]) {
        return { 
          error: new Error('Email already in use'), 
          type: 'email', 
          status: 'error' 
        };
      } else if (!queryResult[1]){
        //shouldn't be possible but worth handling
        return {
          error: new Error('No organization associated with user!'),
          type: 'organization',
          status: 'error'
        }
      } else {
        var personData = {
          email: email,
          password: 'testtest'
        };
        var foundOrganization = queryResult[1];

        return createPersonWithRoleAndBindToOrganization(personData, roleToAssign, Person, foundOrganization, Role, RoleMapping);
      }
    })
    .then(function(data){
      return data;
    }, function(err){
      console.log('Error inviting person to organization:');
      console.log(err);
      return { error: err, type: 'general', status: 'error' };
    })
  }

  Person.remoteMethod(
    "invite",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } }
      ],
      http: { path: '/invite', verb: 'post' },
      returns: { arg: 'data', type: 'object' },
      description: "Takes in an email and role for a new user, creates their account and emails an invite to them."
    }
  );

  Person.updateUser = function(req, cb) {
    req.user.updateAttributes(req.body, function(err, updatedUser){
      if (err) return cb(err, { status: 'failure', message: err.message });
      else return cb(null, { status: 'success', message: 'Updated user '+req.user.email, user: updatedUser });
    });
  }

  Person.remoteMethod(
    "updateUser",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } }
      ],
      http: { path: '/update-user', verb: 'post' },
      returns: { arg: 'data', type: 'object' },
      description: "Update currently logged in user's information"
    }
  )
}

function findPerson(email, Person) {
  return Person.findOne({
    where: { email: email }
  })
}

function findOrganization(whereObject, Organization) {
  return Organization.findOne({
    where: whereObject
  })
}

function findPersonAndOrganization(email, Person, orgFilter, Organization) {
  return Promise.all([
    findPerson(email, Person),
    findOrganization(orgFilter, Organization)
  ])
}

function createPersonWithRoleAndBindToOrganization(personData, roleToAssign, Person, organization, Role, RoleMapping) {
  return Person.create(personData)
  .then(function(createdPerson){
    if (roleToAssign === 'owner'){
      organization.owner = createdPerson.id;
      organization.save();
    }

    createdPerson.organization = organization.id;
    createdPerson.save();

    console.log('User created: '+createdPerson.email);

    return assignRole(createdPerson, roleToAssign, Role, RoleMapping)
    .then(function(updatedUser){
      return {
        user: updatedUser,
        organization: organization
      };
    })
  })
}

function assignRole(user, roleName, Role, RoleMapping) {
  roleName = roleName.toLowerCase();

  if (!user) {
    return Promise.reject(new Error("Issue creating user"));
  } else if (user.status == 'error') {
    return Promise.resolve(user);
  }

  return Role.findOne({
    where: { name: roleName }
  })
  .then(function(role){
    if (!role) {
      return Promise.reject(new Error("No role with this name exists!"))
    } else {
      return role.principals.create({ 
        principalType: RoleMapping.USER,
        principalId: user.id
      })
    }
  }).then(function(principal){
    return user;
  })
}
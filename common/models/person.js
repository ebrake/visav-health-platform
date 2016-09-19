import React from 'react';
import Oy from 'oy-vey';
import GettingStartedEmail from '../../client/src/components/email-templates/GettingStartedEmail';

var path = require('path');

module.exports = function(Person) {

  Person.signup = function(req, email, password, organizationName, cb) {
    var err;

    if(!req.body.email){
      err = new Error('Valid email required on req.body.email');
      err.statusCode = 417;
      err.code = 'PERSON_CREATE_FAILED_MISSING_REQUIREMENT_EMAIL';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

    if(!req.body.password){
      err = new Error('Valid password required on req.body.password');
      err.statusCode = 417;
      err.code = 'PERSON_CREATE_FAILED_MISSING_REQUIREMENT_PASSWORD';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

    if(!req.body.organizationName){
      err = new Error('Valid organization required on req.body.organizationName');
      err.statusCode = 417;
      err.code = 'PERSON_CREATE_FAILED_MISSING_REQUIREMENT_ORGANIZATIONNAME';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

    var orgFilter = { name: req.body.organizationName };

    return findPersonAndOrganization(req, req.body.email, orgFilter)
    .then(function(queryResult){
      if (queryResult[0]) {
        err = new Error('A person with this email has already been created');
        err.statusCode = 422;
        err.code = 'PERSON_CREATE_FAILED_INVALID_REQUIREMENT_DUPLICATE_EMAIL';
        throw err;
      } 
      else if (queryResult[1]) {
        err = new Error('An organization with this name has already been created');
        err.statusCode = 422;
        err.code = 'PERSON_CREATE_FAILED_INVALID_REQUIREMENT_DUPLICATE_ORGANIZATIONNAME';
        throw err;
      } 
      else {
        var personData = {
          email: req.body.email.toLowerCase(),
          password: req.body.password
        };

        return req.app.models.Organization.create(orgFilter)
        .then(function(createdOrganization){
          console.log('Organization created: '+createdOrganization.name);
          
          return createPersonWithRoleAndBindToOrganization(req, personData, 'owner', createdOrganization);
        })
      }
    })
    .then(function(data){
      return cb(null, {status: 'success', user: data.user, organization: data.organization });
    }, function(err){
      return cb(null, { status: 'failure', message: err.message, error: err });
    })
  }

  Person.remoteMethod(
    "signup",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'email', type: 'string' },
        { arg: 'password', type: 'string' },
        { arg: 'organizationName', type: 'string' }
      ],
      http: { path: '/signup', verb: 'post' },
      returns: { arg: 'data', type: 'object' },
      description: "Accepts a new user's email and password, returns the created user"
    }
  );

  //send verification email after registration
  Person.afterRemote('signup', function(context, createdObject, next) {
    if (!createdObject || !createdObject.data || createdObject.data.status == 'failure') {
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

  Person.signin = function(req, email, password, cb){
    var err;
    if(!req.body.email){
      err = new Error('Valid email required on req.body.email');
      err.statusCode = 417;
      err.code = 'PERSON_SIGNIN_FAILED_MISSING_REQUIREMENT_EMAIL';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    if(!req.body.password){
      err = new Error('Valid password required on req.body.password');
      err.statusCode = 417;
      err.code = 'PERSON_SIGNIN_FAILED_MISSING_REQUIREMENT_PASSWORD';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

    return Promise.all([
      Person.login({
        email: req.body.email.toLowerCase(),
        password: req.body.password
      }),
      Person.findOne({
        where: { email: req.body.email.toLowerCase() }
      })
    ])
    .then(function(data){
      var message = 'Signed in user with email '+data[1].email
      console.log(message);
      return cb(null, { status: 'success', token: data[0], user: data[1], message: message })
    })
    .catch(function(err){
      console.log('Issue signing in user: '+err.message);
      return cb(null, { status: 'failure', message: err.message, error: err });
    })
  }

  Person.remoteMethod(
    "signin",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'email', type: 'string' },
        { arg: 'password', type: 'string' }
      ],
      http: { path: '/signin', verb: 'post' },
      returns: { arg: 'data', type: 'object' },
      description: "Accepts a user's email and password, returns an access token"
    }
  );

  Person.invite = function(req, email, role, cb) {
    var err;
    if(!req.body.email){
      err = new Error('Valid email required on req.body.email');
      err.statusCode = 417;
      err.code = 'PERSON_CREATE_FAILED_MISSING_REQUIREMENT_EMAIL';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    if(!req.body.role){
      err = new Error('Valid Role required on req.body.role');
      err.statusCode = 417;
      err.code = 'PERSON_CREATE_FAILED_MISSING_REQUIREMENT_ROLE';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    if(!req.user.organization){
      err = new Error('No organization associated with user. Valid organization required on req.user.organization.');
      err.statusCode = 417;
      err.code = 'PERSON_CREATE_FAILED_MISSING_REQUIREMENT_NO_ORGANIZATION';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

    var email = req.body.email.toLowerCase();
    var roleToAssign = req.body.role;
    var orgFilter = { id: req.user.organization.id };

    return findPersonAndOrganization(req, email, orgFilter)
    .then(function(queryResult){
      if (queryResult[0]) {
        err = new Error('A Person with this email has already been created.');
        err.statusCode = 422;
        err.code = 'PERSON_INVITE_FAILED_INVALID_REQUIREMENT_DUPLICATE_EMAIL';
        throw err;
      } else if (!queryResult[1]){
        //shouldn't be possible but we'll handle it anyways
        err = new Error('This organization does not exist.');
        err.statusCode = 422;
        err.code = 'PERSON_INVITE_FAILED_INVALID_REQUIREMENT_NO_ORGANIZATION';
        throw err;
      } else {
        var personData = {
          email: email,
          password: 'testtest'
        };
        var foundOrganization = queryResult[1];

        return createPersonWithRoleAndBindToOrganization(req, personData, roleToAssign, foundOrganization);
      }
    })
    .then(function(data){
      return cb(null, { status: 'success', user: data.user, organization: data.organization });
    }, function(err){
      console.log('Error inviting person to organization:');
      console.log(err);
      return cb(null, { status: 'failure', message: err.message, error: err });
    })
  }

  Person.remoteMethod(
    "invite",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'email', type: 'string' },
        { arg: 'role', type: 'string' }
      ],
      http: { path: '/invite', verb: 'post' },
      returns: { arg: 'data', type: 'object' },
      description: "Takes in an email and role for a new user, creates their account and emails an invite to them."
    }
  );
}

function findPerson(req, email) {
  var Person = req.app.models.Person;
  return Person.findOne({
    where: { email: email }
  })
}

function findOrganization(req, whereObject) {
  var Organization = req.app.models.Organization;
  return Organization.findOne({
    where: whereObject
  })
}

function findPersonAndOrganization(req, email, orgFilter) {
  return Promise.all([
    findPerson(req, email),
    findOrganization(req, orgFilter)
  ])
}

function createPersonWithRoleAndBindToOrganization(req, personData, roleToAssign, organization) {
  var Person = req.app.models.Person;
  return Person.create(personData)
  .then(function(createdPerson){
    if (roleToAssign === 'owner'){
      organization.owner = createdPerson.id;
      organization.save();
    }

    createdPerson.organization = organization.id;
    createdPerson.save();

    console.log('User created: '+createdPerson.email);

    return assignRole(req, createdPerson, roleToAssign)
    .then(function(updatedUser){
      return {
        user: updatedUser,
        organization: organization
      };
    })
  })
}

function assignRole(req, user, roleName) {
  roleName = roleName.toLowerCase();

  if (!user) {
    return Promise.reject(new Error("Issue creating user"));
  } else if (user.status == 'error') {
    return Promise.resolve(user);
  }
  var Role = req.app.models.Role;
  return Role.findOne({
    where: { name: roleName }
  })
  .then(function(role){
    if (!role) {
      return Promise.reject(new Error("No role with this name exists!"))
    } else {
      return role.principals.create({ 
        principalType: req.app.models.RoleMapping.USER,
        principalId: user.id
      })
    }
  }).then(function(principal){
    return user;
  })
}


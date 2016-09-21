import React from 'react';
import Oy from 'oy-vey';
import GettingStartedEmail from '../../client/src/components/email-templates/GettingStartedEmail';
import PasswordResetEmail from '../../client/src/components/email-templates/PasswordResetEmail';
import InvitedUserEmail from '../../client/src/components/email-templates/InvitedUserEmail';

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
    var personData = {
      email: req.body.email.toLowerCase(),
      password: req.body.password
    };

    findPersonAndOrganization(req, req.body.email, orgFilter)
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

    Promise.all([
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
    var orgFilter = { id: req.user.toJSON().organization.id };
    var personData = {
      email: email,
      password: generatePassword(10)
    };

    findPersonAndOrganization(req, email, orgFilter)
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
        var foundOrganization = queryResult[1];

        return createPersonWithRoleAndBindToOrganization(req, personData, roleToAssign, foundOrganization);
      }
    })
    .then(function(data){
      return cb(null, { status: 'success', user: data.user, organization: data.organization, invitedBy: req.user, password: personData.password });
    }, function(err){
      console.log('Error inviting person to organization:');
      console.log(err);
      return cb(null, { status: 'failure', message: err.message, error: err });
    })
  }

  //send invite email after invitation
  Person.afterRemote('invite', function(context, createdObject, next) {
    if (!createdObject || !createdObject.data || createdObject.data.status == 'failure') {
      return next();
    }

    // TODO: Add e-mail to database queue if sending fails
    var createdUser = createdObject.data.user;
    var invitedBy = createdObject.data.invitedBy;
    var password = createdObject.data.password;
    var organizationName = createdObject.data.organization.name;

    Person.app.models.Email.send({
      to: createdUser.email,
      from: Person.app.globalConfig.SYSTEM_EMAIL,
      subject: 'Welcome to '+Person.app.globalConfig.APP_NAME,
      html: Oy.renderTemplate(<InvitedUserEmail user={createdUser} invitedBy={invitedBy} password={password} organizationName={organizationName} />, {
        title: 'Getting Started with '+Person.app.globalConfig.APP_NAME,
        previewText: 'Welcome to '+Person.app.globalConfig.APP_NAME+'...'
      })
    }, function(err) {
      if (err) return next(err);
      next();
    });

  });

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

  Person.updateUser = function(req, cb) {
    if (!req.user) {
      err = new Error('Anonymous request (no user signed in)');
      err.statusCode = 417;
      err.code = 'PERSON_CREATE_FAILED_MISSING_REQUIREMENT_NOT_SIGNED_IN';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

    req.user.updateAttributes(req.body, function(err, updatedUser){
      if (err) 
        return cb(null, { status: 'failure', message: err.message, error: err });
      else
        return cb(null, { status: 'success', message: 'Successfully updated user', user: updatedUser });
    })
  }

  Person.remoteMethod(
    "updateUser",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
      ],
      http: { path: '/update-user', verb: 'post' },
      returns: { arg: 'data', type: 'object' },
      description: 'Updates the signed in user on whatever fields are passed to it.'
    }
  );

  Person.requestPasswordReset = function(req, email, cb) {
    var err;
    if(!req.body.email){
      err = new Error('Valid email required on req.body.email');
      err.statusCode = 417;
      err.code = 'PERSON_RESET_PASSWORD_FAILED_MISSING_REQUIREMENT_EMAIL';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

    Person.resetPassword({
      email: req.body.email
    }, function(err) {
      if (err) 
        return cb(null, { status: 'failure', message: err.message, error: err });
      else
        return cb(null, { status: 'success', message: 'Password request event triggered.' });
    });

  }

  Person.on('resetPasswordRequest', function(info) {
    var subject = 'Password Reset';
    var html = Oy.renderTemplate(
      <PasswordResetEmail accessToken={info.accessToken.id}/>, 
      {
        title: subject,
        previewText: subject
      }
    );

    Person.app.models.Message.sendEmail({
      body: {
        recipient : { email: info.email },
        html: html,
        subject: subject
      }
    }, function(err) {
      if (err) return console.log('> error sending password reset email');
      console.log('> sending password reset email to:', info.email);
    });
  });

  Person.remoteMethod(
    "requestPasswordReset",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'email', type: 'string' },
      ],
      http: { path: '/requestPasswordReset', verb: 'post' },
      returns: { arg: 'data', type: 'object' },
      description: "Takes in an email and resets its password."
    }
  );

  Person.doResetPassword = function(req, res, cb) {
    var err;
    if (!req.accessToken){
      err = new Error('Valid accessToken required on req.accessToken');
      err.statusCode = 417;
      err.code = 'PERSON_RESET_PASSWORD_FAILED_MISSING_REQUIREMENT_ACCESS_TOKEN';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }


    //verify passwords match
    if (!req.body.password ||
        !req.body.confirmation ||
        req.body.password !== req.body.confirmation) {
      err = new Error('Password and confirmation do not match!');
      err.statusCode = 400;
      err.code = 'PERSON_RESET_PASSWORD_FAILED_PASSWORD_CONFIRMATION_MISMATCH';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

    Person.findById(req.accessToken.userId, function(err, user) {
      if (err) return cb(null, { status: 'failure', message: err.message, error: err });
      user.updateAttribute('password', req.body.password, function(err, user) {
        if (err) return cb(null, { status: 'failure', message: err.message, error: err });
        console.log('> password reset processed successfully');
        return cb(null, { status: 'success', message: 'Password reset successful' });
      });
    });
  };

  Person.remoteMethod(
    "doResetPassword",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'res', type: 'object', http: { source: 'res' } }

      ],
      http: { path: '/resetPassword', verb: 'post' },
      returns: { arg: 'data', type: 'object' },
      description: "Take in a password and confirmation, and changes password to that password if they match."
    }
  );

  Person.getRelatedPeople = function (req, cb) {
    var err;
    var user = req.user.toJSON();
    var role = user.role.name;
    if (role == 'owner' ){
      Person.find({where: { organization : user.organization.id } }, function(err, people){ 
        if (err) return cb(null, { status: 'failure', message: err.message, error: err });

        return cb(null, { status: 'success', message: 'Related people successfully retrieved', people: people });
      });
    }
    else if (role == 'doctor'){
      Person.findOne({where: { id : user.id }, include: [{ patients: 'caregivers' }]}, function(err, self){
        if (err) return cb(null, { status: 'failure', message: err.message, error: err });

        var people = [];
        for( patientIndex in self.patients ){
          var patient = self.patients[patientIndex];
          people.push(patient);
          for( caregiverIndex in patient.caregivers ){
            var caregiver = patient.caregivers[caregiverIndex];
            people.push(caregiver);
          }
        }

        for( adminIndex in self.admins ){
          var admin = self.admins[adminIndex];
          people.push(admin);
        } 

        return cb(null, { status: 'success', message: 'Related people successfully retrieved', people: people });

      });
    }
    else if (role == 'admin'){
      Person.findOne({where: { id : user.id }, include: [ { doctors: { patients: 'caregivers' } } ]}, function(err, self){ 
        if (err) return cb(null, { status: 'failure', message: err.message, error: err });

        var people = [];
        for( doctorIndex in self.doctors ){
          var doctor = self.doctors[doctorIndex];
          people.push(doctor);
          for( patientIndex in doctor.patients ){
            var patient = doctor.patients[patientIndex];
            people.push(patient);
            for( caregiverIndex in patient.caregivers ){
              var caregiver = patient.caregivers[caregiverIndex];
              people.push(caregiver)
            }
          }
        }
        return cb(null, { status: 'success', message: 'Related people successfully retrieved', people: people });
      });
    }
    else if (role == 'patient'){
      Person.findOne({where: { id : user.id }, include: [ 'doctors', 'caregivers' ]}, function(err, self){
        if (err) return cb(null, { status: 'failure', message: err.message, error: err }); 

        var people = [];
        for( doctorIndex in self.doctors ){
          var doctor = self.doctors[doctorIndex];
          people.push(doctor);
        }

        for( caregiverIndex in self.caregivers ){
          var caregiver = self.caregivers[caregiverIndex];
          people.push(caregiver);
        }
        return cb(null, { status: 'success', message: 'Related people successfully retrieved', people: people });
      });
    }
    else if (role == 'caregiver'){
      Person.findOne({where: { id : user.id }, include: [{ caregivees: ['doctors', 'caregivers'] }]}, function(err, self){
        if (err) return cb(null, { status: 'failure', message: err.message, error: err });

        var people = [];

        for( caregiveeIndex in self.caregivees ){
          var caregivee = self.caregivers[caregiveeIndex];
          people.push(caregivee);
          for( caregiverIndex in caregivee.caregivers ){
            var caregiver = caregivee.caregivers[caregiverIndex];
            people.push(caregiver);
          }
          for( doctorIndex in caregivee.doctors ){
            var doctor = caregivee.doctors[doctorIndex];
            people.push(doctor);
          }
        }
        return cb(null, { status: 'success', message: 'Related people successfull retrieved', people: people });
      });
    }
    else{
      err = new Error('Valid role required on req.user.role');
      err.statusCode = 422;
      err.code = 'GET_RELATED_PEOPLE_FAILED_INVALID_REQUIREMENT_ROLE';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

  }

  Person.remoteMethod(
    "getRelatedPeople",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
      ],
      http: { path: '/getRelatedPeople', verb: 'post' },
      returns: { arg: 'data', type: 'object' },
      description: "Returns all related people for the requesting user."
    }
  );
}

function findPerson(req, email) {
  var Person = req.app.models.Person;
  return Person.findOne({
    where: { email: email }
  })
}

function findPeople(req, filterObj) {
  var Person = req.app.models.Person;
  return Person.findOne({
    where: filterObj
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
    throw new Error("Issue creating user");
  } 

  var Role = req.app.models.Role;
  return Role.findOne({
    where: { name: roleName }
  })
  .then(function(role){
    if (!role) {
      throw new Error("No role with this name exists!");
    } else {
      user.role = role.id;
      return user.save();
    }
  })
  .then(function(user){
    return user;
  })
}

function generatePassword(length){
  var text = "";
  var symbols = "!?&"
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"+symbols;

  for(var i=0; i < length; i++ ) {
    text += (i < length - 3) ? possible.charAt(Math.floor(Math.random() * possible.length)) : symbols.charAt(Math.floor(Math.random() * symbols.length));
  }

  return text;
}

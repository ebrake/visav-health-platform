import React from 'react';
import Oy from 'oy-vey';
import GettingStartedEmail from '../../client/src/components/email-templates/GettingStartedEmail';
import PasswordResetEmail from '../../client/src/components/email-templates/PasswordResetEmail';
import InvitedUserEmail from '../../client/src/components/email-templates/InvitedUserEmail';

var path = require('path');

module.exports = function(Person) {

  Person.signup = function(req, email, password, firstName, lastName, organizationName, cb) {
    var err;

    if (!req.body.email){
      err = new Error('Valid email required on req.body.email');
      err.statusCode = 417;
      err.code = 'PERSON_CREATE_FAILED_MISSING_REQUIREMENT_EMAIL';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    if (!req.body.password){
      err = new Error('Valid password required on req.body.password');
      err.statusCode = 417;
      err.code = 'PERSON_CREATE_FAILED_MISSING_REQUIREMENT_PASSWORD';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    if (!req.body.firstName){
      err = new Error('Valid first name required on req.body.firstName');
      err.statusCode = 417;
      err.code = 'PERSON_CREATE_FAILED_MISSING_REQUIREMENT_FIRSTNAME';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    if (!req.body.lastName){
      err = new Error('Valid last name required on req.body.lastName');
      err.statusCode = 417;
      err.code = 'PERSON_CREATE_FAILED_MISSING_REQUIREMENT_LASTNAME';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    if (!req.body.organizationName){
      err = new Error('Valid organization required on req.body.organizationName');
      err.statusCode = 417;
      err.code = 'PERSON_CREATE_FAILED_MISSING_REQUIREMENT_ORGANIZATIONNAME';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }


    var orgFilter = { name: req.body.organizationName };
    var personData = {
      email: req.body.email.toLowerCase(),
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName
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
        { arg: 'firstName', type: 'string' },
        { arg: 'lastName', type: 'string' },
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
    if (!req.body.email) {
      err = new Error('Valid email required on req.body.email');
      err.statusCode = 417;
      err.code = 'PERSON_SIGNIN_FAILED_MISSING_REQUIREMENT_EMAIL';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    if (!req.body.password) {
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

  Person.invite = function(req, email, firstName, lastName, role, cb) {
    var err;
    var readableUser = req.user.toJSON();
    if (!req.body.email) {
      err = new Error('Valid email required on req.body.email');
      err.statusCode = 417;
      err.code = 'PERSON_INVITE_FAILED_MISSING_REQUIREMENT_EMAIL';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    if (!req.body.role) {
      err = new Error('Valid Role required on req.body.role');
      err.statusCode = 417;
      err.code = 'PERSON_INVITE_FAILED_MISSING_REQUIREMENT_ROLE';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    if (!req.body.firstName) {
      err = new Error('Valid first name required on req.body.firstName');
      err.statusCode = 417;
      err.code = 'PERSON_INVITE_FAILED_MISSING_REQUIREMENT_FIRSTNAME';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    if (!req.body.lastName) {
      err = new Error('Valid last name required on req.body.lastName');
      err.statusCode = 417;
      err.code = 'PERSON_INVITE_FAILED_MISSING_REQUIREMENT_LASTNAME';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    if (!req.user.organization) {
      err = new Error('No organization associated with user. Valid organization required on req.user.organization.');
      err.statusCode = 417;
      err.code = 'PERSON_INVITE_FAILED_MISSING_REQUIREMENT_NO_ORGANIZATION';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    if (readableUser.role.name == 'owner' && role !== 'admin') {
      err = new Error('Owners are not allowed to invite non-admin staff.');
      err.statusCode = 422;
      err.code = 'PERSON_INVITE_FAILED_INVALID_REQUIREMENT_UNASSIGNABLE_ROLE';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

    var email = req.body.email.toLowerCase();
    var roleToAssign = req.body.role;
    var orgFilter = { id: readableUser.organization.id };
    var personData = {
      email: email,
      password: generatePassword(10),
      firstName: firstName,
      lastName: lastName
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
        { arg: 'firstName', type: 'string' },
        { arg: 'lastName', type: 'string' },
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
    if (!req.body.email){
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
    if (!req.accessToken) {
      err = new Error('Valid accessToken required on req.accessToken');
      err.statusCode = 417;
      err.code = 'PERSON_RESET_PASSWORD_FAILED_MISSING_REQUIREMENT_ACCESS_TOKEN';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    //verify passwords match
    if (!req.body.password || !req.body.confirmation || req.body.password !== req.body.confirmation) {
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

  Person.getViewablePeople = function (req, cb) {
    var err;
    var readableUser = req.user.toJSON();
    var role = readableUser.role.name;
    if (role == 'owner' || role == 'admin') {
      Person.find({where: { organization : readableUser.organization.id } }, function(err, people){ 
        if (err) return cb(null, { status: 'failure', message: err.message, error: err });

        return cb(null, { status: 'success', message: 'Related people successfully retrieved', people: people });
      });
    }
    else if (role == 'doctor') {
      Person.findOne({where: { id : readableUser.id }, include: [{ patients: 'caregivers' }]}, function(err, self){
        if (err) return cb(null, { status: 'failure', message: err.message, error: err });

        self = self.toJSON();

        var people = [];

        self.patients.forEach(function(patient){
          people.push(patient);
          if (patient.caregivers) {
            patient.caregivers.forEach(function(caregiver){
              people.push(caregiver);
            })
          }
        })

        return cb(null, { status: 'success', message: 'Related people successfully retrieved', people: people });
      });
    }
    else if (role == 'patient') {
      Person.findOne({where: { id : readableUser.id }, include: [ 'doctors', 'caregivers' ]}, function(err, self){
        if (err) return cb(null, { status: 'failure', message: err.message, error: err }); 

        self = self.toJSON();

        var people = [];

        self.doctors.forEach(function(doctor){
          people.push(doctor);
        })

        self.caregivers.forEach(function(caregiver){
          people.push(caregiver);
        })

        return cb(null, { status: 'success', message: 'Related people successfully retrieved', people: people });
      });
    }
    else if (role == 'caregiver') {
      Person.findOne({where: { id : readableUser.id }, include: [{ caregivees: ['doctors', 'caregivers'] }]}, function(err, self){
        if (err) return cb(null, { status: 'failure', message: err.message, error: err });

        self = self.toJSON();
        
        var people = [];

        self.caregivees.forEach(function(caregivee){
          people.push(caregivee);

          caregivee.caregivers.forEach(function(caregiver){
            people.push(caregiver);
          })

          caregivee.doctors.forEach(function(doctor){
            people.push(doctor);
          })
        })

        return cb(null, { status: 'success', message: 'Related people successfull retrieved', people: people });
      });
    }
    else {
      err = new Error('Valid role required on req.user.role');
      err.statusCode = 422;
      err.code = 'GET_VIEWABLE_PEOPLE_FAILED_INVALID_REQUIREMENT_ROLE';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

  }

  Person.remoteMethod(
    "getViewablePeople",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
      ],
      http: { path: '/getViewablePeople', verb: 'get' },
      returns: { arg: 'data', type: 'object' },
      description: "Returns all related people for the requesting user."
    }
  );

  Person.getRelatedPeople = function (req, cb) {
    var err;
    var readableUser = req.user.toJSON();

    if (!req.body.person) {
      err = new Error("No user to get related people for!");
      err.statusCode = 417;
      err.code = 'GET_RELATED_PEOPLE_FAILED_MISSING_REQUIREMENT_USER';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    if (!req.body.person.organization || req.body.person.organization.id !== readableUser.organization.id) {
      err = new Error("Organization does not match for requesting user and requested user!");
      err.statusCode = 422;
      err.code = 'GET_RELATED_PEOPLE_FAILED_INVALID_REQUIREMENT_ORGANIZATION'
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

    if (req.body.person.role.name == 'admin' || req.body.person.role.name == 'owner') {
      return cb(null, { status: 'success', message: 'No related people' });
    }
    else if (req.body.person.role.name == 'doctor') {
      Person.findOne({ where: { id: req.body.person.id }, include: 'patients' }, function(err, person){
        if (err) 
          return cb(null, { status: 'failure', message: err.message, error: err });

        person = person.toJSON();

        return cb(null, { 
          status: 'success', 
          message: 'Successfully got patients for doctor', 
          patients: person.patients 
        });
      })
    }
    else if (req.body.person.role.name == 'caregiver') {
      Person.findOne({ where: { id: req.body.person.id }, include: 'caregivees' }, function(err, person){
        if (err) 
          return cb(null, { status: 'failure', message: err.message, error: err });

        person = person.toJSON();

        return cb(null, { 
          status: 'success', 
          message: 'Successfully got patients for caregiver', 
          patients: person.caregivees 
        });
      })
    }
    else if (req.body.person.role.name == 'patient') {
      Person.findOne({ where: { id: req.body.person.id }, include: ['doctors', 'caregivers'] }, function(err, person){
        if (err) 
          return cb(null, { status: 'failure', message: err.message, error: err });

        person = person.toJSON();

        return cb(null, { 
          status: 'success', 
          message: 'Successfully got patients for patient', 
          doctors: person.doctors, 
          caregivers: person.caregivers 
        });
      })
    }
    else {
      err = new Error("No role for requested person!");
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

  Person.getPatient = function(req, cb) {
    var err;
    var readableUser = req.user.toJSON();
    if (!req.query.id) {
      err = new Error("No ID provided to query!");
      err.statusCode = 417;
      err.code = 'GET_PATIENT_FAILED_MISSING_REQUIREMENT_ID';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    
    Person.findById(req.query.id)
    .then(function(patient){
      var readablePatient = patient ? patient.toJSON() : undefined;
      if (!readablePatient || readableUser.organization.id != readablePatient.organization.id) {
        err = new Error("This patient id does not correspond to a patient within the organization");
        err.statusCode = 422;
        err.code = 'GET_PATIENT_FAILED_INVALID_REQUIREMENT_ID';
        throw err;
      } else {
        return patient;
      }
    })
    .then(function(patient){
      return cb(null, { status: 'success', message: 'Found patient', patient: patient });
    }, function(err){
      return cb(null, { status: 'failure', message: err.message, error: err });
    })
  }

  Person.remoteMethod(
    "getPatient",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
      ],
      http: { path: '/getPatient', verb: 'get' },
      returns: { arg: 'data', type: 'object' },
      description: "Returns the person object of the patient with the id provided in query"
    }
  );

  Person.destroyDoctorPatientRelation = function(req, cb) {
    modifyDoctorPatientRelation(req, true, cb);
  }

  Person.remoteMethod(
    "destroyDoctorPatientRelation",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
      ],
      http: { path: '/unbindDoctorAndPatient', verb: 'post' },
      returns: { arg: 'data', type: 'object' },
      description: "Accepts a doctor and a patient, destroys their relationship."
    }
  )

  Person.makeDoctorPatientRelation = function(req, cb) {
    modifyDoctorPatientRelation(req, false, cb);
  }

  Person.remoteMethod(
    "makeDoctorPatientRelation",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
      ],
      http: { path: '/bindDoctorAndPatient', verb: 'post' },
      returns: { arg: 'data', type: 'object' },
      description: "Accepts a doctor and a patient, destroys their relationship."
    }
  )

  function modifyDoctorPatientRelation(req, destroy, cb) {
    var err;
    var readableUser = req.user.toJSON();
    if (!readableUser.role || readableUser.role.name !== 'admin') {
      err = new Error('Non-admin staff may not create doctor<->patient relationships.');
      err.statusCode = 422;
      err.code = 'MODIFY_DOCTOR_PATIENT_RELATION_FAILED_INVALID_REQUIREMENT_ROLE';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    if (!req.body.doctor) {
      err = new Error('No doctor provided!');
      err.statusCode = 417;
      err.code = 'MODIFY_DOCTOR_PATIENT_RELATION_FAILED_MISSING_REQUIREMENT_DOCTOR';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    if (!req.body.patient) {
      err = new Error('No patient provided!');
      err.statusCode = 417;
      err.code = 'MODIFY_DOCTOR_PATIENT_RELATION_FAILED_MISSING_REQUIREMENT_PATIENT';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    if (!req.body.doctor.role || req.body.doctor.role.name !== 'doctor') {
      err = new Error('Invalid role for doctor!');
      err.statusCode = 422;
      err.code = 'MODIFY_DOCTOR_PATIENT_RELATION_FAILED_INVALID_REQUIREMENT_DOCTOR_ROLE';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    if (!req.body.patient.role || req.body.patient.role.name !== 'patient') {
      err = new Error('Invalid role for patient!');
      err.statusCode = 422;
      err.code = 'MODIFY_DOCTOR_PATIENT_RELATION_FAILED_INVALID_REQUIREMENT_PATIENT_ROLE';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

    var DoctorPatient = Person.app.models.DoctorPatient;

    DoctorPatient.findOne({
      where: {
        doctorId: req.body.doctor.id,
        patientId: req.body.patient.id
      }
    })
    .then(function(relation){
      if (destroy) {
        if (!relation) {
          err = new Error('Relationship did not exist, nothing to destroy');
          err.statusCode = 422;
          err.code = 'MODIFY_DOCTOR_PATIENT_RELATION_FAILED_INVALID_REQUIREMENTS_RELATION';
          return { status: 'failure', message: err.message, error: err };
        }
        else {
          return DoctorPatient.destroyById(relation.id)
          .then(function(result){
            return { status: 'success', message: 'Relation successfully removed' };
          })
        }
      }
      else {
        if (relation) {
          err = new Error('Relationship already existed, will not create duplicate');
          err.statusCode = 422;
          err.code = 'MODIFY_DOCTOR_PATIENT_RELATION_FAILED_INVALID_REQUIREMENTS_DUPLICATE';
          return { status: 'failure', message: 'Relation already existed', relation: relation };
        }
        else {
          return DoctorPatient.create({
            doctorId: req.body.doctor.id,
            patientId: req.body.patient.id
          })
          .then(function(relation){
            return { status: 'success', message: 'Relation successfully created', relation: relation };
          })
        }
      }
    })
    .then(function(data){
      return cb(null, data);
    }, function(err){
      return cb(null, { status: 'failure', message: err.message, error: err });
    })
  }

  Person.destroyCaregiverPatientRelation = function(req, cb) {
    modifyCaregiverPatientRelation(req, true, cb);
  }

  Person.remoteMethod(
    "destroyCaregiverPatientRelation",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
      ],
      http: { path: '/unbindCaregiverAndPatient', verb: 'post' },
      returns: { arg: 'data', type: 'object' },
      description: "Accepts a caregiver and a patient, destroys relationship."
    }
  );

  Person.makeCaregiverPatientRelation = function(req, cb) {
    modifyCaregiverPatientRelation(req, false, cb);
  }

  Person.remoteMethod(
    "makeCaregiverPatientRelation",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
      ],
      http: { path: '/bindCaregiverAndPatient', verb: 'post' },
      returns: { arg: 'data', type: 'object' },
      description: "Accepts a caregiver and a patient, creates a relationship."
    }
  );

  function modifyCaregiverPatientRelation(req, destroy, cb) {
    var err;
    var readableUser = req.user.toJSON();
    if (!readableUser.role || readableUser.role.name !== 'admin') {
      err = new Error('Non-admin staff may not create caregiver<->patient relationships.');
      err.statusCode = 422;
      err.code = 'MODIFY_CAREGIVER_PATIENT_RELATION_FAILED_INVALID_REQUIREMENT_ROLE';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    if (!req.body.caregiver) {
      err = new Error('No caregiver provided!');
      err.statusCode = 417;
      err.code = 'MODIFY_CAREGIVER_PATIENT_RELATION_FAILED_MISSING_REQUIREMENT_CAREGIVER';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    if (!req.body.patient) {
      err = new Error('No patient provided!');
      err.statusCode = 417;
      err.code = 'MODIFY_CAREGIVER_PATIENT_RELATION_FAILED_MISSING_REQUIREMENT_PATIENT';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    if (!req.body.caregiver.role || req.body.caregiver.role.name !== 'caregiver') {
      err = new Error('Invalid role for caregiver!');
      err.statusCode = 422;
      err.code = 'MODIFY_CAREGIVER_PATIENT_RELATION_FAILED_INVALID_REQUIREMENT_CAREGIVER_ROLE';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    if (!req.body.patient.role || req.body.patient.role.name !== 'patient') {
      err = new Error('Invalid role for patient!');
      err.statusCode = 422;
      err.code = 'MODIFY_CAREGIVER_PATIENT_RELATION_FAILED_INVALID_REQUIREMENT_PATIENT_ROLE';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

    var CaregiverPatient = Person.app.models.CaregiverPatient;

    CaregiverPatient.findOne({
      where: {
        caregiverId: req.body.caregiver.id,
        patientId: req.body.patient.id
      }
    })
    .then(function(relation){
      if (destroy) {
        if (!relation) {
          err = new Error('Relationship did not exist, nothing to destroy');
          err.statusCode = 422;
          err.code = 'MODIFY_CAREGIVER_PATIENT_RELATION_FAILED_INVALID_REQUIREMENTS_RELATION';
          return { status: 'failure', message: err.message, error: err };
        }
        else {
          return CaregiverPatient.destroyById(relation.id)
          .then(function(result){
            return { status: 'success', message: 'Relation successfully removed' };
          })
        }
      }
      else {
        if (relation) {
          err = new Error('Relationship already existed, will not create duplicate');
          err.statusCode = 422;
          err.code = 'MODIFY_CAREGIVER_PATIENT_RELATION_FAILED_INVALID_REQUIREMENTS_DUPLICATE';
          return { status: 'failure', message: 'Relation already existed', relation: relation };
        }
        else {
          return CaregiverPatient.create({
            caregiverId: req.body.caregiver.id,
            patientId: req.body.patient.id
          })
          .then(function(relation){
            return { status: 'success', message: 'Relation successfully created', relation: relation };
          })
        }
      }
    })
    .then(function(data){
      return cb(null, data);
    }, function(err){
      return cb(null, { status: 'failure', message: err.message, error: err });
    })
  }

  Person.removeUser = function(req, cb) {
    var err;
    var readableUser = req.user.toJSON();
    if (!readableUser.role || readableUser.role.name !== 'admin') {
      err = new Error('Non-admin staff may not remove users.');
      err.statusCode = 422;
      err.code = 'REMOVE_USER_FAILED_INVALID_REQUIREMENT_ROLE';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    if (!req.body.id) {
      err = new Error('No ID provided for user to remove.');
      err.statusCode = 417;
      err.code = 'REMOVE_USER_FAILED_MISSING_REQUIREMENT_ID';
      return cb(null, { status: 'failure', message: err.message, error : err });
    }

    Person.findById(req.body.id)
    .then(function(foundUser){
      if (!foundUser) {
        err = new Error('No user found with provided ID!');
        err.statusCode = 404;
        err.code = 'REMOVE_USER_FAILED_INVALID_REQUIREMENT_ID';
        throw err;
      }

      foundUser = foundUser.toJSON();
      if (foundUser.organization.id !== readableUser.organization.id) {
        err = new Error('User is not in the same organization as requesting user!');
        err.statusCode = 422;
        err.code = 'REMOVE_USER_FAILED_INVALID_REQUIREMENT_ORGANIZATION_MISMATCH';
        throw err;
      }

      return Person.destroyById(req.body.id)
      .then(function(){
        //so we can access this person in the cb
        return foundUser;
      })
    })
    .then(function(deletedUser){
      return cb(null, { status: 'success', message: 'Deleted user '+deletedUser.firstName+' '+deletedUser.lastName+'', deletedUser: deletedUser });
    }, function(err){
      return cb(null, { status: 'failure', message: err.message, error: err });
    })
  }

  Person.remoteMethod(
    'removeUser',
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
      ],
      http: { path: '/removeUser', verb: 'delete' },
      returns: { arg: 'data', type: 'object' },
      description: "Accepts a user ID and removes that user as long as requesting user is an admin within the same organization."
    }
  )
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
    if (roleToAssign === 'owner') {
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
  var RoleMapping = req.app.models.RoleMapping;

  return Role.findOne({
    where: { name: roleName }
  })
  .then(function(role){
    if (!role) {
      throw new Error("No role with this name exists!");
    } else {
      user.role = role.id;

      return role.principals.create({
        principalType: RoleMapping.USER,
        principalId: user.id
      })
      .then(function(principal){
        return user.save();
      })
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

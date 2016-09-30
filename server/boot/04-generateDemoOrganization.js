
var testOrganizationQueries = {
  ownerSignup: {
    email: 'dev+owner@krisandbrake.com',
    password: 'testtest',
    firstName: 'Brody',
    lastName: 'McLeon',
    organizationName: 'Dev Test'
  },
  adminInvite: {
    email: 'dev+admin@krisandbrake.com',
    firstName: 'Nancy',
    lastName: 'Barbato',
    role: 'admin'
  },
  doctorInvite: {
    email: 'dev+doctor@krisandbrake.com',
    firstName: 'Roy',
    lastName: 'Halladay',
    role: 'doctor'
  },
  caregiverInvite: {
    email: 'dev+caregiver@krisandbrake.com',
    firstName: 'Barry',
    lastName: 'Manilow',
    role: 'caregiver'
  },
  patientInvite: {
    email: 'dev+patient@krisandbrake.com',
    firstName: 'Steven',
    lastName: 'Tyler',
    role: 'patient'
  }
};

/**
 * A boot script function that generates a demo organization with a user in each role, for easy testing purposes.
 * @module server/boot/04-generateDemoUser
 */
module.exports = function(app, cb) {

  var Person = app.models.Person;

  var fakeReq = {
    app: app,
    body: testOrganizationQueries.ownerSignup
  };

  //signup owner
  Person.signup(fakeReq, fakeReq.body.email, fakeReq.body.password, fakeReq.body.firstName, fakeReq.body.lastName, fakeReq.organizationName, function(alwaysNull, data){
    if (data.status == 'failure') {
      if (data.message != 'A person with this email has already been created') {
        console.log('Demo organization creation unexpectedly stopped: ');
        console.log(data.err);
      } else {
        console.log('Demo organization already exists');
      }
      return cb();
    }
    
    data.user.updateAttribute('password', 'testtest');
    var user = data.user;
    //find owner model otherwise req.user breaks Person.invite
    Person.findById(data.user.id, function(err, user){
      if (err) {
        console.log('Demo organization creation failed at finding model of owner: ');
        console.log(err);
        return cb();
      }

      fakeReq = {
        app: app,
        user: user,
        body: testOrganizationQueries.adminInvite
      };

      //invite admin
      Person.invite(fakeReq, fakeReq.body.email, fakeReq.body.firstName, fakeReq.body.lastName, fakeReq.body.role, function(alwaysNull, data){
        if (data.status == 'failure') {
          console.log('Demo organization creation stopped at inviting admin:');
          console.log(data.message);
          return cb();
        }
        
        data.user.updateAttribute('password', 'testtest');

        //find admin model because only admins can invite doctors and other people
        Person.findById(data.user.id, function(err, user){
          if (err) {
            console.log('Demo organization creation failed at finding model of admin:');
            console.log(err);
            return cb();
          }

          fakeReq = {
            app: app,
            user: user,
            body: testOrganizationQueries.doctorInvite
          };

          Person.invite(fakeReq, fakeReq.body.email, fakeReq.body.firstName, fakeReq.body.lastName, fakeReq.body.role, function(alwaysNull, data){
            if (data.status == 'failure') {
              console.log('Demo organization creation stopped at inviting doctor:');
              console.log(data.message);
              return cb();
            }

            data.user.updateAttribute('password', 'testtest');
            fakeReq.body = testOrganizationQueries.caregiverInvite;

            Person.invite(fakeReq, fakeReq.body.email, fakeReq.body.firstName, fakeReq.body.lastName, fakeReq.body.role, function(alwaysNull, data){
              if (data.status == 'failure') {
                console.log('Demo organization creation stopped at inviting caregiver:');
                console.log(data.message);
                return cb();
              }

              data.user.updateAttribute('password', 'testtest');
              fakeReq.body = testOrganizationQueries.patientInvite;

              Person.invite(fakeReq, fakeReq.body.email, fakeReq.body.firstName, fakeReq.body.lastName, fakeReq.body.role, function(alwaysNull, data){
                if (data.status == 'failure') {
                  console.log('Demo organization creation stopped at inviting patient:');
                  console.log(data.message);
                  return cb();
                }

                data.user.updateAttribute('password', 'testtest');
                console.log('Demo organization successfully created:');
                return cb();
              });
            });
          });
        });
      });
    })
  });
};

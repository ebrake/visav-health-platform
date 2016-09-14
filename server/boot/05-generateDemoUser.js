
var testUser = {
  email: 'dev@test.user',
  password: 'testtest',
  firstName: 'Brody',
  lastName: 'McLeon',
  organization: 'Dev Test Org'
};

/**
 * A boot script function that generates the demo user.
 * @module boot/generateDemoUser
 */
module.exports = function(app, cb) {

  var Person = app.models.Person;
  var Organization = app.models.Organization;

  var filter = {
    where: {
      email: testUser.email
    }
  };

  return Person.findOne(filter)
  .then(function(person){
    if (person) {
      return Organization.findOne({
        where: { owner: person.id }
      })
      .then(function(organization){
        if (organization) {
          console.log(testUser.email+' is the owner of '+organization.name+'.');
          return 'done';
        } else {
          return Person.destroyById(person.id);
        }
      })
    } else {
      return;
    }
  })
  .then(function(result){
    if (result == 'done')
      return;

    var fakeReq = {
      app: app,
      body: {
        email: testUser.email,
        password: testUser.password, 
        organization: testUser.organization
      }
    };

    return Person.signup(fakeReq, cb);
  })
  .then(function(received){
    cb();
  })
  .catch(function(err){
    cb(err);
  })

};

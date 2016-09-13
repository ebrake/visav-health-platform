
var testUser = {
  email: 'dev@test.user',
  password: 'testtest',
  firstName: 'Brody',
  lastName: 'McLeon'
};

/**
 * A boot script function that generates the demo user.
 * @module boot/generateDemoUser
 */
module.exports = function(app) {

  var filter = {
    where: {
      email: testUser.email
    }
  }

  app.models.Person.findOrCreate(filter, testUser, function(err, person, created) {
    if (err) console.log(err);
    else if (created) console.log("User created: "+testUser.email)
  });

};

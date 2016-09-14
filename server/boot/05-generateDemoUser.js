
var testUser = {
  email: 'dev@test.user',
  password: 'testtest',
  firstName: 'Brody',
  lastName: 'McLeon',
  role: 'owner'
};

/**
 * A boot script function that generates the demo user.
 * @module boot/generateDemoUser
 */
module.exports = function(app, cb) {

  var Person = app.models.Person;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  var filter = {
    where: {
      email: testUser.email
    }
  }

  Person.findOrCreate(filter, testUser, function(err, person, created) {
    if (err) console.log(err);
    else if (created) console.log("User created: "+testUser.email)

    RoleMapping.findOne({
      where: { principalId: person.id },
      include: 'role'
    }, function(err, result) {
      if (err) {
        return cb(err);

      } if (!result) {
        //testUser doesn't have a role
        Role.findOne({
          where: { name: testUser.role }
        }, function(err, role){
          if (err) cb(err);

          role.principals.create({ 
            principalType: RoleMapping.USER,
            principalId: person.id
          }, function(err, result){
            if (err) cb(err);

            cb();
          })
        })

      } else {
        //testUser has a role
        cb();
      }
    })
  });

};

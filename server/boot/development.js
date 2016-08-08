'use strict';

var testUser = {
  email: 'dev@test.user',
  password: 'testtest',
  name: 'Brodysseus'
};

module.exports = function(app) {

  if (process.env.NODE_ENV == 'development') {
    app.models.Person.find({
      where: {
        email: testUser.email
      }
    }, function(err, devUsers){
      if (err) return;
      if (devUsers[0]) return;

      app.models.Person.create(testUser);
    });
  }

};

var loopback = require('loopback');

module.exports = function() {
  return function setCurrentUser(req, res, next) {
    if (!req.accessToken) {
      return next();
    }
    req.app.models.Person.findById(req.accessToken.userId, function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new Error('No user with this access token was found.'));
      }
      var loopbackContext = loopback.getCurrentContext();
      if (loopbackContext) {
        loopbackContext.set('user', user);
      }

      req.user = user;

      next();
    });
  }
}
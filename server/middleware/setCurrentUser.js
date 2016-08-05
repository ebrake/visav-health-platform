module.exports = function(app) {
  return function setCurrentUser(req, res, next) {
    console.log("Trying to set current user...");
    console.log(req.accessToken);
    if (!req.accessToken) {
      return next();
    }
    app.models.Person.findById(req.accessToken.userId, function(err, user) {
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
      next();
    });
  }
}
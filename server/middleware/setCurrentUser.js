/**
 * A middleware function that sets req.user when req.accessToken is passed through
 * @module middleware/setCurrentUser
 */
module.exports = function setCurrentUser(req, res, next) {
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

    delete user.password;
    req.user = user;

    next();
  });
}

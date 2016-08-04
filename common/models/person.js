var config = require('../../server/config.json');
var path = require('path');
 
module.exports = function(Person) {
  //send verification email after registration
  Person.afterRemote('create', function(context, userInstance, next) {
    console.log('> user.afterRemote triggered');
 
    /* could email using this code, adjusted to use our values
    var options = {
      type: 'email',
      to: userInstance.email,
      from: 'noreply@loopback.com', //change to process.env.APP_EMAIL or wherever we store that
      subject: 'Thanks for registering.',
      template: path.resolve(__dirname, '../../server/views/verify.ejs'),
      redirect: '/verified',
      user: user
    };
 
    userInstance.verify(options, function(err, response, next) {
      if (err) return next(err);
 
      console.log('> verification email sent:', response);
 
      context.res.render('response', {
        title: 'Signed up successfully',
        content: 'Please check your email and click on the verification link ' +
            'before logging in.',
        redirectTo: '/',
        redirectToLinkText: 'Log in'
      });
    });
    */  
  });
}

module.exports = function(installation) {

  installation.beforeRemote('replaceOrCreate',function(ctx, modelInstance, next){

    // Override userId with reference to user.
    // Demo user is 1

    // TODO: Link to actual user through request!

    ctx.req.body.userId = 1;

    next();
  });

}

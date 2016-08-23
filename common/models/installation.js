
module.exports = function(Installation) {

  Installation.beforeRemote('replaceOrCreate',function(ctx, modelInstance, next){

    //this is null for me...
    //var id = ctx.req.params.id || null;
    //ctx.req.body.userId = id;

    // TODO: Link to user object, referenced through AUTH HTTP token.

    ctx.req.body.userId = 1;
    if (ctx.req.params.deviceType=='iOS') {
      ctx.req.body.deviceType = 'ios';
    }
    
    next();
  });

}

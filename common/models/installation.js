
module.exports = function(Installation) {

  Installation.beforeRemote('replaceOrCreate',function(ctx, modelInstance, next){

    var id = ctx.req.params.id || null;
    ctx.req.body.person = id;
    if (ctx.req.params.deviceType=='iOS') {
      ctx.req.body.deviceType = 'ios';
    }
    
    next();
  });

}

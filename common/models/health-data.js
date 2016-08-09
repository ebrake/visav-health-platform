module.exports = function(Healthdata) {
  Healthdata.receiveData = function(req, cb) {
    console.log('Healthdata received POST request...');

    cb(null, null);
  }

  Healthdata.remoteMethod(
    "receiveData",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } }
      ],
      http: { path: '/create', verb: 'post' }
    }
  )
};

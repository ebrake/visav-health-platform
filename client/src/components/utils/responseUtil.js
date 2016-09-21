export default {
  craftErrorResponse: function(err) {
    var craftedResponse = { data: { error: err, status: 'failure', message: err.message } };
  }
}
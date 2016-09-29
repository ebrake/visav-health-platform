export default {
  craftErrorResponse: function(err) {
    return { data: { error: err, status: 'failure', message: err ? err.message : '' } };
  }
}
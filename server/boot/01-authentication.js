/**
 * A boot script that enables authentication on the server
 * @module boot/authentication
 */
 module.exports = function enableAuthentication(server) {
  // enable authentication
  server.enableAuth();
};

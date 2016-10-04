/**
 * A boot script that enables authentication on the server
 * @module boot/01-authentication
 */
 module.exports = function enableAuthentication(server) {
  // enable authentication
  server.enableAuth();
};

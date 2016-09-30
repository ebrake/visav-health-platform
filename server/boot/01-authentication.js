/**
 * A boot script that enables authentication on the server
 * @module server/boot/01-authentication
 */
 module.exports = function enableAuthentication(server) {
  // enable authentication
  server.enableAuth();
};

/**
 * A boot script function that enforces serving the Loopback REST API over localhost:4000
 * @module boot/05-restApi
 */
 export default function mountRestApi(server) {
  const restApiRoot = server.get('restApiRoot');

  server.use(restApiRoot, server.loopback.rest());
}

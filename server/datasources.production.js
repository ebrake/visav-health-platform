/**
 * In PRODUCTION environment this overrides datasources.json
 * @module modules/datasources-production
 */
module.exports = {
  "psql": {
    "url": process.env.DATABASE_URL + '?ssl=true'
  }
}

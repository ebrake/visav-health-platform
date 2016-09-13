/**
 * In STAGING environment this overrides datasources.json
 * @module modules/datasources-staging
 */
module.exports = {
  "psql": {
    "url": process.env.DATABASE_URL + '?ssl=true'
  }
}

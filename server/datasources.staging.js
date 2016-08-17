// In production
// This will override datasources.json
// to use secure environment variables (Heroku)
// for database connection
// To test, set NODE_ENV=production and DATABASE_URL=[heroku-postgresql-data-base-url] in your .env

module.exports = {
  "psql": {
    "connector": "postgresql",
    "url": process.env.DATABASE_URL + '?ssl=true'
  }
}

// In production
// This will override datasources.json

module.exports = {
  "psql": {
    "url": process.env.DATABASE_URL + '?ssl=true'
  }
}

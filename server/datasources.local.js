/**
 * This always overrides datasources.json
 * @module server/datasources-local
 */
 module.exports = {
  "emails": {
    "name": "emails",
    "connector": "mail",
    "transports": [
      {
        "type": "SMTP",
        "host": process.env.POSTMARK_SMTP_SERVER,
        secureConnection: true,
        "port": 587,
        "auth": {
          "user": process.env.POSTMARK_API_TOKEN,
          "pass": process.env.POSTMARK_API_TOKEN
        },
        "tls": {
          "rejectUnauthorized": false
        },
      }
    ]
  }
}

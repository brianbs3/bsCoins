const config = require('../config');

console.log(`config.db: ${config.DB}`)
console.log(`config.MONGO_DB: ${config.MONGO_DB}`)
const knex = require('knex')(config.DB, {
    debug: true
});

module.exports = knex;
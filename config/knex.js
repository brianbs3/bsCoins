const config = require('../config');

console.log(`config.db: ${config.DB}`)
const knex = require('knex')(config.DB, {
    debug: true
});

module.exports = knex;
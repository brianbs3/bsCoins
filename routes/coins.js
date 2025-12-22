const router = require('express').Router();
const { formatJSON11 } = require('../utils/format');
const {lookupCoinCollection} = require('../utils/coins')
const knex = require('../config/knex');
const pjson = require('../package.json');
// const config = require('../config')
// const { MongoClient } = require('mongodb');
// const uri = config.MONGO_DB;
// const client = new MongoClient(uri);

router.get('/version', (req, res) => {
    return res.json(formatJSON11({ "version": pjson.version }));
});

router.get('/collection', async (req, res) => {
    console.log('hello')
    const [coinCollection] = await Promise.all([
        lookupCoinCollection()
    ])
    console.log(coinCollection);
    return res.json(coinCollection)        
    // knex.select()
    //     .from('coins')
    //     .then(
    //         m => {
    //             return res.json(formatJSON11(m));
    //         }
    //     );
});
module.exports = router;
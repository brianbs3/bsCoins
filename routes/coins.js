const router = require('express').Router();
const { formatJSON11 } = require('../utils/format');
const {lookupCoinCollection, createCoin} = require('../utils/coins')
const knex = require('../config/knex');
const pjson = require('../package.json');
// const config = require('../config')
// const { MongoClient } = require('mongodb');
// const uri = config.MONGO_DB;
// const client = new MongoClient(uri);

router.get('/version', (req, res) => {
    return res.json(formatJSON11({ "version": pjson.version }));
});

router.get('/', async (req, res) => {
    const [coinCollection] = await Promise.all([
        lookupCoinCollection()
    ])

    return res.json(coinCollection)        
});

router.get('/pdf', async (req, res) => {
    const [coinCollection] = await Promise.all([
        lookupCoinCollection()
    ])

    return res.json(coinCollection)        
});

router.post('/add', async (req, res) => {
    try {
        console.log('add coin')
        const { date, attributes, errors, notes} = req.body;
        
        const c = await createCoin({date, attributes, errors, notes})

        return res.json({msg: "hello", c})
    }
    catch (error) {
        console.log('there was an error')
        console.log(error)
        return res.json(error)
    }
});
module.exports = router;
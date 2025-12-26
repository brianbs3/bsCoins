const router = require('express').Router();
const { formatJSON11 } = require('../utils/format');
const {lookupCoinCollection, lookupCoin, createCoin, exportCoinCollectionPDF} = require('../utils/coins')
const knex = require('../config/knex');
const pjson = require('../package.json');
const moment = require('moment')
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

router.get('/coin/:tag', async (req, res) => {
    const { tag } = req.params;
    console.log(`tag: ${tag}`)
    const [coinCollection] = await Promise.all([
        lookupCoin(tag)
    ])

    return res.json(coinCollection)      
    
});

router.get('/pdf', async (req, res) => {
    const [coinCollection] = await Promise.all([
        lookupCoinCollection()
    ])

    const d = new Date();
    const outputFile = `bsCoins Collection - ${d.toISOString()}`;
    const filepath = `./static/pdf/${outputFile}.pdf`
    
    // Create PDF document with asset hostname as title
    const pdfDoc = await exportCoinCollectionPDF(coinCollection);
    
    // Stream PDF directly to browser
    pdfDoc.pipe(res);
    // return res.json({outputFile: outputFile, filepath: filepath})
});

router.post('/add', async (req, res) => {
    try {
        console.log('add coin')
        const { date, attributes, errors, notes, mintage, GSID} = req.body;
        
        const c = await createCoin({date, attributes, errors, notes, mintage, GSID})

        return res.json({msg: "hello", c})
    }
    catch (error) {
        console.log('there was an error')
        console.log(error)
        return res.json(error)
    }
});
module.exports = router;
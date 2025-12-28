const config = require('../config')
const { MongoClient } = require('mongodb');
const uri = config.MONGO_DB;
const client = new MongoClient(uri);
const PDFDocument = require('pdfkit-table');
const fs = require("fs");



const lookupCoinCollection = () => {
    return new Promise(async (resolve, reject) => {

        try {
            await client.connect();
            const database = client.db("bsCoins"); 
            const collection = database.collection("collection");
            const p = await collection.find().toArray();
   
            if(p){
                resolve(p)
            }
            else{
                resolve(null)
            }
        } 
        catch (error) {
            console.log(error);
            reject(new Error(`Cannot get product`));
        }
    });
}

const lookupCoin = (tag) => {
    return new Promise(async (resolve, reject) => {
        console.log(`looking up ${tag}`)
        try {
            await client.connect();
            const database = client.db("bsCoins"); 
            
            const p = await database.collection('collection').find({"attributes.tag": tag}).toArray();
            console.log(p)
            if(p){
                resolve(p)
            }
            else{
                resolve(null)
            }
        } 
        catch (error) {
            console.log(error);
            reject(new Error(`Cannot get product`));
        }
    });
}

const createCoin = (coin) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(`creating coin...`)
            // await db.sequelize.models.products.upsert(product);
            // let p = await db.sequelize.models.products.findOne({
            //     where: { upc: product.upc}
            // });
            await client.connect()
            const database = client.db("bsCoins");
            const collection = database.collection("collection");
            // product.title = product.description;
            // product.success = true;
             const c = await collection.updateOne({"attributes.tag": coin.attributes.tag},
                { $set: coin },
                { upsert: true }
            )
            // const c = await collection.insertOne(coin, function (err, result) {
            //     if (err) throw err;
            //     console.log("1 document inserted");
            //     client.close();
            // });
            // const p = await collection.updateOne({ upc: product.upc },
            //     { $set: product },
            //     { upsert: true }
            // )

            resolve(c);
        }
        catch (error) {
            console.log(error);
            reject(new Error(`Cannot create coin`));
        }
    });
}

const exportCoinCollectionPDF = async(coins) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log(Object.map(coins))
            let c = []
            Object.keys(coins).forEach((k) => {
                
                let err = ""
                let notes = ""
                coins[k].errors.forEach((e) => {
                    err = `${err} \n ${e}`
                });
                coins[k].notes.forEach((n) => {
                    notes = `${notes} \n ${n}`
                });
                c.push([
                    coins[k].attributes.tag,
                    coins[k].attributes.year, 
                    coins[k].attributes.mint,
                    coins[k].attributes.hasMintMark,
                    coins[k].attributes.condition,
                    coins[k].attributes.grade,
                    coins[k].attributes.denomination,
                    coins[k].attributes.cameFrom,
                    err,
                    notes
                ])
            })
            
            const d = new Date();
            // Create a new PDF document with A4 size and 30pt margins
            const doc = new PDFDocument({margin: 30, size: 'A4'});

            // Configure default font and size for the document
            doc.fontSize(10)

            // Generate appropriate title based on report type
            let title = `bsCoins Collection`
            
            // Define table structure with headers and data
            const table = {
                title: title,
                subtitle: `Generated: ${d.toISOString()}\nTags are denoted in red on the back of the cards in most cases.`,
                headers: [
                    { label: "Tag", property: 'tag', width: 20, renderer: null },
                    { label: "Year", property: 'year', width: 20, renderer: null },
                    { label: "Mint", property: 'mint', width: 20, renderer: null },
                    { label: "Mint Mark", property: 'mintMark', width: 20, renderer: null },
                    { label: "Condition", property: 'condition', width: 50, renderer: null },
                    { label: "Grade", property: 'grade', width: 50, renderer: null },
                    { label: "Denomination", property: 'denomination', width: 50, renderer: null },
                    { label: "Source", property: 'source', width: 100, renderer: null },
                    { label: "Errors", property: 'errors', width: 100, renderer: null },
                    { label: "Notes", property: 'notes', width: 100, renderer: null },
                    
                ],
                // Coin data rows (array of arrays)
                rows: c,
            };
            
            // Render the table with custom styling
            doc.table(table, {
                prepareHeader: () => doc.font("Helvetica-Bold").fontSize(6),
                prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                    doc.font("Helvetica").fontSize(6);
                    // Optional: Add row background styling
                    // indexColumn === 0 && doc.addBackground(rectRow, 'blue', 0.15);
                },
            });
            
            // Finalize the document and resolve with stream
            doc.end();
            
            resolve(doc);
            
        }
        catch (error) {
            console.log(error);
            reject(new Error(`Cannot generate PDF Options`));
        }
    });
}

module.exports = {
    lookupCoinCollection,
    lookupCoin,
    createCoin,
    exportCoinCollectionPDF,
};
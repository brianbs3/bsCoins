const config = require('../config')
const { MongoClient } = require('mongodb');
const uri = config.MONGO_DB;
const client = new MongoClient(uri);



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
            const c = await collection.insertOne(coin, function (err, result) {
                if (err) throw err;
                console.log("1 document inserted");
                client.close();
            });
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

module.exports = {
    lookupCoinCollection,
    createCoin,   
};
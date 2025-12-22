const config = require('../config')
const { MongoClient } = require('mongodb');
const uri = config.MONGO_DB;
const client = new MongoClient(uri);



const lookupCoinCollection = () => {
    return new Promise(async (resolve, reject) => {

        try {
            console.log('here we are before connect')
            await client.connect();
            console.log('here we are after connect')
            const database = client.db("bsCoins"); 
            const collection = database.collection("collection");

            // const specificQuery = { upc: upc };
            // const specificOptions = {};
            
            const p = await collection.find().toArray();
            console.log('here we are afte await')
            // console.log(p)
            // const p = await collection.findOne(specificQuery, specificOptions);
    
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

module.exports = {
    lookupCoinCollection,
    
};
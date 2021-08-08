const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://SEP:blockchain@cluster0.iv7t1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


//IIFE for js, calls function on script load
(async function () {
    try {
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    } catch {
        console.log("Connection Failed");
    }
    try {
        const collection = client.db("SEP").collection("users");
        await collection.insertOne({
            user: "SEP",
            storedItems: [
                {}
            ]
        })
        client.close();
    }
    catch {
        console.log("Connection error")
    }
})();



const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://SEP:blockchain@cluster0.iv7t1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

//IIFE for js, calls function on script load
async function getClient() {
    try {
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        return client;
    } catch {
        console.log("Connection Failed");
    }

}


// add the new pdf to the database
async function addToDatabase(userName, obj) {

    const client = await getClient();
    const collection = client.db("SEP").collection("users");

    await collection.updateOne(
        { user: userName },
        {
            $addToSet: {
                stored: obj,
            }
        }
    )
    console.log("added");
    client.close();
}

// return a list of pdf ids;
async function returnToUser(userName) {
    try {
        const client = await getClient();
        const collection = client.db("SEP").collection("users");
        let val = await collection.find({ user: userName }).toArray();
        client.close();
        return val[0];
    }
    catch
    {
        console.log("Retrieving data failed");
    }

}

//register new user to database
async function registerUser(data){
    const client = await getClient();
    const collection = client.db("SEP").collection("users");
    collection.insertOne(data);
    console.log("1 user inserted");
    return;
}

//login user
async function loginUser(data){
    console.log("logging in ...")
    try {
        const client = await getClient();
        const collection = client.db("SEP").collection("users");
        let val = await collection.find({ Email: email }).toArray();
        client.close();
        return val[0];
    }
    catch
    {
        console.log("Retrieving data failed");
    }
}

module.exports = {
    returnToUser, addToDatabase, registerUser, loginUser
}

// let temp = {
//     Date: '19-Jan-2012',
//     fileName: 'Not Cool Bro',
//     TxHash: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
// }

// async function init() {
//     await addToDatabase('TestUser', temp);
// }

// init();
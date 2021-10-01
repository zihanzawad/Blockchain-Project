const { MongoClient, ListCollectionsCursor, ObjectId } = require('mongodb');
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

async function getTxHash(userName, id) {
    const client = await getClient();
    const collection = client.db("SEP").collection("users");

    let ret = await collection.findOne(
        {
            user: userName,
        });
    let selected = Array.from(ret.stored);

    let found = ""
    for (obj of selected) {
        if (ObjectId(id).equals(obj._id)) {
            found = obj.TxHash;
        }
    }

    return found;
}

// add the new pdf to the database
async function addToDatabase(email, obj) {

    obj._id = ObjectId();
    const client = await getClient();
    const collection = client.db("SEP").collection("users");

    await collection.updateOne(
        { Email: email },
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
async function returnToUser(email) {
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

//login user
async function validateUser(email, password) {
    try {
        const client = await getClient();
        const collection = client.db("SEP").collection("users");
        let val = await collection.find({ Email: email, Password: password }).toArray();
        client.close();
        if(val.length != 0) {
            return true;
        }
        return false;
    }
    catch {
        console.log("Retrieving data failed");
    }
}

async function emailAvailability(email) {
    try {
        const client = await getClient();
        const collection = client.db("SEP").collection("users");
        let val = await collection.find({ Email: email }).toArray();
        client.close();
        if(val.length == 0) {
            return true;
        }
        return false;
    }
    catch {
        console.log("Retrieving data failed");
    }
}

//register new user to database
async function registerUser(email, name, password){
    try {
        const client = await getClient();
        const collection = client.db("SEP").collection("users");
        await collection.insertOne({ Email: email, Name: name, Password: password });
        client.close();
    }
    catch {
        console.log("Retrieving data failed");
    }
}

//update user profile on database
async function updateProfile (userId, newName, newPassword){
    
    try {
        const client = await getClient();
        const collection = client.db("SEP").collection("users");
        let val = await collection.findOne({ Email: userId });
        //console.log(val);
        await collection.updateOne(
            { _id: val._id },
            { $set: 
                {
                    Name: newName,
                    Password: newPassword
                }
            }
         )

        client.close();
    }
    catch {
        console.log("Retrieving data failed");
    }
    return; 
}

module.exports = {
    returnToUser, addToDatabase, validateUser, registerUser, emailAvailability, getTxHash, updateProfile
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
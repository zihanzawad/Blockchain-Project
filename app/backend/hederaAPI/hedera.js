const { Client, FileCreateTransaction, Hbar, FileId, PrivateKey, FileContentsQuery, FileAppendTransaction } = require("@hashgraph/sdk");
const { addToDatabase } = require('../../database/index')
console.log()
require('dotenv').config();
const crypto = require('crypto');

//create a hadera client
async function connectClient() {

    //Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = process.env.ACCOUNTID
    const myPrivateKey = process.env.PRIVATEKEY;

    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null ||
        myPrivateKey == null) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    }

    let key = await PrivateKey.generate(myPrivateKey);
    let publicKey = key.publicKey;

    const client = Client.forTestnet();

    client.setOperator(myAccountId, myPrivateKey);
    return { client, key, publicKey }
}

// create the first instance of a file
async function createFile(file, client, key, publicKey) {

    const transaction = await new FileCreateTransaction()
        .setKeys([publicKey]) //A different key then the client operator key
        .setContents(file)
        .setMaxTransactionFee(new Hbar(2))
        .freezeWith(client);

    //Sign with the file private key
    const signTx = await transaction.sign(key);

    //Sign with the client operator private key and submit to a Hedera network
    const submitTx = await signTx.execute(client);

    //Request the receipt
    const receipt = await submitTx.getReceipt(client);

    const newFileId = receipt.fileId;

    return newFileId

}

// add content to existing file
async function appendFile(TxHash, file, client, key) {
    const transaction = await new FileAppendTransaction()
        .setFileId(TxHash)
        .setContents(file)
        .freezeWith(client);

    //Sign with the file private key
    const signTx = await transaction.sign(key);

    //Sign with the client operator key and submit to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt
    const receipt = await txResponse.getReceipt(client);
    //Get the transaction consensus status
    const transactionStatus = receipt.status;


}

//retrieves content stored in a file based on the file id
async function getFileContent(TxHash) {
    let { client } = await connectClient();
    console.log(TxHash)
    TxHash = FileId.fromString(TxHash)
    //Create the query
    const query = new FileContentsQuery()
        .setFileId(TxHash);

    //Sign with client operator private key and submit the query to a Hedera network
    const contents = await query.execute(client);
    return contents;
}


// splits file into 3kib chunks
function createChunks(file, cSize) {
    let startPointer = 0;
    let endPointer = file.length;
    let chunks = [];
    while (startPointer < endPointer) {
        let newStartPointer = startPointer + cSize;
        chunks.push(file.slice(startPointer, newStartPointer));
        startPointer = newStartPointer;
    }
    return chunks;
}

//takes in a file buffer and encrypts it with SHA256, returning a hex string
function encryptData(data) {
    const hashSum = crypto.createHash('sha256');
    hashSum.update(data);

    const hexHash = hashSum.digest('hex');
    return hexHash;
}

// uploads a file to the block chain
async function uploadToBlockChain(originalFileName, hashString, user) {

    //let fileContent = file.buffer;
    let { client, key, publicKey } = await connectClient();
    let fileHash = hashString;

    /*
    let chunks = await createChunks(fileContent, 3 * 1024);
    let first = chunks.shift();
    let TxHash = await createFile(first, client, key, publicKey);

    for (chunk of chunks) {
        await appendFile(TxHash, chunk, client, key);
    }*/

    let TxHash = await createFile(fileHash, client, key, publicKey);
    let obj = {
        Date: new Date().toLocaleDateString(),
        fileName: originalFileName,
        TxHash: TxHash.toString()
    }

    await addToDatabase(user, obj);
}

//USED FOR TESTING PURPOSES UNTIL convert_pdf.py HAS BEEN COMPLETED AND MERGED INTO MASTER
async function uploadToBlockChainOriginal(file, user) {

    let fileContent = file.buffer;
    let { client, key, publicKey } = await connectClient();
    let fileHash = encryptData(fileContent);

    let TxHash = await createFile(fileHash, client, key, publicKey);
    let obj = {
        Date: new Date().toLocaleDateString(),
        fileName: file.originalname,
        TxHash: TxHash.toString()
    }

    await addToDatabase(user, obj);
}

module.exports = {
    uploadToBlockChain,
    uploadToBlockChainOriginal,
    getFileContent
}

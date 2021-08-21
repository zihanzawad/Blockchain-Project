const { Client, FileCreateTransaction, Hbar, PrivateKey, FileContentsQuery, FileAppendTransaction } = require("@hashgraph/sdk");
require('dotenv').config();
const fs = require('fs')

//create a hadera client
async function connectClient() {

    //Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = "0.0.2225458";
    const myPrivateKey = "302e020100300506032b65700422042042921f16be7462a2f2f3888700ea55c69ab0deb3ee0c557cf744e9322ac04248";

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
async function appendFile(fileId, file, client, key) {
    const transaction = await new FileAppendTransaction()
        .setFileId(fileId)
        .setContents(file)
        .freezeWith(client);

    //Sign with the file private key
    const signTx = await transaction.sign(key);

    //Sign with the client operator key and submit to a Hedera network
    console.log("Appending new chunck");
    const txResponse = await signTx.execute(client);

    console.log("Getting result");

    //Request the receipt
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status;

    console.log("The transaction consensus status is " + transactionStatus);

}

//retrieves content stored in a file based on the file id
async function getFileContent(fileId, client) {
    //Create the query
    const query = new FileContentsQuery()
        .setFileId(fileId);

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

// uploads a file to the block chain
async function uploadToBlockChain(file) {
    let { client, key, publicKey } = await connectClient();
    let chunks = await createChunks(file, 3 * 1024)

    let first = chunks.shift();
    txHash = await createFile(first, client, key, publicKey);

    let size = chunks.length;

    for (chunk of chunks) {
        await appendFile(txHash, chunk, client, key);
        console.log(--size);
    }

    let val = await getFileContent(txHash, client)
    fs.writeFileSync('input.docx', file);
    fs.writeFileSync('output.docx', val);

    if (val === file) {
        console.log(true);
    } else {
        console.log(false);

    }
}


module.exports = {
    uploadToBlockChain
}
const { Client, FileCreateTransaction, Hbar, PrivateKey, FileContentsQuery, FileAppendTransaction } = require("@hashgraph/sdk");


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

    let key = PrivateKey.fromString(myPrivateKey);

    const client = Client.forTestnet();

    await client.setOperator(myAccountId, myPrivateKey);
    return { client, key }
}

// create the first instance of a file
async function createFile(file, client, key) {

    const transaction = await new FileCreateTransaction()
        .setKeys(key) //A different key then the client operator key
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
    // console.log(fileId)
    // console.log(file)
    // console.log(client)
    // console.log(key)
    //Create the transaction
    const transaction = await new FileAppendTransaction()
        .setFileId(fileId)
        .setContents(file)
        .setMaxTransactionFee(new Hbar(2))
        .freezeWith(client);

    //Sign with the file private key
    const signTx = await transaction.sign(key);

    //Sign with the client operator key and submit to a Hedera network
    console.log("Appending new chunck");
    const txResponse = await signTx.execute(client);

    console.log("Retting result");

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

    console.log(contents);
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
    let { client, key } = await connectClient();
    let chunks = await createChunks(file, 3 * 1024)

    let first = chunks.shift();
    txHash = await createFile(first, client, key);

    console.log(first);
    console.log(file)

    // for (chunk of chunks) {
    //     await appendFile(txHash, chunk, client, key);
    // }

    // console.log("" + txHash)
    // let val = await getFileContent(txHash, client)
    // console.log(file);

    // if (val === file) {
    //     console.log(true);
    // } else {
    //     console.log(false);

    // }
}


module.exports = {
    uploadToBlockChain
}
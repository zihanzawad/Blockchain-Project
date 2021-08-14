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
async function appendFile(fileId, file) {

    //Create the transaction
    const transaction = new FileAppendTransaction()
        .setFileId(fileId)
        .setContents(file);

}

//retrieves content stored in a file based on the file id
async function getFileContent(fileId, client) {
    //Create the query
    const query = new FileContentsQuery()
        .setFileId(fileId);

    //Sign with client operator private key and submit the query to a Hedera network
    const contents = await query.execute(client);

    //v2.0.7
}


// splits file into 3kib chunks
function splitFile(s, maxBytes) {
    let buf = Buffer.from(s);
    const result = [];
    while (buf.length) {
        let i = buf.lastIndexOf(32, maxBytes + 1);
        // If no space found, try forward search
        if (i < 0) i = buf.indexOf(32, maxBytes);
        // If there's no space at all, take the whole string
        if (i < 0) i = buf.length;
        // This is a safe cut-off point; never half-way a multi-byte
        result.push(buf.slice(0, i).toString());
        buf = buf.slice(i + 1); // Skip space (if any)
    }
    return result;
}


// uploads a file to the block chain
async function uploadToBlockChain(file) {
    let { client, key } = await connectClient();
    let chunks = await splitFile(file.buffer, 3 * 1024)

    let first = chunks.shift();
    txHash = await createFile(first, client, key);
    for (chunk of chunks) {
        await appendFile(txHash, chunk, client, key);
    }
    await getFileContent(txHash, client)
}


module.exports = {
    uploadToBlockChain
}
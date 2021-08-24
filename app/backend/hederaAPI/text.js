const { Client, PrivateKey, FileContentsQuery, FileAppendTransaction, Hbar, FileCreateTransaction } = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {

    //Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = "0.0.2225458";
    const myPrivateKey = "302e020100300506032b65700422042042921f16be7462a2f2f3888700ea55c69ab0deb3ee0c557cf744e9322ac04248";

    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null ||
        myPrivateKey == null) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    }

    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this reallyyy easy!
    const client = Client.forTestnet();

    client.setOperator(myAccountId, myPrivateKey);

    //Create new keys
    const fileKey = await PrivateKey.generate();
    const filePublicKey = fileKey.publicKey;

    //Create the transaction
    const transaction = await new FileCreateTransaction()
        .setKeys([filePublicKey]) //A different key then the client operator key
        .setContents("the file contents")
        .setMaxTransactionFee(new Hbar(2))
        .freezeWith(client);

    //Sign with the file private key
    const signTx = await transaction.sign(fileKey);

    //Sign with the client operator private key and submit to a Hedera network
    const submitTx = await signTx.execute(client);

    //Request the receipt
    const receipt = await submitTx.getReceipt(client);

    //Get the file ID
    const newFileId = receipt.fileId;

    console.log("The new file ID is: " + newFileId);

    //Create the query

    const query = new FileContentsQuery()
        .setFileId(newFileId);

    //Sign with client operator private key and submit the query to a Hedera network
    const contents = await query.execute(client); 
    console.log(contents.toString());

    const fileAppend = await new FileAppendTransaction()
        .setFileId(newFileId)
        .setContents("The additional contents")
        .freezeWith(client)

    const sign = await (await fileAppend.sign(fileKey)).execute(client)

    //Create the query
    const query2 = new FileContentsQuery()
        .setFileId(newFileId);

    //Sign with client operator private key and submit the query to a Hedera network
    const contents2 = await query2.execute(client);

    console.log(contents2.toString());
}
main();
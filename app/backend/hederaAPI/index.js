const { Client, FileCreateTransaction, Hbar,PrivateKey,AccountId } = require("@hashgraph/sdk");

async function main() {

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

    let temp = client._network.getNodeAccountIdsForExecute();

    // console.log(temp[0].);


    const transaction = await new FileCreateTransaction()
        .setKeys(key) //A different key then the client operator key
        .setContents("the file contents")
        .setMaxTransactionFee(new Hbar(2))
        .freezeWith(client);

    //Sign with the file private key
    const signTx = await transaction.sign(key);

    //Sign with the client operator private key and submit to a Hedera network
    const submitTx = await signTx.execute(client);

    //Request the receipt
    const receipt = await submitTx.getReceipt(client);

    //Get the file ID
    const newFileId = receipt.fileId;

    console.log("The new file ID is: " + newFileId);
}
main();
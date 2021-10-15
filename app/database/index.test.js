const { getClient } = require(".");
const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://SEP:blockchain@cluster0.iv7t1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

describe('validateUser', () => {
    let client;
    let db;
  
    beforeAll(async () => {
      client = await getClient();
      db = await client.db("SEP");
    });
  
    afterAll(async () => {
      await client.close();
      //await db.close();
    });
  
    it('should check if user exists', async () => {
      const users = db.collection('users');
  
      let val = await users.find({ Email: "test@test.com", Password: "AAA" }).toArray();
      let check = false;
  
      if(val.length != 0) {
          check = true;
      }
  
      expect(check).toEqual(true);
    });
  });


describe('emailAvailability', () => {
  let client;
  let db;

  beforeAll(async () => {
    client = await getClient();
    db = await client.db("SEP");
  });

  afterAll(async () => {
    await client.close();
    //await db.close();
  });

  it('should check if email is unavailable', async () => {
    const users = db.collection('users');

    let val = await users.find({ Email: "test@test.com" }).toArray();
    let check = false;

    if(val.length == 0) {
        check = true;
    }

    expect(check).toEqual(false);
  });
});

describe('returnToUser', () => {
    let client;
    let db;
  
    beforeAll(async () => {
      client = await getClient();
      db = await client.db("SEP");
    });
  
    afterAll(async () => {
      await client.close();
      //await db.close();
    });
  
    it('should grab the users first pdf info', async () => {
      const users = db.collection('users');
  
      let val = await users.find({ Email: "test@test.com" }).toArray();
      const mockPDF = {"Date": "9/17/2021", "TxHash": "0.0.2542089", "fileName": "TestFile.txt"};
  
      expect(val[0].stored[0]).toEqual(mockPDF);
    });
  });

describe('getTxHash', () => {
    let client;
    let db;
  
    beforeAll(async () => {
      client = await getClient();
      db = await client.db("SEP");
    });
  
    afterAll(async () => {
      await client.close();
      //await db.close();
    });
  
    it('should get hashes', async () => {
      const users = db.collection('users');
  
      let ret = await users.findOne(
        {
            user: "Testing",
        });
        
        let selected = Array.from(ret.stored);

        let found = ""
        for (obj of selected) {
            if (ObjectId(id).equals(obj._id)) {
                found = obj.TxHash;
            }
        }
  
      expect(found).toEqual('sadasd');
    });
  });
var express = require('express')
var cors = require('cors')
var app = express()

app.use(cors())
const port = 8080;

const testUserObj = {
    user : "SEP",
    stored : [
        {
            Date : "19-Jan-2012",
            fileName : "My Secrete Mix Tape",
            TxHash : "https://etherscan.io/tx/0x8ef8e6db26a41e5690b57b895d4f87c86256c241975f1838d6fdb283f92e1bf5",
        }
    ]
};

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/getUser', (req, res) => {
  res.send(testUserObj);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
const express = require('express')
const cors = require('cors')
const app = express()
const multer = require('multer');
const upload = multer();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
 
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

//takes pdf payload from server and gets encrypted version into server; 
app.post('/upload', upload.single('pdf'), function (req, res, next) {
  console.log(req.file)
  res.send("Finshed")
})
// returns the testUserObject
app.get('/getUser', (req, res) => {
  res.send(testUserObj);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
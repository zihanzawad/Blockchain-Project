const express = require('express')
const { uploadToBlockChain } = require('./hederaAPI/hedera')
const cors = require('cors')
const app = express()
const multer = require('multer');
const upload = multer();
const { returnToUser, getTxHash } = require('../database/index')
const { getFileContent } = require('./hederaAPI/hedera')

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const port = 8080;
//takes pdf payload from server and gets encrypted version into server; 
app.post('/upload', upload.single('pdf'), function (req, res) {
  uploadToBlockChain(req.file)
  res.send("Finshed")
})
// returns the testUserObject
app.get('/getUser', async (req, res) => {

  let user = await returnToUser('TestUser')
  res.send(user);
})
app.get('/getFile/:TxHash', async (req, res) => {

  let content = await getFileContent(req.params.TxHash)
  res.send(content);
})

app.get('/getFile/:username/:_id', async (req, res) => {

  let TxHash = await getTxHash(req.params.username, req.params._id)
  let content = await getFileContent(TxHash);
  res.send(content);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})


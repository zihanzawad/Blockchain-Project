const express = require('express')
const { uploadToBlockChain } = require('./hederaAPI/hedera')
const cors = require('cors')
const app = express()
const multer = require('multer');
const upload = multer();
const { returnToUser } = require('../database/index')

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const port = 8080;



//takes pdf payload from server and gets encrypted version into server; 
app.post('/upload', upload.single('pdf'), function (req, res) {
  console.log(req.file);
  uploadToBlockChain(req.file)
  res.send("Finshed")
})
// returns the testUserObject
app.get('/getUser', async (req, res) => {
  let user = await returnToUser('TestUser')
  res.send(user);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
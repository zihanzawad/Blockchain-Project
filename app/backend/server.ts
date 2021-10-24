const express = require('express')
const { uploadToBlockChain } = require('./hederaAPI/hedera')
const cors = require('cors')
const app = express()
const multer = require('multer');
const upload = multer();
const { returnToUser } = require('../database/index')
const { getFileContent } = require('./hederaAPI/hedera')
const { spawn } = require('child_process')

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const port:number = 8080;
//takes pdf payload from server and gets encrypted version into server; 
app.post('/upload', upload.single('pdf'), function (req, res) {

  //spawn python child process to process pdf
  var pythonOut:string;
  const uploadedFile = req.file.buffer.toString('base64');
  console.log(uploadToBlockChain);
  const python = spawn('python', ['Scripts/convert_pdf.py', uploadedFile]);

  //feed all stdout from script into pythonOut
  python.stdout.on('data', function (data) {
    pythonOut = data.toString();
  });

  //flush stdout data into uploadToBlockchain on close
  python.on('close', (code) => {
    console.log(`Python script exiting with code ${code}`);
    uploadToBlockChain(req.file.originalname, pythonOut)
  });

  res.send("Finshed");
})
// returns the testUserObject
app.get('/getUser', async (req, res) => {

  let user = await returnToUser('TestUser');
  res.send(user);
})
app.get('/getFile/:TxHash', async (req, res) => {

  let content = await getFileContent(req.params.TxHash);
  res.send(content);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
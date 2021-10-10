const express = require('express')
const { uploadToBlockChain, uploadToBlockChainOriginal, getFileContent } = require('./hederaAPI/hedera');
const spawn = require('child_process').spawn;
const cors = require('cors');
const app = express();
const multer = require('multer');
const upload = multer();
const { returnToUser, validateUser, registerUser, emailAvailability, updateProfile, getTxHash } = require('../database/index')
const passport = require('passport');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
require('./passport');

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    name: 'google-auth-session',
    keys: ['key1', 'key2'],
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
var session;

let rootDir = '/Users/jennytran/Documents/GitHub/Blockchain-Project/app';
const port:number = 8080;

//spawns a child process to run a specific command with passed args
function run_child_process(command, args) {
  return new Promise((resolve) => {
      const process = spawn(command, args)
      let stdout = "";
      let stderr = "";
      process.stdout.on("data", (data) => {
          stdout += data.toString();
      });
      process.stderr.on("data", (data) => {
          stderr += data.toString();
      });
      process.on("close", (code) => {
          console.log("Child process exiting with code " + code)
          resolve({ stdout, stderr, code });
      });
  });
}

app.get('/', function (req,res) {
  session=req.session;
  if(session.userid){
      res.sendFile('html/select.html',{'root': rootDir})
  }else
      res.sendFile('html/login.html',{'root': rootDir})
});

app.post('/home', async (req,res) => {
  let validation = await validateUser(req.body.email, req.body.password);
  if(validation){
      session=req.session;
      session.userid=req.body.email;
      console.log(req.session)
      res.sendFile('html/select.html',{'root': rootDir})
  }
  else{
      res.send('Invalid username or password');
  }
});

app.get('/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
));

app.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/',
    }),
    function (req, res) {
        session=req.session;
        // session.firstname=req.user.name.givenName;
        // session.lastname=req.user.name.familyName;
        session.userid=req.user.email;
        session.name=req.user.name.givenName;
        res.redirect('/googleValidate');
    }
);

app.get('/googleValidate', async (req,res) => {
    session=req.session;
    let emailCheck = await emailAvailability(session.userid);
    if (emailCheck) {
        await registerUser(session.userid, session.name, '');
    }
    console.log(session);
    res.redirect('/');
});

app.get('/register', function (req,res) {
    res.sendFile('html/register.html',{'root': rootDir})
});

app.post('/registration', async (req,res) => {
    let emailCheck = await emailAvailability(req.body.email);
    if (emailCheck) {
        await registerUser(req.body.email, req.body.name, req.body.password);
        res.redirect('/');
    }
    else {
        res.redirect('/register');
    }
});

app.get('/edit', function (req,res) {
  session=req.session;
  if(session.userid){
      res.sendFile('html/edit.html',{'root': rootDir})
  }else
  res.redirect('/');
});

app.post('/saveChanges', async function (req,res) {

  let validation = await validateUser(req.session.userid, req.body.currPass);

  if(validation && (req.body.newPass1 == req.body.newPass2 ) && (req.body.newPass1 != req.body.currPass)){
      await updateProfile(req.session.userid, req.body.newName, req.body.newPass1);
      res.send("Successful: Profile saved");
  }
  else if (validation == false) {
      res.send("Unsucessful: Old password incorrect");
  }
  else if (req.body.newPass1 != req.body.newPass2) {
      res.send('Unsucessful: New Passwords do not match');
  }
  else if (req.body.newPass1 == req.body.currPass || req.body.newPass2 == req.body.currPass){
      res.send('Unsucessful: No changes in Password');
  }
});


app.get('/upload', function (req,res) {
  session=req.session;
  if(session.userid){
      res.sendFile('html/upload.html',{'root': rootDir})
  }else
  res.redirect('/');
});

app.get('/verify', function (req,res) {
  session=req.session;
  if(session.userid){
      res.sendFile('html/verify.html',{'root': rootDir})
  }else
  res.redirect('/');
});

app.get('/logout', function (req,res) {
  req.session.destroy();
  res.redirect('/');
});


//takes pdf payload from server and gets encrypted version into server; 
//COMMENTED CURRENT VERSION UNTIL convert_pdf.py HAS BEEN COMPLETED AND MERGED INTO MASTER
/*
app.post('/upload', upload.single('pdf'), function (req, res) {

  //spawn python child process to process pdf
  var pythonOut:string;
  const uploadedFile = req.file.buffer.toString('base64');
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

  res.sendFile('html/upload.html',{'root': rootDir})
})
*/

app.post('/uploadFile', upload.single('pdf'), async (req, res) => {
  session=req.session;
  //spawn python child process to process pdf
  var hashes;
  let uploadedFile = req.file.buffer.toString('base64');
  run_child_process("python", ['Scripts/convert_pdf.py', uploadedFile]).then(
      ({ stdout }) => {
          uploadToBlockChain(req.file.originalname, stdout, session.userid);
      },
  );

  res.send("Finshed");
});

app.post('/compare', upload.single('pdf'), function(req, res) {
  var hashToFetch = req.params.fetchHash;
  var originalHashes = getFileContent(hashToFetch);
  let uploadedFile = req.file.buffer.toString('base64');
  run_child_process("python", ['Scripts/compare_hash_arrays.py', originalHashes, newHashes, uploadedFile]).then(
      ({ stdout }) => {
          res.send(stdout);
      },
  );
});

// returns the testUserObject
app.get('/getUser', async (req, res) => {

  let user = await returnToUser('TestUser');
  res.send(user);
})
app.get('/getFile/:TxHash', async (req, res) => {

  let content = await getFileContent(req.params.TxHash);
  res.send(content);
})

app.get('/getFile/:username/:_id', async (req, res) => {
  let TxHash = await getTxHash(req.params.username, req.params._id)
  let content = await getFileContent(TxHash);
  res.send(content);
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})


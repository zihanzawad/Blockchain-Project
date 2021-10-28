var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
const express = require('express');
const { uploadToBlockChain, uploadToBlockChainOriginal, getFileContent } = require('./hederaAPI/hedera');
const spawn = require('child_process').spawn;
const cors = require('cors');
const app = express();
const multer = require('multer');
const upload = multer();
const { returnToUser, validateUser, registerUser, emailAvailability, updateProfile, getUserName } = require('../database/index')
const passport = require('passport');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const fs = require('fs')
require('./passport');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
let rootDir = `${__dirname}/../`;
console.log(rootDir)
const port = 8080;

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
            console.log({ stdout, stderr })
            resolve({ stdout, stderr, code });
        });
    });
}

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    name: 'google-auth-session',
    keys: ['key1', 'key2'],
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
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

app.get('/', function (req, res) {
    session = req.session;
    if (session.userid) {
        res.sendFile('html/select.html', { 'root': rootDir })
    }

    else {
        var errorText = req.query.valid;
        if (errorText != null || errorText != "") {
            res.sendFile('html/login.html', { 'root': rootDir })
        }
        else {
            res.sendFile('html/login.html', { 'root': rootDir, error: errorText })
        }
    }
});

app.post('/home', async (req, res) => {
    let validation = await validateUser(req.body.email, req.body.password);
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (req.body.email == "" || req.body.email == null) {
        var errorText = encodeURIComponent('error2');
        res.redirect('/?valid=' + errorText);
    }
    else if (req.body.password == "" || req.body.password == null) {
        var errorText = encodeURIComponent('error3');
        res.redirect('/?valid=' + errorText);
    }
    else if (validation && req.body.email.match(regexEmail)) {
        session = req.session;
        session.userid = req.body.email;
        console.log(req.session)
        res.redirect('/');
    }
    else {
        var errorText = encodeURIComponent('error1');
        res.redirect('/?valid=' + errorText);
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
        session = req.session;
        // session.firstname=req.user.name.givenName;
        // session.lastname=req.user.name.familyName;
        session.userid = req.user.email;
        session.name = req.user.name.givenName;
        res.redirect('/googleValidate');
    }
);

app.get('/googleValidate', async (req, res) => {
    session = req.session;
    let emailCheck = await emailAvailability(session.userid);
    if (emailCheck) {
        await registerUser(session.userid, session.name, '');
    }
    console.log(session);
    res.redirect('/');
});

app.get('/register', function (req, res) {
    session = req.session;
    if (session.userid) {
        res.redirect('/');
    } else
        res.sendFile('html/register.html', { 'root': rootDir })
});

app.post('/registration', async (req, res) => {
    let regexName = /^[A-Za-z]+$/;
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let emailCheck = await emailAvailability(req.body.email);
    if (req.body.email == "" || req.body.email == null) {
        var errorText = encodeURIComponent('error1');
        res.redirect('/register?valid=' + errorText);
    }
    else if (req.body.name == "" || req.body.name == null) {
        var errorText = encodeURIComponent('error2');
        res.redirect('/register?valid=' + errorText);
    }
    else if (req.body.password == "" || req.body.password == null) {
        var errorText = encodeURIComponent('error3');
        res.redirect('/register?valid=' + errorText);
    }
    else if (req.body.confirmPassword == "" || req.body.confirmPassword == null) {
        var errorText = encodeURIComponent('error4');
        res.redirect('/register?valid=' + errorText);
    }
    else if (!req.body.email.match(regexEmail)) {
        var errorText = encodeURIComponent('error5');
        res.redirect('/register?valid=' + errorText);
    }
    else if (!req.body.name.match(regexName)) {
        var errorText = encodeURIComponent('error6');
        res.redirect('/register?valid=' + errorText);
    }
    else if (req.body.password != req.body.confirmPassword) {
        var errorText = encodeURIComponent('error7');
        res.redirect('/register?valid=' + errorText);
    }
    else if (emailCheck) {
        await registerUser(req.body.email, req.body.name, req.body.password);
        var errorText = encodeURIComponent('success');
        res.redirect('/?valid=' + errorText);
    }
    else {
        var errorText = encodeURIComponent('error8');
        res.redirect('/register?valid=' + errorText);
    }
});

app.get('/edit', function (req, res) {
    session = req.session;
    if (session.userid) {
        res.sendFile('html/edit.html', { 'root': rootDir })
    } else
        res.redirect('/');
});

app.post('/saveChanges', async function (req, res) {

    let validation = await validateUser(req.session.userid, req.body.currPass);

    if (validation && (req.body.newPass1 == req.body.newPass2) && (req.body.newPass1 != req.body.currPass)) {
        await updateProfile(req.session.userid, req.body.newName, req.body.newPass1);
        res.send("Successful: Profile saved");
    }
    else if (validation == false) {
        res.send("Unsucessful: Old password incorrect");
    }
    else if (req.body.newPass1 != req.body.newPass2) {
        res.send('Unsucessful: New Passwords do not match');
    }
    else if (req.body.newPass1 == req.body.currPass || req.body.newPass2 == req.body.currPass) {
        res.send('Unsucessful: No changes in Password');
    }
});

app.get('/upload', function (req, res) {
    session = req.session;
    if (session.userid) {
        res.sendFile('html/upload.html', { 'root': rootDir })
    } else
        res.redirect('/');
});

app.get('/verify', function (req, res) {
    session = req.session;
    if (session.userid) {
        res.sendFile('html/verify.html', { 'root': rootDir })
    } else
        res.redirect('/');
});

// document viewer
app.get('/docView', function (req, res) {
    session = req.session;
    if (session.userid) {
        res.sendFile('html/view.html', { 'root': rootDir })
    } else
        res.redirect('/');
});

app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
});


//takes pdf payload from server and gets encrypted version into server;
//COMMENTED CURRENT VERSION UNTIL convert_pdf.py HAS BEEN COMPLETED AND MERGED INTO MASTER
app.post('/uploadFile', upload.single('pdf'), async (req, res) => {
    session = req.session;
    //spawn python child process to process pdf
    fs.writeFileSync(`Scripts/files/${req.file.originalname}`, req.file.buffer, 'binary');

    let pathToScript = 'Scripts/convert_pdf.py'
    run_child_process("python", [pathToScript, req.file.originalname]).then(
        ({ stdout }) => {
            //check how data is formatted on python ned
            uploadToBlockChain(req.file.originalname, stdout, session.userid);
            fs.unlinkSync(`Scripts/files/${req.file.originalname}`);
        },
    );

    res.send("Finshed");
});

app.post('/compare', upload.single('pdf'), function (req, res) {
    var hashToFetch = req.params.fetchHash;
    var originalHashes = getFileContent(hashToFetch);
    fs.writeFileSync(`Scripts/files/${req.file.originalname}`, req.file.buffer, 'binary');
    run_child_process("python", ['Scripts/compare_hash_arrays.py', originalHashes, newHashes, req.file.originalname]).then(
        ({ stdout }) => {
            res.send(stdout);
        },
    );
});

// returns the testUserObject
//COMMENTED GENERATOR CODE FOR USER TESTING PURPOSES, FEEL FREE TO UNCOMMENT AT WILL
app.get('/getUser', async (req, res) => {
    session = req.session;
    let user = await returnToUser(session.userid);
    // return __awaiter(_this, void 0, void 0, function () {
    //     return __generator(this, function (_a) {
    //         switch (_a.label) {
    //             case 0: return [4 /*yield*/, user];
    //             case 1:
    //                 user = _a.sent();
    //                 res.send(user);
    //                 return [2 /*return*/];
    //         }
    //     });
    // });
    console.log(user);
    res.send(user);
});

app.get('/getName', async (req, res) => {
    session = req.session;
    let user = await getUserName(session.userid);
    res.send(user);
});

app.get('/getEmail', async (req, res) => {
    session = req.session;
    res.send(session.userid);
});

app.get('/getFile/:TxHash', function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
        var content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getFileContent(req.params.TxHash)];
                case 1:
                    content = _a.sent();
                    res.send(content);
                    return [2 /*return*/];
            }
        });
    });
});

app.get('/getFile/:username/:_id', async (req, res) => {
    let TxHash = await getTxHash(req.params.username, req.params._id)
    let content = await getFileContent(TxHash);
    res.send(content);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var express = require('express');
var uploadToBlockChain = require('./hederaAPI/hedera').uploadToBlockChain;
var cors = require('cors');
var app = express();
var multer = require('multer');
var upload = multer();
var returnToUser = require('../database/index').returnToUser;
var getFileContent = require('./hederaAPI/hedera').getFileContent;
var spawn = require('child_process').spawn;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
var port = 8080;
//takes pdf payload from server and gets encrypted version into server; 
app.post('/upload', upload.single('pdf'), function (req, res) {
    //spawn python child process to process pdf
    var pythonOut;
    var uploadedFile = req.file.buffer.toString('base64');
    var python = spawn('python', ['Scripts/convert_pdf.py', uploadedFile]);
    //feed all stdout from script into pythonOut
    python.stdout.on('data', function (data) {
        pythonOut = data.toString();
    });
    //flush stdout data into uploadToBlockchain on close
    python.on('close', function (code) {
        console.log("Python script exiting with code " + code);
        uploadToBlockChain(req.file.originalname, pythonOut);
    });
    res.send("Finshed");
});
// returns the testUserObject
app.get('/getUser', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, returnToUser('TestUser')];
            case 1:
                user = _a.sent();
                res.send(user);
                return [2 /*return*/];
        }
    });
}); });
app.get('/getFile/:TxHash', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
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
}); });
app.listen(port, function () {
    console.log("Example app listening at http://localhost:" + port);
});

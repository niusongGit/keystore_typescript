"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keystore = void 0;
var crypto = require("crypto");
var crypto_1 = require("crypto");
// import * as ed25519 from 'ed25519';
var aes_cbc_1 = require("./crypto/aes_cbc");
//import { wordlists } from 'bip39';
var Version_5 = 5;
// 加密盐
var Salt = [53, 111, 103, 103, 87, 66, 54, 103, 53, 108, 65, 81, 73, 53, 70, 43];
var Keystore = /** @class */ (function () {
    function Keystore(saveKeyName, addrPre) {
        this.saveKeyName = saveKeyName;
        this.AddrPre = addrPre;
        this.Coinbase = 0;
        // this.MnemonicLang = wordlists.english; // Initialize based on your wordlists.English
        this.Seed = new Buffer(0);
        this.CheckHash = new Buffer(0);
        this.Addrs = [];
        this.addrMap = new Map();
        this.Salt = Buffer.alloc(32);
        this.Rounds = 0;
        this.Version = 0;
    }
    Keystore.prototype.Load = function () {
        // Implement the logic to load the keystore from the file
        var keystoreString = localStorage.getItem(this.saveKeyName);
        if (keystoreString) {
            var savedKeystore = JSON.parse(keystoreString);
            this.Coinbase = savedKeystore.Coinbase;
            this.Seed = savedKeystore.Seed;
            this.CheckHash = savedKeystore.CheckHash;
            this.Addrs = savedKeystore.Addrs;
            this.addrMap = savedKeystore.addrMap;
            this.Salt = savedKeystore.Salt;
            this.Rounds = savedKeystore.Rounds;
            this.Version = savedKeystore.Version;
        }
    };
    Keystore.prototype.Save = function () {
        // 将数据转换为字符串并保存到本地存储
        // Implement the logic to save the keystore to the file
    };
    Keystore.prototype.CreateNewKeystore = function (password) {
        var pwd = crypto.createHash("sha256").update(password).digest();
        var seed = (0, crypto_1.randomBytes)(16);
        this.NewWallet(seed, pwd);
    };
    Keystore.prototype.NewWallet = function (seed, pwd) {
        var privPassphraseSalt = (0, crypto_1.randomBytes)(32);
        this.Salt = privPassphraseSalt;
        var nStartTime = Date.now();
        this.Rounds = 25000;
        (0, aes_cbc_1.Pbkdf2Key)(pwd, this.Salt, this.Rounds);
        this.Rounds = Math.floor(2500000 / (Date.now() - nStartTime));
        nStartTime = Date.now();
        (0, aes_cbc_1.Pbkdf2Key)(pwd, this.Salt, this.Rounds);
        this.Rounds = Math.floor((this.Rounds + (this.Rounds * 100) / (Date.now() - nStartTime)) / 2);
        if (this.Rounds < 25000) {
            this.Rounds = 25000;
        }
        var pbkdf2Key = (0, aes_cbc_1.Pbkdf2Key)(pwd, this.Salt, this.Rounds);
        var seedSec = (0, aes_cbc_1.EncryptCBCPbkdf2Key)(seed, pbkdf2Key);
        if (seedSec === null) {
            throw new Error("Failed to encrypt seed");
        }
        var checkHash = crypto.createHash("sha256").update(seed).digest();
        this.Seed = seedSec;
        this.CheckHash = checkHash;
        this.Version = Version_5;
    };
    return Keystore;
}());
exports.Keystore = Keystore;

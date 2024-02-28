"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecryptCBCPbkdf2Key = exports.EncryptCBCPbkdf2Key = exports.Pbkdf2Key = void 0;
var crypto = require("crypto");
var Pbkdf2KeySize = 48;
function Pbkdf2Key(password, salt, iter) {
    return crypto.pbkdf2Sync(password, salt, iter, Pbkdf2KeySize, 'sha256');
}
exports.Pbkdf2Key = Pbkdf2Key;
function EncryptCBCPbkdf2Key(plantText, pbkdf2Key) {
    if (pbkdf2Key.length !== Pbkdf2KeySize) {
        throw new Error("Crypted Key length error(".concat(pbkdf2Key.length, "), Crypted Key length should be ").concat(Pbkdf2KeySize));
    }
    return EncryptCBC(plantText, pbkdf2Key.slice(0, Pbkdf2KeySize - 16), pbkdf2Key.slice(Pbkdf2KeySize - 16));
}
exports.EncryptCBCPbkdf2Key = EncryptCBCPbkdf2Key;
function DecryptCBCPbkdf2Key(plantText, pbkdf2Key) {
    if (pbkdf2Key.length !== Pbkdf2KeySize) {
        throw new Error("Crypted Key length error(".concat(pbkdf2Key.length, "), Crypted Key length should be ").concat(Pbkdf2KeySize));
    }
    return DecryptCBC(plantText, pbkdf2Key.slice(0, Pbkdf2KeySize - 16), pbkdf2Key.slice(Pbkdf2KeySize - 16));
}
exports.DecryptCBCPbkdf2Key = DecryptCBCPbkdf2Key;
function EncryptCBC(plantText, key, iv) {
    if (iv.length !== 16) {
        throw new Error("IV length error(".concat(iv.length, "), aes cbc IV length should be 16"));
    }
    var block = crypto.createCipheriv('aes-256-cbc', key, iv);
    var paddedText = PKCS7Padding(plantText, 16);
    var ciphertext = Buffer.concat([block.update(paddedText), block.final()]);
    return ciphertext;
}
function DecryptCBC(ciphertext, key, iv) {
    if (iv.length !== 16) {
        throw new Error("IV length error(".concat(iv.length, "), aes cbc IV length should be 16"));
    }
    var block = crypto.createDecipheriv('aes-256-cbc', key, iv);
    var decryptedText = Buffer.concat([block.update(ciphertext), block.final()]);
    return PKCS7UnPadding(decryptedText, 16);
}
function PKCS7Padding(data, blockSize) {
    var paddingLength = blockSize - (data.length % blockSize);
    var padding = Buffer.alloc(paddingLength, paddingLength);
    return Buffer.concat([data, padding]);
}
function PKCS7UnPadding(data, blockSize) {
    var paddingLength = data[data.length - 1];
    return data.slice(0, data.length - paddingLength);
}

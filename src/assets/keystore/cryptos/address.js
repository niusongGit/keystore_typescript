"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressFromB58String = exports.B58String = void 0;
var bs58 = require("bs58"); // 请根据实际路径和文件名进行调整
function B58String(addr) {
    if (addr.length <= 0) {
        return "";
    }
    var lastByte = addr[addr.length - 1];
    // const lastStr = String.fromCharCode(...bs58.encode(lastByte));
    var lastStr = bs58.encode([lastByte]);
    if (lastStr === "") {
        return "";
    }
    var preLen = lastByte;
    var preStr = new TextDecoder().decode(addr.slice(0, preLen));
    var centerStr = bs58.encode(addr.slice(preLen, addr.length - 1));
    return preStr + centerStr + lastStr;
}
exports.B58String = B58String;
function AddressFromB58String(str) {
    if (str === '') {
        return new Uint8Array();
    }
    var lastStr = str[str.length - 1];
    var lastByte = bs58.decode(lastStr);
    if (lastByte.length <= 0) {
        return new Uint8Array();
    }
    var preLen = lastByte[0];
    if (preLen > str.length) {
        return new Uint8Array();
    }
    var preStr = str.slice(0, preLen);
    var preByte = new TextEncoder().encode(preStr);
    var centerByte = bs58.decode(str.slice(preLen, str.length - 1));
    // console.log(str.slice(preLen, str.length - 1))
    // console.log("*******************")
    // console.log(preStr)
    // console.log("------------------")
    // console.log(preByte)
    // console.log(centerByte)
    // console.log("==========================")
    var bs = new Uint8Array(preByte.length + centerByte.length + lastByte.length);
    bs.set(preByte, 0);
    bs.set(centerByte, preByte.length);
    bs.set(lastByte, preByte.length + centerByte.length);
    return bs;
}
exports.AddressFromB58String = AddressFromB58String;
//
// function BuildAddr(pre: string, pubKey: Uint8Array): AddressCoin {
//     // @ts-ignore
//     const publicSHA256 = new Uint8Array([...pubKey].map((byte) => sha256(byte)));
//     const RIPEMD160Hasher = new Uint8Array(ripemd160([...publicSHA256]));
//
//     const buf = new Uint8Array([...new TextEncoder().encode(pre), ...RIPEMD160Hasher]);
//     const temp = new Uint8Array(sha256(sha256(buf)));
//
//     const preLen = new Uint8Array([buf.length]);
//     return new Uint8Array([...buf, ...temp.slice(0, 4), ...preLen]);
// }
//
// function ParseAddrPrefix(addr: AddressCoin): string {
//     if (addr.length <= 0) {
//         return '';
//     }
//
//     const lastByte = addr[addr.length - 1];
//     const preLen = lastByte[0];
//
//     return String.fromCharCode(...addr.slice(0, preLen));
// }
//
// function ValidAddr(pre: string, addr: AddressCoin): boolean {
//     const ok = addr.slice(0, pre.length).every((byte, index) => byte === pre.charCodeAt(index));
//
//     if (!ok) {
//         return false;
//     }
//
//     const length = addr.length;
//     // @ts-ignore
//     const preLen = addr[length - 1][0];
//     const preStr = String.fromCharCode(...addr.slice(0, preLen));
//
//     if (pre !== preStr) {
//         return false;
//     }
//
//     const temp = sha256(sha256(addr.slice(0, length - 4 - 1)));
//     const okSuffix = addr.slice(0, length - 1).every((byte, index) => byte === temp[index]);
//
//     return okSuffix;
// }
//
// function CheckPukAddr(pre: string, pubKey: Uint8Array, addr: AddressCoin): boolean {
//     const tagAddr = BuildAddr(pre, pubKey);
//     return tagAddr.every((byte, index) => byte === addr[index]);
// }
// function sha256(data: number): Uint8Array {
//     // 实现 SHA-256 哈希算法的逻辑，返回 Uint8Array 结果
//     // 请根据实际需要实现此函数
//     return new Uint8Array();
// }
//
function ripemd160(data) {
    // 实现 RIPEMD-160 哈希算法的逻辑，返回 Uint8Array 结果
    // 请根据实际需要实现此函数
    return new Uint8Array();
}

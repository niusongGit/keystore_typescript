"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressInfo = void 0;
var address_1 = require("./crypto/address");
// 地址信息
var AddressInfo = /** @class */ (function () {
    function AddressInfo(source) {
        if (source === void 0) { source = {}; }
        if ('string' === typeof source)
            source = JSON.parse(source);
        this.nickname = source["nickname"];
        this.index = source["index"];
        this.addr = source["addr"];
        this.puk = source["puk"];
        this.cPuk = source["cPuk"];
        this.subKey = source["subKey"];
        this.addrStr = source["addrStr"];
        this.pukStr = source["pukStr"];
        this.checkHash = source["checkHash"];
    }
    AddressInfo.prototype.getAddressStr = function () {
        if (!this.addrStr) {
            this.addrStr = (0, address_1.B58String)(this.addr);
        }
        return this.addrStr;
    };
    AddressInfo.prototype.getPublicKeyStr = function () {
        if (!this.pukStr || !this.puk) {
            this.pukStr = this.puk.toString();
        }
        return this.pukStr;
    };
    return AddressInfo;
}());
exports.AddressInfo = AddressInfo;

import {TxPay as TxPayProto} from "./generated/tx_pay";
import { TxBase as TxBaseProto,Vin as VinProto,Vout as VoutProto } from "./generated/txbase";
import Keystore from "@/assets/keystore/keystore"
import { B58String, AddressFromB58String,AddressCoin} from "@/assets/keystore/cryptos/address";
import {Buffer} from "buffer";
import BigNumber from 'bignumber.js';
import keystore from "@/assets/keystore/keystore";
import { sha3_256 } from 'js-sha3';
import { encode } from 'varint';

const Wallet_tx_type_pay = 4 // 普通支付类型
const Wallet_tx_lockHeight = 300 // 交易锁定高度

export function CreateOfflineTx(keyStoreObj :Keystore,pwd :string,srcaddress :string,address :string,comment :string,amount :number,gas :number,frozenHeight :number,nonce :number,currentHeight :number,domain :string,domainType :number):[string,string,Error | null]{

    const srcaddr = AddressFromB58String(srcaddress)
    if (srcaddr === null){
        return ["","",new Error("srcaddress is not a valid address ")];
    }

    const dst = AddressFromB58String(address)

    if (dst === null){
        return ["","",new Error("address is not a valid address ")];
    }

    let commentbs = new Uint8Array(0)
    if (comment !== ""){
        commentbs = new TextEncoder().encode(comment);
    }


   const [prk,puk,err] = keyStoreObj.GetKeyByAddr(srcaddress,pwd)
    if (err instanceof Error) {
        return ["","",err];
    }
    const nonceInt = new BigNumber(nonce).plus(1);
    //const nonceInt = BigInt(nonce);

    const vin = new Vin({
        Puk: new Uint8Array(puk),
        sign: new Uint8Array(0),
        Nonce: nonceInt
    });


    const vout = new Vout({
        Value: amount,
        Address: new Uint8Array(dst),
        FrozenHeight: frozenHeight,
        Domain: new TextEncoder().encode(domain),
        DomainType: domainType
    })

    const base = new TxBase({
        Type: Wallet_tx_type_pay,
        Vin_total: 1,
        Vin: [
            vin
        ],
        Vout_total: 1,
        Vout: [
            vout
        ],
        Gas: gas,
        LockHeight: currentHeight + Wallet_tx_lockHeight,
        Payload: commentbs
    })

    const sign = base.GetSign(prk,0)
    if (sign === null){
        return ["","",new Error("Signature failure !!")];
    }

    vin.sign = sign
    base.Vin = [vin]
    base.BuildHash()

    return [Buffer.from(base.Hash || new Uint8Array(0)).toString('hex'),Buffer.from(base.Proto()).toString('base64'),null]
}

export function uint64ToBytes(n: number): Uint8Array {
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);
    view.setBigUint64(0, BigInt(n), true); // 使用setBigUint64处理uint64值
    const bytes = new Uint8Array(buffer);
    return bytes;
}

export function hash_SHA3_256(bs: Uint8Array): Uint8Array {
    const hash = sha3_256.create();
    hash.update(bs);
    return new Uint8Array(hash.arrayBuffer());
}

export function bignumberToUint8Array(b?:BigNumber):Uint8Array{
    const hexString = b ? b.toString(16) : "";

// 创建一个 Uint8Array 来存储转换后的结果
    const byteArray = new Uint8Array(Math.ceil(hexString.length / 2));

// 将十六进制字符串转换为字节数组
    for (let i = 0; i < hexString.length; i += 2) {
        const byte = parseInt(hexString.substr(i, 2), 16);
        byteArray[i / 2] = byte;
    }
    return byteArray
}

export class TxBase {
    Hash?: Uint8Array;
    Type?: number;
    Vin_total?: number;
    Vin?: Vin[];
    Vout_total?: number;
    Vout?: Vout[];
    Gas?: number;
    LockHeight?: number;
    Payload?: Uint8Array;
    BlockHash?: Uint8Array;
    GasUsed?: number;

    constructor(data?: {
        Hash?: Uint8Array;
        Type?: number;
        Vin_total?: number;
        Vin?: Vin[];
        Vout_total?: number;
        Vout?: Vout[];
        Gas?: number;
        LockHeight?: number;
        Payload?: Uint8Array;
        BlockHash?: Uint8Array;
        GasUsed?: number;
    }) {
        if (data) {
            this.Hash = data.Hash;
            this.Type = data.Type;
            this.Vin_total = data.Vin_total;
            this.Vin = data.Vin;
            this.Vout_total = data.Vout_total;
            this.Vout = data.Vout;
            this.Gas = data.Gas;
            this.LockHeight = data.LockHeight;
            this.Payload = data.Payload;
            this.BlockHash = data.BlockHash;
            this.GasUsed = data.GasUsed;
        }
    }

    GetSign(prk : Buffer,vinIndex: number):Uint8Array | null{
        const signDst = this.getSignserialize(null,vinIndex)

        if (signDst === null) {
            return null
        }
        return keystore.Sign(signDst,prk)
    }

    getSignserialize(voutBs: Uint8Array|null, vinIndex: number): Uint8Array | null {
        if (vinIndex > (this.Vin ? this.Vin.length : 0)) {
            return null;
        }
        let voutBssLenght = 0;
        const voutBss: Uint8Array[] = [];
        for (const one of this.Vout || []) {
            const voutBsone = one.serialize();
            voutBss.push(voutBsone);
            voutBssLenght += voutBsone.length;
        }
        let bs = new Uint8Array();
        if (voutBs !== null) {
            bs = new Uint8Array([...bs, ...voutBs]);
        }
        bs = new Uint8Array([...bs, ...uint64ToBytes(this.Type || 0)]);
        bs = new Uint8Array([...bs, ...uint64ToBytes(this.Vin_total || 0)]);
        bs = new Uint8Array([...bs, ...uint64ToBytes(vinIndex)]);
        bs = new Uint8Array([...bs, ...uint64ToBytes(this.Vout_total || 0)]);
        for (const one of voutBss) {
            bs = new Uint8Array([...bs, ...one]);
        }
        bs = new Uint8Array([...bs, ...uint64ToBytes(this.Gas || 0)]);
        bs = new Uint8Array([...bs, ...uint64ToBytes(this.LockHeight || 0)]);
        bs = new Uint8Array([...bs, ...(this.Payload || new Uint8Array(0))]);
        return bs;
    }

    // getSignserialize(voutBs: Uint8Array|null, vinIndex: number): Uint8Array | null {
    //     if (vinIndex > (this.Vin ? this.Vin.length : 0)) {
    //         return null;
    //     }
    //     let voutBssLenght = 0;
    //     const voutBss: Uint8Array[] = [];
    //     for (const one of this.Vout || []) {
    //         const voutBsone = one.serialize();
    //         voutBss.push(voutBsone);
    //         voutBssLenght += voutBsone.length;
    //     }
    //     let bs: Uint8Array;
    //     if (voutBs === null) {
    //         bs = new Uint8Array(8 + 8 + 8 + 8 + voutBssLenght + 8 + (this.Payload ? this.Payload.length : 0) + 8);
    //     } else {
    //         bs = new Uint8Array((voutBs.length || 0) + 8 + 8 + 8 + 8 + voutBssLenght + 8 + (this.Payload ? this.Payload.length : 0) + 8);
    //         bs.set(voutBs);
    //     }
    //     bs.set(uint64ToBytes(this.Type || 0), bs.length - 8 - 8 - 8 - 8 - voutBssLenght - 8 - (this.Payload ? this.Payload.length : 0) - 8);
    //     bs.set(uint64ToBytes(this.Vin_total || 0), bs.length - 8 - 8 - 8 - voutBssLenght - 8 - (this.Payload ? this.Payload.length : 0) - 8);
    //     bs.set(uint64ToBytes(vinIndex), bs.length - 8 - 8 - voutBssLenght - 8 - (this.Payload ? this.Payload.length : 0) - 8);
    //     bs.set(uint64ToBytes(this.Vout_total || 0), bs.length - 8 - voutBssLenght - 8 - (this.Payload ? this.Payload.length : 0) - 8);
    //     for (const one of voutBss) {
    //         bs.set(one, bs.length - voutBssLenght - 8 - (this.Payload ? this.Payload.length : 0) - 8);
    //     }
    //     bs.set(uint64ToBytes(this.Gas || 0), bs.length - 8 - (this.Payload ? this.Payload.length : 0) - 8);
    //     bs.set(uint64ToBytes(this.LockHeight || 0), bs.length - (this.Payload ? this.Payload.length : 0) - 8);
    //     bs.set(this.Payload || new Uint8Array(0), 0);
    //     return bs;
    // }

    Proto():Uint8Array{
       const TxBaseP = new TxBaseProto();

        this.Vin?.forEach((element, index) => {
            TxBaseP.Vin.push(new VinProto({
                Puk: element.Puk,
                sign: element.sign,
                Nonce: bignumberToUint8Array(element.Nonce)
            }))
        });

        this.Vout?.forEach((element, index) => {
            TxBaseP.Vout.push(new VoutProto({
                Value: element.Value,
                Address: element.Address,
                FrozenHeight: element.FrozenHeight,
                Domain: element.Domain,
                DomainType: element.DomainType,
            }))
        });

        TxBaseP.Hash = this.Hash?this.Hash:new Uint8Array(0);
        TxBaseP.Type = this.Type?this.Type:0;
        TxBaseP.Vin_total = this.Vin_total?this.Vin_total:0;
        TxBaseP.Vout_total = this.Vout_total?this.Vout_total:0;
        TxBaseP.Gas = this.Gas?this.Gas:0;
        TxBaseP.LockHeight = this.LockHeight?this.LockHeight:0;
        TxBaseP.Payload = this.Payload?this.Payload:new Uint8Array(0);

        const txPayP = new TxPayProto()
        txPayP.TxBase = TxBaseP
        return   txPayP.serializeBinary()
    }
    serialize(): Uint8Array {
        const vinBss: Uint8Array[] = [];
        for (const one of this.Vin || []) {
            const vinBsone = one.serialize();
            vinBss.push(vinBsone);
        }

        const voutBss: Uint8Array[] = [];
        for (const one1 of this.Vout || []) {
            const voutBsone = one1.serialize();
            voutBss.push(voutBsone);
        }

        let bs = new Uint8Array();
        bs = new Uint8Array([...bs, ...uint64ToBytes(this.Type || 0)]);
        bs = new Uint8Array([...bs, ...uint64ToBytes(this.Vin_total || 0)]);

        if (vinBss.length>0){
            for (const one2 of vinBss) {
                bs = new Uint8Array([...bs, ...one2]);
            }
        }


        bs = new Uint8Array([...bs, ...uint64ToBytes(this.Vout_total || 0)]);

        if (voutBss.length>0) {
            for (const one3 of voutBss) {
                bs = new Uint8Array([...bs, ...one3]);
            }
        }

        bs = new Uint8Array([...bs, ...uint64ToBytes(this.Gas || 0)]);
        bs = new Uint8Array([...bs, ...uint64ToBytes(this.LockHeight || 0)]);
        bs = new Uint8Array([...bs, ...(this.Payload || new Uint8Array(0))]);

        return bs;
    }
    BuildHash():void{
        if ((this.Hash ? this.Hash.length : 0) > 0){
            return
        }

        let  bs:Uint8Array = this.serialize()

        const id = new Uint8Array(8);
        const value = 4;
        const encoded = encode(value);
        id.set(encoded);
        // console.log("id ",id)
        // console.log("hash_SHA3_256 ", hash_SHA3_256(new Uint8Array([1, 2, 3])))
        bs = new Uint8Array([...id, ...(hash_SHA3_256(bs) || new Uint8Array())]);
        this.Hash = bs;
        return;
    }
}

export class Vin {
    Puk?: Uint8Array;
    sign?: Uint8Array;
    Nonce?: BigNumber;
    constructor(data?: {
        Puk?: Uint8Array;
        sign?: Uint8Array;
        Nonce?: BigNumber;
    }) {
        if (data) {
            this.Puk = data.Puk;
            this.sign = data.sign;
            this.Nonce = data.Nonce;
        }
    }
    serialize(): Uint8Array {
        let bs = new Uint8Array();
        bs = new Uint8Array([...bs, ...(this.Puk || new Uint8Array())]);
        bs = new Uint8Array([...bs, ...(this.sign || new Uint8Array())]);
        bs = new Uint8Array([...bs, ...(bignumberToUint8Array(this.Nonce) || new Uint8Array())]);
        return bs
    }
}

export class Vout {
    Value?: number;
    Address?: Uint8Array;
    FrozenHeight?: number;
    Domain?: Uint8Array;
    DomainType?: number;
    constructor(data?: {
        Value?: number;
        Address?: Uint8Array;
        FrozenHeight?: number;
        Domain?: Uint8Array;
        DomainType?: number;
    }) {
        if (data) {
            this.Value = data.Value;
            this.Address = data.Address;
            this.FrozenHeight = data.FrozenHeight;
            this.Domain = data.Domain;
            this.DomainType = data.DomainType;
        }
    }
    serialize(): Uint8Array {
        let bs = new Uint8Array();
        bs = new Uint8Array([...bs, ...uint64ToBytes(this.Value || 0)]);
        bs = new Uint8Array([...bs, ...(this.Address || new Uint8Array())]);
        bs = new Uint8Array([...bs, ...uint64ToBytes(this.FrozenHeight || 0)]);
        bs = new Uint8Array([...bs, ...uint64ToBytes(this.DomainType || 0)]);
        bs = new Uint8Array([...bs, ...Buffer.from(this.Domain || '')]);
        return bs;
    }
}


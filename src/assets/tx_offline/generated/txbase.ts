/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 4.22.0
 * source: txbase.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
export class TxBase extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
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
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [4, 6], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("Hash" in data && data.Hash != undefined) {
                this.Hash = data.Hash;
            }
            if ("Type" in data && data.Type != undefined) {
                this.Type = data.Type;
            }
            if ("Vin_total" in data && data.Vin_total != undefined) {
                this.Vin_total = data.Vin_total;
            }
            if ("Vin" in data && data.Vin != undefined) {
                this.Vin = data.Vin;
            }
            if ("Vout_total" in data && data.Vout_total != undefined) {
                this.Vout_total = data.Vout_total;
            }
            if ("Vout" in data && data.Vout != undefined) {
                this.Vout = data.Vout;
            }
            if ("Gas" in data && data.Gas != undefined) {
                this.Gas = data.Gas;
            }
            if ("LockHeight" in data && data.LockHeight != undefined) {
                this.LockHeight = data.LockHeight;
            }
            if ("Payload" in data && data.Payload != undefined) {
                this.Payload = data.Payload;
            }
            if ("BlockHash" in data && data.BlockHash != undefined) {
                this.BlockHash = data.BlockHash;
            }
            if ("GasUsed" in data && data.GasUsed != undefined) {
                this.GasUsed = data.GasUsed;
            }
        }
    }
    get Hash() {
        return pb_1.Message.getFieldWithDefault(this, 1, new Uint8Array(0)) as Uint8Array;
    }
    set Hash(value: Uint8Array) {
        pb_1.Message.setField(this, 1, value);
    }
    get Type() {
        return pb_1.Message.getFieldWithDefault(this, 2, 0) as number;
    }
    set Type(value: number) {
        pb_1.Message.setField(this, 2, value);
    }
    get Vin_total() {
        return pb_1.Message.getFieldWithDefault(this, 3, 0) as number;
    }
    set Vin_total(value: number) {
        pb_1.Message.setField(this, 3, value);
    }
    get Vin() {
        return pb_1.Message.getRepeatedWrapperField(this, Vin, 4) as Vin[];
    }
    set Vin(value: Vin[]) {
        pb_1.Message.setRepeatedWrapperField(this, 4, value);
    }
    get Vout_total() {
        return pb_1.Message.getFieldWithDefault(this, 5, 0) as number;
    }
    set Vout_total(value: number) {
        pb_1.Message.setField(this, 5, value);
    }
    get Vout() {
        return pb_1.Message.getRepeatedWrapperField(this, Vout, 6) as Vout[];
    }
    set Vout(value: Vout[]) {
        pb_1.Message.setRepeatedWrapperField(this, 6, value);
    }
    get Gas() {
        return pb_1.Message.getFieldWithDefault(this, 7, 0) as number;
    }
    set Gas(value: number) {
        pb_1.Message.setField(this, 7, value);
    }
    get LockHeight() {
        return pb_1.Message.getFieldWithDefault(this, 8, 0) as number;
    }
    set LockHeight(value: number) {
        pb_1.Message.setField(this, 8, value);
    }
    get Payload() {
        return pb_1.Message.getFieldWithDefault(this, 9, new Uint8Array(0)) as Uint8Array;
    }
    set Payload(value: Uint8Array) {
        pb_1.Message.setField(this, 9, value);
    }
    get BlockHash() {
        return pb_1.Message.getFieldWithDefault(this, 10, new Uint8Array(0)) as Uint8Array;
    }
    set BlockHash(value: Uint8Array) {
        pb_1.Message.setField(this, 10, value);
    }
    get GasUsed() {
        return pb_1.Message.getFieldWithDefault(this, 11, 0) as number;
    }
    set GasUsed(value: number) {
        pb_1.Message.setField(this, 11, value);
    }
    static fromObject(data: {
        Hash?: Uint8Array;
        Type?: number;
        Vin_total?: number;
        Vin?: ReturnType<typeof Vin.prototype.toObject>[];
        Vout_total?: number;
        Vout?: ReturnType<typeof Vout.prototype.toObject>[];
        Gas?: number;
        LockHeight?: number;
        Payload?: Uint8Array;
        BlockHash?: Uint8Array;
        GasUsed?: number;
    }): TxBase {
        const message = new TxBase({});
        if (data.Hash != null) {
            message.Hash = data.Hash;
        }
        if (data.Type != null) {
            message.Type = data.Type;
        }
        if (data.Vin_total != null) {
            message.Vin_total = data.Vin_total;
        }
        if (data.Vin != null) {
            message.Vin = data.Vin.map(item => Vin.fromObject(item));
        }
        if (data.Vout_total != null) {
            message.Vout_total = data.Vout_total;
        }
        if (data.Vout != null) {
            message.Vout = data.Vout.map(item => Vout.fromObject(item));
        }
        if (data.Gas != null) {
            message.Gas = data.Gas;
        }
        if (data.LockHeight != null) {
            message.LockHeight = data.LockHeight;
        }
        if (data.Payload != null) {
            message.Payload = data.Payload;
        }
        if (data.BlockHash != null) {
            message.BlockHash = data.BlockHash;
        }
        if (data.GasUsed != null) {
            message.GasUsed = data.GasUsed;
        }
        return message;
    }
    toObject() {
        const data: {
            Hash?: Uint8Array;
            Type?: number;
            Vin_total?: number;
            Vin?: ReturnType<typeof Vin.prototype.toObject>[];
            Vout_total?: number;
            Vout?: ReturnType<typeof Vout.prototype.toObject>[];
            Gas?: number;
            LockHeight?: number;
            Payload?: Uint8Array;
            BlockHash?: Uint8Array;
            GasUsed?: number;
        } = {};
        if (this.Hash != null) {
            data.Hash = this.Hash;
        }
        if (this.Type != null) {
            data.Type = this.Type;
        }
        if (this.Vin_total != null) {
            data.Vin_total = this.Vin_total;
        }
        if (this.Vin != null) {
            data.Vin = this.Vin.map((item: Vin) => item.toObject());
        }
        if (this.Vout_total != null) {
            data.Vout_total = this.Vout_total;
        }
        if (this.Vout != null) {
            data.Vout = this.Vout.map((item: Vout) => item.toObject());
        }
        if (this.Gas != null) {
            data.Gas = this.Gas;
        }
        if (this.LockHeight != null) {
            data.LockHeight = this.LockHeight;
        }
        if (this.Payload != null) {
            data.Payload = this.Payload;
        }
        if (this.BlockHash != null) {
            data.BlockHash = this.BlockHash;
        }
        if (this.GasUsed != null) {
            data.GasUsed = this.GasUsed;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.Hash.length)
            writer.writeBytes(1, this.Hash);
        if (this.Type != 0)
            writer.writeUint64(2, this.Type);
        if (this.Vin_total != 0)
            writer.writeUint64(3, this.Vin_total);
        if (this.Vin.length)
            writer.writeRepeatedMessage(4, this.Vin, (item: Vin) => item.serialize(writer));
        if (this.Vout_total != 0)
            writer.writeUint64(5, this.Vout_total);
        if (this.Vout.length)
            writer.writeRepeatedMessage(6, this.Vout, (item: Vout) => item.serialize(writer));
        if (this.Gas != 0)
            writer.writeUint64(7, this.Gas);
        if (this.LockHeight != 0)
            writer.writeUint64(8, this.LockHeight);
        if (this.Payload.length)
            writer.writeBytes(9, this.Payload);
        if (this.BlockHash.length)
            writer.writeBytes(10, this.BlockHash);
        if (this.GasUsed != 0)
            writer.writeUint64(11, this.GasUsed);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): TxBase {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new TxBase();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.Hash = reader.readBytes();
                    break;
                case 2:
                    message.Type = reader.readUint64();
                    break;
                case 3:
                    message.Vin_total = reader.readUint64();
                    break;
                case 4:
                    reader.readMessage(message.Vin, () => pb_1.Message.addToRepeatedWrapperField(message, 4, Vin.deserialize(reader), Vin));
                    break;
                case 5:
                    message.Vout_total = reader.readUint64();
                    break;
                case 6:
                    reader.readMessage(message.Vout, () => pb_1.Message.addToRepeatedWrapperField(message, 6, Vout.deserialize(reader), Vout));
                    break;
                case 7:
                    message.Gas = reader.readUint64();
                    break;
                case 8:
                    message.LockHeight = reader.readUint64();
                    break;
                case 9:
                    message.Payload = reader.readBytes();
                    break;
                case 10:
                    message.BlockHash = reader.readBytes();
                    break;
                case 11:
                    message.GasUsed = reader.readUint64();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): TxBase {
        return TxBase.deserialize(bytes);
    }
}
export class Vin extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        Puk?: Uint8Array;
        sign?: Uint8Array;
        Nonce?: Uint8Array;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("Puk" in data && data.Puk != undefined) {
                this.Puk = data.Puk;
            }
            if ("sign" in data && data.sign != undefined) {
                this.sign = data.sign;
            }
            if ("Nonce" in data && data.Nonce != undefined) {
                this.Nonce = data.Nonce;
            }
        }
    }
    get Puk() {
        return pb_1.Message.getFieldWithDefault(this, 1, new Uint8Array(0)) as Uint8Array;
    }
    set Puk(value: Uint8Array) {
        pb_1.Message.setField(this, 1, value);
    }
    get sign() {
        return pb_1.Message.getFieldWithDefault(this, 2, new Uint8Array(0)) as Uint8Array;
    }
    set sign(value: Uint8Array) {
        pb_1.Message.setField(this, 2, value);
    }
    get Nonce() {
        return pb_1.Message.getFieldWithDefault(this, 3, new Uint8Array(0)) as Uint8Array;
    }
    set Nonce(value: Uint8Array) {
        pb_1.Message.setField(this, 3, value);
    }
    static fromObject(data: {
        Puk?: Uint8Array;
        sign?: Uint8Array;
        Nonce?: Uint8Array;
    }): Vin {
        const message = new Vin({});
        if (data.Puk != null) {
            message.Puk = data.Puk;
        }
        if (data.sign != null) {
            message.sign = data.sign;
        }
        if (data.Nonce != null) {
            message.Nonce = data.Nonce;
        }
        return message;
    }
    toObject() {
        const data: {
            Puk?: Uint8Array;
            sign?: Uint8Array;
            Nonce?: Uint8Array;
        } = {};
        if (this.Puk != null) {
            data.Puk = this.Puk;
        }
        if (this.sign != null) {
            data.sign = this.sign;
        }
        if (this.Nonce != null) {
            data.Nonce = this.Nonce;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.Puk.length)
            writer.writeBytes(1, this.Puk);
        if (this.sign.length)
            writer.writeBytes(2, this.sign);
        if (this.Nonce.length)
            writer.writeBytes(3, this.Nonce);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Vin {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Vin();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.Puk = reader.readBytes();
                    break;
                case 2:
                    message.sign = reader.readBytes();
                    break;
                case 3:
                    message.Nonce = reader.readBytes();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): Vin {
        return Vin.deserialize(bytes);
    }
}
export class Vout extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        Value?: number;
        Address?: Uint8Array;
        FrozenHeight?: number;
        Domain?: Uint8Array;
        DomainType?: number;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("Value" in data && data.Value != undefined) {
                this.Value = data.Value;
            }
            if ("Address" in data && data.Address != undefined) {
                this.Address = data.Address;
            }
            if ("FrozenHeight" in data && data.FrozenHeight != undefined) {
                this.FrozenHeight = data.FrozenHeight;
            }
            if ("Domain" in data && data.Domain != undefined) {
                this.Domain = data.Domain;
            }
            if ("DomainType" in data && data.DomainType != undefined) {
                this.DomainType = data.DomainType;
            }
        }
    }
    get Value() {
        return pb_1.Message.getFieldWithDefault(this, 1, 0) as number;
    }
    set Value(value: number) {
        pb_1.Message.setField(this, 1, value);
    }
    get Address() {
        return pb_1.Message.getFieldWithDefault(this, 2, new Uint8Array(0)) as Uint8Array;
    }
    set Address(value: Uint8Array) {
        pb_1.Message.setField(this, 2, value);
    }
    get FrozenHeight() {
        return pb_1.Message.getFieldWithDefault(this, 3, 0) as number;
    }
    set FrozenHeight(value: number) {
        pb_1.Message.setField(this, 3, value);
    }
    get Domain() {
        return pb_1.Message.getFieldWithDefault(this, 4, new Uint8Array(0)) as Uint8Array;
    }
    set Domain(value: Uint8Array) {
        pb_1.Message.setField(this, 4, value);
    }
    get DomainType() {
        return pb_1.Message.getFieldWithDefault(this, 5, 0) as number;
    }
    set DomainType(value: number) {
        pb_1.Message.setField(this, 5, value);
    }
    static fromObject(data: {
        Value?: number;
        Address?: Uint8Array;
        FrozenHeight?: number;
        Domain?: Uint8Array;
        DomainType?: number;
    }): Vout {
        const message = new Vout({});
        if (data.Value != null) {
            message.Value = data.Value;
        }
        if (data.Address != null) {
            message.Address = data.Address;
        }
        if (data.FrozenHeight != null) {
            message.FrozenHeight = data.FrozenHeight;
        }
        if (data.Domain != null) {
            message.Domain = data.Domain;
        }
        if (data.DomainType != null) {
            message.DomainType = data.DomainType;
        }
        return message;
    }
    toObject() {
        const data: {
            Value?: number;
            Address?: Uint8Array;
            FrozenHeight?: number;
            Domain?: Uint8Array;
            DomainType?: number;
        } = {};
        if (this.Value != null) {
            data.Value = this.Value;
        }
        if (this.Address != null) {
            data.Address = this.Address;
        }
        if (this.FrozenHeight != null) {
            data.FrozenHeight = this.FrozenHeight;
        }
        if (this.Domain != null) {
            data.Domain = this.Domain;
        }
        if (this.DomainType != null) {
            data.DomainType = this.DomainType;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.Value != 0)
            writer.writeUint64(1, this.Value);
        if (this.Address.length)
            writer.writeBytes(2, this.Address);
        if (this.FrozenHeight != 0)
            writer.writeUint64(3, this.FrozenHeight);
        if (this.Domain.length)
            writer.writeBytes(4, this.Domain);
        if (this.DomainType != 0)
            writer.writeUint64(5, this.DomainType);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Vout {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Vout();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.Value = reader.readUint64();
                    break;
                case 2:
                    message.Address = reader.readBytes();
                    break;
                case 3:
                    message.FrozenHeight = reader.readUint64();
                    break;
                case 4:
                    message.Domain = reader.readBytes();
                    break;
                case 5:
                    message.DomainType = reader.readUint64();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): Vout {
        return Vout.deserialize(bytes);
    }
}
/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 4.22.0
 * source: tx_pay.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as dependency_1 from "./txbase";
import * as pb_1 from "google-protobuf";
export class TxPay extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        TxBase?: dependency_1.TxBase;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("TxBase" in data && data.TxBase != undefined) {
                this.TxBase = data.TxBase;
            }
        }
    }
    get TxBase() {
        return pb_1.Message.getWrapperField(this, dependency_1.TxBase, 1) as dependency_1.TxBase;
    }
    set TxBase(value: dependency_1.TxBase) {
        pb_1.Message.setWrapperField(this, 1, value);
    }
    get has_TxBase() {
        return pb_1.Message.getField(this, 1) != null;
    }
    static fromObject(data: {
        TxBase?: ReturnType<typeof dependency_1.TxBase.prototype.toObject>;
    }): TxPay {
        const message = new TxPay({});
        if (data.TxBase != null) {
            message.TxBase = dependency_1.TxBase.fromObject(data.TxBase);
        }
        return message;
    }
    toObject() {
        const data: {
            TxBase?: ReturnType<typeof dependency_1.TxBase.prototype.toObject>;
        } = {};
        if (this.TxBase != null) {
            data.TxBase = this.TxBase.toObject();
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.has_TxBase)
            writer.writeMessage(1, this.TxBase, () => this.TxBase.serialize(writer));
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): TxPay {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new TxPay();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    reader.readMessage(message.TxBase, () => message.TxBase = dependency_1.TxBase.deserialize(reader));
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): TxPay {
        return TxPay.deserialize(bytes);
    }
}
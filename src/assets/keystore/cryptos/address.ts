import * as crypto from 'crypto';
import * as bs58 from 'bs58';

export type AddressCoin = Buffer;

export function B58String(addr: AddressCoin): string {
    if (addr.length <= 0) {
        return "";
    }
    const lastByte = addr.slice(-1);
    const lastStr = bs58.encode(lastByte);
    if (lastStr === ""){
        return "";
    }

    const preLen = lastByte[0];
    const preStr = addr.slice(0, preLen).toString();
    const centerStr = bs58.encode(addr.slice(preLen, -1));
    return preStr + centerStr + lastStr;
}


export function AddressFromB58String(str: string): AddressCoin | null {
    if (str === "") {
        return null;
    }
    const lastStr = str.slice(-1);
    const lastByte = bs58.decode(lastStr);
    if (lastByte.length <= 0) {
        return null;
    }
    const preLen = lastByte[0];
    if (preLen > str.length) {
        return null;
    }
    const preStr = str.slice(0, preLen);
    const centerByte = bs58.decode(str.slice(preLen, -1));
    const bs = Buffer.concat([Buffer.from(preStr), centerByte, lastByte]);
    return bs;
}

export function BuildAddr(pre: string, pubKey: Buffer): AddressCoin {
    // 第一步，计算SHA-256哈希值
    const publicSHA256 = crypto.createHash('sha256').update(pubKey).digest();
    // 第二步，计算RIPEMD-160哈希值
    const RIPEMD160Hasher = crypto.createHash('ripemd160');
    RIPEMD160Hasher.update(publicSHA256);

    const publicRIPEMD160 = RIPEMD160Hasher.digest();
    // 第三步，在上一步结果之间加入地址版本号
    const buf = Buffer.concat([Buffer.from(pre), publicRIPEMD160]);

    // 第四步，计算上一步结果的SHA-256哈希值
    let temp = crypto.createHash('sha256').update(buf).digest();
    // 第五步，再次计算上一步结果的SHA-256哈希值
    temp = crypto.createHash('sha256').update(temp).digest();
    // 第六步，取上一步结果的前4个字节作为校验
    const checksum = temp.slice(0, 4);
    const preLen = Buffer.from(pre).length;
    return Buffer.concat([Buffer.from(pre), publicRIPEMD160, checksum, Buffer.from([preLen])]);
}

export function ParseAddrPrefix(addr: AddressCoin): string {
    if (addr.length <= 0) {
        return "";
    }
    const lastByte = addr.slice(-1);
    const preLen = lastByte[0];
    const preStr = addr.slice(0, preLen).toString();
    return preStr;
}

export function ValidAddr(pre: string, addr: AddressCoin): boolean {
    const ok = Buffer.compare(addr.slice(0, pre.length), Buffer.from(pre)) === 0;
    if (!ok) {
        return false;
    }
    const length = addr.length;
    const preLen = addr[length - 1];
    if (preLen > length) {
        return false;
    }
    const temp = crypto.createHash('sha256').update(addr.slice(0, length - 5)).digest();
    const checksum = temp.slice(0, 4);
    if (!Buffer.compare(addr.slice(0, -5), checksum)) {
        return false;
    }
    return true;
}

export function CheckPukAddr(pre: string, pubKey: Buffer, addr: AddressCoin): boolean {
    const tagAddr = BuildAddr(pre, pubKey);
    return Buffer.compare(tagAddr, addr) === 0;
}

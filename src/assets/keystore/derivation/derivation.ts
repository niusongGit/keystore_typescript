import * as bip39 from 'bip39';
import HDKey from "hdkey";
import * as tweetnacl from "tweetnacl";
import {BuildAddr, B58String, AddressFromB58String, AddressCoin} from '@/assets/keystore/cryptos/address';

const ZeroQuote = 0x80000000;
const PurposeBIP44 = 0x8000002C;
const PurposeBIP49 = 0x80000031;
const PurposeBIP84 = 0x80000054;
const Apostrophe = 0x80000000;
const CoinType = 98055361;

export class KeyManager {
    mnemonic: string;
    keys:  tweetnacl.SignKeyPair | null;

    constructor(mnemonic: string) {
        this.mnemonic = mnemonic;
        this.keys = null;
    }

    GetKey(index: number): tweetnacl.SignKeyPair {
        if (this.mnemonic == ""){
            throw new Error(`mnemonic is null !!`);
        }

        const seedBuffer = bip39.mnemonicToSeedSync(this.mnemonic,"")
        const hdWallet = HDKey.fromMasterSeed(seedBuffer);

        const path = `m/${PurposeBIP44 - Apostrophe}'/${CoinType - Apostrophe}'/0'/0/${index}`;  // 这是 BIP-44 的路径
        const derivedKey = hdWallet.derive(path);
        // 生成 Ed25519 密钥对
        this.keys = tweetnacl.sign.keyPair.fromSeed(derivedKey.privateKey);

        return this.keys;
    }


    CreateAddr(addr_pre: string):AddressCoin{
        if (this.keys == null || this.keys.publicKey.length == 0){
            throw new Error(`publicKey is empty. First call GetKey to generate the secret key !!`);
        }
        //生成地址
        const addr  = BuildAddr(addr_pre,Buffer.from(this.keys.publicKey))
        //console.log("addr Buffer:",addr)
        // const addr_str = B58String(addr)
        // const addrbuffer = AddressFromB58String(addr_str)
        // console.log("addrbuffer:",addrbuffer)
        return addr
    }

}

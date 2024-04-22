<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
      <button @click="testNoce">点击按钮</button>
<!--    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>-->
  </div>
</template>
<script lang="ts" setup>
import { Options, Vue } from 'vue-class-component';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import { AddressFromB58String,B58String, AddressCoin } from '@/assets/keystore/cryptos/address';
//import {AddressInfo} from "@/assets/keystore/wallet";
import Keystore from "@/assets/keystore/keystore"
import {CreateOfflineTx} from "@/assets/tx_offline/tx_offline"

import { BigNumber } from 'bignumber.js';
function testNoce(){
    const bigNumber = new BigNumber('544534534535');

    const hexString = bigNumber.toString(16);

// 创建一个 Uint8Array 来存储转换后的结果
    const byteArray = new Uint8Array(Math.ceil(hexString.length / 2));

// 将十六进制字符串转换为字节数组
    for (let i = 0; i < hexString.length; i += 2) {
        const byte = parseInt(hexString.substr(i, 2), 16);
        byteArray[i / 2] = byte;
    }

    console.log(byteArray)

    return
}


function testOfflineTx(){
    //buildOfflineTx()

    const pwd = "1234567890"
    let key = new Keystore("keystore","iCom")

    const ImportMnemonicerr = key.ImportMnemonic("hour street again define million camera clean violin tunnel cattle flee daughter",pwd)
    if (ImportMnemonicerr instanceof Error) {
        console.error("ImportMnemonicerr", ImportMnemonicerr.message)
    }

    const [addB,err1] = key.GetNewAddr(pwd,"张三")
        if (err1 instanceof Error) {
            console.error("errr1", err1.message)
        }
        console.log("GetNewAddr:",addB)

    const addrinfo = key.getCoinbase()
    if (addrinfo === null){
        console.error("默认地址为空")
        return
    }



    const [hash,tx,errrtx] = CreateOfflineTx(key,pwd ,addrinfo.addrStr,B58String(addB),"comment",10,2,30,119,20,"domain",1)

    if (errrtx instanceof Error) {
        console.error("errrtx", errrtx)
    }
    console.log("CreateOfflineTxHash:",hash)
    console.log("CreateOfflineTx:",tx)
    return
}

//
// function testAddress(){
//     const addressString = "iCom8H3gQQXMBaxFLELzoCxvkGfq655u1UKYr5";
//     const address: AddressCoin = AddressFromB58String(addressString);
//     console.log(address)
//     // const addressStr: string = B58String(address);
//     // console.log(addressStr)
//
//     let ad = new AddressInfo({"addr":address})
//
//     console.log(ad.getAddressStr())
// }

// testAddress();


    function testNewKeystore (){

    const pwd = "1234567890"
    const newpwd = "9876543210"
        let key = new Keystore("keystore","iCom")

        const ImportMnemonicerr = key.ImportMnemonic("picture person motion target burst steak crawl bench among either smile win",pwd)
         if (ImportMnemonicerr instanceof Error) {
             console.error("ImportMnemonicerr", ImportMnemonicerr.message)
         }
       // const [words,err] =  key.ExportMnemonic("12345678901")
       //  console.log(words)
       //  if (err instanceof Error) {
       //      console.error("errr", err.message)
       //  }

        // const er = key.Load()
        // if (er instanceof Error) {
        //     console.log("load:", er.message);
        //
        //     const err = key.CreateNewKeystore(pwd)
        //     if (err instanceof Error) {
        //         console.error("errr", err.message)
        //     }
        //
        //     const [addB,err1] = key.GetNewAddr(pwd,"张三")
        //     if (err1 instanceof Error) {
        //         console.error("errr1", err1.message)
        //     }
        //     console.log("GetNewAddr:",addB)
        //
        // }



        // key.Load()

        const [words,err2] =  key.ExportMnemonic(pwd)
         console.log(words)
         if (err2 instanceof Error) {
             console.error("errr2", err2.message)
             return
         }
        key.GetAddrAll().forEach((element, index) => {
            console.log("index:",index," value:",element)
        });

        const addrinfo = key.getCoinbase()
        if (addrinfo === null){
            console.error("默认地址为空")
            return
        }
        const [prk,puk,keyerr] = key.GetKeyByAddr(addrinfo.addrStr,pwd)
        if (keyerr instanceof Error) {
            console.error("keyerr", keyerr.message)
            return
        }

        let message = new Uint8Array([1, 2, 3, 4, 5]);

        const signature = keystore.Sign(message,prk)

        console.log(signature)
        if (signature === null){
            console.error("签名结果为空")
            return
        }
        let ok = keystore.SignVerify(message,signature,puk)
        console.log("验证签名结果：",ok)

        // message = new Uint8Array([1, 2, 3, 4, 5,6]);
        // ok = keystore.SignVerify(message,signature,puk)
        // console.log("验证签名结果：",ok)


        // const [ok1,uperr] = key.UpdatePwd(pwd,newpwd)
        // if (uperr instanceof Error) {
        //     console.error("keyerr", uperr.message)
        //     return
        // }
        // console.log("修改密码是否成功",ok1)
        // let UpdateAddrNameok = key.UpdateAddrName("五五",pwd,addrinfo.addrStr)
        // console.log("修改名字是否成功",UpdateAddrNameok)
        // UpdateAddrNameok = key.UpdateAddrName("李四",newpwd,addrinfo.addrStr)
        // console.log("修改名字是否成功",UpdateAddrNameok)
        //
        // key.GetAddrAll().forEach((element, index) => {
        //     console.log("index:",index," value:",element)
        // });
        console.log("keystore :",key)
        // key.CreateNewKeystore("1234567890")
        // key.GetNewAddr("1234567890","1234567890")
        // console.log(key)
        //
        // const keystoreString1 = localStorage.getItem(key.saveKeyName);
        // console.log("222222222222222222222222222222222222222222222")
        // console.log(keystoreString1)
        // if (keystoreString1) {
        //     console.log("33333333333333333333333333333333333333333")
        //     const savedKeystore: Keystore = JSON.parse(keystoreString1, (key, value) => {
        //         if (value && value.type === 'Buffer' && Array.isArray(value.data)) {
        //             return Buffer.from(value.data);
        //         }
        //         return value;
        //     });
        //     console.log(savedKeystore)
        //     console.log("addrMap :",savedKeystore.addrMap)
        //     console.log("seed :",savedKeystore.Seed)
        // }
    }
// import * as bip39 from 'bip39';
// import { Buffer } from "buffer";
// window.Buffer = Buffer;
// import {deriveAddressFromPath} from "@/assets/keystore/derivation/derivation"
// function bip39Test(){
//
//
//     const words = 'hour street again define million camera clean violin tunnel cattle flee daughter';
//     bip39.setDefaultWordlist("english");
//     console.log("getDefaultWordlist :", bip39.getDefaultWordlist())
//     //console.log("DEFAULT_WORDLIST :", bip39.wordlists.DEFAULT_WORDLIST)
//     const seedBuffer = bip39.mnemonicToEntropy(words);
//     //console.log(seedBuffer);
//     //console.log("byte :",Buffer.from(seedBuffer, 'hex'));
//     const path = "m/44'/98055361'/0'/0/0";
//     const adr = deriveAddressFromPath(Buffer.from(seedBuffer, 'hex'),path)
//     console.log(adr);
//
//
// }

//import aes_cbc, {AesManager} from '@/assets/keystore/cryptos/aes_cbc';

// import {KeyManager} from '@/assets/keystore/derivation/derivation';
// function bipTest(){
//     // // 示例用法
//     const mnemonic = 'hour street again define million camera clean violin tunnel cattle flee daughter'; // 替换为实际的助记词
//     const km = new KeyManager(mnemonic);
//     const keys = km.GetKey(0)
//     console.log("publicKey: ", keys.publicKey);
//     console.log("privateKey: ", keys.secretKey);
//     const addr = km.CreateAddr("iCom")
//     console.log("addr: ", addr);
// }


// import HDKey from 'hdkey';
// import * as bip39 from 'bip39';
// import * as crypto from 'crypto';
// import {Address} from '@/assets/keystore/cryptos/address';
// import * as tweetnacl from 'tweetnacl';
// function hdkeytest(){
//     const pwd = crypto.createHash("sha256").update("123456").digest()
//     console.log("pwd :",pwd)
//
//     const words = 'hour street again define million camera clean violin tunnel cattle flee daughter';
//     const seedBuffer = bip39.mnemonicToSeedSync(words,"")
//     console.log("seedBuffer: ",seedBuffer);
//     //bip39.setDefaultWordlist("english");
//     //console.log("getDefaultWordlist :", bip39.getDefaultWordlist())
//     //console.log("DEFAULT_WORDLIST :", bip39.wordlists.DEFAULT_WORDLIST)
//    // const seedBuffer = bip39.mnemonicToEntropy(words);
//     //console.log(seedBuffer);
// //    console.log("byte :",Buffer.from(seedBuffer, 'hex'));
//
//     // 创建 HD 钱包
//     const hdWallet = HDKey.fromMasterSeed(seedBuffer);
//    // const hdWallet = HDKey.fromMasterSeed(Buffer.from(seedBuffer, 'hex'));
//
// // 派生出一个以太坊地址
//     //const path = "m/44'/98055361'/0'/0/0";  // 这是 BIP-44 的路径，表示以太坊的默认地址
//     const coinType = 98055361
//     const Apostrophe = 0x80000000
//     const  purpose = 0x8000002C
//     const path = `m/${purpose - Apostrophe}'/${coinType - Apostrophe}'/0'/0/0`;  // 这是 BIP-44 的路径，表示以太坊的默认地址
//     console.log("path : ",path);
//     const derivedKey = hdWallet.derive(path);
//     console.log("derivedKey : ",derivedKey);
//
//     // 生成 Ed25519 密钥对
//     const keyPair = tweetnacl.sign.keyPair.fromSeed(derivedKey.privateKey);
//
//     // 获取 Ed25519 公钥
//     const publicKey = keyPair.publicKey;
//     console.log("publicKey: ", publicKey);
//     console.log("privateKey: ", keyPair.secretKey);
//
//
//     // // 生成 Ed25519 密钥对
//     // const keyPair = ed25519.MakeKeypair(derivedKey.privateKey);
//     //
//     // // 获取 Ed25519 公钥
//     // const publicKey = keyPair.publicKey;
//     // console.log("publicKey: ", publicKey);
//
//
//     // 使用 ed25519 生成私钥
//     // const privateKey = crypto.createPrivateKey({
//     //     key: derivedKey.privateKey,
//     //     format: 'pem',
//     //     type: 'ed25519'
//     // });
//     // console.log("私钥 : ",privateKey);
//
//     const ad  = Address.buildAddress("iCom",publicKey)
//     console.log("地址 : ",ad);
//     console.log("地址str: ",B58String(ad));
// }

import * as CryptoJS from "crypto-js";
import {mnemonicToEntropy, mnemonicToSeedSync} from "bip39";
import keystore from "@/assets/keystore/keystore";
// function aesTest(){
//
//     const pbk: Uint8Array = new Uint8Array( [82,119,34,172,7,189,122,60,54,238,83,234,85,232,53,47,246,6,29,129,189,61,99,209,100,144,45,125,186,201,244,120,173,44,244,42,19,163,244,210,10,225,96,99,34,57,61,173]);
//     const seed:Uint8Array = new Uint8Array([240,1,178,152,123,22,93,51,28,32,248,36,241,233,24,115])
//     const ekey:Uint8Array = new Uint8Array([232,74,235,130,64,108,187,192,212,165,210,248,38,22,246,100,223,169,122,160,196,30,199,35,116,119,240,243,93,141,142,19])
//     console.log("go版：",ekey)
//     const seedB = EncryptCBCPbkdf2Key(seed,pbk)
//     console.log("js版：",seedB)
//     console.log("解密后seed：",DecryptCBCPbkdf2Key(seedB,pbk))
//     console.log("加密前seed：",seed)
//
//
//
//     return
// }
// aesTest()

// function aesTest1(){
//
//     const pwd = CryptoJS.SHA256("123456789");
//     const privPassphraseSalt = CryptoJS.lib.WordArray.random(32);
//     const seed =  CryptoJS.lib.WordArray.random(16);
//     const round = 6
//     const pbkdf2Key = Pbkdf2Key(pwd,privPassphraseSalt,round)
//     const pbk = Uint8Array.from(pbkdf2Key.words)
//     const seedA = wordArrayToUint8Array(seed)
//     console.log("加密前seed：",seedA)
//     const seedB = EncryptCBCPbkdf2Key(seedA,pbk)
//     console.log("加密后seed：",seedB)
//     console.log("解密后seed：",DecryptCBCPbkdf2Key(seedB,pbk))
//
//
//     return
// }
// aesTest2()
//
// function aesTest2(){
//     // 测试数据
//     const plaintext = new Uint8Array([1, 2, 3, 4, 5]);
//     const key = new Uint8Array([10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 0, 10, 20, 30, 40, 50]);
//     const iv = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
//
// // 加密
//     const ciphertext = EncryptCBC(plaintext, key, iv);
//     console.log('Ciphertext:', ciphertext);
//
// // 解密
//     const decryptedText = DecryptCBC(ciphertext, key, iv);
//     console.log('Decrypted Text:', decryptedText);
//
// // 验证解密结果是否与原始明文相同
//     const isEqual = JSON.stringify(Array.from(decryptedText)) === JSON.stringify(Array.from(plaintext));
//     console.log('Decryption is successful:', isEqual);
// }

// function aesTest3(){
//    const bbc = aes_cbc.tencrypt("12345678922222",'123456789asdfghj','asdfghj123456789')
//     console.log(bbc)
//    const word = aes_cbc.tdecrypt(bbc,'123456789asdfghj','asdfghj123456789')
//     console.log(word)
// }
// aesTest3()

// function aesTest4(){
//     let privPassphraseSalt = CryptoJS.lib.WordArray.random(32);
//     let pwd = CryptoJS.SHA256("1234567890");
//     let pbkdf2Key = AesManager.pbkdf2Key(pwd.words,privPassphraseSalt.words,5)
//     console.log(pbkdf2Key)
//     let seed =  CryptoJS.lib.WordArray.random(16);
//     console.log("seed.words :",seed.words)
//     // let subkey = AesManager.encrypt(CryptoJS.enc.Hex.stringify(seed),pbkdf2Key)
//     // let seed2 = AesManager.decrypt(subkey,pbkdf2Key)
//     // console.log("加密前seed：",CryptoJS.enc.Hex.stringify(seed))
//     // console.log("解密后seed：",seed2)
//
//    //
//    //  let privPassphraseSalt = CryptoJS.lib.WordArray.random(32);
//    //  let pwd = CryptoJS.SHA256("123456789");
//    // let seed =  CryptoJS.lib.WordArray.random(16);
//    //  let pbkdf2Key = AesManager.pbkdf2Key(pwd,privPassphraseSalt,5)
//    //  console.log(pbkdf2Key)
//    //  let subkey = AesManager.encrypt(CryptoJS.enc.Hex.stringify(seed),pbkdf2Key)
//    //  let seed2 = AesManager.decrypt(subkey,pbkdf2Key)
//    //  console.log("加密前seed：",CryptoJS.enc.Hex.stringify(seed))
//    //  console.log("解密后seed：",seed2)
//
//
//     // let pbkdf2Key:number[] = [1483333072, 574217800, -142010656, -2051694082, 1173247197, 350917124, -981826339, -670119907, -1195070407, -1558702030, -296103471, 616793461, 1096415621, -867227402, -28236499, -299330175, 1114938607, -1114773147, -91861256, 1734391939, 999694240, 465381988, -962630541, 1792124393, -1393401540, 417557584, 1303234900, 942630738, -1490719019, 1675718447, 1667468161, 1954781638, -1814662186, -784545978, -2012237500, 1223258384, -422003637, -1244638676, 1662251922, 1429543727, 805351576, -1520157150, 1421389347, 1987378656, -2125092984, -1938853614, 503421044, -211944931]
//     // console.log(pbkdf2Key)
//    // let seed = "62b76a13139f6af97fadf91f44f7c355"
//     let subkey = AesManager.encrypt(CryptoJS.enc.Hex.stringify(seed),pbkdf2Key)
//     let pbkdf2Key2 = AesManager.pbkdf2Key(CryptoJS.SHA256("1234567890").words,privPassphraseSalt.words,5)
//     let seed2 = AesManager.decrypt(subkey,pbkdf2Key2)
//     console.log("加密前seed：",CryptoJS.enc.Hex.stringify(seed))
//     console.log("解密后seed：",seed2)
//     console.log("解密后seed wordArray：",CryptoJS.enc.Utf8.parse(seed2))
// }
//aesTest4()
</script>

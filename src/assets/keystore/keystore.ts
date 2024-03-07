import * as crypto from 'crypto';
import { randomBytes } from 'crypto';
import {AesManager} from './cryptos/aes_cbc';
import { AddressInfo } from './wallet';
import { B58String, AddressFromB58String,AddressCoin} from "@/assets/keystore/cryptos/address";
import {KeyManager} from '@/assets/keystore/derivation/derivation';
import {Buffer} from "buffer";
import * as bip39 from 'bip39';
import * as tweetnacl from "tweetnacl";

const Version_5 = 5;

class Keystore {
    saveKeyName: string;
    AddrPre: string;
    Coinbase: number;
    Seed: Buffer;
    CheckHash: Buffer;
    Addrs: AddressInfo[];
    addrMap: Map<string, AddressInfo>;
    Salt: Buffer;
    Rounds: number;
    Version: number;

    constructor(saveKeyName: string, addrPre: string) {
        this.saveKeyName = saveKeyName;
        this.AddrPre = addrPre;
        this.Coinbase = 0;
        this.Seed = new Buffer(0);
        this.CheckHash = new Buffer(0);
        this.Addrs = [];
        this.addrMap = new Map<string, AddressInfo>();
        this.Salt = new Buffer(0);
        this.Rounds = 0;
        this.Version = 0;
    }

    /**
     * 加载本地keystore
     * @returns {Error | null} 为null时表示执行成功
     */
    public Load(): Error | null {
        // Implement the logic to load the keystore from the file
        const keystoreString = localStorage.getItem(this.saveKeyName);
        if (keystoreString) {
            const savedKeystore: Keystore = JSON.parse(keystoreString, (key, value) => {
                if (value && value.type === 'Buffer' && Array.isArray(value.data)) {
                    return Buffer.from(value.data);
                }
                return value;
            });
            this.Coinbase = savedKeystore.Coinbase;
            this.Seed = savedKeystore.Seed;
            this.CheckHash = savedKeystore.CheckHash;
            this.Addrs = savedKeystore.Addrs;
            this.Salt = savedKeystore.Salt;
            this.Rounds = savedKeystore.Rounds;
            this.Version = savedKeystore.Version;

            if (this.checkIntact() === false){
                return new Error("Damaged wallet file: Wallet incomplete");
            }

            if (this.Addrs.length>0){
                this.Addrs.forEach((element, index) => {
                    this.addrMap.set(element.addrStr, element);
                });
            }
            return null
        }
        return  new Error("Not loaded to keystore, please create it first");

    }

    private checkIntact(): boolean {
        if (this.Seed && this.Seed.length > 0) {
            if (!this.CheckHash || this.CheckHash.length !== 32) {
                return false;
            }

            // if (this.Version === Version_5) {
                if (!this.Salt || this.Salt.length !== 32) {
                    return false;
                }

                if (this.Rounds < 25) {
                    return false;
                }
           // }


            return true;
        }

        return false;
    }

    public Save(): void {
        // Implement the logic to save the keystore to the file
        const keystoreString = JSON.stringify(this);
        localStorage.setItem(this.saveKeyName, keystoreString);
    }

    /**
     * 创建keystore
     * @param {string} password - 密码
     * @returns {Error | null} 为null时表示执行成功
     */
    public CreateNewKeystore(password: string): Error | null {
        const pwd = crypto.createHash('sha256').update(password).digest();
        const seed = randomBytes(16);
        return this.NewWallet(seed, pwd);
    }

    private NewWallet(seed: Buffer, pwd: Buffer): Error | null {
        this.Salt = randomBytes(32);
        let nStartTime = Date.now();
        this.Rounds = 25;
        AesManager.Pbkdf2Key(pwd, this.Salt, this.Rounds);
        this.Rounds = Math.floor(2500 / (Date.now() - nStartTime));
        nStartTime = Date.now();
        AesManager.Pbkdf2Key(pwd, this.Salt, this.Rounds);
        this.Rounds = Math.floor(
            (this.Rounds + (this.Rounds * 100) / (Date.now() - nStartTime)) / 2
        );
        if (this.Rounds < 25) {
            this.Rounds = 25;
        }
        const pbkdf2Key = AesManager.Pbkdf2Key(pwd, this.Salt, this.Rounds);

        const seedAes = AesManager.EncryptCBCPbkdf2Key(seed, pbkdf2Key);
        if (seedAes instanceof Error) {
            return seedAes;
        }
        this.Seed = seedAes
        if (this.Seed === null || this.Seed.length === 0) {
            return new Error('Failed to encrypt seed');
        }

        this.CheckHash = crypto.createHash("sha256").update(seed).digest();
        this.Version = Version_5;
        return null
    }

    /**
     * 创建钱包地址
     * @param {string} walletPassword - 密码
     * @param {string} nickname - 名称（可以为空）
     * @returns {Buffer}  地址Buffer格式
     * @returns {Error | null} 为null时表示执行成功
     */
    GetNewAddr(walletPassword :string,nickname :string) :[AddressCoin, Error | null]{
        const walletPasswordHash = crypto.createHash("sha256").update(walletPassword).digest();
       // const newAddrPasswordHash = crypto.createHash("sha256").update(newAddrPassword).digest();
        const [ok,walletPbkdf2Key] = this.Decrypt(walletPasswordHash)
        if (!ok){
            return [new Buffer(0),new Error(`wallet password fail !!`)];
        }

        let index = 0
        if (this.Addrs.length>0){
            const lastIndex = this.Addrs[this.Addrs.length-1].index
            index = lastIndex +1
        }

        const seed = AesManager.DecryptCBCPbkdf2Key(this.Seed,walletPbkdf2Key)
        if (seed instanceof Error) {
            return [new Buffer(0),seed];
        }


        bip39.setDefaultWordlist("english");
        const words = bip39.entropyToMnemonic(seed)

        const keyM =  new KeyManager(words)
        const key = keyM.GetKey(index)
        const addr = keyM.CreateAddr(this.AddrPre)

       // const pbkdf2Key = Pbkdf2Key(newAddrPasswordHash, this.Salt, this.Rounds);
        const prk = AesManager.EncryptCBCPbkdf2Key(Buffer.from(key.secretKey),walletPbkdf2Key)
        if (prk instanceof Error) {
            return [new Buffer(0),prk];
        }
        const puk = AesManager.EncryptCBCPbkdf2Key(Buffer.from(key.publicKey),walletPbkdf2Key)
        if (puk instanceof Error) {
            return [new Buffer(0),puk];
        }
        const addrinfo = new AddressInfo({
            index: index,
            nickname: nickname,
            addr: addr,
            // puk: key.publicKey,
            cPuk: puk,
            subKey: prk,
            addrStr: B58String(addr),
            // pukStr: string;
            //checkHash: crypto.createHash('sha256').update(key.secretKey).digest()
        })

        this.Addrs.push(addrinfo)
        this.addrMap.set(addrinfo.addrStr,addrinfo)
      //  console.log("this.addrMap :",this.addrMap)
        this.Save()
        return [addr,null]
    }

    /**
     * 验证密码
     * @param {Buffer} pwd - 密码
     * @returns {boolean} 密码是否正确
     * @returns {Buffer}  pbkdf2Key
     */
    Decrypt (pwd :Buffer) :[boolean,Buffer]{
        const pbkdf2Key = AesManager.Pbkdf2Key(pwd, this.Salt, this.Rounds);
        const seed = AesManager.DecryptCBCPbkdf2Key(this.Seed,pbkdf2Key)
        if (seed instanceof Error) {
            return [false,pbkdf2Key];
        }

        if (seed.length === 0){
            return [false,pbkdf2Key]
        }

        const chackHash = crypto.createHash("sha256").update(seed).digest();
        if (Buffer.compare(this.CheckHash, chackHash) !== 0) {
            return [false,pbkdf2Key]
        }
        return [true,pbkdf2Key]
    }

    CreateNewWalletRand(seedSrc: Buffer, password: string, coinAddrNum: number): Error | null {
            const pwd = crypto.createHash('sha256').update(password).digest();
            this.NewWallet(seedSrc, pwd);
            if (coinAddrNum > 1) {
                for (let i = 0; i < coinAddrNum; i++) {
                    const [addr,err] = this.GetNewAddr(password,"");
                    if (err instanceof Error) {
                        return err;
                    }
                }
            } else {
                const [addr,err] = this.GetNewAddr(password,"");
                if (err instanceof Error) {
                    return err;
                }
            }
            return null;

    }

    /**
     * 获取地址信息
     * @param {string} addr - 地址
     * @returns {AddressInfo | null} 地址信息
     */
    FindAddress(addr: string): AddressInfo | null {
        const v = this.addrMap.get(addr);
        if (!v) {
            return null;
        }
        return v as AddressInfo;

    }

    /**
     * 获取全部地址信息
     * @returns {AddressInfo[]}  全部地址信息
     */
    GetAddrAll():AddressInfo[]{
        return this.Addrs
    }

    /**
     * 设置默认地址
     * @param {number} index - 地址数组索
     * @returns {boolean} 是否成功
     */
    setCoinbase(index: number): boolean {
        if (index < this.Addrs.length) {
            this.Coinbase = index;
            return true;
        }
        return false;
    }

    /**
     * 获取默认地址信息
     * @returns {AddressInfo | null} 默认地址信息
     */
    getCoinbase(): AddressInfo | null {
        if (this.Coinbase < this.Addrs.length) {
            return this.Addrs[this.Coinbase];
        }
        return null;
    }

    /**
     * 根据地址获取对应的秘钥
     * @param {string} addr - 地址
     * @param {string} password - 密码
     * @returns {Buffer} 私钥
     * @returns {Buffer}  公钥
     * @returns {Error | null} 为null时表示执行成功
     */
    GetKeyByAddr(addr: string, password: string): [prk: Buffer, puk: Buffer, err: Error | null] {
        const pwd = crypto.createHash('sha256').update(password).digest();
        const [ok,walletPbkdf2Key] = this.Decrypt(pwd)
        if (!ok){
            return [new Buffer(0),new Buffer(0),new Error(`wallet password fail !!`)];
        }


        const addrInfo= this.FindAddress(addr)
        if (addrInfo === null){
            return [new Buffer(0),new Buffer(0),new Error(`get address info error`)];
        }

        const puk = AesManager.DecryptCBCPbkdf2Key(addrInfo.cPuk, walletPbkdf2Key);
        if (puk instanceof Error) {
            return [new Buffer(0),new Buffer(0),puk]
        }

        const prk = AesManager.DecryptCBCPbkdf2Key(addrInfo.subKey, walletPbkdf2Key);
        if (prk instanceof Error) {
            return [new Buffer(0),new Buffer(0),prk]
        }
        return [ prk, puk, null];
    }

    /**
     * 修改地址名称
     * @param {string} nickname - 名字（可以为空）
     * @param {string} password - 密码
     * @param {string} addr - 地址
     * @returns {Error | null} 为null时表示执行成功
     */
    UpdateAddrName(nickname : string, password: string, addr: string) :Error | null {
        const pwd = crypto.createHash('sha256').update(password).digest();
        const [ok,walletPbkdf2Key] = this.Decrypt(pwd)
        if (!ok){
            return new Error(`wallet password fail !!`);
        }


        const addrInfo= this.FindAddress(addr)
        if (addrInfo === null){
            return new Error(`get address info error`);
        }

        if (addrInfo.nickname === nickname){
            return null
        }

        //this.Addrs下最多只有一个item.addrStr === addr，所以这种修改方法效率不高，不用它
        // this.Addrs = this.Addrs.map((item) => {
        //     if (item.addrStr === addr) {
        //         item.nickname = addr;
        //         this.addrMap.set(item.addrStr, item);
        //     }
        //     return item;
        // });

        const index = this.Addrs.findIndex((item) => item.addrStr === addr);
        addrInfo.nickname = nickname
        this.Addrs[index] = addrInfo
        this.addrMap.set(addrInfo.addrStr, addrInfo);
        this.Save()
        return null
    }

    /**
     * 修改密码
     * @param {string} oldpwd - 旧密码
     * @param {string} newpwd - 新密码
     * @returns {boolean}  是否修改成功
     * @returns {Error | null} 为null时表示执行成功
     */
    UpdatePwd(oldpwd: string, newpwd: string):[boolean, Error | null] {
        const oldHash = crypto.createHash('sha256').update(oldpwd).digest();
        const newHash = crypto.createHash('sha256').update(newpwd).digest();
        const [ok,pbkdf2Key] = this.Decrypt(oldHash);
        if (!ok) {
            return [false, new Error("wallet password fail")];
        }
        // 解密种子
        const seedBs = AesManager.DecryptCBCPbkdf2Key(this.Seed, pbkdf2Key);
        if (seedBs instanceof Error) {
            return [false,seedBs];
        }

        // 用新密码加密种子
        const pbkdf2KeyNew = AesManager.Pbkdf2Key(newHash, this.Salt, this.Rounds);

        const seedSec = AesManager.EncryptCBCPbkdf2Key(seedBs, pbkdf2KeyNew);
        if (seedSec instanceof Error) {
            return [false,seedSec];
        }


        let addrs:AddressInfo[];
        try {
            addrs = this.Addrs.map((element, index) => {
                const puk = AesManager.DecryptCBCPbkdf2Key(element.cPuk, pbkdf2Key);
                if (puk instanceof Error) {
                    throw puk
                }
                const pukSec = AesManager.EncryptCBCPbkdf2Key(puk, pbkdf2KeyNew);
                if (pukSec instanceof Error) {
                    throw pukSec
                }

                const prk = AesManager.DecryptCBCPbkdf2Key(element.subKey, pbkdf2Key);
                if (prk instanceof Error) {
                    throw prk
                }
                const prkSec = AesManager.EncryptCBCPbkdf2Key(prk, pbkdf2KeyNew);
                if (prkSec instanceof Error) {
                    throw prkSec
                }

                element.cPuk = pukSec
                element.subKey = prkSec

                this.addrMap.set(element.addrStr, element);
                return element;
            });
        }catch (e) {
            return [false,e as Error]
        }

        this.Addrs = addrs
        const checkHash = crypto.createHash('sha256').update(seedBs).digest();
        this.Seed = seedSec;
        this.CheckHash = checkHash;
        this.Save(); // 根据实际情况保存数据
        return [true, null];

    }

    /**
     * 助记词导出
     * @param {string} pwd - 密码
     * @returns {string}  全部地址信息
     * @returns {Error | null} 助记词
     */
    ExportMnemonic(pwd: string): [string,  Error | null] {
        const pwdHash = crypto.createHash('sha256').update(pwd).digest();
        const pbkdf2Key = AesManager.Pbkdf2Key(pwdHash, this.Salt, this.Rounds);
        const seedBs = AesManager.DecryptCBCPbkdf2Key(this.Seed, pbkdf2Key);
        if (seedBs instanceof Error) {

            return ["",new Error("wallet password fail :"+seedBs.message)];
        }

        const chackHash = crypto.createHash('sha256').update(seedBs).digest();
        if (!chackHash.equals(this.CheckHash)) {
            return ["", new Error("wallet password fail")];
        }

        bip39.setDefaultWordlist("english");
        const words = bip39.entropyToMnemonic(seedBs)

        return [words, null];
    }

    /**
     * 助记词导入
     * @param {string} words - 助记词
     * @param {string} pwd - 密码
     * @returns {Error | null} 为null时表示执行成功
     */
    ImportMnemonic(words: string, pwd: string):  Error | null {
        bip39.setDefaultWordlist("english")
        const seedBs = bip39.mnemonicToEntropy(words);
        if (seedBs === "") {
            return new Error("Error: Invalid mnemonic words");
        }
        const seedBuffer = Buffer.from(seedBs, 'hex')

        const err = this.CreateNewWalletRand(seedBuffer, pwd, 1);
        if (err instanceof Error) {
            return err;
        }
        return null;
    }

    /**
     * 签名
     * @param {Uint8Array} message - 签名原始数据
     * @param {Buffer} prk - 私钥
     * @returns {Uint8Array | null} 签名结果，为null表示失败
     */
    public static Sign(message :Uint8Array,prk :Buffer):Uint8Array|null{
        if (prk.length === 0){
            return null
        }
        return  tweetnacl.sign.detached(message, new Uint8Array(prk));
    }

    /**
     * 签名验证
     * @param {Uint8Array} message - 签名原始数据
     * @param {Uint8Array} signature - 签名结果
     * @param {Buffer} puk - 公钥
     * @returns {boolean}  验证结果
     */
    public static SignVerify(message :Uint8Array,signature:Uint8Array,puk :Buffer):boolean{
        if (puk.length === 0 || signature.length === 0){
            return false
        }

        return  tweetnacl.sign.detached.verify(message, signature, new Uint8Array(puk));
    }
}

export default Keystore;
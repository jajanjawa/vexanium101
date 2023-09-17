import {ScatterEOS, ScatterJS} from "scatter-ts";
import {Api, JsonRpc} from "vexaniumjs";
import {reactive} from "vue";
import process from "process";

ScatterJS.plugins( new ScatterEOS() );

const isDev = process.env.NODE_ENV === 'development';
const Wallet = {};
const network = ScatterJS.Network.fromJson({
    blockchain: 'eos',
    chainId: 'f9f432b1851b5c179d2091a96f593aaed50ec7466b74f89301f957a83e56ce1f',
    host: 'vex.speakapp.me',
    port: '',
    protocol: 'https'
});
Wallet.rpc = null;
Wallet.vex = null;
Wallet.account = reactive({logged: false, name: '', pubKey: '', authority: ''});
Wallet.balance = reactive({VEX: '0.0000', ZIDR: '0.00'});

if (isDev) {
    // Wallet.account.logged = true;
    // Wallet.account.name = 'bermainrobot';
    console.log('enter dev mode');
}

Wallet.initRpc = function () {
    this.rpc = new JsonRpc(network.fullhost());
}
Wallet.login = async function () {
    let connected = await ScatterJS.connect("Vexanium 101", {network});
    if (!connected) throw new Error("belum tersambung dengan wallet");

    const id = await ScatterJS.login();
    if (!id) throw new Error('no identity');

    this.vex = ScatterJS.eos(network, Api, {rpc: this.rpc});
}
Wallet.getAccount = async function () {
    const account = ScatterJS.account("eos");
    this.account.logged = true;
    this.account.name = account.name;
    this.account.pubKey = account.publicKey;
    this.account.authority = account.authority;
    return this.account;
}
/**
 *
 * @return {Api}
 */
Wallet.getVexjs = function () {
    if (!this.vex) throw new Error("belum tersambung dengan wallet");
    if (!this.account.logged) throw new Error("silakan login dahulu");
    return this.vex;
}
Wallet.fetchMyBalance = async function (contract, token) {
    let data = await this.rpc.get_currency_balance(contract, this.account.name, token);
    this.balance[token] = data[0];
}

export default Wallet;
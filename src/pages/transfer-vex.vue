<template>
    <f7-page name="transfer-vex">
        <f7-navbar title="Transfer VEX"></f7-navbar>
        <f7-card raised>
            <f7-card-content>
                <f7-list>
                    <f7-list-input label="Penerima" type="text" :maxlength="12"
                                   v-model:value="input.to"></f7-list-input>
                    <f7-list-input label="Jumlah VEX" type="number" :min="0"
                                   v-model:value="input.amount"
                                   :info="`saldo saya ${Wallet.balance.VEX}`"></f7-list-input>
                    <f7-list-input label="Memo" type="text" :maxlength="255" v-model:value="input.memo"></f7-list-input>
                </f7-list>
            </f7-card-content>
            <f7-card-footer class="display-flex justify-content-flex-end">
                <f7-button fill preloader :loading="input.loading" @click="doTransfer">Kirim</f7-button>
            </f7-card-footer>
        </f7-card>
    </f7-page>
</template>
<script setup>
import {onMounted, reactive} from "vue";
import {f7} from "framework7-vue";
import {Asset, Sym} from "eos-common";
import Wallet from "@/js/wallet";

const vexToken = {contract: "vex.token", symbol: new Sym("VEX", 4)};
const input = reactive({to: '', amount: '', memo: '', loading: false});

onMounted(() => {
    Wallet.fetchMyBalance(vexToken.contract, vexToken.symbol.code().to_string());
});

function amountToAsset() {
    let amount = parseFloat(input.amount);
    if (isNaN(amount) || amount < 0) throw new Error("isi jumlah dengan benar");

    let pow = 10 ** vexToken.symbol.precision();
    amount = amount * pow;
    return new Asset(amount, vexToken.symbol);
}

async function doTransfer() {
    input.loading = true;
    let quantity = amountToAsset();
    const actions = {
        actions: [{
            account: vexToken.contract,
            name: 'transfer',
            authorization: [{
                actor: Wallet.account.name,
                permission: Wallet.account.authority,
            }],
            data: {
                from: Wallet.account.name,
                to: input.to,
                quantity: quantity.to_string(),
                memo: input.memo,
            },
        }]
    }

    try {
        await Wallet.getVexjs().transact(actions, {
            blocksBehind: 3, expireSeconds: 30
        });

        input.loading = false;
        input.to = '';
        input.amount = '';
        input.memo = '';
        f7.toast.show({text: 'berhasil terkirim', closeTimeout: 2000});


        setTimeout(() => {
            Wallet.fetchMyBalance(vexToken.contract, vexToken.symbol.code().to_string());
        }, 700);
    } catch (e) {
        input.loading = false;
        f7.toast.show({text: e.message, closeTimeout: 2000});
    }
}

</script>

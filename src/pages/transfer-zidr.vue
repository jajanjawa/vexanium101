<template>
    <f7-page name="transfer-vex">
        <f7-navbar title="Transfer ZIDR"></f7-navbar>
        <f7-card raised>
            <f7-card-content>
                <f7-list>
                    <f7-list-input label="Penerima" type="text" :maxlength="12"
                                   v-model:value="input.to"></f7-list-input>
                    <f7-list-input label="Jumlah ZIDR" type="number" :min="0"
                                   v-model:value="input.amount"
                                   :info="`saldo saya ${Wallet.balance.ZIDR}`"></f7-list-input>
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

const zidrToken = {contract: "idr.speakapp", symbol: new Sym("ZIDR", 2)};
const input = reactive({to: '', amount: '', memo: '', loading: false});

onMounted(() => {
    Wallet.fetchMyBalance(zidrToken.contract, zidrToken.symbol.code().to_string());
});

function amountToAsset() {
    let amount = parseFloat(input.amount);
    if (isNaN(amount) || amount < 0) throw new Error("isi jumlah dengan benar");

    let pow = 10 ** zidrToken.symbol.precision();
    amount = amount * pow;
    return new Asset(amount, zidrToken.symbol);
}

async function doTransfer() {
    input.loading = true;
    let quantity = amountToAsset();

    try {
        await Wallet.getVexjs().getAbi(zidrToken.contract);
        const tx = Wallet.getVexjs().buildTransaction();
        tx.with(zidrToken.contract).as(Wallet.account.name)
            .transfer(Wallet.account.name, input.to, quantity.to_string(), input.memo);
        await tx.send({blocksBehind: 3, expireSeconds: 30});

        input.loading = false;
        input.to = '';
        input.amount = '';
        input.memo = '';
        f7.toast.show({text: 'berhasil terkirim', closeTimeout: 2000});

        setTimeout(() => {
            Wallet.fetchMyBalance(zidrToken.contract, zidrToken.symbol.code().to_string());
        }, 700);
    } catch (e) {
        input.loading = false;
        f7.toast.show({text: e.message, closeTimeout: 2000});
    }
}

</script>

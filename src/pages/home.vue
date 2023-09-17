<template>
    <f7-page name="home">
        <f7-navbar title="Vexanium 101" :subtitle="state.motd"></f7-navbar>

        <f7-block class="display-flex justify-content-center">
            <f7-button fill @click="doLogin">Login</f7-button>
        </f7-block>

        <div class="grid grid-gap grid-cols-2 padding-half">
            <f7-button fill href="/transfer-vex/">Transfer VEX</f7-button>
            <f7-button fill href="/transfer-zidr/">Transfer ZIDR</f7-button>
        </div>

    </f7-page>
</template>
<script setup>
import {f7} from "framework7-vue";
import {reactive} from "vue";
import Wallet from "@/js/wallet";

const state = reactive({motd: 'Selamat Datang'});

async function doLogin() {
    if (Wallet.account.logged) {
        f7.toast.show({text: 'kamu sudah tersambung', closeTimeout: 2000});
        return;
    }

    try {
        await Wallet.login();
        let account = await Wallet.getAccount();
        state.motd = `Halo ${account.name}`;
        f7.toast.show({text: `selamat datang ${account.name}`, closeTimeout: 2500});
    } catch (e) {
        f7.toast.show({text: e.message, closeTimeout: 2000});
    }
}
</script>
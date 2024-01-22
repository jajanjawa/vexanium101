<template>
    <f7-page name="home">
        <f7-navbar title="Vexanium 101" :subtitle="state.motd"></f7-navbar>

        <f7-block class="display-flex justify-content-center">
            <f7-card raised>
                <f7-card-content>
                    <f7-input type="text" placeholder="Alamat IP Wallet" v-model:value="state.ipAddress"></f7-input>
                    <f7-button fill @click="doLogin" class="margin-top" preloader :loading="state.loading">Login
                    </f7-button>
                </f7-card-content>
            </f7-card>
        </f7-block>

        <div class="grid grid-gap grid-cols-2 padding-half">
            <f7-button fill href="/transfer-vex/">Transfer VEX</f7-button>
            <f7-button fill href="/transfer-zidr/">Transfer ZIDR</f7-button>
        </div>

    </f7-page>
</template>
<script setup>
import {f7} from "framework7-vue";
import {onMounted, reactive} from "vue";
import Wallet from "@/js/wallet";

const state = reactive({motd: 'Selamat Datang', ipAddress: '', loading: false});

onMounted(() => {
    if (Wallet.account.logged) {
        state.motd = `Halo ${Wallet.account.name}`;
    }
});

async function doLogin() {
    state.loading = true;
    try {
        let account = await Wallet.login(state.ipAddress);
        state.motd = `Halo ${account.name}`;
        state.loading = false;
        f7.toast.show({text: `selamat datang ${account.name}`, closeTimeout: 2500});
    } catch (e) {
        state.motd = 'Selamat Datang';
        state.loading = false;
        f7.toast.show({text: e.message, closeTimeout: 2000});
    }
}
</script>
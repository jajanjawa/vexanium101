<template>
    <f7-app v-bind="f7params">
        <!-- Your main view, should have "view-main" class -->
        <f7-view main class="safe-areas" url="/"></f7-view>
    </f7-app>
</template>
<script setup>
import {onMounted} from 'vue';
import {f7ready} from 'framework7-vue';
import routes from '../js/routes.js';
import Wallet from '../js/wallet';

// Framework7 Parameters
const f7params = {
    name: 'Vexanium 101', // App name
    theme: 'auto', // Automatic theme detection
    // App routes
    routes: routes,
    view: {
        browserHistory: true
    }
};

Wallet.initRpc();

onMounted(() => {
    f7ready(() => {
        // Call F7 APIs here
    });
});

</script>
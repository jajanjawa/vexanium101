import HomePage from '../pages/home.vue';
import TransferVex from '../pages/transfer-vex.vue';
import TransferZidr from '../pages/transfer-zidr.vue';
import NotFoundPage from '../pages/404.vue';

const routes = [
    {
        path: '/',
        component: HomePage,
    },
    {
        path: '/transfer-vex/',
        component: TransferVex,
    },
    {
        path: '/transfer-zidr/',
        component: TransferZidr,
    },
    {
        path: '(.*)',
        component: NotFoundPage,
    },
];

export default routes;

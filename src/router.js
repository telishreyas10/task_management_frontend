import { createRouter, createWebHistory } from 'vue-router';

import Home from './components/Home.vue';
import Detail from './components/Detail.vue';

const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/details/:identifier',
        component: Detail
    }
];

export default createRouter({
    routes,
    history: createWebHistory()
});

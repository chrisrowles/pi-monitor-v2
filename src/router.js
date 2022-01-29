import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './pages/Home';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Home,
  },
  {
    path: '/network',
    name: 'network',
    component: () => import(/* webpackChunkName: "about" */ './pages/Network')
  },
  {
    path: '/services',
    name: 'services',
    component: () => import(/* webpackChunkName: "about" */ './pages/Services')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;

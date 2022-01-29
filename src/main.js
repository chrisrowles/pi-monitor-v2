import Vue from 'vue';
import store from './store';
import router from './router';
import api from './services/api';
import bus from './services/bus';
import App from './pages/App';
import './bootstrap';

/** Add event bus, api client and app name instance properties **/
Vue.prototype.$bus = bus;
Vue.prototype.$api = api;
Vue.prototype.$app_name = process.env.VUE_APP_NAME;

/** Mount the instance **/
new Vue({
  router,
  store: store,
  render: h => h(App, { props: { name: Vue.prototype.$app_name }})
}).$mount('#app');

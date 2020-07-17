import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowCircleUp,
  faArrowCircleDown,
  faExclamationTriangle,
  faHdd, faServer,
  faTachometerAlt,
  faWifi
} from '@fortawesome/free-solid-svg-icons';

import _ from 'lodash';
import Vue from 'vue';
import App from './App';

import api from './api';
import bus from './bus';
import router from './router';

import './scss/app.scss';

library.add(
    faArrowCircleUp,
    faArrowCircleDown,
    faExclamationTriangle,
    faHdd, faServer,
    faTachometerAlt,
    faWifi
);
dom.watch();

Vue.config.productionTip = false;
Vue.prototype.$_ = _;
Vue.prototype.$bus = bus;
Vue.prototype.$api = api;
Vue.prototype.$app_name = process.env.VUE_APP_NAME;

new Vue({
  router,
  render: h => h(App, { props: { name: Vue.prototype.$app_name }})
}).$mount('#app');

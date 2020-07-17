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

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

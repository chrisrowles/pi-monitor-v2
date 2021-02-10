import _ from 'lodash';
import {library, dom} from '@fortawesome/fontawesome-svg-core';
import {
  faArrowCircleUp,
  faArrowCircleDown,
  faExclamationTriangle,
  faHdd, faServer,
  faTachometerAlt,
  faWifi,
  faTasks,
  faSpinner,
  faCogs,
  faBroadcastTower
} from '@fortawesome/free-solid-svg-icons';
import './scss/app.scss';
import Vue from 'vue';
import App from './App';
import router from './router';
import api from './services/api';
import bus from './services/bus';
import store from './services/store';

/** Add required font awesome icons **/
library.add(
    faArrowCircleUp,
    faArrowCircleDown,
    faExclamationTriangle,
    faHdd, faServer,
    faTachometerAlt,
    faWifi,
    faTasks,
    faSpinner,
    faCogs,
    faBroadcastTower
);
dom.watch();

/** Add lodash, event-bus, api client and app name instance properties **/
Vue.config.productionTip = false;
Vue.prototype.$_ = _;
Vue.prototype.$bus = bus;
Vue.prototype.$api = api;
Vue.prototype.$app_name = process.env.VUE_APP_NAME;

/** Mount the instance **/
new Vue({
  router,
  store: store,
  render: h => h(App, { props: { name: Vue.prototype.$app_name }})
}).$mount('#app');

import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import _ from 'lodash';
import Vue from 'vue'
import App from './App'

import './scss/app.scss';

import router from './router'

library.add(faExclamationTriangle);
dom.watch();

Vue.config.productionTip = false
Vue.prototype.$_ = _;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

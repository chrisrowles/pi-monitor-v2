import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import _ from 'lodash';
import Vue from 'vue'
import App from './App.vue'

import './scss/app.scss';

library.add(faExclamationTriangle);
dom.watch();

Vue.config.productionTip = false
Vue.prototype.$_ = _;

new Vue({
  render: h => h(App),
}).$mount('#app')

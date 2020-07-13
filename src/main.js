import _ from 'lodash';

import Vue from 'vue'
import App from './App.vue'

import './scss/app.scss';

Vue.config.productionTip = false
Vue.prototype.$_ = _;

new Vue({
  render: h => h(App),
}).$mount('#app')

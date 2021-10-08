import Vue from 'vue'

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
  faBroadcastTower,
  faHome,
  faNetworkWired,
  faUser,
  faUsers,
  faTerminal,
  faList
} from '@fortawesome/free-solid-svg-icons';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import 'bootstrap';

import '@/scss/app.scss';

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
    faBroadcastTower,
    faHome,
    faNetworkWired,
    faUser,
    faUsers,
    faTerminal,
    faList
);

Vue.component('fa-icon', FontAwesomeIcon)
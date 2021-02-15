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

import {library, dom} from '@fortawesome/fontawesome-svg-core';

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

dom.watch();
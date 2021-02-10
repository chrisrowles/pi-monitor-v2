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

import {library, dom} from '@fortawesome/fontawesome-svg-core';

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
    faBroadcastTower
);

dom.watch();